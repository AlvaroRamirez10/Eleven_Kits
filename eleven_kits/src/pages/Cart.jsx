import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../CartContext';

function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <Header />

      <div style={{ padding: '48px 24px', maxWidth: '820px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '30px',
          letterSpacing: '1px',
          marginBottom: '32px',
        }}>
          TU CARRITO
        </h1>

        {items.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            backgroundColor: '#1C1C1C',
            borderRadius: '8px',
          }}>
            <ShoppingBag color="#4A4A4A" size={40} style={{ marginBottom: '16px' }} />
            <p style={{ color: '#8A8A8A', marginBottom: '20px', fontSize: '14px' }}>
              Tu carrito está vacío.
            </p>
            <Link to="/">
              <button style={{
                backgroundColor: '#FFD500',
                color: '#0A0A0A',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                Volver a la tienda
              </button>
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    backgroundColor: '#1C1C1C',
                    borderRadius: '8px',
                    padding: '14px',
                    border: '1px solid #262626',
                  }}
                >
                  <div style={{
                    width: '76px',
                    height: '76px',
                    backgroundColor: '#262626',
                    borderRadius: '6px',
                    backgroundImage: item.image ? `url(${item.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexShrink: 0,
                  }} />

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </p>
                    {item.size && (
                      <p style={{ fontSize: '12px', color: '#8A8A8A', marginBottom: '4px' }}>
                        Talla: {item.size}
                      </p>
                    )}
                    {item.customization && (
                      <p style={{ fontSize: '12px', color: '#8A8A8A', marginBottom: '4px' }}>
                        {item.customization.customizationName && (
                          <>Nombre: {item.customization.customizationName} </>
                        )}
                        {item.customization.customizationNumber && (
                          <>· Nº {item.customization.customizationNumber} </>
                        )}
                        {item.customization.hasPatches && <>· Con parches</>}
                      </p>
                    )}
                    <p style={{ color: '#FFD500', fontSize: '14px', fontWeight: 500 }}>
                      {item.price} €
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#0A0A0A',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    flexShrink: 0,
                  }}>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#B8B8B0',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '4px',
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#B8B8B0',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '4px',
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 color="#666" size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #262626',
              borderRadius: '8px',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#8A8A8A',
                marginBottom: '8px',
              }}>
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#8A8A8A',
                marginBottom: '16px',
              }}>
                <span>Envío</span>
                <span>{totalPrice >= 60 ? 'Gratis' : 'Calculado en el siguiente paso'}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #262626',
                paddingTop: '16px',
              }}>
                <p style={{ fontSize: '17px' }}>
                  Total: <span style={{ color: '#FFD500', fontWeight: 600 }}>{totalPrice.toFixed(2)} €</span>
                </p>

                <Link to="/checkout">
                  <button style={{
                    backgroundColor: '#FFD500',
                    color: '#0A0A0A',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '4px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    Finalizar compra
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;