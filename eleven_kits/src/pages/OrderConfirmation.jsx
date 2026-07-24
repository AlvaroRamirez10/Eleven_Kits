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
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 213, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Package color="#FFD500" size={16} />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>Detalles del pedido</p>
              <p style={{ fontSize: '11px', color: '#8A8A8A', margin: '2px 0 0' }}>Guarda este código para consultas</p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#121212',
            border: '1px solid #2A2A2A',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '12px', color: '#8A8A8A' }}>Número de pedido</span>
            <span style={{
              color: '#FFD500',
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(255, 213, 0, 0.12)',
              padding: '6px 10px',
              borderRadius: '999px',
            }}>
              PED-{id.slice(0, 8).toUpperCase()}
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