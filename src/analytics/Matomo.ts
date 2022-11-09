declare global {
    interface Window {
        _paq: any[];
        _mtm: any[];
    }
}

export default function initMatomo() {
    // Abort if we already added script to head
    const matomoScript = document.getElementById('matomo');
    if (matomoScript) {
        return;
    }

    // Abort if in Dev mode
    if (process.env.NODE_ENV !== 'production') {
        console.log('Matomo not initialized in dev mode'); // eslint-disable-line no-console
        return;
    }

    // initialize matomo
    window._paq = window._paq || [];

    // Get referrer from localstorage
    const referrer = localStorage.getItem('referrer');
    localStorage.removeItem('referrer');
    if (referrer) {
        window._paq.push(['setReferrerUrl', decodeURIComponent(referrer)]);
    }

    // track downloads from the download page
    window._paq.push(['addDownloadExtensions', 'deb|rpm|msi|sha256|asc|pub']);

    const tagManagerScript = window.location.origin.endsWith('nimiq.com')
        ? 'https://stats.nimiq-network.com/js/container_3VTb93Xw.js' // TODO replace by locally built script
        : 'https://stats.nimiq-network.com/js/container_3VTb93Xw_testnet_fbf7a074829d193a6e96d815.js';

    window._mtm = window._mtm || [];
    window._mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

    const script = document.createElement('script');
    script.async = true;
    script.id = 'matomo';
    script.src = tagManagerScript;

    document.head.appendChild(script);
}
