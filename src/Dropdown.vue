<template>
    <div class="dropdown" :class="{extended}">
        <button class="nq-button-pill" :class="color" @click="extended = !extended">
            <span class="nq-label">{{ selectedEntry ? selectedEntry.label : 'empty' }}</span>
            <Tooltip v-if="selectedEntry.tooltip" preferredPosition="top right" :container="tooltipContainer">
                <template v-slot:trigger>
                    <InfoCircleSmallIcon />
                </template>
                <template v-slot:default>
                    <div v-html="selectedEntry.tooltip"></div>
                </template>
            </Tooltip>
            <svg width="7" height="6" viewBox="0 0 7 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 .7c.3-.3.7-.3 1 0l2.6 4.5c.2.4 0 .8-.5.8H1a.5.5 0 01-.5-.8L3.1.7z"/>
            </svg>
        </button>
        <transition name="dropdown-fade">
            <div class="background" v-if="extended">
                <span
                    v-for="other in others"
                    :key="other.value"
                    class="other"
                    @click="select(other.value); extended = false">
                    <span class="nq-label">{{ other.label }}</span>
                    <Tooltip v-if="other.tooltip" preferredPosition="bottom right" :container="tooltipContainer">
                        <template v-slot:trigger>
                            <InfoCircleSmallIcon />
                        </template>
                        <template v-slot:default>
                            <div v-html="other.tooltip"></div>
                        </template>
                    </Tooltip>
                </span>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Tooltip, InfoCircleSmallIcon } from '@nimiq/vue-components';

type Entry = {
    value: string,
    label: string,
    tooltip?: string, // Warning: this gets displayed via v-html. Do not pass untrusted content.
}

@Component({ components: { Tooltip, InfoCircleSmallIcon } })
export default class Dropdown extends Vue {
    @Prop({ type: Array, required: true }) entries!: Entry[];
    @Prop(String) default?: string;
    @Prop({ type: String, default: 'green' }) color!: string;
    @Prop({
        type: Object,
        default: () => ({ $el: document.body }),
    }) tooltipContainer!: Vue | { $el: HTMLElement };

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

    get selectedEntry() {
        return this.entries.find(pair => pair.value === this.selected);
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
        width: 100%;
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

    button > svg {
        display: inline-block;
        margin-left: 1rem;
        margin-right: -0.25rem;
        margin-bottom: 0.375rem;
        opacity: .7;
        transform: rotate(-60deg);
        transform-origin: 40% 60%;
        transition: transform var(--movement-duration) var(--nimiq-ease);
    }

    .extended button > svg {
        transform: rotate(0deg);
    }

    .nq-label {
        color: inherit;
        text-transform: unset;
    }

    .tooltip {
        margin: 0 .75rem -.25rem;
    }

    ::v-deep {
        .tooltip .trigger {
            color: inherit;
        }

        .tooltip .tooltip-box {
            pointer-events: none;
            width: 35rem;
        }
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
            color var(--movement-duration) var(--nimiq-ease);

        padding: 0.75rem 2rem;
        cursor: pointer;
        color: rgba(31, 35, 72, .4); // based on nimiq-blue

        &:hover {
            color: rgba(31, 35, 72, .6); // based on nimiq-blue
        }

        .tooltip {
            margin-right: 0;
        }
    }
</style>
