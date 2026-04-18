'use client';
import { useInquiry } from '@/providers/InquiryProvider';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './InquirySidebar.module.css';

export default function InquirySidebar() {
  const pathname = usePathname();
  const { items, removeItem, isSidebarOpen, setIsSidebarOpen, mounted, clearItems } = useInquiry();
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', message: '' });

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  if (pathname && pathname.startsWith('/admin')) return null;

  // Early return if not mounted
  if (!mounted) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const text = `🚀 *New Quote Request from Website*

👤 *Customer Details:*
▪️ *Name:* ${formData.name}
▪️ *Phone:* ${formData.phone}
${formData.email ? `▪️ *Email:* ${formData.email}` : ''}
${formData.company ? `▪️ *Company:* ${formData.company}` : ''}

📦 *Products Requested:*
${items.map((i) => `➡️ ${i.name}`).join('\n')}

${formData.message ? `💬 *Additional Note:* \n"${formData.message}"` : ''}

_Sent via Yashada Enterprises Inquiry Cart_`;

    const whatsappUrl = `https://wa.me/918208997234?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Optional: Clear list on success
    clearItems();
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {items.length > 0 && !isSidebarOpen && (
        <button className={styles.fab} onClick={() => setIsSidebarOpen(true)} aria-label="View Inquiry List">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <div className={styles.fabBadge}>{items.length}</div>
        </button>
      )}

      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
        data-lenis-prevent="true"
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`} data-lenis-prevent="true">
        <div className={styles.header}>
          <div className={styles.title}>
            Inquiry List {items.length > 0 && <span className={styles.badge}>{items.length}</span>}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.5}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              <p>Your inquiry list is empty. Browse products and add them here to request a bulk quote.</p>
            </div>
          ) : (
            <>
              <div className={styles.productList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.productItem}>
                    <span className={styles.productName}>{item.name}</span>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)} aria-label="Remove item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>

              <form id="inquiryForm" onSubmit={handleSubmit} className={styles.form}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--clr-text-light)', borderBottom: '1px solid var(--clr-border-dark)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Your Details</div>
                <input required type="text" name="name" placeholder="Your Name *" value={formData.name} onChange={handleChange} className="form-input" style={{padding: '0.6rem 1rem'}} />
                <input required type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} className="form-input" style={{padding: '0.6rem 1rem'}} />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="form-input" style={{padding: '0.6rem 1rem'}} />
                <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} className="form-input" style={{padding: '0.6rem 1rem'}} />
                <textarea name="message" placeholder="Additional details..." rows="3" value={formData.message} onChange={handleChange} className="form-input" style={{padding: '0.6rem 1rem'}} />
              </form>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <button type="submit" form="inquiryForm" className="btn btn--gold" style={{width: '100%', justifyContent: 'center'}}>
              Send via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
