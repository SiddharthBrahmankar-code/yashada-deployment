'use client';

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import productsData from '@/data/products.json';
import brandsData from '@/data/brands.json';

// SHA-256 hash of the admin password — plaintext never appears in the bundle
const ADMIN_PASSWORD_HASH = '441da12c0604929b02dc185df8e4fa61f55afa03f853ccb3b55a61ea9cfa175c';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);
  const [toast, setToast] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setCategories(JSON.parse(JSON.stringify(productsData.categories)));
    setBrands(JSON.parse(JSON.stringify(brandsData.brands)));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ─── Auth ──────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={styles.authWrap}>
        <div style={styles.authCard}>
          <div style={styles.authLogo}>YASHADA.</div>
          <h2 style={styles.authTitle}>Admin Panel</h2>
          <p style={styles.authSub}>Enter the admin password to continue</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const hash = await hashPassword(password);
            if (hash === ADMIN_PASSWORD_HASH) setAuthenticated(true);
            else alert('Incorrect password');
          }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.btnGold}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Download JSON ─────────────────────────────────────
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✅ ${filename} downloaded! Keep this as a backup.`);
  };

  // ─── Publish to Website (one-click deploy) ─────────────
  const publishToSite = async () => {
    if (publishing) return;
    if (!confirm('Publish all changes to the live website?')) return;

    setPublishing(true);
    showToast('⏳ Publishing changes...');

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: { categories },
          brands: { brands },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`✅ ${data.message} (commit: ${data.commitSha})`);
      } else {
        showToast(`❌ ${data.error || 'Publish failed — try Download Backup instead'}`);
      }
    } catch (err) {
      showToast('❌ Network error — check your connection and try again');
    } finally {
      setPublishing(false);
    }
  };

  // ─── Product CRUD ──────────────────────────────────────
  const deleteProduct = (catIdx, prodIdx) => {
    if (!confirm('Delete this product?')) return;
    const updated = [...categories];
    updated[catIdx].products.splice(prodIdx, 1);
    setCategories(updated);
    showToast('Product deleted');
  };

  const saveProduct = (catIdx, product) => {
    const updated = [...categories];
    const cat = updated[catIdx];
    const existingIdx = cat.products.findIndex((p) => p.id === product.id);
    if (existingIdx >= 0) {
      cat.products[existingIdx] = product;
    } else {
      cat.products.push(product);
    }
    setCategories(updated);
    setEditingProduct(null);
    showToast('Product saved');
  };

  // ─── Brand CRUD ────────────────────────────────────────
  const deleteBrand = (idx) => {
    if (!confirm('Delete this brand?')) return;
    const updated = [...brands];
    updated.splice(idx, 1);
    setBrands(updated);
    showToast('Brand deleted');
  };

  const saveBrand = (brand) => {
    const updated = [...brands];
    const existingIdx = updated.findIndex((b) => b.id === brand.id);
    if (existingIdx >= 0) {
      updated[existingIdx] = brand;
    } else {
      updated.push(brand);
    }
    setBrands(updated);
    setEditingBrand(null);
    showToast('Brand saved');
  };

  // ─── Product Form ──────────────────────────────────────
  const ProductForm = ({ product, catIdx, onSave, onCancel }) => {
    const [form, setForm] = useState(
      product || { id: '', name: '', description: '', image: '', specs: {} }
    );
    const [specKey, setSpecKey] = useState('');
    const [specVal, setSpecVal] = useState('');

    const set = (key, val) => setForm({ ...form, [key]: val });

    return (
      <div style={styles.formCard} className="admin-form-card">
        <h3 style={styles.formTitle}>{product ? 'Edit Product' : 'New Product'}</h3>
        <label style={styles.label}>Product Name *</label>
        <input
          style={styles.input}
          value={form.name}
          onChange={(e) => {
            set('name', e.target.value);
            if (!product) set('id', slugify(e.target.value));
          }}
          placeholder="e.g. BOPP Tape"
        />
        <label style={styles.label}>Slug (auto-generated)</label>
        <input
          style={{ ...styles.input, opacity: 0.6 }}
          value={form.id}
          onChange={(e) => set('id', e.target.value)}
        />
        <label style={styles.label}>Description</label>
        <textarea
          style={{ ...styles.input, minHeight: 80 }}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Short product description..."
        />
        <label style={styles.label}>Image Path</label>
        <input
          style={styles.input}
          value={form.image}
          onChange={(e) => set('image', e.target.value)}
          placeholder="/images/products/my-product.webp"
        />
        <label style={styles.label}>Specifications</label>
        <div style={{ marginBottom: '0.5rem' }}>
          {Object.entries(form.specs || {}).map(([k, v]) => (
            <div key={k} style={styles.specRow}>
              <span style={styles.specKey}>{k}:</span>
              <span style={styles.specVal}>{v}</span>
              <button
                style={styles.btnSmallDanger}
                onClick={() => {
                  const newSpecs = { ...form.specs };
                  delete newSpecs[k];
                  set('specs', newSpecs);
                }}
              >✕</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input style={{ ...styles.input, flex: 1 }} value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Key (e.g. Brand)" />
          <input style={{ ...styles.input, flex: 1 }} value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Value (e.g. Abro)" />
          <button style={styles.btnSmall} onClick={() => {
            if (specKey && specVal) {
              set('specs', { ...form.specs, [specKey]: specVal });
              setSpecKey('');
              setSpecVal('');
            }
          }}>+ Add</button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={styles.btnGold} onClick={() => {
            if (!form.name) return alert('Name is required');
            onSave(catIdx, { ...form, id: form.id || slugify(form.name) });
          }}>Save Product</button>
          <button style={styles.btnGlass} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  };

  // ─── Brand Form ────────────────────────────────────────
  const BrandForm = ({ brand, onSave, onCancel }) => {
    const [form, setForm] = useState(
      brand || { id: '', name: '', tagline: '', description: '', image: '' }
    );
    const set = (key, val) => setForm({ ...form, [key]: val });
    return (
      <div style={styles.formCard} className="admin-form-card">
        <h3 style={styles.formTitle}>{brand ? 'Edit Brand' : 'New Brand'}</h3>
        <label style={styles.label}>Brand Name *</label>
        <input style={styles.input} value={form.name} onChange={(e) => { set('name', e.target.value); if (!brand) set('id', slugify(e.target.value)); }} placeholder="e.g. Surelock" />
        <label style={styles.label}>Slug</label>
        <input style={{ ...styles.input, opacity: 0.6 }} value={form.id} onChange={(e) => set('id', e.target.value)} />
        <label style={styles.label}>Tagline</label>
        <input style={styles.input} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Short tagline" />
        <label style={styles.label}>Description</label>
        <textarea style={{ ...styles.input, minHeight: 80 }} value={form.description} onChange={(e) => set('description', e.target.value)} />
        <label style={styles.label}>Image Path</label>
        <input style={styles.input} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="/images/brands/surelock.webp" />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={styles.btnGold} onClick={() => { if (!form.name) return alert('Name is required'); onSave({ ...form, id: form.id || slugify(form.name) }); }}>Save Brand</button>
          <button style={styles.btnGlass} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner} className="admin-header-inner">
          <div>
            <span style={styles.logo}>YASHADA.</span>
            <span style={styles.adminBadge}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              style={{ ...styles.btnGold, opacity: publishing ? 0.6 : 1, cursor: publishing ? 'wait' : 'pointer' }}
              onClick={publishToSite}
              disabled={publishing}
            >
              {publishing ? '⏳ Publishing...' : '📤 Publish to Website'}
            </button>
            <button style={styles.btnGlass} onClick={() => {
              downloadJSON({ categories }, 'products.json');
              downloadJSON({ brands }, 'brands.json');
            }}>💾 Backup</button>
            <button style={styles.btnGlass} onClick={() => setAuthenticated(false)}>Logout</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={styles.tabs} className="admin-tabs">
        <button
          style={activeTab === 'products' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('products')}
        >
          📦 Products ({categories.reduce((sum, c) => sum + c.products.length, 0)})
        </button>
        <button
          style={activeTab === 'brands' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('brands')}
        >
          🏷️ Brands ({brands.length})
        </button>
        <button
          style={activeTab === 'analytics' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <input
          style={{ ...styles.input, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,83,0.2)' }}
          placeholder={activeTab === 'products' ? '🔍 Search products, categories, brands... (fuzzy)' : '🔍 Search brands... (fuzzy)'}
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <main style={styles.main} className="admin-main">
        {/* ─── Products Tab ─── */}
        {activeTab === 'products' && (() => {
          // Build fuzzy search index
          const allProducts = categories.flatMap((cat, catIdx) =>
            cat.products.map((p) => ({
              ...p,
              categoryName: cat.name,
              categoryId: cat.id,
              catIdx,
              brandName: p.specs?.Brand || '',
            }))
          );

          let displayCategories = categories;
          let autoExpandIds = new Set();

          if (adminSearch.trim()) {
            const fuse = new Fuse(allProducts, {
              keys: [
                { name: 'name', weight: 1.0 },
                { name: 'description', weight: 0.5 },
                { name: 'categoryName', weight: 0.7 },
                { name: 'brandName', weight: 0.8 },
              ],
              threshold: 0.4,
              ignoreLocation: true,
            });
            const results = fuse.search(adminSearch);
            const matchedIds = new Set(results.map((r) => r.item.id));

            displayCategories = categories
              .map((cat, catIdx) => ({
                ...cat,
                catIdx,
                products: cat.products.filter((p) => matchedIds.has(p.id)),
              }))
              .filter((cat) => cat.products.length > 0);

            displayCategories.forEach((cat) => autoExpandIds.add(cat.id));
          }

          return (
            <>
              {editingProduct && (
                <ProductForm
                  product={editingProduct.product}
                  catIdx={editingProduct.catIdx}
                  onSave={saveProduct}
                  onCancel={() => setEditingProduct(null)}
                />
              )}

              {adminSearch.trim() && (
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem' }}>
                  Found {displayCategories.reduce((a, c) => a + c.products.length, 0)} products in {displayCategories.length} categories
                </div>
              )}

              {displayCategories.map((cat) => {
                const catIdx = categories.findIndex((c) => c.id === cat.id);
                const isExpanded = adminSearch.trim() ? autoExpandIds.has(cat.id) : expandedCat === catIdx;
                return (
              <div key={cat.id} style={styles.catCard}>
                <div
                  style={styles.catHeader}
                  className="admin-cat-header"
                  onClick={() => {
                    if (!adminSearch.trim()) setExpandedCat(expandedCat === catIdx ? null : catIdx);
                  }}
                >
                  <div>
                    <h3 style={styles.catName}>{cat.name}</h3>
                    <span style={styles.catCount}>{cat.products.length} products</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      style={styles.btnSmall}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct({ catIdx, product: null });
                        setExpandedCat(catIdx);
                      }}
                    >+ Add Product</button>
                    <span style={styles.chevron}>{isExpanded ? '▼' : '▶'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={styles.productList}>
                    {cat.products.map((product, prodIdx) => (
                      <div key={product.id} style={styles.productRow} className="admin-product-row">
                        <div style={styles.productInfo}>
                          {product.image && (
                            <img src={product.image} alt={product.name} style={styles.productThumb} />
                          )}
                          <div>
                            <div style={styles.productName}>{product.name}</div>
                            <div style={styles.productSlug}>{product.id}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }} className="admin-product-actions">
                          <button
                            style={styles.btnSmall}
                            onClick={() => setEditingProduct({ catIdx, product })}
                          >Edit</button>
                          <button
                            style={styles.btnSmallDanger}
                            onClick={() => deleteProduct(catIdx, prodIdx)}
                          >Delete</button>
                        </div>
                      </div>
                    ))}
                    {cat.products.length === 0 && (
                      <p style={{ color: '#888', padding: '1rem', textAlign: 'center' }}>No products yet</p>
                    )}
                  </div>
                )}
              </div>
                );
              })}
            </>
          );
        })()}

        {/* ─── Brands Tab ─── */}
        {activeTab === 'brands' && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <button style={styles.btnGold} onClick={() => setEditingBrand({})}>+ Add Brand</button>
            </div>

            {editingBrand !== null && (
              <BrandForm
                brand={editingBrand.id ? editingBrand : null}
                onSave={saveBrand}
                onCancel={() => setEditingBrand(null)}
              />
            )}

            {(() => {
              let displayBrands = brands;
              if (adminSearch.trim()) {
                const fuse = new Fuse(brands, {
                  keys: [
                    { name: 'name', weight: 1.0 },
                    { name: 'tagline', weight: 0.7 },
                    { name: 'description', weight: 0.5 },
                  ],
                  threshold: 0.4,
                  ignoreLocation: true,
                });
                displayBrands = fuse.search(adminSearch).map(r => r.item);
              }
              return (
            <div style={styles.brandGrid} className="admin-brand-grid">
              {displayBrands.map((brand) => {
                const idx = brands.findIndex(b => b.id === brand.id);
                return (
                <div key={brand.id} style={styles.brandCard}>
                  {brand.image && <img src={brand.image} alt={brand.name} style={styles.brandImg} />}
                  <h4 style={styles.brandName}>{brand.name}</h4>
                  <p style={styles.brandTagline}>{brand.tagline}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button style={styles.btnSmall} onClick={() => setEditingBrand(brand)}>Edit</button>
                    <button style={styles.btnSmallDanger} onClick={() => deleteBrand(idx)}>Delete</button>
                  </div>
                </div>
                );
              })}
            </div>
              );
            })()}
          </>
        )}

        {/* ─── Analytics Tab ─── */}
        {activeTab === 'analytics' && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Search Telemetry & Analytics</h3>
            <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Advanced Search tracking is strictly enabled via PostHog. The system passively monitors the keywords, filters, and categories users query in real-time.
            </p>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ color: '#d4a853', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Setup Required</div>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Ensure your <code style={{ color: '#e5e5e5' }}>NEXT_PUBLIC_POSTHOG_KEY</code> is placed in your <code style={{ color: '#e5e5e5' }}>.env.local</code> file so production telemetry goes to your cloud account.
              </p>
            </div>
            <a 
              href="https://us.posthog.com/project/home" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ ...styles.btnGold, display: 'inline-block', textDecoration: 'none' }}
            >
              Open PostHog Dashboard
            </a>
          </div>
        )}
      </main>

      {/* Instructions */}
      <footer style={styles.footer}>
        <h4 style={{ color: '#d4a853', marginBottom: '0.5rem' }}>How to publish changes:</h4>
        <ol style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
          <li>Make your edits above (add/edit/delete products or brands)</li>
          <li>Click <strong>"📤 Publish to Website"</strong></li>
          <li>Wait ~60 seconds — your changes will be live!</li>
        </ol>
        <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem' }}>💡 Use "💾 Backup" to download a copy of your data as a safety measure.</p>
      </footer>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: '#e5e5e5', fontFamily: "'Inter', 'Outfit', sans-serif" },
  // Auth
  authWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' },
  authCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '3rem', width: 360, textAlign: 'center' },
  authLogo: { fontSize: '1.5rem', fontWeight: 800, color: '#d4a853', letterSpacing: 2, marginBottom: '1.5rem' },
  authTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' },
  authSub: { fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem' },
  // Header
  header: { borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100, background: '#0a0a0f' },
  headerInner: { maxWidth: 960, margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' },
  logo: { fontSize: '1.25rem', fontWeight: 800, color: '#d4a853', letterSpacing: 2 },
  adminBadge: { marginLeft: 8, fontSize: '0.6rem', fontWeight: 700, color: '#0a0a0f', background: '#d4a853', padding: '2px 8px', borderRadius: 4, letterSpacing: 2, verticalAlign: 'middle' },
  // Tabs
  tabs: { maxWidth: 960, margin: '0 auto', padding: '1rem 1.5rem 0', display: 'flex', gap: '0.5rem' },
  tab: { padding: '0.6rem 1.25rem', borderRadius: '8px 8px 0 0', border: '1px solid rgba(255,255,255,0.06)', borderBottom: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 },
  tabActive: { padding: '0.6rem 1.25rem', borderRadius: '8px 8px 0 0', border: '1px solid rgba(212,168,83,0.3)', borderBottom: '2px solid #d4a853', background: 'rgba(212,168,83,0.05)', color: '#d4a853', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 },
  // Main
  main: { maxWidth: 960, margin: '0 auto', padding: '1.5rem' },
  // Category card
  catCard: { border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: '1rem', overflow: 'hidden' },
  catHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' },
  catName: { fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 },
  catCount: { fontSize: '0.75rem', color: '#888' },
  chevron: { color: '#888', fontSize: '0.85rem' },
  // Product list
  productList: { borderTop: '1px solid rgba(255,255,255,0.04)' },
  productRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', flexWrap: 'wrap', gap: '0.5rem' },
  productInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  productThumb: { width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.06)' },
  productName: { fontWeight: 600, color: '#e5e5e5', fontSize: '0.9rem' },
  productSlug: { fontSize: '0.7rem', color: '#666' },
  // Brand grid
  brandGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  brandCard: { border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1.25rem', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  brandImg: { width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem' },
  brandName: { fontWeight: 700, color: '#fff', margin: 0 },
  brandTagline: { fontSize: '0.8rem', color: '#888', margin: 0 },
  // Form
  formCard: { border: '1px solid rgba(212,168,83,0.2)', borderRadius: 12, padding: '1.5rem', background: 'rgba(212,168,83,0.03)', marginBottom: '1.5rem' },
  formTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#d4a853', margin: '0 0 1rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#aaa', marginBottom: '0.25rem', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  input: { width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#e5e5e5', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  // Specs
  specRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: '0.35rem', fontSize: '0.85rem' },
  specKey: { color: '#d4a853', fontWeight: 600 },
  specVal: { color: '#ccc', flex: 1 },
  // Buttons
  btnGold: { padding: '0.6rem 1.25rem', borderRadius: 8, border: '1px solid #d4a853', background: 'rgba(212,168,83,0.12)', color: '#d4a853', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  btnGlass: { padding: '0.6rem 1.25rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#aaa', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' },
  btnSmall: { padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid rgba(212,168,83,0.3)', background: 'rgba(212,168,83,0.08)', color: '#d4a853', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  btnSmallDanger: { padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid rgba(255,80,80,0.3)', background: 'rgba(255,80,80,0.08)', color: '#ff5050', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  // Toast
  toast: { position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)', color: '#d4a853', padding: '0.85rem 1.5rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, zIndex: 9999, backdropFilter: 'blur(10px)' },
  // Footer
  footer: { maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
};
