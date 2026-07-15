import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import supabase from "../supabaseClient";

const STATUS_OPTIONS = ["pendiente", "enviado", "entregado"];

const STATUS_COLORS = {
  pendiente: { text: "#FFD500", bg: "rgba(255, 213, 0, 0.1)" },
  enviado: { text: "#60A5FA", bg: "rgba(96, 165, 250, 0.1)" },
  entregado: { text: "#4ADE80", bg: "rgba(74, 222, 128, 0.1)" },
};

function AdminOrders() {
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const [variantsMap, setVariantsMap] = useState({});

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login");
        return;
      }
      setChecking(false);
      loadOrders();
    }
    init();
  }, [navigate]);

  async function loadOrders() {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(ordersData || []);

    const { data: itemsData } = await supabase.from("order_items").select("*");

    const grouped = {};
    (itemsData || []).forEach((item) => {
      if (!grouped[item.order_id]) grouped[item.order_id] = [];
      grouped[item.order_id].push(item);
    });
    setOrderItems(grouped);

    const { data: productsData } = await supabase
      .from("products")
      .select("id, name");

    const map = {};
    (productsData || []).forEach((p) => {
      map[p.id] = p.name;
    });
    setProductsMap(map);

    const { data: variantsData } = await supabase
      .from("product_variants")
      .select("id, size");

    const vMap = {};
    (variantsData || []).forEach((v) => {
      vMap[v.id] = v.size;
    });
    setVariantsMap(vMap);
  }

  async function handleStatusChange(orderId, newStatus) {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    loadOrders();
  }

  function toggleExpand(orderId) {
    setExpandedId(expandedId === orderId ? null : orderId);
  }

  if (checking) {
    return (
      <div
        style={{
          backgroundColor: "#0A0A0A",
          minHeight: "100vh",
          color: "#F5F5F0",
        }}
      >
        <p style={{ padding: "32px" }}>Comprobando acceso...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#F5F5F0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #262626",
        }}
      >
        <div>
          <Link
            to="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#8A8A8A",
              fontSize: "12px",
              textDecoration: "none",
              marginBottom: "6px",
            }}
          >
            <ArrowLeft size={13} /> Panel
          </Link>
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "20px",
              letterSpacing: "1px",
            }}
          >
            PEDIDOS
          </h1>
        </div>
      </div>

      <div
        style={{ padding: "32px 24px", maxWidth: "900px", margin: "0 auto" }}
      >
        <p style={{ color: "#8A8A8A", marginBottom: "20px", fontSize: "13px" }}>
          {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const statusStyle =
              STATUS_COLORS[order.status] || STATUS_COLORS.pendiente;

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: "#1C1C1C",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp size={16} color="#666" />
                    ) : (
                      <ChevronDown size={16} color="#666" />
                    )}
                    <div>
                      <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                        {order.customer_name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#8A8A8A" }}>
                        {new Date(order.created_at).toLocaleString("es-ES")} ·{" "}
                        {order.total} €
                      </p>
                    </div>
                  </div>

                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.text}33`,
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option
                        key={s}
                        value={s}
                        style={{ backgroundColor: "#1C1C1C", color: "#F5F5F0" }}
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid #262626",
                      marginLeft: "26px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#8A8A8A",
                        marginBottom: "6px",
                      }}
                    >
                      Contacto:{" "}
                      <span style={{ color: "#B8B8B0" }}>
                        {order.customer_email} ·{" "}
                        {order.customer_phone || "sin teléfono"}
                      </span>
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#8A8A8A",
                        marginBottom: "14px",
                      }}
                    >
                      Envío:{" "}
                      <span style={{ color: "#B8B8B0" }}>
                        {order.shipping_address}, {order.shipping_city},{" "}
                        {order.shipping_postal_code}
                      </span>
                    </p>

                    <p
                      style={{
                        fontSize: "12px",
                        color: "#8A8A8A",
                        marginBottom: "8px",
                        fontWeight: 600,
                      }}
                    >
                      PRODUCTOS
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {(orderItems[order.id] || []).map((item) => (
                        <div key={item.id} style={{ marginBottom: "8px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              color: "#F5F5F0",
                            }}
                          >
                            <span>
                              {productsMap[item.product_id] ||
                                "Producto eliminado"}{" "}
                              × {item.quantity}
                              {item.variant_id &&
                                variantsMap[item.variant_id] && (
                                  <span style={{ color: "#8A8A8A" }}>
                                    {" "}
                                    — Talla {variantsMap[item.variant_id]}
                                  </span>
                                )}
                            </span>
                            <span style={{ color: "#FFD500" }}>
                              {(item.price_at_purchase * item.quantity).toFixed(
                                2,
                              )}{" "}
                              €
                            </span>
                          </div>
                          {(item.customization_name ||
                            item.customization_number ||
                            item.has_patches) && (
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#FFD500",
                                marginTop: "2px",
                              }}
                            >
                              {item.customization_name && (
                                <>Nombre: {item.customization_name} </>
                              )}
                              {item.customization_number && (
                                <>· Nº {item.customization_number} </>
                              )}
                              {item.has_patches && <>· Con parches</>}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {orders.length === 0 && (
            <p style={{ color: "#8A8A8A", fontSize: "13px" }}>
              Todavía no hay pedidos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
