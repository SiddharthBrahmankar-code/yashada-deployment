'use client';

import { useState, useCallback } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Name is required';
    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!data.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[\d\s+\-()]{7,15}$/.test(data.phone)) {
      errs.phone = 'Enter a valid phone number';
    }
    if (!data.message.trim()) errs.message = 'Message is required';
    return errs;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'inquiry',
          ...formData,
        }).toString(),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const subject = `Inquiry from ${formData.name} - ${formData.company}`;
        const body = `Name: ${formData.name}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nProduct Interest: ${formData.product}\n\n${formData.message}`;
        window.open(
          `mailto:yashadaenterprises@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        );
        setSubmitted(true);
      }
    } catch {
      const subject = `Inquiry from ${formData.name} - ${formData.company}`;
      const body = `Name: ${formData.name}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nProduct Interest: ${formData.product}\n\n${formData.message}`;
      window.open(
        `mailto:yashadaenterprises@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      );
      setSubmitted(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    // Clear error on change if touched
    if (touched[name]) {
      const newErrors = validate(newData);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const getInputClass = (name) =>
    touched[name] && errors[name] ? 'form-input--error' : '';

  return (
    <>
      {/* Hero */}
      <section className={`section--dark ${styles.hero}`}>
        <div className="container">
          <div className="label" style={{ marginBottom: '1rem' }}>Get in Touch</div>
          <h1 className="ourstory__heading" style={{ marginBottom: '1rem' }}>
            LET&apos;S TALK<br />
            <span className="accent">BUSINESS</span>
          </h1>
          <p
            style={{ maxWidth: 500, margin: '0 auto', fontSize: '1.125rem', color: 'var(--clr-text-muted)' }}
          >
            Whether you need a quote, product information, or just want to say
            hello — we&apos;re here.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section--dark" style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div className={styles.grid}>
            {/* Form */}
            <div>
              <h2
                className="ourstory__heading"
                style={{ fontSize: 'var(--fs-h3)', marginBottom: '2rem' }}
              >
                SEND US AN <span className="accent">INQUIRY</span>
              </h2>

              {submitted ? (
                <div className={styles.success}>
                  <div style={{ marginBottom: '1rem' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--clr-text-light)', marginBottom: '0.5rem' }}>
                    Thank You!
                  </h3>
                  <p style={{ color: 'var(--clr-text-muted)' }}>
                    Your inquiry has been sent. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  name="inquiry"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  noValidate
                >
                  <input type="hidden" name="form-name" value="inquiry" />
                  <p style={{ display: 'none' }}>
                    <label>Don&apos;t fill this out: <input name="bot-field" /></label>
                  </p>
                  {[
                    { name: 'name', label: 'Your Name *', type: 'text', required: true },
                    { name: 'company', label: 'Company Name', type: 'text', required: false },
                    { name: 'email', label: 'Email Address *', type: 'email', required: true },
                    { name: 'phone', label: 'Phone Number *', type: 'tel', required: true },
                    { name: 'product', label: 'Product Interest', type: 'text', required: false },
                  ].map((field) => (
                    <div key={field.name} style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-input ${getInputClass(field.name)}`}
                      />
                      {touched[field.name] && errors[field.name] && (
                        <div className="form-error">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          {errors[field.name]}
                        </div>
                      )}
                    </div>
                  ))}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${getInputClass('message')}`}
                    />
                    {touched.message && errors.message && (
                      <div className="form-error">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {errors.message}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn--gold" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2
                className="ourstory__heading"
                style={{ fontSize: 'var(--fs-h3)', marginBottom: '2rem' }}
              >
                CONTACT <span className="accent">INFO</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[
                  {
                    label: 'Address',
                    value: 'Shop No 11 and 12, Sai Industrial Estate, Behind Ambad Substation, Near Patil Transport, Ambad Gaon, Nashik - 422010',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    ),
                  },
                  {
                    label: 'Phone',
                    value: '0253-6602234 · +91 82089 97234',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    ),
                  },
                  {
                    label: 'Email',
                    value: 'yashadaenterprises@gmail.com',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    ),
                  },
                  {
                    label: 'Hours',
                    value: 'Mon - Sat: 10:00 AM - 7:00 PM',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className={styles.infoCard}>
                    <div style={{ color: 'var(--clr-accent)', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          color: 'var(--clr-text-light)',
                          marginBottom: '0.25rem',
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/918208997234?text=Hello%20Yashada%20Enterprises"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--gold"
                  style={{ flex: 1, justifyContent: 'center', minWidth: 150 }}
                >
                  WhatsApp Us
                </a>
                <a
                  href="tel:8208997234"
                  className="btn btn--glass"
                  style={{ flex: 1, justifyContent: 'center', minWidth: 150 }}
                >
                  Call Now
                </a>
              </div>

              {/* Map */}
              <div style={{ marginTop: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <iframe
                  src="https://maps.google.com/maps?q=Shop%20No%2011%20and%2012,%20Sai%20Industrial%20Estate,%20Ambad%20Gaon,%20Nashik&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="250"
                  style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Yashada Enterprises Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
