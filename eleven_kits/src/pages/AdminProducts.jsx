import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ImagePlus } from "lucide-react";
import supabase from "../supabaseClient";

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];

function getSizesForCategory(categorySlug) {
  if (!categorySlug) return CLOTHING_SIZES;
  return categorySlug === "calzado" ? SHOE_SIZES : CLOTHING_SIZES;
}

function AdminProducts() {
  const [checking, setChecking] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    customizable: false,
    customizationPrice: "",
    patchesAvailable: false,
    patchesPrice: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login");
        return;
      }
      setChecking(false);
      loadData();
    }
    init();
  }, [navigate]);

  async function loadData() {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");
    const { data: subcats } = await supabase
      .from("subcategories")
      .select("id, name, category_id")
      .order("name");
    const { data: prods } = await supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, active, category_id, subcategory_id, customizable, customization_price, patches_available, patches_price",
      )
      .order("created_at", { ascending: false });
    const { data: variants } = await supabase
      .from("product_variants")
      .select("product_id, size, stock")
      .order("size", { ascending: true });

    setCategories(cats || []);
    setSubcategories(subcats || []);

    const variantsByProduct = (variants || []).reduce((acc, variant) => {
      if (!acc[variant.product_id]) {
        acc[variant.product_id] = [];
      }

      acc[variant.product_id].push(variant);
      return acc;
    }, {});

    setProducts(
      (prods || []).map((product) => ({
        ...product,
        variants: variantsByProduct[product.id] || [],
      })),
    );
  }

  function handleFormChange(e) {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const prevCategory = categories.find((c) => c.id === form.categoryId);
      const nextCategory = categories.find((c) => c.id === value);
      const prevSizes = getSizesForCategory(prevCategory?.slug);
      const nextSizes = getSizesForCategory(nextCategory?.slug);

      if (prevSizes !== nextSizes) {
        setSelectedSizes({});
      }
    }

    setForm({ ...form, [name]: value });
  }

  function toggleSize(size) {
    setSelectedSizes((prev) => {
      const updated = { ...prev };
      if (size in updated) {
        delete updated[size];
      } else {
        updated[size] = "";
      }
      return updated;
    });
  }

  function handleSizeStock(size, value) {
    setSelectedSizes((prev) => ({ ...prev, [size]: value }));
  }

  async function loadExistingGallery(productId) {
    const { data } = await supabase
      .from("product_images")
      .select("id, image_url")
      .eq("product_id", productId)
      .order("position");

    setExistingGallery(data || []);
  }

  async function handleDeleteGalleryImage(imageId) {
    await supabase.from("product_images").delete().eq("id", imageId);
    setExistingGallery((prev) => prev.filter((img) => img.id !== imageId));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.category_id,
      subcategoryId: product.subcategory_id || "",
      customizable: product.customizable || false,
      customizationPrice: product.customization_price || "",
      patchesAvailable: product.patches_available || false,
      patchesPrice: product.patches_price || "",
    });
    setImageFile(null);
    setGalleryFiles([]);
    setMessage(null);
    loadExistingGallery(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      subcategoryId: "",
      customizable: false,
      customizationPrice: "",
      patchesAvailable: false,
      patchesPrice: "",
    });
    setImageFile(null);
    setGalleryFiles([]);
    setExistingGallery([]);
    setSelectedSizes({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage("Error al subir la imagen: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // Subir imágenes de galería (si hay)
    const galleryUrls = [];
    for (const file of galleryFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) {
        setMessage(
          "Error al subir una imagen de galería: " + uploadError.message,
        );
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      galleryUrls.push(publicUrlData.publicUrl);
    }

    if (editingId) {
      const updateData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.categoryId,
        subcategory_id: form.subcategoryId || null,
        customizable: form.customizable,
        customization_price: form.customizable
          ? parseFloat(form.customizationPrice) || 0
          : 0,
        patches_available: form.patchesAvailable,
        patches_price: form.patchesAvailable
          ? parseFloat(form.patchesPrice) || 0
          : 0,
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", editingId);

      if (updateError) {
        setMessage("Error al actualizar: " + updateError.message);
        setSaving(false);
        return;
      }

      if (galleryUrls.length > 0) {
        const startPosition = existingGallery.length;
        const galleryInserts = galleryUrls.map((url, i) => ({
          product_id: editingId,
          image_url: url,
          position: startPosition + i,
        }));
        await supabase.from("product_images").insert(galleryInserts);
      }

      setMessage("Producto actualizado correctamente.");
      cancelEdit();
      setSaving(false);
      loadData();
      return;
    }

    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.categoryId,
        subcategory_id: form.subcategoryId || null,
        image_url: imageUrl,
        active: true,
        customizable: form.customizable,
        customization_price: form.customizable
          ? parseFloat(form.customizationPrice) || 0
          : 0,
        patches_available: form.patchesAvailable,
        patches_price: form.patchesAvailable
          ? parseFloat(form.patchesPrice) || 0
          : 0,
      })
      .select()
      .single();

    if (productError) {
      setMessage("Error al crear el producto: " + productError.message);
      setSaving(false);
      return;
    }

    // Guardar la imagen principal también como parte de la galería (posición 0)
    const allImages = [];
    if (imageUrl)
      allImages.push({
        product_id: newProduct.id,
        image_url: imageUrl,
        position: 0,
      });
    galleryUrls.forEach((url, i) => {
      allImages.push({
        product_id: newProduct.id,
        image_url: url,
        position: i + 1,
      });
    });

    if (allImages.length > 0) {
      await supabase.from("product_images").insert(allImages);
    }

    const variantsToInsert = Object.entries(selectedSizes).map(
      ([size, stock]) => ({
        product_id: newProduct.id,
        size,
        stock: parseInt(stock) || 0,
      }),
    );

    if (variantsToInsert.length > 0) {
      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsToInsert);

      if (variantsError) {
        setMessage(
          "Producto creado, pero hubo un error con las tallas: " +
            variantsError.message,
        );
        setSaving(false);
        loadData();
        return;
      }
    }

    setMessage("Producto creado correctamente.");
    cancelEdit();
    setSaving(false);
    loadData();
  }

  async function handleDelete(productId) {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;

    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId);
    await supabase.from("product_images").delete().eq("product_id", productId);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      if (error.code === "23503") {
        alert(
          'No se puede borrar: este producto ya tiene pedidos asociados (aunque estén entregados, se conservan como historial). Usa el botón "Desactivar" para ocultarlo de la tienda sin perder ese historial.',
        );
      } else {
        alert("Error al borrar el producto: " + error.message);
      }
      return;
    }

    loadData();
  }

  async function handleToggleActive(productId, currentActive) {
    await supabase
      .from("products")
      .update({ active: !currentActive })
      .eq("id", productId);
    loadData();
  }

  if (checking) {
    return (
      <div
        style={{
          backgroundColor: "#0A0A0A",
          minHeight: "100vh",
          color: "#F5F5F0",
        }}
      >
        <p style={{ padding: "32px" }}>Comprobando acceso...</p>
      </div>
    );
  }

  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === form.categoryId,
  );

  const currentCategory = categories.find((c) => c.id === form.categoryId);
  const availableSizes = getSizesForCategory(currentCategory?.slug);
  const isShoeCategory = currentCategory?.slug === "calzado";

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    color: "#8A8A8A",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#0A0A0A",
    border: "1px solid #333",
    borderRadius: "4px",
    color: "#F5F5F0",
    fontSize: "14px",
    marginBottom: "16px",
    outline: "none",
  };

  // Agrupamos los productos por categoría, y dentro de cada categoría por subcategoría,
  // para que la lista quede organizada en vez de todo en una única columna plana.
  const productsByCategory = categories
    .map((category) => {
      const categoryProducts = products.filter(
        (p) => p.category_id === category.id,
      );
      const categorySubcats = subcategories.filter(
        (s) => s.category_id === category.id,
      );

      const groups = categorySubcats
        .map((sub) => ({
          subcategory: sub,
          items: categoryProducts.filter((p) => p.subcategory_id === sub.id),
        }))
        .filter((group) => group.items.length > 0);

      const uncategorized = categoryProducts.filter((p) => !p.subcategory_id);

      return {
        category,
        groups,
        uncategorized,
        total: categoryProducts.length,
      };
    })
    .filter((entry) => entry.total > 0);

  const productCard = (p) => (
    <div
      key={p.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        backgroundColor: "#1C1C1C",
        border: "1px solid #262626",
        padding: "10px",
        borderRadius: "8px",
        opacity: p.active ? 1 : 0.5,
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          backgroundColor: "#262626",
          borderRadius: "5px",
          backgroundImage: p.image_url ? `url(${p.image_url})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexShrink: 0,
        }}
      />
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "13px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {p.name}{" "}
          {!p.active && (
            <span style={{ color: "#666", fontSize: "11px" }}>(inactivo)</span>
          )}
        </p>
        <p style={{ fontSize: "12px", color: "#FFD500" }}>{p.price} €</p>
        {(p.variants || []).length > 0 && (
          <p
            style={{
              fontSize: "11px",
              color: "#8A8A8A",
              marginTop: "6px",
              lineHeight: 1.4,
            }}
          >
            Tallas:{" "}
            {p.variants
              .map((variant) => `${variant.size} (${variant.stock})`)
              .join(", ")}
          </p>
        )}
        {(p.customizable || p.patches_available) && (
          <p style={{ fontSize: "11px", color: "#FFD500", marginTop: "4px" }}>
            {p.customizable && `Personalizable (+${p.customization_price}€)`}
            {p.customizable && p.patches_available && " · "}
            {p.patches_available && `Parches (+${p.patches_price}€)`}
          </p>
        )}
      </div>
      <button
        onClick={() => startEdit(p)}
        style={{
          background: "none",
          border: "1px solid #333",
          color: "#F5F5F0",
          padding: "7px 14px",
          borderRadius: "4px",
          fontSize: "12px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Editar
      </button>
      <button
        onClick={() => handleToggleActive(p.id, p.active)}
        style={{
          background: "none",
          border: `1px solid ${p.active ? "#333" : "#4ADE8055"}`,
          color: p.active ? "#B8B8B0" : "#4ADE80",
          padding: "7px 14px",
          borderRadius: "4px",
          fontSize: "12px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {p.active ? "Desactivar" : "Activar"}
      </button>
      <button
        onClick={() => handleDelete(p.id)}
        style={{
          background: "none",
          border: "1px solid #3A1F1F",
          color: "#FF6B6B",
          padding: "7px 14px",
          borderRadius: "4px",
          fontSize: "12px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Borrar
      </button>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#F5F5F0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #262626",
        }}
      >
        <div>
          <Link
            to="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#8A8A8A",
              fontSize: "12px",
              textDecoration: "none",
              marginBottom: "6px",
            }}
          >
            <ArrowLeft size={13} /> Panel
          </Link>
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "20px",
              letterSpacing: "1px",
            }}
          >
            PRODUCTOS
          </h1>
        </div>
      </div>

      <div
        style={{
          padding: "32px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#1C1C1C",
            border: "1px solid #262626",
            padding: "24px",
            borderRadius: "10px",
          }}
        >
          <h2
            style={{ fontSize: "15px", fontWeight: 600, marginBottom: "20px" }}
          >
            {editingId ? "Editar producto" : "Nuevo producto"}
          </h2>

          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <label style={labelStyle}>Precio (€)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleFormChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Categoría</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleFormChange}
            required
            style={inputStyle}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {form.categoryId && (
            <>
              <label style={labelStyle}>Subcategoría</label>
              <select
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleFormChange}
                style={inputStyle}
              >
                <option value="">Sin subcategoría</option>
                {filteredSubcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <label style={labelStyle}>
            Imagen principal{" "}
            {editingId && "(deja vacío para mantener la actual)"}
          </label>
          <label
            htmlFor="product-image-input"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              backgroundColor: "#0A0A0A",
              border: "1px dashed #444",
              borderRadius: "4px",
              fontSize: "13px",
              color: imageFile ? "#F5F5F0" : "#8A8A8A",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            <ImagePlus size={16} color="#FFD500" />
            {imageFile ? imageFile.name : "Seleccionar imagen"}
          </label>
          <input
            id="product-image-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ display: "none" }}
          />

          <label style={labelStyle}>Imágenes adicionales (galería)</label>
          <label
            htmlFor="gallery-images-input"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              backgroundColor: "#0A0A0A",
              border: "1px dashed #444",
              borderRadius: "4px",
              fontSize: "13px",
              color: galleryFiles.length > 0 ? "#F5F5F0" : "#8A8A8A",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            <ImagePlus size={16} color="#FFD500" />
            {galleryFiles.length > 0
              ? `${galleryFiles.length} imagen(es) seleccionada(s)`
              : "Añadir varias imágenes"}
          </label>
          <input
            id="gallery-images-input"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
            style={{ display: "none" }}
          />
          <p style={{ fontSize: "11px", color: "#666", marginTop: "-4px", marginBottom: "16px" }}>
            Consejo: mantén pulsado Ctrl (o Shift para un rango) al hacer clic en las fotos dentro del explorador de Windows para seleccionar varias a la vez.
          </p>

          {existingGallery.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {existingGallery.map((img) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <img
                    src={img.image_url}
                    alt=""
                    style={{
                      width: "56px",
                      height: "56px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryImage(img.id)}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      backgroundColor: "#FF6B6B",
                      color: "#0A0A0A",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "11px",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {!editingId && (
            <>
              <label style={{ ...labelStyle, marginBottom: "8px" }}>
                Tallas y stock{" "}
                {form.categoryId && (
                  <span style={{ color: "#666" }}>
                    (
                    {isShoeCategory
                      ? "numeración de calzado"
                      : "tallas de ropa"}
                    )
                  </span>
                )}
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                {availableSizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor:
                        size in selectedSizes ? "#FFD500" : "#0A0A0A",
                      color: size in selectedSizes ? "#0A0A0A" : "#F5F5F0",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: size in selectedSizes ? 600 : 400,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {Object.keys(selectedSizes).length > 0 && (
                <div
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {Object.entries(selectedSizes).map(([size, stock]) => (
                    <div
                      key={size}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          width: "30px",
                          color: "#8A8A8A",
                        }}
                      >
                        {size}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => handleSizeStock(size, e.target.value)}
                        style={{
                          ...inputStyle,
                          marginBottom: 0,
                          padding: "8px 10px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div style={{ borderTop: "1px solid #262626", paddingTop: "16px", marginBottom: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.customizable}
                onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
              />
              Permitir personalizar nombre y número
            </label>

            {form.customizable && (
              <div style={{ marginBottom: "14px", marginLeft: "24px" }}>
                <label style={labelStyle}>Precio extra por personalización (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.customizationPrice}
                  onChange={(e) => setForm({ ...form, customizationPrice: e.target.value })}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginTop: "14px", marginBottom: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.patchesAvailable}
                onChange={(e) => setForm({ ...form, patchesAvailable: e.target.checked })}
              />
              Permitir añadir parches en las mangas
            </label>

            {form.patchesAvailable && (
              <div style={{ marginLeft: "24px" }}>
                <label style={labelStyle}>Precio extra por parches (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.patchesPrice}
                  onChange={(e) => setForm({ ...form, patchesPrice: e.target.value })}
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
              </div>
            )}
          </div>

          {message && (
            <p
              style={{
                fontSize: "13px",
                color: message.includes("Error") ? "#FF6B6B" : "#4ADE80",
                backgroundColor: message.includes("Error")
                  ? "#2A1414"
                  : "#132A1A",
                padding: "10px 12px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              backgroundColor: "#FFD500",
              color: "#0A0A0A",
              border: "none",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving
              ? "Guardando..."
              : editingId
                ? "Guardar cambios"
                : "Crear producto"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                width: "100%",
                background: "none",
                border: "1px solid #333",
                color: "#B8B8B0",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Cancelar edición
            </button>
          )}
        </form>

        <div>
          <h2
            style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px" }}
          >
            Productos existentes ({products.length})
          </h2>

          {productsByCategory.length === 0 && (
            <p style={{ color: "#8A8A8A", fontSize: "13px" }}>
              Todavía no has creado ningún producto.
            </p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {productsByCategory.map(
              ({ category, groups, uncategorized, total }) => (
                <div key={category.id}>
                  <p
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.5px",
                      color: "#FFD500",
                      marginBottom: "10px",
                    }}
                  >
                    {category.name.toUpperCase()}{" "}
                    <span
                      style={{
                        color: "#666",
                        fontWeight: 400,
                        fontFamily: "inherit",
                      }}
                    >
                      ({total})
                    </span>
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {groups.map(({ subcategory, items }) => (
                      <div key={subcategory.id}>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#8A8A8A",
                            marginBottom: "8px",
                            paddingLeft: "4px",
                          }}
                        >
                          {subcategory.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {items.map(productCard)}
                        </div>
                      </div>
                    ))}

                    {uncategorized.length > 0 && (
                      <div>
                        {groups.length > 0 && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8A8A",
                              marginBottom: "8px",
                              paddingLeft: "4px",
                            }}
                          >
                            Sin subcategoría
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {uncategorized.map(productCard)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;