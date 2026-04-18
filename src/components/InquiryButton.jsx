'use client';
import { useInquiry } from '@/providers/InquiryProvider';

export default function InquiryButton({ product, className, transparent }) {
  const { addItem, items, setIsSidebarOpen } = useInquiry();
  const isAdded = items.some((i) => i.id === product.id);

  return (
    <button
      className={className || "btn btn--gold"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAdded) {
          setIsSidebarOpen(true);
        } else {
          addItem(product);
        }
      }}
      aria-label={`Add ${product.name} to Inquiry`}
      style={transparent ? { background: 'var(--clr-dark-surface)', color: 'var(--clr-text-light)', border: '1px solid var(--clr-border-light)' } : {}}
    >
      {isAdded ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Added to Inquiry
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><line x1="12" y1="11" x2="16" y2="11"/><line x1="14" y1="9" x2="14" y2="13"/></svg>
          Add to Inquiry List
        </>
      )}
    </button>
  );
}
