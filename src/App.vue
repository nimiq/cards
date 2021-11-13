<template>
    <main id="app">
        <link rel="prefetch" :href="cardUrl">
        <transition name="notification">
            <div v-if="showNotification" class="notification">
                <img src="img/checkmark-small.svg">
                Card created.
            </div>
        </transition>
        <transition name="switch">
            <article v-if="state === constructor.State.INTRO" class="intro" key="intro">
                <section>
                    <h1>{{ pageTitle }}</h1>
                    <p class="intro-text">
                        Treat your friends and family with some wonderful NIM!
                        <template v-if="constructor.THEMES.length > 1">
                            <br>
                            Get started by selecting a theme for your card.
                        </template>
                    </p>
                    <p v-if="constructor.THEMES.length > 1">
                        <Dropdown :entries="dropdownEntries" color="light-blue" :default="theme.id"
                            @change="changeTheme" />
                    </p>
                    <button class="nq-button light-blue" @click="state = constructor.State.MAIN">
                        Create a Card
                    </button>
                    <a href="javascript:void(0)" @click="state = constructor.State.SCANNER" class="redeem-button">
                        <ScanQrCodeIcon /> Redeem a Card
                    </a>
                </section>
            </article>
            <article v-else-if="state === constructor.State.MAIN" class="main" key="main">
                <Dropdown v-if="constructor.THEMES.length > 1 && !funded"
                    :entries="dropdownEntries" :default="theme.id" @change="changeTheme"
                    color="light-blue" class="theme-switcher" />

                <h2 class="title">
                    Create your {{ theme.label }}
                    <Tooltip v-if="getThemeTooltip(theme)" preferredPosition="top left" :container="$parent">
                        <template v-slot:trigger>
                            <InfoCircleIcon />
                        </template>
                        <template v-slot:default>
                            <div v-html="getThemeTooltip(theme)"></div>
                        </template>
                    </Tooltip>
                </h2>

                <section id="card" :class="{'dark-card': theme.darkCard}">
                    <img :src="cardUrl" class="background">

                    <div class="value-container">
                        <AmountInput
                            v-if="!funded"
                            id="value-input"
                            v-model="value"
                            :maxFontSize="5"
                            placeholder="0.00"
                            :class="{ 'has-value': !!value }"/>
                        <Amount v-else id="value-funded" :amount="value" :minDecimals="0"/>
                    </div>

                    <textarea id="text" v-model="message"
                        placeholder="Write your loving message here..."></textarea>

                    <div id="qrcode">
                        <QrCode v-show="funded" fill="#1f2248" :data="cashlink"
                            errorCorrection="L" :radius="0.5" :size="300" ref="qrcode" />
                        <img v-show="funded" :src="qrCodeSource" alt="QR Code" ref="qrcodeimg">
                        <div class="placeholder" v-if="!funded">
                            QR code will be shown here once you funded your gift card.
                        </div>
                    </div>

                </section>
                <transition name="switch">
                    <button v-if="!funded" class="nq-button light-blue cta" key="fund" @click="fund"
                        :disabled="!(value > 0)">
                        Fund card
                    </button>
                    <button v-else class="nq-button gold cta" key="print" @click="print">
                        Print card
                    </button>
                </transition>
            </article>
            <article v-else-if="state === constructor.State.SCANNER" class="scanner" key="scanner">
                <h2>Scan a Nimiq Gift Card</h2>
                <SmallPage>
                    <QrScanner
                        :validate="isCashlink"
                        @cancel="state = constructor.State.INTRO"
                        @result="navigateTo($event)"
                    />
                </SmallPage>
            </article>
        </transition>
    </main>
</template>

<script lang="ts">
import '@nimiq/style/nimiq-style.min.css';
import '@nimiq/vue-components/dist/NimiqVueComponents.css';

import { Component, Vue } from 'vue-property-decorator';
import {
    Amount,
    AmountInput,
    QrCode,
    Tooltip,
    SmallPage,
    QrScanner,
    InfoCircleIcon,
    ScanQrCodeIcon,
} from '@nimiq/vue-components';
import HubApi, { Cashlink, CashlinkTheme } from '@nimiq/hub-api';
import { BrowserDetection } from '@nimiq/utils';
import Dropdown from './Dropdown.vue';

document.body.classList.add(BrowserDetection.detectBrowser());

export interface Theme {
    label: string;
    id: string;
    cashlinkTheme: CashlinkTheme;
    darkBackground: boolean;
    darkCard: boolean;
    designer?: string;
}

// This can be specified in the .env file or via command line
const DEFAULT_THEME_ID = process.env.VUE_APP_DEFAULT_THEME;

@Component({ components: {
    Amount,
    AmountInput,
    QrCode,
    Tooltip,
    Dropdown,
    SmallPage,
    QrScanner,
    InfoCircleIcon,
    ScanQrCodeIcon,
} })
class App extends Vue {
    private static readonly THEMES: Theme[] = [
        {
            label: 'Generic Gift Card',
            id: 'generic',
            cashlinkTheme: HubApi.CashlinkTheme.GENERIC,
            darkBackground: false,
            darkCard: true,
        },
        {
            label: 'Birthday Card',
            id: 'birthday',
            cashlinkTheme: HubApi.CashlinkTheme.BIRTHDAY,
            darkBackground: false,
            darkCard: true,
        },
        {
            label: 'Easter Card (designed by DAD)',
            id: 'easter1',
            cashlinkTheme: HubApi.CashlinkTheme.EASTER,
            darkBackground: false,
            darkCard: false,
            designer: 'DAD',
        },
        {
            label: 'Easter Card (designed by Francis)',
            id: 'easter2',
            cashlinkTheme: HubApi.CashlinkTheme.EASTER,
            darkBackground: false,
            darkCard: false,
            designer: 'Francis',
        },
        {
            label: 'Winter Holiday Card',
            id: 'christmas',
            cashlinkTheme: HubApi.CashlinkTheme.CHRISTMAS,
            darkBackground: false,
            darkCard: true,
        },
        {
            label: 'Lunar New Year Card',
            id: 'lunar-new-year',
            cashlinkTheme: HubApi.CashlinkTheme.LUNAR_NEW_YEAR,
            darkBackground: true,
            darkCard: true,
        },
        // {
        //     label: '春节 Card (Chinese New Year)',
        //     id: 'lunar-new-year-china',
        //     cashlinkTheme: HubApi.CashlinkTheme.LUNAR_NEW_YEAR,
        //     darkBackground: true,
        //     darkCard: true,
        // },
        // {
        //     label: 'Tết Card (Vietnamese New Year)',
        //     id: 'lunar-new-year-vietnam',
        //     cashlinkTheme: HubApi.CashlinkTheme.LUNAR_NEW_YEAR,
        //     darkBackground: true,
        //     darkCard: true,
        // },
        // {
        //     label: '설날 Card (Korean New Year)',
        //     id: 'lunar-new-year-korea',
        //     cashlinkTheme: HubApi.CashlinkTheme.LUNAR_NEW_YEAR,
        //     darkBackground: true,
        //     darkCard: true,
        // },
    ];

    state: App.State = App.State.INTRO;
    funded = false;
    printed = false;
    value = 0;
    message = '';
    cashlink = '';
    qrCodeSource = '';
    showNotification = false;
    theme = App.THEMES.find(theme => theme.id === DEFAULT_THEME_ID)!;

    mounted() {
        this.changeTheme(this.theme.id);
    }

    async fund() {
        const hubOrigin = /(www\.)?nimiq/.test(window.location.origin)
            ? window.location.origin.replace(/(www\.)?nimiq/, 'hub.nimiq')
            : `${window.location.protocol}//${window.location.hostname}:8080`;
        const hubApi = new HubApi(hubOrigin);

        try {
            const cashlink: Cashlink = await hubApi.createCashlink({
                appName: 'Nimiq Gift Card',
                message: this.message,
                value: this.value,
                autoTruncateMessage: true,
                returnLink: true,
                skipSharing: true,
                theme: this.theme.cashlinkTheme,
            });

            this.value = cashlink.value;
            this.cashlink = cashlink.link!;

            if (!this.message && cashlink.message) this.message = cashlink.message as string;

            await this.$nextTick();
            this.qrCodeSource = await (this.$refs.qrcode as QrCode).toDataUrl();

            this.funded = true;

            this.showNotification = true;
            setTimeout(() => { this.showNotification = false; }, 3000);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'CANCELED' && message !== 'Connection was closed') {
                // eslint-disable-next-line
                setTimeout(() => alert(e), 500); // give the hub popup time to close
            }
        }
    }

    changeTheme(themeId: string) {
        this.theme = App.THEMES.find(theme => theme.id === themeId)!;
        document.body.style.backgroundImage = `url(${this.backgroundUrl})`;
        document.body.classList.toggle('dark-background', this.theme.darkBackground);
        App.THEMES.forEach(theme => document.body.classList.toggle(theme.id, theme.id === themeId));
    }

    print() {
        window.print();
        this.printed = true;
    }

    get backgroundUrl() {
        if (this.theme.id.startsWith('lunar-new-year')) return 'themes/lunar-new-year-background.svg';
        if (this.theme.id.startsWith('easter')) return 'themes/easter-background.svg';
        return `themes/${this.theme.id}-background.svg`;
    }

    get cardUrl() {
        return this.getThemeCardUrl(this.theme);
    }

    get pageTitle() {
        if (this.theme.id === 'generic') return 'Nimiq Gift Card';
        if (this.theme.id.startsWith('easter')) return 'Nimiq Easter Card';
        return `Nimiq ${this.theme.label}`;
    }

    get dropdownEntries() { // eslint-disable-line class-methods-use-this
        return App.THEMES.map(theme => ({
            value: theme.id,
            label: theme.label,
            tooltip: this.getThemeTooltip(theme, true),
        }));
    }

    getThemeCardUrl(theme: Theme) { // eslint-disable-line class-methods-use-this
        return `themes/${theme.id}-card.svg`;
    }

    getThemeTooltip(theme: Theme, includePreview = false): string | undefined {
        switch (theme.id) {
            case 'easter1':
            case 'easter2':
                // eslint-disable-next-line prefer-template
                return `This card was designed by community member <em>${theme.designer}</em> and was chosen as`
                    + ' a winner of our Easter Card design competition.'
                    + (includePreview
                        ? `<br><img src="${this.getThemeCardUrl(theme)}" style="min-height: 16rem; margin-top: 2rem">`
                        : '');
            default:
                return undefined;
        }
    }

    isCashlink(link: string): boolean { // eslint-disable-line class-methods-use-this
        return /^(https?:\/\/)?(hub\.nimiq(-testnet)?\.com|localhost(:\d+)?)\/cashlink/.test(link);
    }

    navigateTo(link: string) { // eslint-disable-line class-methods-use-this
        window.location.href = link;
    }
}

namespace App {
    export enum State {
        INTRO = 'intro',
        MAIN = 'main',
        SCANNER = 'scanner',
    }
}

export default App;
</script>

<style lang="scss">
    $dark-font: var(--nimiq-blue);
    $light-font: white;

    html {
        contain: layout; // avoid expensive re-layouting during transition of transform on state switch
    }

    body {
        background-position: center bottom;
        background-size: cover;
        overflow: hidden;
        color: $dark-font;

        &.dark-background {
            &, .logo {
                color: $light-font;
            }
        }

        &.easter1,
        &.easter2 {
            background-position: center;
        }
    }

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        margin-top: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .notification {
        position: fixed;
        left: calc(50% - 13.25rem);
        top: 9rem;
        padding: 3rem;
        border-radius: 2rem;
        box-shadow: 0 1rem 2.5rem rgba(0,0,0,.2);
        background: white;
        color: var(--nimiq-green);
        font-weight: bold;
        transition: transform .7s, opacity .7s;
        transition-delay: 1s; // wait a bit for hub popup to close
        z-index: 1;
    }

    .notification-enter,
    .notification-leave-to {
        opacity: 0;
        transform: translateY(-13rem);
    }

    .notification img {
        margin-right: 1rem;
        width: 2rem;
    }

    .switch-leave-active {
        position: absolute;
        transition: opacity .7s ease-out;
    }
    .switch-enter-active {
        transition: transform 1s ease-out, opacity 1s ease-out;

        .theme-switcher {
            display: none;
        }
    }
    .switch-leave-to {
        opacity: 0;
    }
    .switch-enter {
        transform: perspective(100vw) translate3d(4vw, 80vh, 80vw) rotate3d(.5, .5, 1, 26deg);
        opacity: .5;
    }

    .intro {
        width: 95rem;
        text-align: center;

        h1 { font-size: 5rem; }
        p { font-size: 3.25rem; }
        button { margin-top: 4rem; }

        .intro-text {
            line-height: 1.5;
        }

        .redeem-button {
            color: inherit;
            text-decoration: none;
            opacity: .8;
            transition: opacity var(--attr-duration) var(--nimiq-ease);

            &:focus,
            &:hover {
                opacity: 1;
            }

            .nq-icon {
                margin-bottom: -.5rem;
                margin-right: .25rem;
                font-size: 2.5rem;
            }
        }
    }

    .dropdown {
        min-width: 0;
        transition: min-width .2s .2s;

        &.extended {
            min-width: 35rem; // make dropdown wide enough that all entries fit without line breaks
            transition: min-width 0s 0s;
        }
    }

    .dropdown.theme-switcher {
        position: fixed;
        top: 3rem;
        right: 3rem;
    }

    .title {
        margin-bottom: 4rem;
        font-size: 3rem;
        text-align: center;

        .tooltip {
            margin-left: 1rem;
            margin-bottom: -.75rem;

            .trigger {
                color: inherit;
            }

            .tooltip-box {
                min-width: 30rem;
            }
        }
    }

    #card {
        width: 86rem;
        height: 43.375rem;
        background-size: cover;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.11);
        position: relative;

        .background {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }

        .value-container {
            position: absolute;
            top: 5.5rem;
            left: 4.75rem;
            width: 44.875rem;
            height: 8.5rem;
            // border-bottom: 1.5px solid rgba(255,255,255,.5);

            #value-input {
                font-size: 5rem;
                color: var(--nimiq-blue);
                justify-content: flex-start;

                &:not(.has-value) {
                    // not using ::placeholder to also color the currency ticker
                    color: rgba(31, 35, 72, 0.6); // based on nimiq-blue
                    caret-color: var(--nimiq-blue);
                }

                input {
                    color: inherit !important;
                    text-align: left;
                    transition: unset;
                    &:focus,
                    &:hover {
                        box-shadow: none;
                        outline: none;
                    }
                }

                input::placeholder {
                    color: inherit;
                    opacity: 1; // for Firefox
                }

                input,
                .width-finder {
                    padding: 0;
                }

                .nim {
                    margin-left: 1.75rem;
                    font-weight: 600;
                    font-size: 0.5em;
                    color: inherit;
                }
            }

            #value-funded {
                font-size: 5rem;
                width: 100%;
                background: none;
                border: none;
                color: $dark-font;

                .currency {
                    margin-left: .375rem;
                    font-weight: 600;
                    font-size: 0.5em;
                }
            }
        }

        #text {
            position: absolute;
            width: 43rem;
            height: 19rem;
            top: 16.5rem;
            bottom: 7rem;
            left: 2rem;
            padding-left: 3rem;
            background: none;
            border: none;
            font-size: 2.25rem;
            color: $dark-font;
            font-family: Muli,system-ui,sans-serif;
            &::placeholder {
                color: rgba(31, 35, 72, 0.6); // based on nimiq-blue
                opacity: 1; // for Firefox
            }
            &:focus {
                outline: none;
            }
        }

        &.dark-card {
            .value-container {
                #value-input {
                    color: var(--nimiq-white);

                    &:not(.has-value) {
                        color: rgba(255, 255, 255, 0.54);
                        caret-color: var(--nimiq-white);
                    }
                }

                #value-funded {
                    color: var(--nimiq-gold);
                }
            }

            #text {
                color: $light-font;
                &::placeholder {
                    color:rgba(255, 255, 255, 0.54);
                }
            }
        }

        #qrcode {
            position: absolute;
            top: 6.75rem;
            right: 5.75rem;
            width: 19rem;
            height: 19rem;
            padding: 1rem;

            .placeholder {
                font-size: 1.25rem;
                text-align: center;
                color: $dark-font;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                padding: 0 2rem;
            }

            canvas, img {
                width: 100%;
                height: 100%;
            }

            canvas { display: none; }
        }
    }

    .cta {
        margin-top: 5rem;

        &.switch-leave-active {
            left: 50%;
            transform: translateX(-50%);
        }
    }

    @media print {
        footer, header.logo, .dropdown, .title, .notification, #text:placeholder-shown, .cta {
            display: none !important;
        }

        body {
            background: none !important;

            #card {
                // making sure Chrome is not messing with the colors
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                box-shadow: none;

                #text {
                    resize: none;
                }
            }

            &.firefox {
                #card {
                    // avoid that Firefox cuts the card off
                    max-width: calc(100vw - 18rem);

                    #qrcode {
                        top: 7rem;
                        right: 5.5rem;
                        width: 18.75rem;
                        height: 18.75rem;
                    }

                    &.dark-card #text {
                        // fix Firefox color printing on dark background (see https://stackoverflow.com/a/34379688)
                        color: transparent !important;
                        text-shadow: 0 0 $light-font;
                    }
                }
            }
        }
    }

    .scanner {
        margin-top: -7rem;

        &.switch-leave-active {
            margin-top: -3.5rem;
        }

        h2 {
            margin-top: 0;
            text-align: center;
        }

        .small-page {
            margin: 0;
            max-width: unset;
            width: calc(100vmin - 2rem);
            height: 70vh;
            max-height: calc(100vh - 28rem);

            .qr-scanner {
                height: 100%;
                margin: 1rem;
                border-radius: 1rem;

                .cancel-button {
                    background: rgba(255,255,255,.2);
                }
            }
        }
    }

    @media only screen and (max-width: 1023px), only screen and (max-height: 599px) {
        html {
            font-size: 7px;
        }

        #card #qrcode .placeholder {
            font-size: 1.4rem;
        }
    }

    @media only screen and (max-width: 749px), only screen and (max-height: 499px) {
        html {
            font-size: 6px;
        }

        #card #qrcode .placeholder {
            font-size: 1.5rem;
        }
    }

    @media only screen and (max-width: 599px), only screen and (max-height: 419px) {
        html {
            font-size: 7px;
        }

        header.logo {
            padding-top: 5rem;
        }

        #app {
            display: flex;
            margin-top: 0;

            .main *,
            .intro > section > :not(.redeem-button) {
                display: none;
            }

            .intro::after,
            .main::after {
                display: block;
                width: calc(100vw - 6rem);
                margin: auto;
                text-align: center;
                line-height: 1.5;
            }

            .intro::after {
                content: "If you want to create a Nimiq Gift Card instead, please use your desktop computer or laptop.";
                margin-top: 4rem;
            }

            .main::after {
                content: "Hey there! With this app, you can create and print Nimiq Cards. "
                    + "But it's designed for desktop computers and laptops. "
                    + "So fetch your laptop, go to nimiq.com/cards and create a card for your friends and family.";
            }

            .scanner {
                margin-top: 0;

                h2 {
                    margin-left: 2rem;
                    text-align: left;
                }
            }
        }
    }
</style>
