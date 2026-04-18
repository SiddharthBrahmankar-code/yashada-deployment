export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      // All standard crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      // AI crawlers — explicitly allowed for AI search & citations
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'ChatGPT-User',   allow: '/' },
      { userAgent: 'Claude-Web',     allow: '/' },
      { userAgent: 'ClaudeBot',      allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Amazonbot',      allow: '/' },
      { userAgent: 'Bytespider',     allow: '/' },
      { userAgent: 'CCBot',          allow: '/' },
      { userAgent: 'omgili',         allow: '/' },
      { userAgent: 'FacebookBot',    allow: '/' },
      { userAgent: 'anthropic-ai',   allow: '/' },
    ],
    sitemap: 'https://yashada.netlify.app/sitemap.xml',
    host:    'https://yashada.netlify.app',
  };
}
