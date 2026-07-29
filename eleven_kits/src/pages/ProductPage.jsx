import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../CartContext";
import Header from "../components/Header";
import supabase from "../supabaseClient";
import { useIsMobile } from "../useIsMobile";
import { X } from "lucide-react";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isMobile = useIsMobile();

  const [wantsCustomization, setWantsCustomization] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [wantsPatches, setWantsPatches] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      const { data: productData } = await supabase
        .from("products")
        .select(
          "id, name, description, price, image_url, customizable, customization_price, patches_available, patches_price, other_colors_available",
        )
        .eq("id", id)
        .single();

      const { data: variantsData } = await supabase
        .from("product_variants")
        .select("id, size, stock")
        .eq("product_id", id);

      const { data: imagesData } = await supabase
        .from("product_images")
        .select("id, image_url")
        .eq("product_id", id)
        .order("position");

      setProduct(productData);
      setVariants(variantsData || []);
      setImages(
        imagesData && imagesData.length > 0
          ? imagesData
          : productData?.image_url
            ? [{ id: "main", image_url: productData.image_url }]
            : [],
      );
      setActiveImageIndex(0);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#0A0A0A",
          minHeight: "100vh",
          color: "#F5F5F0",
        }}
      >
        <Header />
        <p style={{ padding: "32px 24px", color: "#8A8A8A" }}>Cargando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          backgroundColor: "#0A0A0A",
          minHeight: "100vh",
          color: "#F5F5F0",
        }}
      >
        <Header />
        <p style={{ padding: "32px 24px", color: "#8A8A8A" }}>
          Producto no encontrado.
        </p>
      </div>
    );
  }

  const extraCustomization = wantsCustomization
    ? product.customization_price || 0
    : 0;
  const extraPatches = wantsPatches ? product.patches_price || 0 : 0;
  const finalPrice =
    Math.round((product.price + extraCustomization + extraPatches) * 100) / 100;

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
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "20px" : "32px",
          padding: isMobile ? "16px" : "32px 24px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div>
          <div
            onClick={() => images[activeImageIndex] && setLightboxOpen(true)}
            style={{
              backgroundColor: "#1C1C1C",
              borderRadius: "8px",
              height: isMobile ? "300px" : "420px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "12px",
              cursor: images[activeImageIndex] ? "zoom-in" : "default",
            }}
          >
            {images[activeImageIndex] && (
              <img
                src={images[activeImageIndex].image_url}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    width: isMobile ? "56px" : "64px",
                    height: isMobile ? "56px" : "64px",
                    flexShrink: 0,
                    padding: 0,
                    backgroundColor: "#1C1C1C",
                    border:
                      index === activeImageIndex
                        ? "2px solid #FFD500"
                        : "1px solid #333",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: isMobile ? "21px" : "26px",
              marginBottom: "12px",
            }}
          >
            {product.name}
          </h1>
          <p
            style={{
              color: "#FFD500",
              fontSize: isMobile ? "19px" : "22px",
              fontWeight: 500,
              marginBottom: "16px",
            }}
          >
            {finalPrice.toFixed(2)} €
            {(extraCustomization > 0 || extraPatches > 0) && (
              <span
                style={{ color: "#666", fontSize: "14px", fontWeight: 400 }}
              >
                {" "}
                (base {product.price} €)
              </span>
            )}
          </p>
          <p
            style={{
              color: "#B8B8B0",
              fontSize: "14px",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            {product.description}
          </p>

          {variants.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "#8A8A8A",
                  marginBottom: "8px",
                }}
              >
                Talla
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {variants.map((v) => (
                  <button
                    key={v.id}
                    disabled={v.stock === 0}
                    onClick={() => {
                      setSelectedSize(v.id);
                      setSizeError(false);
                    }}
                    style={{
                      padding: isMobile ? "10px 14px" : "8px 14px",
                      backgroundColor:
                        selectedSize === v.id ? "#FFD500" : "#1C1C1C",
                      color:
                        selectedSize === v.id
                          ? "#0A0A0A"
                          : v.stock === 0
                            ? "#4A4A4A"
                            : "#F5F5F0",
                      border: sizeError
                        ? "1px solid #FF6B6B"
                        : "1px solid #333",
                      borderRadius: "4px",
                      cursor: v.stock === 0 ? "not-allowed" : "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p
                  style={{
                    color: "#FF6B6B",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  Selecciona una talla antes de añadir al carrito.
                </p>
              )}
            </div>
          )}

          {product.other_colors_available && (
            <div
              style={{
                backgroundColor: "#1C1C1C",
                border: "1px solid #262626",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <p style={{ fontSize: "13px", color: "#B8B8B0" }}>
                ¿Buscas otro color de este modelo? Consúltanos y te ayudaremos a encontrarlo.
              </p>

              <a
                href="https://wa.me/34693242855"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFD500",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                WhatsApp →
              </a>
            </div>
          )}

          {product.customizable && (
            <div style={{ marginBottom: "24px" }}>
              <button
                type="button"
                onClick={() => setWantsCustomization(!wantsCustomization)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#1C1C1C",
                  border: "1px solid #333",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  color: "#F5F5F0",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <span>
                  Personaliza tu camiseta
                  {product.customization_price > 0 && (
                    <span style={{ color: "#FFD500", fontSize: "12px" }}>
                      {" "}
                      (+{product.customization_price} €)
                    </span>
                  )}
                </span>
                <span style={{ color: "#8A8A8A" }}>
                  {wantsCustomization ? "−" : "+"}
                </span>
              </button>

              {wantsCustomization && (
                <div
                  style={{
                    backgroundColor: "#1C1C1C",
                    border: "1px solid #262626",
                    borderTop: "none",
                    borderRadius: "0 0 6px 6px",
                    padding: "16px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#8A8A8A",
                      marginBottom: "6px",
                    }}
                  >
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={customName}
                    onChange={(e) =>
                      setCustomName(e.target.value.toUpperCase())
                    }
                    placeholder="Ej: RONALDO"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      color: "#F5F5F0",
                      fontSize: "16px",
                      marginBottom: "12px",
                      boxSizing: "border-box",
                    }}
                  />

                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#8A8A8A",
                      marginBottom: "6px",
                    }}
                  >
                    Número (opcional)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={customNumber}
                    onChange={(e) =>
                      setCustomNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Ej: 7"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      color: "#F5F5F0",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      marginBottom: product.patches_available ? "14px" : 0,
                    }}
                  />

                  {product.patches_available && (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={wantsPatches}
                        onChange={(e) => setWantsPatches(e.target.checked)}
                      />
                      Añadir parches en las mangas
                      {product.patches_price > 0 && (
                        <span style={{ color: "#FFD500" }}>
                          {" "}
                          (+{product.patches_price} €)
                        </span>
                      )}
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              if (variants.length > 0 && !selectedSize) {
                setSizeError(true);
                return;
              }
              setSizeError(false);
              const variant = variants.find((v) => v.id === selectedSize);
              const productWithFinalPrice = { ...product, price: finalPrice };
              addToCart(productWithFinalPrice, variant, 1, {
                customizationName: wantsCustomization ? customName : null,
                customizationNumber: wantsCustomization ? customNumber : null,
                hasPatches: wantsPatches,
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            style={{
              backgroundColor: "#FFD500",
              color: "#0A0A0A",
              border: "none",
              padding: "14px 32px",
              borderRadius: "4px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "16px" : "24px",
            right: isMobile ? "16px" : "24px",
            left: isMobile ? "16px" : "auto",
            backgroundColor: "#FFD500",
            color: "#0A0A0A",
            padding: "14px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Producto añadido al carrito ✓
        </div>
      )}

      {lightboxOpen && images[activeImageIndex] && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: isMobile ? "16px" : "24px",
              right: isMobile ? "16px" : "24px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X color="#F5F5F0" size={20} />
          </button>

          <img
            src={images[activeImageIndex].image_url}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              cursor: "default",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ProductPage;
