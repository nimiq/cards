import initGTM from './GTM';
import initMatomo from './Matomo';

declare global {
    interface Window {
        _iub: any[] & { csConfiguration: any };
    }
}

export default function loadIubenda() {
    // Abort if we already added script to head
    const iubendaScript = document.getElementById('iubenda');
    if (iubendaScript) {
        return;
    }

    // Abort if in Dev mode
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    // Declare configuration
    window._iub = window._iub || [];
    window._iub.csConfiguration = {
        ccpaAcknowledgeOnDisplay: true,
        consentOnContinuedBrowsing: false,
        cookiePolicyInOtherWindow: true,
        countryDetection: true,
        enableCcpa: true,
        floatingPreferencesButtonColor: '#FFFFFF00',
        floatingPreferencesButtonDisplay: 'bottom-right',
        invalidateConsentWithoutLog: true,
        lang: 'en',
        perPurposeConsent: true,
        siteId: 2726169,
        cookiePolicyId: 78537710,
        banner: {
            acceptButtonCaptionColor: '#FFFFFF',
            acceptButtonColor: '#0582CA',
            acceptButtonDisplay: true,
            backgroundColor: '#FFFFFF',
            brandBackgroundColor: '#FFFFFF',
            brandTextColor: '#1F2348',
            closeButtonDisplay: false,
            customizeButtonCaptionColor: '#1F2348',
            customizeButtonColor: '#DADADA',
            customizeButtonDisplay: true,
            explicitWithdrawal: true,
            fontSize: '14px',
            listPurposes: true,
            logo: null,
            position: 'float-bottom-center',
            rejectButtonCaptionColor: '#1F2348',
            rejectButtonColor: '#DADADA',
            rejectButtonDisplay: true,
            textColor: '#1F2348',
        },
        callback: {
            onConsentGiven() {
                initMatomo();
                initGTM();
            },
        },
    };

    // Add scripts tag to head
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.iubenda.com/cs/ccpa/stub.js';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.async = true;
    script2.id = 'iubenda';
    script2.src = 'https://cdn.iubenda.com/cs/iubenda_cs.js';
    document.head.appendChild(script2);
}
