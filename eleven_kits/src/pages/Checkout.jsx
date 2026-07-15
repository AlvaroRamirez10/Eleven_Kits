import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../CartContext';

function Checkout() {
  const { items, totalPrice } = useCart();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            items,
            customer: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              address: form.address,
              city: form.city,
              postalCode: form.postalCode,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError('Hubo un problema al procesar el pago: ' + data.error);
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setError('Hubo un problema al conectar con el pago. Inténtalo de nuevo.');
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
        <Header />
        <div style={{ padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: '#8A8A8A', marginBottom: '20px' }}>Tu carrito está vacío.</p>
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
      </div>
    );
  }

  const fieldStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: '#8A8A8A',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: '#0A0A0A',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#F5F5F0',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <Header />

      <div style={{
        padding: '48px 24px',
        maxWidth: '960px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '40px',
        alignItems: 'start',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '28px',
            letterSpacing: '1px',
            marginBottom: '28px',
          }}>
            FINALIZAR COMPRA
          </h1>

          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '13px', color: '#FFD500', marginBottom: '12px', fontWeight: 600 }}>
              CONTACTO
            </p>

            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre completo</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#FFD500', margin: '24px 0 12px', fontWeight: 600 }}>
              ENVÍO
            </p>

            <div style={fieldStyle}>
              <label style={labelStyle}>Dirección</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Código postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <p style={{
                color: '#FF6B6B',
                fontSize: '13px',
                backgroundColor: '#2A1414',
                padding: '10px 14px',
                borderRadius: '4px',
                marginTop: '8px',
                marginBottom: '8px',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: '#FFD500',
                color: '#0A0A0A',
                border: 'none',
                padding: '15px 32px',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
                width: '100%',
                marginTop: '12px',
              }}
            >
              {submitting ? 'Redirigiendo al pago...' : 'Ir al pago'}
            </button>

            <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginTop: '12px' }}>
              Pago seguro procesado por Stripe.
            </p>
          </form>
        </div>

        <div style={{
          backgroundColor: '#1C1C1C',
          border: '1px solid #262626',
          borderRadius: '8px',
          padding: '20px',
          position: 'sticky',
          top: '24px',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            Resumen del pedido
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {items.map((item) => (
              <div
                key={item.cartItemId}
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#262626',
                  borderRadius: '4px',
                  backgroundImage: item.image ? `url(${item.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#FFD500',
                    color: '#0A0A0A',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {item.quantity}
                  </span>
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.name}
                  </p>
                  {item.size && (
                    <p style={{ fontSize: '11px', color: '#8A8A8A' }}>Talla: {item.size}</p>
                  )}
                  {item.customization && (
                    <p style={{ fontSize: '11px', color: '#8A8A8A' }}>
                      {item.customization.customizationName && (
                        <>{item.customization.customizationName} </>
                      )}
                      {item.customization.customizationNumber && (
                        <>#{item.customization.customizationNumber} </>
                      )}
                      {item.customization.hasPatches && <>· Parches</>}
                    </p>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#FFD500', flexShrink: 0 }}>
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid #262626',
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: '15px' }}>Total</p>
            <p style={{ fontSize: '15px', color: '#FFD500', fontWeight: 600 }}>
              {totalPrice.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;