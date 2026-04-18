'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const InquiryContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearItems: () => {},
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  mounted: false,
});

export const useInquiry = () => useContext(InquiryContext);

export default function InquiryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('yashada_inquiry_list');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('yashada_inquiry_list', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, { id: product.id, name: product.name }];
    });
    setIsSidebarOpen(true);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearItems = () => setItems([]);

  return (
    <InquiryContext.Provider value={{
      items: mounted ? items : [],
      addItem, removeItem, clearItems,
      isSidebarOpen, setIsSidebarOpen,
      mounted
    }}>
      {children}
    </InquiryContext.Provider>
  );
}
