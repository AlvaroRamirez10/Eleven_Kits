import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import supabase from '../supabaseClient';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function AdminCategories() {
  const [checking, setChecking] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ categoryId: '', name: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/admin/login');
        return;
      }
      setChecking(false);
      loadData();
    }
    init();
  }, [navigate]);

  async function loadData() {
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    const { data: subcats } = await supabase.from('subcategories').select('*').order('name');
    setCategories(cats || []);
    setSubcategories(subcats || []);
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const { error } = await supabase.from('categories').insert({
      name: newCategoryName,
      slug: slugify(newCategoryName),
    });

    if (error) {
      setMessage('Error: ' + error.message);
      return;
    }

    setNewCategoryName('');
    setMessage('Categoría creada.');
    loadData();
  }

  async function handleCreateSubcategory(e) {
    e.preventDefault();
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) return;

    const category = categories.find((c) => c.id === newSubcategory.categoryId);
    const slug = `${category.slug}-${slugify(newSubcategory.name)}`;

    const { error } = await supabase.from('subcategories').insert({
      category_id: newSubcategory.categoryId,
      name: newSubcategory.name,
      slug,
    });

    if (error) {
      setMessage('Error: ' + error.message);
      return;
    }

    setNewSubcategory({ categoryId: '', name: '' });
    setMessage('Subcategoría creada.');
    loadData();
  }

  function startEditCategory(cat) {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  }

  async function saveEditCategory(catId) {
    const { error } = await supabase
      .from('categories')
      .update({ name: editingCategoryName, slug: slugify(editingCategoryName) })
      .eq('id', catId);

    if (error) {
      setMessage('Error: ' + error.message);
      return;
    }

    setEditingCategoryId(null);
    loadData();
  }

  function startEditSubcategory(sub) {
    setEditingSubcategoryId(sub.id);
    setEditingSubcategoryName(sub.name);
  }

  async function saveEditSubcategory(subId, categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    const slug = `${category.slug}-${slugify(editingSubcategoryName)}`;

    const { error } = await supabase
      .from('subcategories')
      .update({ name: editingSubcategoryName, slug })
      .eq('id', subId);

    if (error) {
      setMessage('Error: ' + error.message);
      return;
    }

    setEditingSubcategoryId(null);
    loadData();
  }

  async function handleDeleteCategory(catId) {
    if (!confirm('¿Borrar esta categoría? También se borrarán sus subcategorías. Los productos asociados NO se borran, pero quedarán sin categoría válida.')) return;

    await supabase.from('subcategories').delete().eq('category_id', catId);
    await supabase.from('categories').delete().eq('id', catId);
    loadData();
  }

  async function handleDeleteSubcategory(subId) {
    if (!confirm('¿Borrar esta subcategoría?')) return;
    await supabase.from('subcategories').delete().eq('id', subId);
    loadData();
  }

  if (checking) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
        <p style={{ padding: '32px' }}>Comprobando acceso...</p>
      </div>
    );
  }

  const inputStyle = {
    padding: '9px 12px',
    backgroundColor: '#0A0A0A',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#F5F5F0',
    fontSize: '13px',
    outline: 'none',
  };

  const smallBtn = (color) => ({
    background: 'none',
    border: `1px solid ${color}33`,
    color,
    padding: '5px 12px',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
  });

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
          <Link to="/admin" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#8A8A8A',
            fontSize: '12px',
            textDecoration: 'none',
            marginBottom: '6px',
          }}>
            <ArrowLeft size={13} /> Panel
          </Link>
          <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: '20px', letterSpacing: '1px' }}>
            CATEGORÍAS
          </h1>
        </div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '700px', margin: '0 auto' }}>

        {message && (
          <p style={{
            fontSize: '13px',
            color: message.includes('Error') ? '#FF6B6B' : '#4ADE80',
            backgroundColor: message.includes('Error') ? '#2A1414' : '#132A1A',
            padding: '10px 12px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}>
            {message}
          </p>
        )}

        <form onSubmit={handleCreateCategory} style={{
          display: 'flex', gap: '8px', marginBottom: '28px',
        }}>
          <input
            type="text"
            placeholder="Nombre de nueva categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{ ...inputStyle, flexGrow: 1 }}
          />
          <button type="submit" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFD500',
            color: '#0A0A0A',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            <Plus size={14} /> Categoría
          </button>
        </form>

        {categories.map((cat) => (
          <div key={cat.id} style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #262626',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              {editingCategoryId === cat.id ? (
                <div style={{ display: 'flex', gap: '8px', flexGrow: 1 }}>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    style={{ ...inputStyle, flexGrow: 1 }}
                  />
                  <button onClick={() => saveEditCategory(cat.id)} style={smallBtn('#4ADE80')}>
                    Guardar
                  </button>
                  <button onClick={() => setEditingCategoryId(null)} style={smallBtn('#8A8A8A')}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <p style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: '15px',
                    letterSpacing: '0.5px',
                  }}>
                    {cat.name.toUpperCase()}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => startEditCategory(cat)} style={smallBtn('#F5F5F0')}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} style={smallBtn('#FF6B6B')}>
                      Borrar
                    </button>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
              {subcategories.filter((s) => s.category_id === cat.id).map((sub) => (
                <div key={sub.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: '10px',
                  borderLeft: '2px solid #333',
                }}>
                  {editingSubcategoryId === sub.id ? (
                    <div style={{ display: 'flex', gap: '6px', flexGrow: 1 }}>
                      <input
                        type="text"
                        value={editingSubcategoryName}
                        onChange={(e) => setEditingSubcategoryName(e.target.value)}
                        style={{ ...inputStyle, flexGrow: 1, padding: '6px 10px' }}
                      />
                      <button onClick={() => saveEditSubcategory(sub.id, sub.category_id)} style={smallBtn('#4ADE80')}>
                        Guardar
                      </button>
                      <button onClick={() => setEditingSubcategoryId(null)} style={smallBtn('#8A8A8A')}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: '13px', color: '#B8B8B0' }}>{sub.name}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => startEditSubcategory(sub)} style={smallBtn('#F5F5F0')}>
                          Editar
                        </button>
                        <button onClick={() => handleDeleteSubcategory(sub.id)} style={smallBtn('#FF6B6B')}>
                          Borrar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {newSubcategory.categoryId === cat.id ? (
              <form
                onSubmit={handleCreateSubcategory}
                style={{ display: 'flex', gap: '6px', marginTop: '14px' }}
              >
                <input
                  type="text"
                  placeholder="Nombre de subcategoría"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  style={{ ...inputStyle, flexGrow: 1, padding: '7px 10px' }}
                  autoFocus
                />
                <button type="submit" style={{
                  backgroundColor: '#FFD500', color: '#0A0A0A', border: 'none',
                  padding: '7px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}>
                  Añadir
                </button>
                <button
                  type="button"
                  onClick={() => setNewSubcategory({ categoryId: '', name: '' })}
                  style={smallBtn('#8A8A8A')}
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <button
                onClick={() => setNewSubcategory({ categoryId: cat.id, name: '' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#FFD500',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginTop: '14px',
                  padding: 0,
                }}
              >
                <Plus size={12} /> Añadir subcategoría
              </button>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <p style={{ color: '#8A8A8A', fontSize: '13px' }}>Todavía no has creado ninguna categoría.</p>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;