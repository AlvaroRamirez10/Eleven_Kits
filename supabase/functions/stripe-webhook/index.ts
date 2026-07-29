import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const metadata = session.metadata;
    const items = JSON.parse(metadata.items);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: metadata.customer_name,
        customer_email: session.customer_email,
        customer_phone: metadata.customer_phone,
        shipping_address: metadata.shipping_address,
        shipping_city: metadata.shipping_city,
        shipping_postal_code: metadata.shipping_postal_code,
        total: session.amount_total / 100,
        status: "pendiente",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creando pedido:", orderError);
      return new Response("Error creando pedido", { status: 500 });
    }

    // Necesitamos el precio real de cada producto para price_at_purchase
    const productIds = items.map((i: any) => i.productId);
    const { data: products } = await supabase
      .from("products")
      .select("id, price, name, image_url")
      .in("id", productIds);

    const orderItems = items.map((item: any) => {
      const product = products?.find((p) => p.id === item.productId);
      return {
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
        // Usamos el precio que viajó en metadata (ya incluye extras de personalización)
        // en vez del precio base del producto.
        price_at_purchase: item.price || product?.price || 0,
        customization_name: item.customizationName || null,
        customization_number: item.customizationNumber || null,
        has_patches: item.hasPatches || false,
      };
    });

    await supabase.from("order_items").insert(orderItems);

    // Descontar stock de las tallas vendidas
    for (const item of items) {
      if (item.variantId) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock")
          .eq("id", item.variantId)
          .single();

        if (variant) {
          await supabase
            .from("product_variants")
            .update({ stock: Math.max(0, variant.stock - item.quantity) })
            .eq("id", item.variantId);
        }
      }
    }

    // Enviar email de confirmación al cliente
    try {
      const itemsHtml = items
        .map((item: any) => {
          const product = products?.find((p) => p.id === item.productId);
          const productName = product?.name || "Producto";

          let line = `${item.quantity} x ${productName}`;
          if (item.customizationName || item.customizationNumber) {
            line += ` (${item.customizationName || ""} ${item.customizationNumber ? "#" + item.customizationNumber : ""})`;
          }
          if (item.hasPatches) {
            line += " + parches";
          }
          return `<li>${line}</li>`;
        })
        .join("");

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Eleven Kits <onboarding@resend.dev>",
          to: session.customer_email,
          subject: "Confirmación de tu pedido — Eleven Kits",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0A0A0A; color: #F5F5F0; padding: 32px; border-radius: 8px;">
              <h1 style="color: #FFD500; font-size: 22px;">¡Gracias por tu compra, ${metadata.customer_name}!</h1>
              <p style="color: #B8B8B0; font-size: 14px;">Hemos recibido tu pedido y ya lo estamos preparando.</p>
              <ul style="color: #F5F5F0; font-size: 14px;">${itemsHtml}</ul>
              <p style="color: #FFD500; font-size: 16px; font-weight: bold;">Total: ${(session.amount_total / 100).toFixed(2)} €</p>
              <p style="color: #8A8A8A; font-size: 12px; margin-top: 24px;">
                Envío a: ${metadata.shipping_address}, ${metadata.shipping_city}, ${metadata.shipping_postal_code}
              </p>
            </div>
          `,
        }),
      });
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
      // No bloqueamos el pedido si falla el email, solo lo registramos
    }

    // Notificación de nueva venta por Telegram
    try {
      const itemsList = items
        .map((item: any) => {
          const product = products?.find((p) => p.id === item.productId);
          const productName = product?.name || "Producto";
          let line = `• ${item.quantity}x ${productName}`;
          if (item.customizationName || item.customizationNumber) {
            line += ` (${item.customizationName || ""} ${item.customizationNumber ? "#" + item.customizationNumber : ""})`;
          }
          if (item.hasPatches) {
            line += " + parches";
          }
          return line;
        })
        .join("\n");

      const message = `🛒 *¡Nuevo pedido en Eleven Kits!*

👤 ${metadata.customer_name}
📧 ${session.customer_email}
📞 ${metadata.customer_phone || "sin teléfono"}

${itemsList}

💰 Total: ${(session.amount_total / 100).toFixed(2)} €

📍 ${metadata.shipping_address}, ${metadata.shipping_city}, ${metadata.shipping_postal_code}`;

      await fetch(
        `https://api.telegram.org/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: Deno.env.get("TELEGRAM_CHAT_ID"),
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      // Enviar una foto por cada producto comprado, con su cantidad y personalización
      for (const item of items) {
        const product = products?.find((p) => p.id === item.productId);

        if (product?.image_url) {
          let caption = `${item.quantity}x ${product.name}`;
          if (item.customizationName || item.customizationNumber) {
            caption += ` (${item.customizationName || ""} ${item.customizationNumber ? "#" + item.customizationNumber : ""})`;
          }
          if (item.hasPatches) {
            caption += " + parches";
          }

          await fetch(
            `https://api.telegram.org/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/sendPhoto`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: Deno.env.get("TELEGRAM_CHAT_ID"),
                photo: product.image_url,
                caption: caption,
              }),
            },
          );
        }
      }
    } catch (telegramError) {
      console.error("Error enviando notificación de Telegram:", telegramError);
      // No bloqueamos el pedido si falla la notificación, solo lo registramos
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});