<template>
    <main id="app">
        <link rel="prefetch" href="img/christmas-card.svg"><!-- this is the path in the deployment -->
        <transition name="switch">
            <article v-if="intro" class="intro" key="intro">
                <section class="content">
                    <h1>Nimiq Holiday Gift Cards</h1>
                    <p>
                        Treat your friends and family to the wonderful gift of NIM this holiday.
                    </p>
                    <button class="nq-button light-blue" v-on:click="create">Create a gift card</button>
                </section>
            </article>
            <article v-else class="main" key="main">
                <h2 class="title">Create your Holiday Gift Card</h2>
                <section id="card" class="content">
                    <img src="../assets/christmas-card.svg" class="background">

                    <div class="value-container">
                        <Amount ref="amount" id="value" :amount="value" :decimals="2" v-bind:class="{ funded }"/>
                    </div>

                    <textarea id="text" ref="text"
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

@Component({ components: { Amount, QrCode } })
export default class App extends Vue {
    intro = true;
    funded = false;
    printed = false;
    value = 0;
    cashlink = '';
    qrCodeSource = '';

    create() {
        this.intro = false;
    }

    async fund() {
        const hubOrigin = window.location.origin.includes('www')
            ? window.location.origin.replace('www', 'hub')
            : `${window.location.protocol}//${window.location.hostname}:8080`;
        const hubApi = new HubApi(hubOrigin);

        try {
            const cashlink: Cashlink = await hubApi.createCashlink({
                appName: 'Holiday Gift Card',
                message: (this.$refs.text as HTMLTextAreaElement).value,
                autoTruncateMessage: true,
                returnCashlink: true,
                skipSharing: true,
                theme: HubApi.CashlinkTheme.CHRISTMAS,
            });

            this.value = cashlink.value;
            this.cashlink = cashlink.cashlink!;

            await this.$nextTick();
            this.qrCodeSource = await (this.$refs.qrcode as QrCode).toDataUrl();

            this.funded = true;
        } catch (e) {
            const message = e.message || e;
            if (message !== 'CANCELED' && message !== 'Connection was closed') {
                await new Promise(resolve => setTimeout(resolve, 500)); // give the hub popup time to close
                // eslint-disable-next-line
                alert(e);
            }
        }
    }

    print() {
        window.print();
        this.printed = true;
    }
}
</script>

<style lang="scss">

    $contentWidth: 86rem;
    $contentHeight: 43.375rem;

    body {
        background: var(--nimiq-gray) url("../assets/christmas-background.svg");
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
    }

    article {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .switch-enter-active {
        transition: all .5s cubic-bezier(.31,.64,.84,1.3);
    }
    .switch-leave-active {
        transition: all .3s ease-out;
    }
    .intro.switch-leave {
        opacity: 1;
    }
    .intro.switch-leave-to {
        opacity: 0;
    }
    .main.switch-enter {
        transform: translate3d(0, 80vh, 0);
        opacity: .5;
    }
    .main.switch-enter-to {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }

    .title {
        font-size: 3rem;
        text-align: center;
        width: $contentWidth;
        position: absolute;
        top: calc(50% - #{$contentHeight} / 2 - 10.25rem);
        left: calc(50% - #{$contentWidth} / 2);
    }

    .content {
        width: $contentWidth;
        height: $contentHeight;
        position: absolute;

        @media screen {
            top: calc(50% - #{$contentHeight} / 2);
            left: calc(50% - #{$contentWidth} / 2);
        }
    }

    .cta {
        position: absolute;
        top: calc(50% + 24.65rem);
        left: calc(50% - 15.5rem);
    }

    #card {
        background-size: cover;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.11);

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

    @media print {
        footer, header.logo, .cta {
            display: none;
        }
        body {
            background: none;
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

    .intro {
        text-align: center;

        h1 { font-size: 5rem; }
        p { font-size: 3.25rem; }
        button { margin-top: 4rem; }
    }
</style>
