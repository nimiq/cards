<template>
    <div>
        <select ref="select" @change="$emit('theme-selected', currentTheme())">
            <option
                v-for="theme in themes"
                :key="theme.id"
                :selected="theme.id == selected"
                :value="theme.id"
                >
                {{ theme.label }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import HubApi from '@nimiq/hub-api';

export interface Theme {
    label: string;
    id: string;
    cashlinkTheme: number;
}

@Component({ components: { } })
export default class ThemeSelector extends Vue {
    private themes: Theme[] = [
        {
            label: 'Chinese New Year Gift Card',
            id: 'cny',
            cashlinkTheme: HubApi.CashlinkTheme.STANDARD,
        },
        {
            label: 'Holiday Gift Card',
            id: 'christmas',
            cashlinkTheme: HubApi.CashlinkTheme.CHRISTMAS,
        },
        {
            label: 'Neutral Gift Card',
            id: 'neutral',
            cashlinkTheme: HubApi.CashlinkTheme.STANDARD,
        },
    ];

    @Prop(String) selected?: string;
    private default: string = 'cny';

    created() {
        this.default = this.selected || this.default;
    }

    mounted() {
        this.$emit('theme-selected', this.currentTheme());
    }

    currentTheme() {
        const index = this.$refs.select
            ? (this.$refs.select as HTMLSelectElement).selectedIndex
            : this.themes.findIndex(theme => theme.id === this.selected);
        return this.themes[index];
    }
}
</script>

<style>

</style>
