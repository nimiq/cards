<template>
    <main id="app">
        <!-- TODO remove? update to themes/ folder? -->
        <link rel="prefetch" href="img/christmas-card.svg"><!-- this is the path in the deployment -->
        <transition name="notification">
            <div v-if="showNotification" class="notification">
                <img src="../assets/checkmark-small.svg">
                Gift Card created.
            </div>
        </transition>
        <transition name="switch">
            <article v-if="intro" class="intro" key="intro">
                <section>
                    <h1>Nimiq Holiday Gift Cards</h1>
                    <p>
                        Treat your friends and family to the wonderful gift of NIM this holiday.
                    </p>
                    <p>
                        <ThemeSelector @theme-selected="changeTheme" />
                    </p>
                    <button class="nq-button light-blue" v-on:click="create">Create a gift card</button>
                </section>
            </article>
            <article v-else class="main" key="main">
                <ThemeSelector class="theme-selector" @theme-selected="changeTheme" />

                <h2 class="title">Create your Holiday Gift Card</h2>

                <section id="card">
                    <img :src="themeImageUrl('card')" class="background">

                    <div class="value-container">
                        <Amount ref="amount" id="value" :amount="value" :decimals="2" v-bind:class="{ funded }"/>
                    </div>

                    <textarea id="text" v-model="message"
                        placeholder="Write your loving Holiday message here..."></textarea>

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
                    <button v-if="!funded" class="nq-button light-blue cta" key="fund" @click="fund">
                        Fund gift card
                    </button>
                    <button v-else class="nq-button gold cta" key="print" @click="print">
                        Print gift card
                    </button>
                </transition>
            </article>
        </transition>
    </main>
</template>

<script lang="ts">
import '@nimiq/style/nimiq-style.min.css';
import '@nimiq/vue-components/dist/NimiqVueComponents.css';

import { Component, Vue } from 'vue-property-decorator';
import { Amount, QrCode } from '@nimiq/vue-components';
import HubApi, { Cashlink } from '@nimiq/hub-api';
import ThemeSelector, { Theme } from './ThemeSelector.vue';

@Component({ components: { Amount, QrCode, ThemeSelector } })
export default class App extends Vue {
    intro = true;
    funded = false;
    printed = false;
    value = 0;
    message = '';
    cashlink = '';
    qrCodeSource = '';
    showNotification = false;
    // not optimal: currently defining "default" here and in ThemeSelector, should be one place only
    theme: Theme = {
        label: 'Gift Card',
        id: 'neutral',
        cashlinkTheme: HubApi.CashlinkTheme.STANDARD,
    };

    create() {
        this.intro = false;
    }

    async fund() {
        const hubOrigin = /(www\.)?nimiq/.test(window.location.origin)
            ? window.location.origin.replace(/(www\.)?nimiq/, 'hub.nimiq')
            : `${window.location.protocol}//${window.location.hostname}:8080`;
        const hubApi = new HubApi(hubOrigin);

        try {
            const cashlink: Cashlink = await hubApi.createCashlink({
                appName: 'Holiday Gift Card',
                message: this.message,
                autoTruncateMessage: true,
                returnCashlink: true,
                skipSharing: true,
                theme: HubApi.CashlinkTheme.CHRISTMAS,
            });

            this.value = cashlink.value;
            this.cashlink = cashlink.cashlink!;

            if (!this.message && cashlink.message) this.message = cashlink.message as string;

            await this.$nextTick();
            this.qrCodeSource = await (this.$refs.qrcode as QrCode).toDataUrl();

            this.funded = true;

            this.showNotification = true;
            setTimeout(() => {
                this.showNotification = false;
            }, 3000);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'CANCELED' && message !== 'Connection was closed') {
                await new Promise(resolve => setTimeout(resolve, 500)); // give the hub popup time to close
                // eslint-disable-next-line
                alert(e);
            }
        }
    }

    changeTheme(theme: Theme) {
        this.theme = theme;
        document.body.style.backgroundImage = `url(${this.themeImageUrl('background')})`;
    }

    themeImageUrl(asset: String){
        return `themes/${this.theme.id}-${asset}.svg`;
    }

    print() {
        window.print();
        this.printed = true;
    }
}
</script>

<style lang="scss">
    html {
        contain: layout; // avoid expensive re-layouting during transition of transform on state switch
    }

    body {
        background-position: center bottom;
        background-size: cover;
        overflow: hidden;
    }

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
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
        transition: transform .7s ease-out, opacity .7s ease-out;
    }
    .switch-enter-active {
        transition: transform 1s ease-out, opacity 1s ease-out;
    }
    .switch-leave-to {
        opacity: 0;
    }
    .switch-enter {
        transform: perspective(100vw) translate3d(4vw, 80vh, 80vw) rotate3d(.5, .5, 1, 26deg);
        opacity: .5;
    }

    .intro {
        width: 90rem;
        text-align: center;

        h1 { font-size: 5rem; }
        p { font-size: 3.25rem; }
        button { margin-top: 4rem; }
    }

    .title {
        margin-bottom: 4rem;
        font-size: 3rem;
        text-align: center;
    }

    .theme-selector {
        position: fixed;
        top: 3rem;
        right: 3rem;
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
            top: 5rem;
            left: 2rem;
            width: 44.875rem;
            height: 8.5rem;
            padding: 1rem 0 0 2rem;
            // border-bottom: 1.5px solid rgba(255,255,255,.5);

            #value {
                font-size: 5rem;
                width: 100%;
                background: none;
                border: none;
                margin-top: 1rem;
                padding: 1rem;
                color: rgba(255, 255, 255, 0.54);

                &.funded {
                    color: var(--nimiq-gold);
                }

                .currency {
                    font-size: 52%;
                }
            }
        }

        #text {
            position: absolute;
            width: 43rem;
            top: 16.5rem;
            bottom: 7rem;
            left: 2rem;
            padding-left: 3rem;
            background: none;
            border: none;
            font-size: 2.25rem;
            color: white;
            font-family: Muli,system-ui,sans-serif;
            &::placeholder {
                color:rgba(255, 255, 255, 0.54);
                // color: red;
            }
            &:focus {
                outline: none;
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
    }

    @media print {
        footer, header.logo, .title, .notification, #text:placeholder-shown, .cta {
            display: none;
        }

        body {
            background: none;
        }

        #text {
            resize: none;
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
        }

        #app > * {
            display: none;
        }

        #app::before {
            content: "Hey there! With this app, you can create and print holiday gift cards. "
            + "But it's designed for desktop computers and laptops. "
            + "So fetch your laptop, go to nimiq.com/holidays and create a gift for your friends and family.";
            padding: 0 3rem;
            margin: auto;
            text-align: center;
            line-height: 1.5;
        }
    }
</style>
