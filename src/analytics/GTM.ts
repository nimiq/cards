declare global {
    interface Window {
        dataLayer: any[];
    }
}

export default function initGTM() {
    // Abort if we already added script to head
    const gtagScript = document.getElementById('gtag');
    if (gtagScript) {
        return;
    }

    // Abort if in Dev mode
    if (process.env.NODE_ENV !== 'production') {
        console.log('GTM not initialized in dev mode'); // eslint-disable-line no-console
        return;
    }

    // Add script tag to head
    const script = document.createElement('script');
    script.async = true;
    script.id = 'gtag';
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-NQ9RN8W';

    // Include Google gtag code
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    document.head.appendChild(script);
}
