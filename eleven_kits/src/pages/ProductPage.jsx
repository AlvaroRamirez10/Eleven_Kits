import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../CartContext";
import Header from "../components/Header";
import supabase from "../supabaseClient";
import { useIsMobile } from "../useIsMobile";
import { X, ArrowLeft, Plus, Minus } from "lucide-react";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const sizeSectionRef = useRef(null);

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
      setSelectedSize(null);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  // Cierra el lightbox con Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKey(event) {
      if (event.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen]);

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
          Este producto ya no está disponible.{" "}
          <Link to="/" style={{ color: "#FFD500" }}>
            Volver a la tienda
          </Link>
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

  const hasExtras = extraCustomization > 0 || extraPatches > 0;
  const showPreview = wantsCustomization && (customName || customNumber);

  function handleAddToCart() {
    if (variants.length > 0 && !selectedSize) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
  }

  const sidePadding = isMobile ? "16px" : "0";

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#B8B8B0",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0A0A0A",
    border: "1px solid #333",
    borderRadius: "4px",
    color: "#F5F5F0",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#F5F5F0",
        paddingBottom: isMobile ? "96px" : 0,
      }}
    >
      <style>{`
        .ek-size:focus-visible, .ek-thumb:focus-visible, .ek-cta:focus-visible, .ek-toggle:focus-visible, .ek-back:focus-visible { outline: 2px solid #FFD500; outline-offset: 2px; }
        .ek-size:not(:disabled):hover { border-color: #FFD500 !important; }
        .ek-cta:hover { background-color: #FFE24D !important; }
        .ek-thumbs::-webkit-scrollbar { display: none; }
        .ek-input:focus { border-color: #FFD500 !important; outline: none; }
      `}</style>

      <Header />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "0 0 24px" : "24px 32px 80px",
        }}
      >
        {!isMobile && (
          <button
            type="button"
            className="ek-back"
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              padding: "8px 0",
              marginBottom: "16px",
              color: "#B8B8B0",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} /> Volver
          </button>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(0, 1.1fr) minmax(0, 1fr)",
            columnGap: isMobile ? 0 : "56px",
            rowGap: isMobile ? "24px" : 0,
            alignItems: "start",
          }}
        >
          {/* Galería */}
          <div style={{ minWidth: 0 }}>
            <div
              onClick={() => images[activeImageIndex] && setLightboxOpen(true)}
              style={{
                backgroundColor: "#141414",
                borderRadius: isMobile ? 0 : "4px",
                aspectRatio: "4 / 5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: images[activeImageIndex] ? "zoom-in" : "default",
              }}
            >
              {images[activeImageIndex] && (
                <img
                  src={images[activeImageIndex].image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}
            </div>

            {images.length > 1 && (
              <div
                className="ek-thumbs"
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  padding: isMobile ? "12px 16px 0" : "12px 0 0",
                  scrollbarWidth: "none",
                }}
              >
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    className="ek-thumb"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Ver foto ${index + 1} de ${images.length}`}
                    aria-current={index === activeImageIndex}
                    style={{
                      width: isMobile ? "60px" : "72px",
                      aspectRatio: "4 / 5",
                      flexShrink: 0,
                      padding: 0,
                      backgroundColor: "#141414",
                      border:
                        index === activeImageIndex
                          ? "2px solid #FFD500"
                          : "1px solid #333",
                      borderRadius: "4px",
                      overflow: "hidden",
                      cursor: "pointer",
                      opacity: index === activeImageIndex ? 1 : 0.65,
                    }}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div
            style={{
              minWidth: 0,
              padding: isMobile ? "0 16px" : 0,
              position: isMobile ? "static" : "sticky",
              top: isMobile ? "auto" : "92px",
            }}
          >
            <h1
              style={{
                fontFamily: "'Anton', sans-serif",
                fontWeight: 400,
                fontSize: isMobile ? "34px" : "52px",
                lineHeight: 1,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: "#FFD500",
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? "28px" : "34px",
                margin: "0 0 20px",
              }}
            >
              {finalPrice.toFixed(2)} €
              {hasExtras && (
                <span
                  style={{
                    color: "#8A8A8A",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  base {product.price} €
                </span>
              )}
            </p>

            {product.description && (
              <p
                style={{
                  color: "#B8B8B0",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  margin: "0 0 28px",
                  maxWidth: "520px",
                }}
              >
                {product.description}
              </p>
            )}

            {variants.length > 0 && (
              <div ref={sizeSectionRef} style={{ marginBottom: "28px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: "0 0 10px",
                  }}
                >
                  Talla
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {variants.map((v) => {
                    const soldOut = v.stock === 0;
                    const selected = selectedSize === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        className="ek-size"
                        disabled={soldOut}
                        aria-pressed={selected}
                        onClick={() => {
                          setSelectedSize(v.id);
                          setSizeError(false);
                        }}
                        style={{
                          minWidth: "56px",
                          height: "48px",
                          padding: "0 14px",
                          backgroundColor: selected ? "#FFD500" : "#141414",
                          color: selected
                            ? "#0A0A0A"
                            : soldOut
                              ? "#4A4A4A"
                              : "#F5F5F0",
                          border: sizeError
                            ? "1px solid #FF6B6B"
                            : selected
                              ? "1px solid #FFD500"
                              : "1px solid #333",
                          borderRadius: "4px",
                          cursor: soldOut ? "not-allowed" : "pointer",
                          fontSize: "15px",
                          fontWeight: 600,
                          textDecoration: soldOut ? "line-through" : "none",
                        }}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p
                    role="alert"
                    style={{
                      color: "#FF6B6B",
                      fontSize: "13px",
                      margin: "10px 0 0",
                    }}
                  >
                    Elige una talla para añadirlo al carrito.
                  </p>
                )}
              </div>
            )}

            {product.customizable && (
              <div style={{ marginBottom: "28px" }}>
                <button
                  type="button"
                  className="ek-toggle"
                  aria-expanded={wantsCustomization}
                  onClick={() => setWantsCustomization(!wantsCustomization)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#141414",
                    border: wantsCustomization
                      ? "1px solid #FFD500"
                      : "1px solid #333",
                    borderRadius: wantsCustomization ? "4px 4px 0 0" : "4px",
                    padding: "14px 16px",
                    color: "#F5F5F0",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>
                    Personaliza tu camiseta
                    {product.customization_price > 0 && (
                      <span
                        style={{
                          color: "#FFD500",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {" "}
                        +{product.customization_price} €
                      </span>
                    )}
                  </span>
                  {wantsCustomization ? (
                    <Minus size={18} color="#8A8A8A" />
                  ) : (
                    <Plus size={18} color="#8A8A8A" />
                  )}
                </button>

                {wantsCustomization && (
                  <div
                    style={{
                      backgroundColor: "#141414",
                      border: "1px solid #FFD500",
                      borderTop: "none",
                      borderRadius: "0 0 4px 4px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 96px",
                        gap: "12px",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <label htmlFor="ek-custom-name" style={labelStyle}>
                          Nombre (opcional)
                        </label>
                        <input
                          id="ek-custom-name"
                          className="ek-input"
                          type="text"
                          maxLength={12}
                          value={customName}
                          onChange={(e) =>
                            setCustomName(e.target.value.toUpperCase())
                          }
                          placeholder="Ej: ÁLVARO"
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <label htmlFor="ek-custom-number" style={labelStyle}>
                          Número
                        </label>
                        <input
                          id="ek-custom-number"
                          className="ek-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          value={customNumber}
                          onChange={(e) =>
                            setCustomNumber(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="7"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {showPreview && (
                      <div
                        aria-hidden="true"
                        style={{
                          marginTop: "16px",
                          backgroundColor: "#0A0A0A",
                          border: "1px solid #262626",
                          borderRadius: "4px",
                          padding: "16px 12px",
                          textAlign: "center",
                          fontFamily: "'Anton', sans-serif",
                          overflow: "hidden",
                        }}
                      >
                        {customName && (
                          <div
                            style={{
                              fontSize: "22px",
                              letterSpacing: "0.12em",
                              color: "#F5F5F0",
                              wordBreak: "break-all",
                            }}
                          >
                            {customName}
                          </div>
                        )}
                        {customNumber && (
                          <div
                            style={{
                              fontSize: "88px",
                              lineHeight: 1,
                              color: "#FFD500",
                            }}
                          >
                            {customNumber}
                          </div>
                        )}
                      </div>
                    )}

                    {product.patches_available && (
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "14px",
                          cursor: "pointer",
                          marginTop: "16px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={wantsPatches}
                          onChange={(e) => setWantsPatches(e.target.checked)}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#FFD500",
                            flexShrink: 0,
                          }}
                        />
                        <span>
                          Añadir parches en las mangas
                          {product.patches_price > 0 && (
                            <span style={{ color: "#FFD500" }}>
                              {" "}
                              +{product.patches_price} €
                            </span>
                          )}
                        </span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}

            {product.other_colors_available && (
              <div
                style={{
                  borderLeft: "2px solid #FFD500",
                  padding: "4px 0 4px 14px",
                  marginBottom: "28px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#B8B8B0",
                    lineHeight: 1.5,
                    margin: "0 0 6px",
                  }}
                >
                  ¿Buscas otro color de este modelo? Consúltanos y te ayudaremos
                  a encontrarlo.
                </p>
                <a
                  href="https://t.me/ElevenKits10"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#FFD500",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Escríbenos por Telegram
                </a>
              </div>
            )}

            {!isMobile && (
              <button
                type="button"
                className="ek-cta"
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  backgroundColor: "#FFD500",
                  color: "#0A0A0A",
                  border: "none",
                  padding: "18px 32px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Añadir al carrito
              </button>
            )}

            <p
              style={{
                fontSize: "13px",
                color: "#8A8A8A",
                lineHeight: 1.5,
                margin: "16px 0 0",
              }}
            >
              Envío gratis desde 60 €. Consulta plazos y devoluciones en{" "}
              <Link to="/informacion" style={{ color: "#B8B8B0" }}>
                información
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Barra de compra fija en móvil */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: "16px",
            backgroundColor: "#0A0A0A",
            borderTop: "1px solid #262626",
            padding: "12px 16px",
            paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "24px",
              color: "#FFD500",
              whiteSpace: "nowrap",
            }}
          >
            {finalPrice.toFixed(2)} €
          </span>
          <button
            type="button"
            className="ek-cta"
            onClick={handleAddToCart}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: "#FFD500",
              color: "#0A0A0A",
              border: "none",
              height: "50px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Añadir al carrito
          </button>
        </div>
      )}

      {showToast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: isMobile ? "88px" : "24px",
            right: isMobile ? "16px" : "24px",
            left: isMobile ? "16px" : "auto",
            zIndex: 60,
            backgroundColor: "#F5F5F0",
            color: "#0A0A0A",
            padding: "14px 20px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Añadido al carrito
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
            backgroundColor: "rgba(0,0,0,0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar foto"
            style={{
              position: "absolute",
              top: isMobile ? "16px" : "24px",
              right: isMobile ? "16px" : "24px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X color="#F5F5F0" size={22} />
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