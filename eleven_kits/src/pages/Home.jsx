import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import supabase from "../supabaseClient";
import { useIsMobile } from "../useIsMobile";
import { MessageCircle, Camera, ArrowUpRight } from "lucide-react";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);
  const CARD_WIDTH = 160; // 150px de ancho + 10px de gap

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .eq("active", true);

      const allProducts = data || [];

      // Semilla basada en la fecha de hoy (YYYY-MM-DD), así el resultado
      // es el mismo para todos durante el día, pero cambia mañana.
      const today = new Date().toISOString().slice(0, 10);
      let seed = 0;
      for (let i = 0; i < today.length; i++) {
        seed = (seed * 31 + today.charCodeAt(i)) % 2147483647;
      }

      function seededRandom() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      }

      // Barajado tipo Fisher-Yates, pero determinista según la semilla del día
      const shuffled = [...allProducts];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      setFeaturedProducts(shuffled.slice(0, 8));
      setLoading(false);
    }

    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!isMobile || featuredProducts.length === 0) return;

    const container = scrollRef.current;
    if (!container) return;

    container.scrollLeft = featuredProducts.length * CARD_WIDTH;

    function handleScroll() {
      const setWidth = featuredProducts.length * CARD_WIDTH;

      if (container.scrollLeft >= setWidth * 2) {
        container.scrollLeft -= setWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += setWidth;
      }
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, featuredProducts]);

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#F5F5F0",
      }}
    >
      <Header />

      <div
        style={{
          textAlign: "center",
          padding: isMobile ? "40px 20px 36px" : "80px 24px 64px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#1C1C1C",
            border: "1px solid #333",
            borderRadius: "4px",
            padding: "6px 16px",
            fontSize: "11px",
            letterSpacing: "2px",
            color: "#FFD500",
            marginBottom: "20px",
          }}
        >
          NUEVA COLECCIÓN
        </div>

        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(30px, 8vw, 56px)",
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          EQUÍPATE
          <br />
          <span style={{ color: "#FFD500" }}>PARA GANAR</span>
        </h1>

        <p
          style={{
            color: "#8A8A8A",
            fontSize: "14px",
            maxWidth: "420px",
            margin: "16px auto 0",
          }}
        >
          Camisetas, chándals y calzado deportivo. Encargos cada 15 dias, sin
          devoluciones. Envío gratis desde 60 €.
        </p>

        <Link to="/categoria/futbol">
          <button
            style={{
              marginTop: "24px",
              backgroundColor: "#FFD500",
              color: "#0A0A0A",
              border: "none",
              padding: isMobile ? "13px 32px" : "14px 36px",
              borderRadius: "4px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              width: isMobile ? "100%" : "auto",
              maxWidth: "280px",
            }}
          >
            Ver colección
          </button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : "repeat(auto-fit, minmax(220px, 1fr))",
          gap: isMobile ? "10px" : "16px",
          padding: isMobile ? "0 16px 40px" : "0 24px 64px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {[
          { name: "Fútbol", slug: "futbol" },
          { name: "Baloncesto", slug: "baloncesto" },
          { name: "Calzado", slug: "calzado" },
        ].map((cat) => (
          <Link
            key={cat.slug}
            to={`/categoria/${cat.slug}`}
            style={{
              textDecoration: "none",
              gridColumn:
                isMobile && cat.slug === "calzado" ? "1 / -1" : "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#1C1C1C",
                borderRadius: "8px",
                padding: isMobile ? "22px 16px" : "32px 20px",
                textAlign: "center",
                border: "1px solid #262626",
              }}
            >
              <p
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: isMobile ? "15px" : "18px",
                  letterSpacing: "1px",
                  color: "#F5F5F0",
                  margin: 0,
                }}
              >
                {cat.name.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          padding: isMobile ? "0 16px 40px" : "0 24px 64px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: isMobile ? "16px" : "18px",
            letterSpacing: "1px",
            marginBottom: isMobile ? "14px" : "20px",
          }}
        >
          DESTACADOS
        </p>

        {loading && <p style={{ color: "#8A8A8A" }}>Cargando...</p>}

        {!loading && featuredProducts.length === 0 && (
          <p style={{ color: "#8A8A8A" }}>
            Todavía no hay productos publicados.
          </p>
        )}

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            flexWrap: isMobile ? "nowrap" : "wrap",
            gap: isMobile ? "10px" : "16px",
            overflowX: isMobile ? "auto" : "visible",
            scrollSnapType: isMobile ? "x mandatory" : "none",
            paddingBottom: isMobile ? "4px" : 0,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {(isMobile
            ? [...featuredProducts, ...featuredProducts, ...featuredProducts]
            : featuredProducts
          ).map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              to={`/producto/${product.id}`}
              style={{
                textDecoration: "none",
                flexShrink: 0,
                width: isMobile ? "150px" : "calc(25% - 12px)",
                scrollSnapAlign: isMobile ? "start" : undefined,
              }}
            >
              <div
                style={{
                  backgroundColor: "#1C1C1C",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: isMobile ? "140px" : "220px",
                    backgroundColor: "#262626",
                    backgroundImage: product.image_url
                      ? `url(${product.image_url})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: isMobile ? "8px 10px" : "12px" }}>
                  <p
                    style={{
                      color: "#F5F5F0",
                      fontSize: isMobile ? "12px" : "14px",
                      marginBottom: "4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.name}
                  </p>
                  <p
                    style={{
                      color: "#FFD500",
                      fontSize: isMobile ? "13px" : "15px",
                      fontWeight: 500,
                    }}
                  >
                    {product.price} €
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "0 16px 48px" : "0 24px 80px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#141414",
            border: "1px solid #262626",
            borderRadius: "12px",
            padding: isMobile ? "28px 20px" : "48px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,213,0,0.10) 0%, rgba(255,213,0,0) 70%)",
            }}
          />

          <div
            style={{
              position: "relative",
              textAlign: isMobile ? "left" : "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#FFD500",
                marginBottom: "10px",
              }}
            >
              ATENCIÓN AL CLIENTE
            </p>

            <p
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? "22px" : "32px",
                letterSpacing: "1px",
                marginBottom: "10px",
                maxWidth: isMobile ? "none" : "560px",
                marginLeft: isMobile ? 0 : "auto",
                marginRight: isMobile ? 0 : "auto",
              }}
            >
              ¿DUDAS CON UN PEDIDO O UNA TALLA?
            </p>

            <p
              style={{
                color: "#8A8A8A",
                fontSize: "14px",
                marginBottom: isMobile ? "24px" : "32px",
                maxWidth: isMobile ? "none" : "460px",
                marginLeft: isMobile ? 0 : "auto",
                marginRight: isMobile ? 0 : "auto",
              }}
            >
              Escríbenos directamente, respondemos rápido y sin rodeos.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "12px",
                maxWidth: isMobile ? "none" : "480px",
                margin: isMobile ? 0 : "0 auto",
              }}
            >
              <a
                href="https://wa.me/34693242855"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    backgroundColor: "#1C1C1C",
                    border: "1px solid #2A2A2A",
                    borderRadius: "10px",
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(37, 211, 102, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MessageCircle color="#25D366" size={20} />
                  </div>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: "#F5F5F0",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "1px",
                      }}
                    >
                      WhatsApp
                    </p>
                    <p style={{ color: "#8A8A8A", fontSize: "12px" }}>
                      Respuesta rápida
                    </p>
                  </div>
                  <ArrowUpRight color="#4A4A4A" size={16} />
                </div>
              </a>

              <a
                href="https://instagram.com/alvaror.10"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    backgroundColor: "#1C1C1C",
                    border: "1px solid #2A2A2A",
                    borderRadius: "10px",
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 213, 0, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Camera color="#FFD500" size={20} />
                  </div>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: "#F5F5F0",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "1px",
                      }}
                    >
                      Instagram
                    </p>
                    <p style={{ color: "#8A8A8A", fontSize: "12px" }}>
                      @alvaror.10
                    </p>
                  </div>
                  <ArrowUpRight color="#4A4A4A" size={16} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          margin: isMobile ? "0 16px 20px" : "0 24px 24px",
          padding: isMobile ? "14px 16px" : "16px 20px",
          border: "1px solid #2A2A2A",
          borderRadius: "12px",
          backgroundColor: "#121212",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "10px" : 0,
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          fontSize: "12px",
          color: "#B8B8B0",
        }}
      >
        <span style={{ color: "#F5F5F0" }}>© Eleven Kits</span>
        <Link
          to="/informacion"
          style={{
            color: "#FFD500",
            textDecoration: "none",
            fontWeight: 600,
            padding: "6px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 213, 0, 0.12)",
            border: "1px solid rgba(255, 213, 0, 0.24)",
          }}
        >
          Tallas · Devoluciones · Cuidado de la ropa
        </Link>
        <span>Envío gratis desde 60 €</span>
      </div>
    </div>
  );
}

export default Home;
