import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import supabase from "../supabaseClient";
import { useCart } from "../CartContext";
import logo from "../assets/eleven-kits-logo-horizontal.svg";

function Header() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const { totalItems } = useCart();

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

  return (
    <header
      style={{
        backgroundColor: "#0A0A0A",
        borderBottom: "1px solid #262626",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Eleven Kits" style={{ height: "28px" }} />
        </Link>

        <nav style={{ display: "flex", gap: "32px" }}>
          {categories.map((cat) => {
            const catSubcats = subcategories.filter(
              (s) => s.category_id === cat.id,
            );

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setOpenMenu(cat.id)}
                onMouseLeave={() => setOpenMenu(null)}
                style={{ position: "relative" }}
              >
                <Link
                  to={`/categoria/${cat.slug}`}
                  style={{
                    color: "#B8B8B0",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  {cat.name}
                </Link>

                {openMenu === cat.id && catSubcats.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      paddingTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#1C1C1C",
                        border: "1px solid #262626",
                        borderRadius: "4px",
                        padding: "8px 0",
                        minWidth: "160px",
                      }}
                    >
                      {catSubcats.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/categoria/${cat.slug}/${sub.slug}`}
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            color: "#B8B8B0",
                            textDecoration: "none",
                            fontSize: "13px",
                          }}
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

        <Link to="/carrito" style={{ textDecoration: "none" }}>
          <div style={{ position: "relative" }}>
            <ShoppingBag color="#F5F5F0" size={20} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#FFD500",
                  color: "#0A0A0A",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
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
    </header>
  );
}

export default Header;
