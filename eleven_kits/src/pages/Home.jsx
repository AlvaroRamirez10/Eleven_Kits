import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import supabase from '../supabaseClient';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setFeaturedProducts(data || []);
      setLoading(false);
    }

    fetchFeatured();
  }, []);

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <Header />

      {/* HERO */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 64px',
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#1C1C1C',
          border: '1px solid #333',
          borderRadius: '4px',
          padding: '6px 16px',
          fontSize: '11px',
          letterSpacing: '2px',
          color: '#FFD500',
          marginBottom: '20px',
        }}>
          NUEVA COLECCIÓN
        </div>

        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(36px, 6vw, 56px)',
          lineHeight: 1.1,
          margin: 0,
          letterSpacing: '1px',
        }}>
          EQUÍPATE<br />
          <span style={{ color: '#FFD500' }}>PARA GANAR</span>
        </h1>

        <p style={{
          color: '#8A8A8A',
          fontSize: '15px',
          maxWidth: '420px',
          margin: '20px auto 0',
        }}>
          Camisetas, chándals y calzado deportivo. Envío rápido, calidad revisada.
        </p>

        <Link to="/categoria/futbol">
          <button style={{
            marginTop: '28px',
            backgroundColor: '#FFD500',
            color: '#0A0A0A',
            border: 'none',
            padding: '14px 36px',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Ver colección
          </button>
        </Link>
      </div>

      {/* CATEGORÍAS DESTACADAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        padding: '0 24px 64px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {[
          { name: 'Fútbol', slug: 'futbol' },
          { name: 'Baloncesto', slug: 'baloncesto' },
          { name: 'Calzado', slug: 'calzado' },
        ].map((cat) => (
          <Link key={cat.slug} to={`/categoria/${cat.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#1C1C1C',
              borderRadius: '8px',
              padding: '32px 20px',
              textAlign: 'center',
              border: '1px solid #262626',
              transition: 'border-color 0.2s',
            }}>
              <p style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '18px',
                letterSpacing: '1px',
                color: '#F5F5F0',
                margin: 0,
              }}>
                {cat.name.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* PRODUCTOS DESTACADOS */}
      <div style={{ padding: '0 24px 64px', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '18px',
          letterSpacing: '1px',
          marginBottom: '20px',
        }}>
          DESTACADOS
        </p>

        {loading && <p style={{ color: '#8A8A8A' }}>Cargando...</p>}

        {!loading && featuredProducts.length === 0 && (
          <p style={{ color: '#8A8A8A' }}>Todavía no hay productos publicados.</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                backgroundColor: '#1C1C1C',
                borderRadius: '6px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '220px',
                  backgroundColor: '#262626',
                  backgroundImage: product.image_url ? `url(${product.image_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                <div style={{ padding: '12px' }}>
                  <p style={{ color: '#F5F5F0', fontSize: '14px', marginBottom: '4px' }}>
                    {product.name}
                  </p>
                  <p style={{ color: '#FFD500', fontSize: '15px', fontWeight: 500 }}>
                    {product.price} €
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderTop: '1px solid #262626',
        fontSize: '12px',
        color: '#666',
      }}>
        <span>© Eleven Kits</span>
        <span>Envío gratis desde 60 €</span>
      </div>
    </div>
  );
}

export default Home;