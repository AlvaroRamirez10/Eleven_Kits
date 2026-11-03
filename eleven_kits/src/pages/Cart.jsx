import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../CartContext';
import { useIsMobile } from '../useIsMobile';

const FREE_SHIPPING_FROM = 60;

function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const isMobile = useIsMobile();

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShipping = totalPrice >= FREE_SHIPPING_FROM;
  const remaining = Math.max(0, FREE_SHIPPING_FROM - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_SHIPPING_FROM) * 100);

  const primaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD500',
    color: '#0A0A0A',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 700,
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  function getDetails(item) {
    const parts = [];
    if (item.size) parts.push(`Talla ${item.size}`);
    if (item.customization?.customizationName) {
      parts.push(`Nombre ${item.customization.customizationName}`);
    }
    if (item.customization?.customizationNumber) {
      parts.push(`Nº ${item.customization.customizationNumber}`);
    }
    if (item.customization?.hasPatches) parts.push('Con parches');
    return parts;
  }

  return (
    <div
      style={{
        backgroundColor: '#0A0A0A',
        minHeight: '100vh',
        color: '#F5F5F0',
        paddingBottom: isMobile && items.length > 0 ? '96px' : 0,
      }}
    >
      <style>{`
        .ek-cart-btn:focus-visible, .ek-cart-link:focus-visible { outline: 2px solid #FFD500; outline-offset: 2px; }
        .ek-cta:hover { background-color: #FFE24D !important; }
        .ek-qty-btn:hover { color: #FFD500 !important; }
        .ek-remove:hover { color: #FF6B6B !important; }
      `}</style>

      <Header />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: isMobile ? '24px 16px 24px' : '48px 32px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            marginBottom: isMobile ? '20px' : '36px',
          }}
        >
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? '44px' : '72px',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Tu carrito
          </h1>
          {totalUnits > 0 && (
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? '22px' : '32px',
                color: '#FFD500',
              }}
            >
              {totalUnits}
            </span>
          )}
        </div>

        {items.length === 0 && (
          <div style={{ padding: isMobile ? '32px 0' : '48px 0' }}>
            <ShoppingBag color="#4A4A4A" size={40} style={{ marginBottom: '16px' }} />
            <p style={{ color: '#B8B8B0', margin: '0 0 24px', fontSize: '16px' }}>
              Todavía no has añadido nada.
            </p>
            <Link
              to="/"
              className="ek-cta ek-cart-link"
              style={{
                ...primaryButtonStyle,
                display: 'inline-flex',
                padding: '0 32px',
                height: '50px',
              }}
            >
              Ver la tienda
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? 'minmax(0, 1fr)'
                : 'minmax(0, 1fr) 380px',
              columnGap: '56px',
              rowGap: '24px',
              alignItems: 'start',
            }}
          >
            {/* Líneas del carrito */}
            <div style={{ minWidth: 0 }}>
              {/* Progreso de envío gratis */}
              <div style={{ marginBottom: isMobile ? '8px' : '12px' }}>
                <p style={{ fontSize: '14px', color: '#B8B8B0', margin: '0 0 10px' }}>
                  {freeShipping ? (
                    <>
                      Tienes <span style={{ color: '#FFD500', fontWeight: 600 }}>envío gratis</span>.
                    </>
                  ) : (
                    <>
                      Te faltan{' '}
                      <span style={{ color: '#FFD500', fontWeight: 600 }}>
                        {remaining.toFixed(2)} €
                      </span>{' '}
                      para el envío gratis.
                    </>
                  )}
                </p>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={FREE_SHIPPING_FROM}
                  aria-valuenow={Math.min(totalPrice, FREE_SHIPPING_FROM)}
                  aria-label="Progreso hacia el envío gratis"
                  style={{
                    height: '4px',
                    backgroundColor: '#262626',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: '#FFD500',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>

              {items.map((item) => {
                const details = getDetails(item);
                const lineTotal =
                  Math.round(Number(item.price) * item.quantity * 100) / 100;
                const imageWidth = isMobile ? 84 : 104;

                return (
                  <div
                    key={item.cartItemId}
                    style={{
                      display: 'flex',
                      gap: isMobile ? '14px' : '20px',
                      padding: isMobile ? '20px 0' : '24px 0',
                      borderBottom: '1px solid #262626',
                    }}
                  >
                    <Link
                      to={item.productId ? `/producto/${item.productId}` : '/'}
                      className="ek-cart-link"
                      aria-label={`Ver ${item.name}`}
                      style={{
                        width: `${imageWidth}px`,
                        aspectRatio: '4 / 5',
                        flexShrink: 0,
                        backgroundColor: '#141414',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'block',
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      )}
                    </Link>

                    <div
                      style={{
                        flexGrow: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: isMobile ? '15px' : '16px',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            margin: 0,
                            minWidth: 0,
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontSize: isMobile ? '15px' : '16px',
                            fontWeight: 600,
                            color: '#FFD500',
                            margin: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {lineTotal.toFixed(2)} €
                        </p>
                      </div>

                      {details.length > 0 && (
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#8A8A8A',
                            lineHeight: 1.5,
                            margin: '4px 0 0',
                          }}
                        >
                          {details.join(' · ')}
                        </p>
                      )}

                      {item.quantity > 1 && (
                        <p style={{ fontSize: '13px', color: '#666', margin: '2px 0 0' }}>
                          {Number(item.price).toFixed(2)} € cada uno
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 'auto',
                          paddingTop: '14px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #333',
                            borderRadius: '4px',
                          }}
                        >
                          <button
                            type="button"
                            className="ek-cart-btn ek-qty-btn"
                            aria-label="Quitar una unidad"
                            onClick={() =>
                              updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#B8B8B0',
                              cursor: 'pointer',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Minus size={16} />
                          </button>
                          <span
                            aria-live="polite"
                            style={{
                              fontSize: '15px',
                              fontWeight: 600,
                              minWidth: '24px',
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="ek-cart-btn ek-qty-btn"
                            aria-label="Añadir una unidad"
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#B8B8B0',
                              cursor: 'pointer',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="ek-cart-btn ek-remove"
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label={`Eliminar ${item.name} del carrito`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#8A8A8A',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            height: '40px',
                            padding: '0 4px',
                          }}
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link
                to="/"
                className="ek-cart-link"
                style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  color: '#B8B8B0',
                  fontSize: '14px',
                }}
              >
                Seguir comprando
              </Link>
            </div>

            {/* Resumen */}
            <aside
              style={{
                backgroundColor: '#141414',
                borderRadius: '4px',
                padding: isMobile ? '20px 16px' : '28px',
                position: isMobile ? 'static' : 'sticky',
                top: isMobile ? 'auto' : '92px',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontWeight: 400,
                  fontSize: '24px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 20px',
                }}
              >
                Resumen
              </h2>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '15px',
                  color: '#B8B8B0',
                  marginBottom: '10px',
                }}
              >
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  fontSize: '15px',
                  color: '#B8B8B0',
                  marginBottom: '20px',
                }}
              >
                <span>Envío</span>
                <span
                  style={{
                    textAlign: 'right',
                    color: freeShipping ? '#FFD500' : '#B8B8B0',
                    fontWeight: freeShipping ? 600 : 400,
                  }}
                >
                  {freeShipping ? 'Gratis' : 'Se calcula en el siguiente paso'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid #262626',
                  paddingTop: '20px',
                  marginBottom: isMobile ? 0 : '24px',
                }}
              >
                <span style={{ fontSize: '16px' }}>Total</span>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: '32px',
                    color: '#FFD500',
                  }}
                >
                  {totalPrice.toFixed(2)} €
                </span>
              </div>

              {!isMobile && (
                <>
                  <Link
                    to="/checkout"
                    className="ek-cta ek-cart-link"
                    style={{ ...primaryButtonStyle, width: '100%', height: '56px' }}
                  >
                    Finalizar compra
                  </Link>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#8A8A8A',
                      textAlign: 'center',
                      margin: '14px 0 0',
                    }}
                  >
                    Pago seguro con Stripe
                  </p>
                </>
              )}
            </aside>
          </div>
        )}
      </div>

      {/* Barra de pago fija en móvil */}
      {isMobile && items.length > 0 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#0A0A0A',
            borderTop: '1px solid #262626',
            padding: '12px 16px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '24px',
              color: '#FFD500',
              whiteSpace: 'nowrap',
            }}
          >
            {totalPrice.toFixed(2)} €
          </span>
          <Link
            to="/checkout"
            className="ek-cta ek-cart-link"
            style={{ ...primaryButtonStyle, flex: 1, minWidth: 0, height: '50px' }}
          >
            Finalizar compra
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;