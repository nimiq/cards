<template>
    <main id="app">
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
                <section id="card" class="content">
                    <img src="../assets/christmas-card.svg" class="background">

                    <div class="value-container">
                        <Amount ref="amount" id="value" :amount="value" :decimals="2" v-bind:class="{ funded }"/>
                    </div>

                    <textarea name="text" ref="text" cols="30" rows="10"
                        placeholder="Write your loving Christmas message here..."></textarea>

                    <div id="qrcode">
                        <QrCode v-show="funded" fill="#ffffff" :data="cashlink"
                        errorCorrection="L" :radius="0.5" :size="300" ref="qrcode" />
                        <img v-show="funded" src="qrCodeSource" alt="QR Code" ref="qrcodeimg">
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

import { Component, Vue, Prop } from 'vue-property-decorator';
import { Amount, QrCode } from '@nimiq/vue-components';
import { HubApi, Cashlink } from '@nimiq/hub-api';

@Component({ components: { Amount, QrCode } })
export default class App extends Vue {
    intro = true;
    funded = false;
    printed = false;
    value = 0;
    @Prop({
        type: String,
        default: '',
    })
    cashlink = '';

    cashlinkDummy = 'https://hub.nimiq-testnet.com/cashlink/'
        + '#HflvsbZvE_rmZS2Vhop5rJugkj6w8WYLvfS7uty4RkwAAAAABfXhAEAxMjM0NTY3ODkwOT'
        + 'g3NjU0MzQ1Njc4OTg3NjU0MzI0NTY3ODk4NzY1NDM0NTY3ODk4NzY1NDMyMzQ1Njc4OTg3';

    create() {
        this.intro = false;
    }

    async fund() {
        // const live = false;
        // const hubApi = new HubApi(`https://hub.nimiq${live ? '' : '-testnet'}.com`);
        // FIXME
        const hubApi = new HubApi('https://localhost:8080');
        console.log(hubApi);

        this.cashlink = await hubApi.createCashlink({
            label: (this.$refs.text as HTMLTextAreaElement).value,
            shorten: true,
        });

        // this.cashlink = this.cashlinkDummy;

        const cashlink = await Cashlink.parse(this.cashlink);
        this.value = cashlink.value;
        this.$nextTick(async () => {
            (this.$refs.qrcodeimg as HTMLImageElement).src = await (this.$refs.qrcode as QrCode).toDataUrl();
        });

        this.funded = true;
    }

    print() {
        window.print();
        this.printed = true;
    }
}
</script>

<style lang="scss">
    body {
        background: var(--nimiq-gray) url("../assets/christmas-background.svg");
        background-position: center bottom;
        background-size: cover;
        overflow: hidden;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
        transition: all .8s cubic-bezier(.31,.64,.84,1.3);
    }
    .switch-leave-active {
        transition: all .6s ease-out;
    }
    .intro.switch-leave {
        opacity: 1;
    }
    .intro.switch-leave-to {
        opacity: 0;
    }
    .main.switch-enter {
        transform: translateY(80vh);
        opacity: .5;
    }
    .main.switch-enter-to {
        transform: translateY(0);
        opacity: 1;
    }

    .content {
        width: 86rem;
        height: 43.375rem;
        position: absolute;

        @media screen {
            top: calc(50% - 21.65rem);
            left: calc(50% - 43rem);
        }
    }

    .cta {
        position: absolute;
        top: calc(50% + 24.65rem);
        left: calc(50% - 15.5rem);
    }

    #card {
        background: url("../assets/christmas-card_dummy.svg");
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
            width: 45.875rem;
            height: 8.5rem;
            padding: 1rem 0 0 3rem;
            border-bottom: 1px solid rgba(255,255,255,.5);

            #value {
                font-size: 5rem;
                width: 100%;
                background: none;
                border: none;
                margin-top: 1rem;
                padding: 1rem;
                color: white;

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
            width: 45.875rem;
            top: 16.5rem;
            bottom: 5rem;
            left: 2rem;
            padding-left: 3rem;
            background: none;
            border: none;
            font-size: 2.25rem;
            color: white;
        }

        #qrcode {
            position: absolute;
            top: 7.25rem;
            right: 6.25rem;
            width: 18rem;
            height: 18rem;

            .placeholder {
                color: white;
                font-size: 1.25rem;
                text-align: center;
                position: relative;
                top: calc(50% - 1.5 * 1.25rem);
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

    .intro {
        text-align: center;

        h1 { font-size: 5rem; }
        p { font-size: 3.25rem; }
        button { margin-top: 4rem; }
    }
</style>
