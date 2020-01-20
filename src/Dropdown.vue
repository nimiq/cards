<template>
    <div class="dropdown" :class="{extended}">
        <button class="nq-button-pill nq-label" :class="color" @click="extended = !extended">
            {{ selectedLabel }}
            <svg width="7" height="6" viewBox="0 0 7 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 .7c.3-.3.7-.3 1 0l2.6 4.5c.2.4 0 .8-.5.8H1a.5.5 0 01-.5-.8L3.1.7z"/>
            </svg>
        </button>
        <transition name="dropdown-fade">
            <div class="background" v-if="extended">
                <span
                    v-for="other in others"
                    :key="other.value"
                    class="nq-label other"
                    @click="select(other.value); extended = false">
                    {{ other.label }}
                </span>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

type Entry = {
    value: string,
    label: string,
}

@Component({ components: {} })
export default class Dropdown extends Vue {
    @Prop({ type: Object, required: true }) values!: { [value: string]: string };
    @Prop(String) default?: string;
    @Prop({ type: String, default: 'green' }) color?: string;

    private selected?: string = '';
    private extended: boolean = false;

    created() {
        this.selected = this.default || this.entries[0].value;
    }

    select(id: string) {
        this.selected = id;
        this.$emit('change', this.selected);
    }

    get others() {
        return this.entries.filter(pair => pair.value !== this.selected);
    }

    get selectedLabel() {
        return (this.entries.find(pair => pair.value === this.selected) || { label: 'empty' }).label;
    }

    get entries(): Entry[] {
        if (Array.isArray(this.values)) {
            return this.values.map(value => ({ value: value.replace(/\W/, ''), label: value }));
        }
        return Object.keys(this.values).map(value => ({ value, label: this.values![value] }));
    }
}
</script>

<style scoped lang="scss">

    .dropdown {
        --movement-duration: .4s;
        position: relative;
        display: inline-block;

        &.extended {
            z-index: 1;
        }
    }

    .nq-button-pill {
        display: block;
        height: unset;
        margin: 0;
        z-index: 1;
        transition: border-radius var(--movement-duration) var(--nimiq-ease);
    }

    .nq-button-pill::after {
        display: none;
    }

    .extended .nq-button-pill {
        border-radius: 0.75rem;
    }

    button svg {
        display: inline-block;
        margin-left: 1rem;
        margin-right: -0.25rem;
        margin-bottom: 0.375rem;
        opacity: .7;
        transform: rotate(-60deg);
        transform-origin: 40% 60%;
        transition: transform var(--movement-duration) var(--nimiq-ease);
    }

    .extended .triangle {
        transform: rotate(0deg);
    }

    .background {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        left: -0.5rem;
        background: white;
        border-radius: 1rem;
        padding: 0.5rem;
        padding-top: 4.5rem;
        opacity: 1;
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
        transition: opacity var(--movement-duration) var(--nimiq-ease);
    }

    .dropdown-fade-enter,
    .dropdown-fade-leave-to {
        opacity: 0;
    }

    .dropdown-fade-enter .other,
    .dropdown-fade-leave-to .other {
        transform: translateY(-0.5rem);
    }

    .other {
        font-size: 2rem;
        display: block;
        line-height: 1.5;
        margin: 0;
        margin-top: 0.5rem;
        transition:
            transform var(--movement-duration) var(--nimiq-ease),
            opacity var(--movement-duration) var(--nimiq-ease);

        opacity: 0.6;
        padding: 0.75rem 2rem;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }

</style>
