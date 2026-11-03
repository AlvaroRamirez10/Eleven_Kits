import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../CartContext';
import { useIsMobile } from '../useIsMobile';

function OrderConfirmation() {
  const { id } = useParams();
  const { items, removeFromCart } = useCart();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    items.forEach((item) => removeFromCart(item.cartItemId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderNumber = `PED-${(id || '').slice(0, 8).toUpperCase()}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  }

  const steps = [
    { title: 'Preparamos tu pedido', text: 'Revisamos cada prenda y la dejamos lista para enviar.' },
    { title: 'Te avisamos cuando salga', text: 'Sabrás en cuanto tu pedido esté de camino.' },
    { title: 'Lo recibes en tu dirección', text: 'Llega a la dirección que indicaste al pagar.' },
  ];

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <style>{`
        .ek-cta:hover { background-color: #FFE24D !important; }
        .ek-ghost:hover { border-color: #FFD500 !important; color: #FFD500 !important; }
        .ek-cta:focus-visible, .ek-ghost:focus-visible, .ek-copy:focus-visible { outline: 2px solid #FFD500; outline-offset: 2px; }
      `}</style>

      <Header />

      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: isMobile ? '40px 16px 56px' : '72px 32px 96px',
        }}
      >
        <div
          style={{
            width: isMobile ? '56px' : '72px',
            height: isMobile ? '56px' : '72px',
            borderRadius: '50%',
            backgroundColor: '#FFD500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: isMobile ? '20px' : '28px',
          }}
        >
          <Check color="#0A0A0A" size={isMobile ? 30 : 40} strokeWidth={3} />
        </div>

        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? '48px' : '80px',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}
        >
          Pedido confirmado
        </h1>

        <p
          style={{
            color: '#B8B8B0',
            fontSize: isMobile ? '16px' : '18px',
            lineHeight: 1.6,
            margin: '0 0 32px',
            maxWidth: '520px',
          }}
        >
          Gracias por tu compra. Estamos preparando tu pedido y te avisaremos
          cuando salga hacia tu dirección.
        </p>

        {/* Número de pedido */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '4px',
            padding: isMobile ? '20px 16px' : '24px',
            marginBottom: '40px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#8A8A8A', margin: '0 0 8px' }}>
            Número de pedido. Guárdalo por si necesitas consultarnos algo.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? '30px' : '40px',
                letterSpacing: '0.06em',
                color: '#FFD500',
                minWidth: 0,
                overflowWrap: 'anywhere',
              }}
            >
              {orderNumber}
            </span>
            <button
              type="button"
              className="ek-copy"
              onClick={handleCopy}
              aria-label="Copiar número de pedido"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '44px',
                padding: '0 14px',
                backgroundColor: 'transparent',
                border: '1px solid #333',
                borderRadius: '4px',
                color: copied ? '#FFD500' : '#F5F5F0',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Próximos pasos */}
        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? '22px' : '26px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: '0 0 8px',
          }}
        >
          Qué pasa ahora
        </h2>
        <ol style={{ listStyle: 'none', margin: '0 0 40px', padding: 0 }}>
          {steps.map((step, index) => (
            <li
              key={step.title}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '18px 0',
                borderBottom: '1px solid #262626',
              }}
            >
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '28px',
                  lineHeight: 1,
                  color: '#FFD500',
                  minWidth: '28px',
                }}
              >
                {index + 1}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>
                  {step.title}
                </p>
                <p style={{ fontSize: '14px', color: '#8A8A8A', lineHeight: 1.5, margin: 0 }}>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
          }}
        >
          <Link
            to="/"
            className="ek-cta"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '52px',
              padding: '0 32px',
              backgroundColor: '#FFD500',
              color: '#0A0A0A',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 700,
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Seguir comprando
          </Link>

          <a
            href="https://t.me/ElevenKits10"
            target="_blank"
            rel="noopener noreferrer"
            className="ek-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '52px',
              padding: '0 32px',
              backgroundColor: 'transparent',
              color: '#F5F5F0',
              border: '1px solid #333',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Escríbenos por Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;