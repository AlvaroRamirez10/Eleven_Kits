import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import supabase from "../supabaseClient";
import { useCart } from "../CartContext";
import logo from "../assets/eleven-kits-logo-horizontal.svg";
import { useIsMobile } from "../useIsMobile";

function Header() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState(null);

  const headerHeight = isMobile ? 56 : 68;

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");

      const { data: subcats } = await supabase
        .from("subcategories")
        .select("id, name, slug, category_id")
        .order("name");

      setCategories(cats || []);
      setSubcategories(subcats || []);
    }

    fetchData();
  }, []);

  // Cierra los menús al cambiar de página
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
    setOpenMenu(null);
  }, [location.pathname]);

  // Bloquea el scroll de la página con el menú móvil abierto y cierra con Escape
  useEffect(() => {
    if (!(isMobile && mobileMenuOpen)) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setMobileExpandedCategory(null);
      }
    }
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isMobile, mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileExpandedCategory(null);
  }

  function isActiveCategory(slug) {
    return (
      location.pathname === `/categoria/${slug}` ||
      location.pathname.startsWith(`/categoria/${slug}/`)
    );
  }

  const iconButtonStyle = {
    background: "none",
    border: "none",
    padding: 0,
    width: "44px",
    height: "44px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#F5F5F0",
  };

  return (
    <header
      style={{
        backgroundColor: "#0A0A0A",
        borderBottom: "1px solid #262626",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <style>{`
        .ek-nav-link { position: relative; color: #B8B8B0; text-decoration: none; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; padding: 8px 0; display: inline-block; transition: color 0.15s; }
        .ek-nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: 2px; height: 2px; background: #FFD500; transform: scaleX(0); transform-origin: left; transition: transform 0.2s; }
        .ek-nav-link:hover, .ek-nav-link[aria-current="page"] { color: #F5F5F0; }
        .ek-nav-link:hover::after, .ek-nav-link[aria-current="page"]::after { transform: scaleX(1); }
        .ek-sub-link { display: block; padding: 10px 18px; color: #B8B8B0; text-decoration: none; font-size: 14px; font-family: 'Inter', sans-serif; transition: color 0.15s, background-color 0.15s; }
        .ek-sub-link:hover, .ek-sub-link:focus-visible { color: #0A0A0A; background-color: #FFD500; }
        .ek-header-icon:focus-visible, .ek-nav-link:focus-visible { outline: 2px solid #FFD500; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .ek-nav-link, .ek-nav-link::after, .ek-sub-link { transition: none; }
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: `${headerHeight}px`,
          padding: isMobile ? "0 8px" : "0 32px",
          maxWidth: "1400px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Izquierda: menú (móvil) o logo (escritorio) */}
        <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          {isMobile ? (
            <button
              className="ek-header-icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
              style={iconButtonStyle}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <Link
              to="/"
              style={{ display: "flex", alignItems: "center" }}
              aria-label="Eleven Kits, inicio"
            >
              <img src={logo} alt="Eleven Kits" style={{ height: "28px" }} />
            </Link>
          )}
        </div>

        {/* Centro: logo (móvil) o navegación (escritorio) */}
        {isMobile ? (
          <Link
            to="/"
            onClick={closeMobileMenu}
            style={{ display: "flex", alignItems: "center" }}
            aria-label="Eleven Kits, inicio"
          >
            <img src={logo} alt="Eleven Kits" style={{ height: "22px" }} />
          </Link>
        ) : (
          <nav
            aria-label="Categorías"
            style={{ display: "flex", gap: "40px", alignItems: "center" }}
          >
            {categories.map((cat) => {
              const catSubcats = subcategories.filter(
                (s) => s.category_id === cat.id,
              );

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setOpenMenu(cat.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onFocus={() => setOpenMenu(cat.id)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenMenu(null);
                    }
                  }}
                  style={{ position: "relative" }}
                >
                  <Link
                    to={`/categoria/${cat.slug}`}
                    className="ek-nav-link"
                    aria-current={isActiveCategory(cat.slug) ? "page" : undefined}
                  >
                    {cat.name}
                  </Link>

                  {openMenu === cat.id && catSubcats.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "-18px",
                        paddingTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#141414",
                          border: "1px solid #262626",
                          borderRadius: "4px",
                          padding: "6px 0",
                          minWidth: "200px",
                          boxShadow: "0 16px 32px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <Link
                          to={`/categoria/${cat.slug}`}
                          className="ek-sub-link"
                          style={{ fontWeight: 600, color: "#F5F5F0" }}
                        >
                          Ver todo
                        </Link>
                        {catSubcats.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/categoria/${cat.slug}/${sub.slug}`}
                            className="ek-sub-link"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Derecha: carrito */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Link
            to="/carrito"
            className="ek-header-icon"
            onClick={closeMobileMenu}
            aria-label={
              totalItems > 0
                ? `Carrito, ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`
                : "Carrito"
            }
            style={{ ...iconButtonStyle, textDecoration: "none" }}
          >
            <div style={{ position: "relative", display: "flex" }}>
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    backgroundColor: "#FFD500",
                    color: "#0A0A0A",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "999px",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 4px",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Menú móvil a pantalla completa */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            height: `calc(100dvh - ${headerHeight}px)`,
            overflowY: "auto",
            backgroundColor: "#0A0A0A",
            padding: "8px 16px 32px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <nav aria-label="Categorías">
            {categories.map((cat) => {
              const catSubcats = subcategories.filter(
                (s) => s.category_id === cat.id,
              );
              const isExpanded = mobileExpandedCategory === cat.id;

              return (
                <div key={cat.id} style={{ borderBottom: "1px solid #1C1C1C" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      to={`/categoria/${cat.slug}`}
                      onClick={closeMobileMenu}
                      aria-current={isActiveCategory(cat.slug) ? "page" : undefined}
                      style={{
                        flexGrow: 1,
                        minWidth: 0,
                        padding: "18px 0",
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "34px",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        textDecoration: "none",
                        color: isActiveCategory(cat.slug) ? "#FFD500" : "#F5F5F0",
                      }}
                    >
                      {cat.name}
                    </Link>

                    {catSubcats.length > 0 && (
                      <button
                        className="ek-header-icon"
                        onClick={() =>
                          setMobileExpandedCategory(isExpanded ? null : cat.id)
                        }
                        aria-label={`Subcategorías de ${cat.name}`}
                        aria-expanded={isExpanded}
                        style={{
                          ...iconButtonStyle,
                          color: "#8A8A8A",
                          transform: isExpanded ? "rotate(180deg)" : "none",
                          transition: "transform 0.15s",
                        }}
                      >
                        <ChevronDown size={22} />
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div style={{ paddingBottom: "14px" }}>
                      {catSubcats.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/categoria/${cat.slug}/${sub.slug}`}
                          onClick={closeMobileMenu}
                          style={{
                            display: "block",
                            padding: "12px 0 12px 4px",
                            color: "#B8B8B0",
                            textDecoration: "none",
                            fontSize: "16px",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <a
            href="https://t.me/ElevenKits10"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "auto",
              paddingTop: "24px",
              color: "#8A8A8A",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
              textDecoration: "none",
            }}
          >
            ¿Dudas? Escríbenos por Telegram
          </a>
        </div>
      )}
    </header>
  );
}

export default Header;