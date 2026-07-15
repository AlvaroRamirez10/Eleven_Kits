import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import supabase from '../supabaseClient';

function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      const { data: category } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', categorySlug)
        .single();

      if (!category) {
        setLoading(false);
        return;
      }

      setCategoryName(category.name);

      let query = supabase
        .from('products')
        .select('id, name, price, image_url, subcategory_id')
        .eq('category_id', category.id)
        .eq('active', true);

      if (subcategorySlug) {
        const { data: subcategory } = await supabase
          .from('subcategories')
          .select('id')
          .eq('slug', subcategorySlug)
          .single();

        if (subcategory) {
          query = query.eq('subcategory_id', subcategory.id);
        }
      }

      const { data: productsData } = await query;
      setProducts(productsData || []);
      setLoading(false);
    }

    fetchProducts();
  }, [categorySlug, subcategorySlug]);

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <Header />

      <div style={{ padding: '32px 24px' }}>
        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '28px',
          marginBottom: '24px',
        }}>
          {categoryName}
        </h1>

        {loading && <p style={{ color: '#8A8A8A' }}>Cargando productos...</p>}

        {!loading && products.length === 0 && (
          <p style={{ color: '#8A8A8A' }}>Todavía no hay productos en esta categoría.</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {products.map((product) => (
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
    </div>
  );
}

export default CategoryPage;