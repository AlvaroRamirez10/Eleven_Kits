import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import supabase from "../supabaseClient";
import { useIsMobile } from "../useIsMobile";

function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      const { data: category } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", categorySlug)
        .single();

      if (!category) {
        setLoading(false);
        return;
      }

      setCategoryName(category.name);
      setSubcategoryName("");

      let query = supabase
        .from("products")
        .select("id, name, price, image_url, subcategory_id")
        .eq("category_id", category.id)
        .eq("active", true);

      if (subcategorySlug) {
        const { data: subcategory } = await supabase
          .from("subcategories")
          .select("id, name")
          .eq("slug", subcategorySlug)
          .single();

        if (subcategory) {
          setSubcategoryName(subcategory.name);
          query = query.eq("subcategory_id", subcategory.id);
        }
      }

      const { data: productsData } = await query;
      setProducts(productsData || []);
      setLoading(false);
    }

    fetchProducts();
  }, [categorySlug, subcategorySlug]);

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#F5F5F0",
      }}
    >
      <Header />

      <div style={{ padding: isMobile ? "16px 12px" : "32px 24px" }}>
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? "20px" : "28px",
              marginBottom: isMobile ? "14px" : "24px",
            }}
          >
            {subcategoryName ? `${categoryName} - ${subcategoryName}` : categoryName}
          </h1>

          {categorySlug === "calzado" && (
            <div
              style={{
                marginBottom: isMobile ? "18px" : "28px",
                padding: isMobile ? "14px 12px" : "16px 18px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 213, 0, 0.28)",
                backgroundColor: "rgba(255, 213, 0, 0.08)",
                color: "#F5F5F0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                En calzado hay muchos modelos y colores. Si no ves el que buscas en la web, pregúntanos por el modelo y el color concreto.
              </p>
            </div>
          )}

          {loading && <p style={{ color: "#8A8A8A" }}>Cargando productos...</p>}

          {!loading && products.length === 0 && (
            <p style={{ color: "#8A8A8A" }}>
              Todavía no hay productos en esta categoría.
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fill, minmax(220px, 1fr))",
            gap: isMobile ? "8px" : "16px",
          }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              style={{ textDecoration: "none", minWidth: 0 }}
            >
              <div
                style={{
                  backgroundColor: "#1C1C1C",
                  borderRadius: "6px",
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    height: isMobile ? "190px" : "260px",
                    backgroundColor: "#262626",
                    backgroundImage: product.image_url
                      ? `url(${product.image_url})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: isMobile ? "6px 8px" : "12px" }}>
                  <p
                    style={{
                      color: "#F5F5F0",
                      fontSize: isMobile ? "11px" : "14px",
                      marginBottom: "3px",
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
                      fontSize: isMobile ? "12px" : "15px",
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
    </div>
  );
}

export default CategoryPage;
