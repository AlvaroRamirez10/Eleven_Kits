import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../CartContext';

function OrderConfirmation() {
  const { id } = useParams();
  const { items, removeFromCart } = useCart();

  useEffect(() => {
    items.forEach((item) => removeFromCart(item.productId, item.variantId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <Header />

      <div style={{
        padding: '80px 24px',
        maxWidth: '460px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 213, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <CheckCircle color="#FFD500" size={36} />
        </div>

        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '26px',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          ¡PEDIDO CONFIRMADO!
        </h1>

        <p style={{ color: '#B8B8B0', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          Gracias por tu compra. Estamos preparando tu pedido y te avisaremos cuando salga hacia tu dirección.
        </p>

        <div style={{
          backgroundColor: '#1C1C1C',
          border: '1px solid #262626',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Package color="#FFD500" size={18} />
            <p style={{ fontSize: '13px', fontWeight: 600 }}>Detalles del pedido</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8A8A8A' }}>
            <span>Número de pedido</span>
            <span style={{ color: '#F5F5F0', fontFamily: 'monospace' }}>
              #{id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        <Link to="/">
          <button style={{
            backgroundColor: '#FFD500',
            color: '#0A0A0A',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
          }}>
            Volver a la tienda
          </button>
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;