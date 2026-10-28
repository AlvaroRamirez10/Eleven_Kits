import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Send } from "lucide-react";
import Header from "../components/Header";
import supabase from "../supabaseClient";
import { useIsMobile } from "../useIsMobile";

const CATEGORIES = [
  { name: "Fútbol", slug: "futbol" },
  { name: "Baloncesto", slug: "baloncesto" },
  { name: "Calzado", slug: "calzado" },
];

const CSS = `
.ek-home {
  --pad: clamp(16px, 4vw, 40px);
  --gap-section: clamp(56px, 9vw, 120px);
  background: #0A0A0A;
  color: #F5F5F0;
  min-height: 100vh;
  overflow-x: hidden;
}
.ek-wrap {
  width: 100%;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: var(--pad);
}
.ek-section { margin-top: var(--gap-section); }

.ek-home :focus-visible { outline: 3px solid #F5F5F0; outline-offset: 3px; }
.ek-band :focus-visible { outline-color: #0A0A0A; }

/* Hero: la parte de atrás de una camiseta, nombre y dorsal */
.ek-hero { padding-top: clamp(28px, 5vw, 64px); }
.ek-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  align-items: end;
}
.ek-plate {
  font-family: 'Anton', sans-serif;
  font-size: clamp(14px, 2.2vw, 26px);
  letter-spacing: 0.38em;
  line-height: 1;
  margin-bottom: 8px;
}
.ek-num {
  font-family: 'Anton', sans-serif;
  font-size: clamp(180px, 62vw, 460px);
  line-height: 0.82;
  letter-spacing: -0.02em;
  color: #FFD500;
  animation: ek-rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
@keyframes ek-rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: none; }
}
.ek-h1 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: clamp(38px, 6vw, 84px);
  line-height: 0.98;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
}
.ek-lead {
  font-size: 16px;
  line-height: 1.55;
  max-width: 44ch;
  margin: 0 0 28px;
}
.ek-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #FFD500;
  color: #0A0A0A;
  padding: 15px 28px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}
.ek-btn:hover { background: #F5F5F0; }
.ek-btn-block { width: 100%; justify-content: center; }

@media (min-width: 900px) {
  .ek-hero-grid { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 48px; }
  .ek-num { font-size: clamp(300px, 34vw, 480px); }
  .ek-btn-block { width: auto; }
}

/* Títulos de sección */
.ek-h2 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: clamp(26px, 3.6vw, 44px);
  line-height: 1.05;
  margin: 0 0 clamp(16px, 2.4vw, 28px);
}

/* Categorías: filas grandes, no tarjetas */
.ek-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #141414;
  color: #F5F5F0;
  padding: clamp(18px, 3.2vw, 36px) clamp(16px, 3vw, 32px);
  margin-bottom: 8px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.ek-row:hover { background: #FFD500; color: #0A0A0A; }
.ek-row-name {
  font-family: 'Anton', sans-serif;
  font-size: clamp(36px, 8.5vw, 104px);
  line-height: 1;
  text-transform: uppercase;
}
.ek-row svg { width: clamp(28px, 4vw, 56px); height: auto; flex-shrink: 0; }

/* Banda amarilla: el día 25 */
.ek-band { background: #FFD500; color: #0A0A0A; margin-top: var(--gap-section); }
.ek-band-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  align-items: center;
  padding-block: clamp(36px, 6vw, 72px);
}
.ek-big25 {
  font-family: 'Anton', sans-serif;
  font-size: clamp(130px, 30vw, 300px);
  line-height: 0.82;
  letter-spacing: -0.02em;
}
.ek-band h2 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: clamp(30px, 4.6vw, 56px);
  line-height: 1.02;
  margin: 0 0 14px;
}
.ek-band p { font-size: 16px; line-height: 1.5; margin: 0 0 6px; max-width: 46ch; }
@media (min-width: 900px) {
  .ek-band-inner { grid-template-columns: auto minmax(0, 1fr); gap: 64px; }
}

/* Contacto */
.ek-contact { background: #141414; margin-top: var(--gap-section); }
.ek-contact-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  align-items: end;
  padding-block: clamp(40px, 7vw, 88px);
}
.ek-contact h2 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: clamp(32px, 5.2vw, 64px);
  line-height: 1.02;
  margin: 0;
}
.ek-contact p { font-size: 16px; line-height: 1.55; margin: 0 0 24px; max-width: 44ch; }
.ek-link {
  display: inline-block;
  margin-top: 20px;
  color: #F5F5F0;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
@media (min-width: 900px) {
  .ek-contact-inner { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 64px; }
}

/* Pie: el nombre vuelve a ancho completo */
.ek-footer { margin-top: var(--gap-section); overflow: hidden; }
.ek-footer-name {
  font-family: 'Anton', sans-serif;
  font-size: clamp(56px, 17.5vw, 280px);
  line-height: 0.8;
  letter-spacing: -0.01em;
  color: #1E1E1E;
  white-space: nowrap;
  user-select: none;
}
.ek-footer-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-block: 20px;
  font-size: 12px;
  color: #8A8A8A;
}
.ek-footer-meta a { color: #F5F5F0; }

@media (prefers-reduced-motion: reduce) {
  .ek-num { animation: none; }
  .ek-row, .ek-btn { transition: none; }
}
`;

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);
  const CARD_WIDTH = 180; // 170px de ancho + 10px de gap (solo móvil)

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .eq("active", true);

      const allProducts = data || [];

      // Semilla basada en la fecha de hoy (YYYY-MM-DD): el orden es el mismo
      // para todos durante el día y cambia mañana.
      const today = new Date().toISOString().slice(0, 10);
      let seed = 0;
      for (let i = 0; i < today.length; i++) {
        seed = (seed * 31 + today.charCodeAt(i)) % 2147483647;
      }

      function seededRandom() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      }

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

  // Carrusel infinito en móvil: lista triplicada y salto silencioso al llegar a los bordes
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

  const listToShow = isMobile
    ? [...featuredProducts, ...featuredProducts, ...featuredProducts]
    : featuredProducts;

  return (
    <div className="ek-home">
      <style>{CSS}</style>
      <Header />

      <main>
        {/* HERO */}
        <section className="ek-wrap ek-hero">
          <div className="ek-hero-grid">
            <div aria-hidden="true">
              <div className="ek-plate">ELEVEN</div>
              <div className="ek-num">11</div>
            </div>

            <div>
              <h1 className="ek-h1">Equípate para ganar</h1>
              <p className="ek-lead">
                Camisetas, chándals y calzado deportivo.
              </p>
              <Link to="/categoria/futbol" className="ek-btn ek-btn-block">
                Ver colección
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="ek-wrap ek-section">
          <h2 className="ek-h2">Categorías</h2>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="ek-row">
              <span className="ek-row-name">{cat.name}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* DESTACADOS */}
        <section className="ek-wrap ek-section">
          <h2 className="ek-h2">Destacados</h2>

          {loading && <p style={{ color: "#8A8A8A" }}>Cargando...</p>}

          {!loading && featuredProducts.length === 0 && (
            <p>Todavía no hay productos publicados.</p>
          )}

          <div
            ref={scrollRef}
            aria-label="Productos destacados"
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
            {listToShow.map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                to={`/producto/${product.id}`}
                style={{
                  textDecoration: "none",
                  color: "#F5F5F0",
                  flexShrink: 0,
                  minWidth: 0,
                  width: isMobile ? "170px" : "calc(25% - 12px)",
                  scrollSnapAlign: isMobile ? "start" : undefined,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 5",
                    backgroundColor: "#1C1C1C",
                    backgroundImage: product.image_url
                      ? `url(${product.image_url})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "10px",
                  }}
                />
                <p
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    marginBottom: "2px",
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
                    fontSize: isMobile ? "14px" : "15px",
                    fontWeight: 600,
                  }}
                >
                  {product.price} €
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* BANDA: EL DÍA 25 */}
        <section className="ek-band">
          <div className="ek-wrap ek-band-inner">
            <div className="ek-big25" aria-hidden="true">25</div>
            <div>
              <h2>Encargos el día 25 de cada mes</h2>
              <p>Envío gratis desde 60 €.</p>
              <p>Venta al por mayor con descuentos.</p>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section className="ek-contact">
          <div className="ek-wrap ek-contact-inner">
            <h2>¿Dudas con un pedido o una talla?</h2>
            <div>
              <p>
                Si tienes dudas sobre un pedido o una talla, escríbenos y te
                contestamos lo antes posible.
              </p>
              <a
                href="https://t.me/ElevenKits10"
                target="_blank"
                rel="noopener noreferrer"
                className="ek-btn ek-btn-block"
              >
                <Send size={18} aria-hidden="true" />
                Escribir por Telegram
              </a>
              <br />
              <Link to="/informacion" className="ek-link">
                Tallas, devoluciones y cuidado de la ropa
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* PIE */}
      <footer className="ek-footer">
        <div className="ek-wrap">
          <div className="ek-footer-name" aria-hidden="true">
            ELEVEN KITS
          </div>
          <div className="ek-footer-meta">
            <span>© Eleven Kits</span>
            <Link to="/informacion">Información</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;