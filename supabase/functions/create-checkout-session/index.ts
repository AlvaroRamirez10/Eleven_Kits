import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, customer } = await req.json();

    // Conexión a Supabase para verificar precios reales (nunca confiar en el precio que manda el navegador)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const productIds = items.map((item: any) => item.productId);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (error || !products) {
      throw new Error("No se pudieron verificar los productos.");
    }

    const line_items = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new Error(`Producto no encontrado: ${item.productId}`);

      // El precio ya viene calculado desde el frontend incluyendo los extras
      // de personalización, así que usamos item.price en vez del precio base del producto.
      const unitPrice = item.price || product.price;

      let displayName =
        product.name + (item.size ? ` (Talla ${item.size})` : "");
      if (
        item.customization?.customizationName ||
        item.customization?.customizationNumber
      ) {
        const parts = [];
        if (item.customization.customizationName)
          parts.push(item.customization.customizationName);
        if (item.customization.customizationNumber)
          parts.push(`#${item.customization.customizationNumber}`);
        displayName += ` - ${parts.join(" ")}`;
      }
      if (item.customization?.hasPatches) {
        displayName += " + parches";
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: displayName,
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin = req.headers.get("origin") || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/pedido-confirmado/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone || "",
        shipping_address: customer.address,
        shipping_city: customer.city,
        shipping_postal_code: customer.postalCode,
        items: JSON.stringify(
          items.map((i: any) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
            customizationName: i.customization?.customizationName || null,
            customizationNumber: i.customization?.customizationNumber || null,
            hasPatches: i.customization?.hasPatches || false,
          })),
        ),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
