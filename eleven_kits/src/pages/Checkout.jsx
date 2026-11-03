import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Lock, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../CartContext';
import { useIsMobile } from '../useIsMobile';

const FREE_SHIPPING_FROM = 60;

function Checkout() {
  const { items, totalPrice } = useCart();
  const isMobile = useIsMobile();

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
  const [summaryOpen, setSummaryOpen] = useState(false);

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

  const primaryButtonStyle = {
    display: 'inline-flex',
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

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
        <style>{`.ek-cta:hover { background-color: #FFE24D !important; }`}</style>
        <Header />
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: isMobile ? '40px 16px' : '64px 32px',
          }}
        >
          <ShoppingBag color="#4A4A4A" size={40} style={{ marginBottom: '16px' }} />
          <p style={{ color: '#B8B8B0', margin: '0 0 24px', fontSize: '16px' }}>
            Tu carrito está vacío, así que no hay nada que pagar todavía.
          </p>
          <Link
            to="/"
            className="ek-cta"
            style={{ ...primaryButtonStyle, padding: '0 32px', height: '50px' }}
          >
            Ver la tienda
          </Link>
        </div>
      </div>
    );
  }

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShipping = totalPrice >= FREE_SHIPPING_FROM;

  function getDetails(item) {
    const parts = [];
    if (item.size) parts.push(`Talla ${item.size}`);
    if (item.customization?.customizationName) {
      parts.push(item.customization.customizationName);
    }
    if (item.customization?.customizationNumber) {
      parts.push(`Nº ${item.customization.customizationNumber}`);
    }
    if (item.customization?.hasPatches) parts.push('Con parches');
    return parts;
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    color: '#B8B8B0',
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 14px',
    backgroundColor: '#141414',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#F5F5F0',
    fontSize: '16px',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  };

  const sectionTitleStyle = {
    fontFamily: "'Anton', sans-serif",
    fontWeight: 400,
    fontSize: isMobile ? '22px' : '26px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    margin: 0,
  };

  const summaryContent = (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        {items.map((item) => {
          const details = getDetails(item);
          return (
            <div
              key={item.cartItemId}
              style={{ display: 'flex', gap: '14px', alignItems: 'center' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '56px',
                  aspectRatio: '4 / 5',
                  flexShrink: 0,
                  backgroundColor: '#1C1C1C',
                  borderRadius: '4px',
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
                      borderRadius: '4px',
                      display: 'block',
                    }}
                  />
                )}
                <span
                  style={{
                    position: 'absolute',
                    top: '-7px',
                    right: '-7px',
                    backgroundColor: '#FFD500',
                    color: '#0A0A0A',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 4px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.quantity}
                </span>
              </div>

              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </p>
                {details.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#8A8A8A', margin: '2px 0 0', lineHeight: 1.4 }}>
                    {details.join(' · ')}
                  </p>
                )}
              </div>

              <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, flexShrink: 0 }}>
                {(item.price * item.quantity).toFixed(2)} €
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid #262626', paddingTop: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#B8B8B0',
            marginBottom: freeShipping ? '8px' : 0,
          }}
        >
          <span>Subtotal</span>
          <span>{totalPrice.toFixed(2)} €</span>
        </div>
        {freeShipping && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#B8B8B0',
            }}
          >
            <span>Envío</span>
            <span style={{ color: '#FFD500', fontWeight: 600 }}>Gratis</span>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderTop: '1px solid #262626',
          marginTop: '16px',
          paddingTop: '16px',
        }}
      >
        <span style={{ fontSize: '16px' }}>Total</span>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px', color: '#FFD500' }}>
          {totalPrice.toFixed(2)} €
        </span>
      </div>
    </>
  );

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <style>{`
        .ek-field:focus { border-color: #FFD500 !important; outline: none; }
        .ek-cta:hover:not(:disabled) { background-color: #FFE24D !important; }
        .ek-cta:focus-visible, .ek-co-link:focus-visible, .ek-summary-toggle:focus-visible { outline: 2px solid #FFD500; outline-offset: 2px; }
      `}</style>

      <Header />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: isMobile ? '24px 16px 48px' : '48px 32px 80px',
        }}
      >
        {/* Pasos */}
        <nav
          aria-label="Pasos de la compra"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            marginBottom: isMobile ? '16px' : '24px',
          }}
        >
          <Link to="/carrito" className="ek-co-link" style={{ color: '#8A8A8A', textDecoration: 'none' }}>
            Carrito
          </Link>
          <span style={{ color: '#4A4A4A' }}>/</span>
          <span aria-current="step" style={{ color: '#FFD500', fontWeight: 600 }}>
            Datos
          </span>
          <span style={{ color: '#4A4A4A' }}>/</span>
          <span style={{ color: '#8A8A8A' }}>Pago</span>
        </nav>

        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? '44px' : '72px',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            margin: isMobile ? '0 0 20px' : '0 0 40px',
          }}
        >
          Finalizar compra
        </h1>

        {/* Resumen desplegable en móvil */}
        {isMobile && (
          <div
            style={{
              backgroundColor: '#141414',
              borderRadius: '4px',
              marginBottom: '28px',
            }}
          >
            <button
              type="button"
              className="ek-summary-toggle"
              aria-expanded={summaryOpen}
              onClick={() => setSummaryOpen(!summaryOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                color: '#F5F5F0',
                padding: '16px',
                cursor: 'pointer',
                fontSize: '15px',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {summaryOpen ? 'Ocultar resumen' : `Ver resumen (${totalUnits})`}
                <ChevronDown
                  size={18}
                  color="#8A8A8A"
                  style={{
                    transform: summaryOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                />
              </span>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '22px', color: '#FFD500' }}>
                {totalPrice.toFixed(2)} €
              </span>
            </button>
            {summaryOpen && <div style={{ padding: '4px 16px 20px' }}>{summaryContent}</div>}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 400px',
            columnGap: '64px',
            alignItems: 'start',
          }}
        >
          <form onSubmit={handleSubmit} style={{ minWidth: 0 }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: '20px' }}>Contacto</h2>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="co-name" style={labelStyle}>Nombre completo</label>
              <input
                id="co-name"
                className="ek-field"
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
                columnGap: '16px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="co-email" style={labelStyle}>Email</label>
                <input
                  id="co-email"
                  className="ek-field"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="co-phone" style={labelStyle}>Teléfono (opcional)</label>
                <input
                  id="co-phone"
                  className="ek-field"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <h2 style={{ ...sectionTitleStyle, margin: '32px 0 20px' }}>Envío</h2>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="co-address" style={labelStyle}>Dirección</label>
              <input
                id="co-address"
                className="ek-field"
                type="text"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 140px',
                columnGap: '16px',
              }}
            >
              <div style={{ marginBottom: '16px', minWidth: 0 }}>
                <label htmlFor="co-city" style={labelStyle}>Ciudad</label>
                <input
                  id="co-city"
                  className="ek-field"
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '16px', minWidth: 0 }}>
                <label htmlFor="co-postal" style={labelStyle}>Código postal</label>
                <input
                  id="co-postal"
                  className="ek-field"
                  type="text"
                  inputMode="numeric"
                  name="postalCode"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  color: '#FF6B6B',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  backgroundColor: '#2A1414',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  margin: '8px 0 0',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="ek-cta"
              disabled={submitting}
              style={{
                ...primaryButtonStyle,
                width: '100%',
                height: '56px',
                marginTop: '24px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? 'Redirigiendo al pago...' : `Ir al pago · ${totalPrice.toFixed(2)} €`}
            </button>

            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#8A8A8A',
                margin: '14px 0 0',
              }}
            >
              <Lock size={14} />
              Pago seguro procesado por Stripe
            </p>

            <p style={{ textAlign: 'center', margin: '20px 0 0' }}>
              <Link
                to="/carrito"
                className="ek-co-link"
                style={{ color: '#B8B8B0', fontSize: '14px' }}
              >
                Volver al carrito
              </Link>
            </p>
          </form>

          {!isMobile && (
            <aside
              style={{
                backgroundColor: '#141414',
                borderRadius: '4px',
                padding: '28px',
                position: 'sticky',
                top: '92px',
              }}
            >
              <h2 style={{ ...sectionTitleStyle, fontSize: '24px', marginBottom: '20px' }}>
                Tu pedido
              </h2>
              {summaryContent}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;