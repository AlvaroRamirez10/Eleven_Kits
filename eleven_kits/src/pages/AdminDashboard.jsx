import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ShoppingCart, Tag, LogOut } from 'lucide-react';
import supabase from '../supabaseClient';

function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate('/admin/login');
        return;
      }

      setChecking(false);
    }

    checkSession();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  if (checking) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
        <p style={{ padding: '32px' }}>Comprobando acceso...</p>
      </div>
    );
  }

  const cards = [
    {
      to: '/admin/productos',
      icon: Package,
      title: 'Productos',
      description: 'Crear, editar y borrar productos con imágenes y tallas',
    },
    {
      to: '/admin/pedidos',
      icon: ShoppingCart,
      title: 'Pedidos',
      description: 'Ver pedidos entrantes y actualizar su estado',
    },
    {
      to: '/admin/categorias',
      icon: Tag,
      title: 'Categorías',
      description: 'Gestionar categorías y subcategorías del catálogo',
    },
  ];

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #262626',
      }}>
        <div>
          <p style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '11px',
            letterSpacing: '2px',
            color: '#8A8A8A',
            marginBottom: '2px',
          }}>
            ELEVEN KITS
          </p>
          <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: '20px', letterSpacing: '1px' }}>
            PANEL DE ADMINISTRACIÓN
          </h1>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: '1px solid #333',
            color: '#B8B8B0',
            padding: '9px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>

      <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ color: '#8A8A8A', fontSize: '14px', marginBottom: '28px' }}>
          Bienvenido de nuevo. Elige qué quieres gestionar.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.to} to={card.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #262626',
                  borderRadius: '10px',
                  padding: '24px',
                  height: '100%',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 213, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <Icon color="#FFD500" size={20} />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                    {card.title}
                  </p>
                  <p style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.5 }}>
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;