import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import supabase from "../supabaseClient";
import { useIsMobile } from "../useIsMobile";

function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((product) =>
        product.name?.toLowerCase().includes(normalizedSearch)
      )
    : products;

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setSearchTerm("");

      const { data: category } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", categorySlug)
        .single();

      if (cancelled) return;

      if (!category) {
        setLoading(false);
        return;
      }

      setCategoryName(category.name);

      const { data: subcategoriesData } = await supabase
        .from("subcategories")
        .select("id, name, slug")
        .eq("category_id", category.id)
        .order("name");

      if (cancelled) return;
      setSubcategories(subcategoriesData || []);

      let query = supabase
        .from("products")
        .select("id, name, price, image_url, subcategory_id")
        .eq("category_id", category.id)
        .eq("active", true);

      if (subcategorySlug) {
        const activeSub = (subcategoriesData || []).find(
          (sub) => sub.slug === subcategorySlug
        );
        if (activeSub) {
          query = query.eq("subcategory_id", activeSub.id);
        }
      }

      const { data: productsData } = await query;
      if (cancelled) return;
      setProducts(productsData || []);
      setLoading(false);
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [categorySlug, subcategorySlug]);

  const sidePadding = isMobile ? "16px" : "32px";

  const chipStyle = (active) => ({
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    minHeight: "40px",
    padding: "0 16px",
    borderRadius: "4px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    textDecoration: "none",
    backgroundColor: active ? "#FFD500" : "transparent",
    color: active ? "#0A0A0A" : "#F5F5F0",
    border: active ? "1px solid #FFD500" : "1px solid #333",
  });

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#F5F5F0",
      }}
    >
      <style>{`
        .ek-chips::-webkit-scrollbar { display: none; }
        .ek-search::placeholder { color: #8A8A8A; }
        .ek-search:focus { border-bottom-color: #FFD500 !important; }
      `}</style>

      <Header />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile
            ? `24px ${sidePadding} 48px`
            : `48px ${sidePadding} 80px`,
        }}
      >
        {/* Título + número de productos */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: isMobile ? "20px" : "28px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "44px" : "88px",
              lineHeight: 0.95,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {categoryName}
          </h1>
          {!loading && (
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? "22px" : "36px",
                color: "#FFD500",
              }}
            >
              {filteredProducts.length}
            </span>
          )}
        </div>

        {/* Subcategorías como filtros deslizables */}
        {subcategories.length > 0 && (
          <nav
            aria-label="Subcategorías"
            className="ek-chips"
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              margin: isMobile ? `0 -${sidePadding} 16px` : "0 0 20px",
              padding: isMobile ? `0 ${sidePadding}` : 0,
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Link
              to={`/categoria/${categorySlug}`}
              aria-current={!subcategorySlug ? "page" : undefined}
              style={chipStyle(!subcategorySlug)}
            >
              Todo
            </Link>
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/categoria/${categorySlug}/${sub.slug}`}
                aria-current={sub.slug === subcategorySlug ? "page" : undefined}
                style={chipStyle(sub.slug === subcategorySlug)}
              >
                {sub.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Buscador integrado */}
        {!loading && products.length > 0 && (
          <input
            type="text"
            className="ek-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar en esta sección"
            aria-label="Buscar producto"
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid #333",
              borderRadius: 0,
              color: "#F5F5F0",
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              padding: "12px 0",
              marginBottom: isMobile ? "24px" : "36px",
              outline: "none",
            }}
          />
        )}

        {categorySlug === "calzado" && (
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
              color: "#8A8A8A",
              margin: isMobile ? "0 0 24px" : "0 0 36px",
              maxWidth: "560px",
            }}
          >
            En calzado hay muchos modelos y colores. Si no ves el que buscas,
            escríbenos por Telegram con el modelo y el color.
          </p>
        )}

        {loading && <p style={{ color: "#8A8A8A" }}>Cargando productos...</p>}

        {!loading && products.length === 0 && (
          <p style={{ color: "#8A8A8A" }}>
            Todavía no hay productos en esta sección.
          </p>
        )}

        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <p style={{ color: "#8A8A8A" }}>
            Ningún producto coincide con “{searchTerm.trim()}”. Prueba con otra
            palabra.
          </p>
        )}

        {/* Productos sin marco */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fill, minmax(240px, 1fr))",
            columnGap: isMobile ? "12px" : "24px",
            rowGap: isMobile ? "24px" : "40px",
          }}
        >
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                minWidth: 0,
                display: "block",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 5",
                  backgroundColor: "#141414",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )}
              </div>
              <p
                style={{
                  color: "#F5F5F0",
                  fontSize: isMobile ? "14px" : "15px",
                  lineHeight: 1.3,
                  margin: "10px 0 2px",
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
                  margin: 0,
                }}
              >
                {product.price} €
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;