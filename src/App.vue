<template>
    <div id="app">
        <h1>Hi!</h1>

        <p>Congratulations, you just set up a fully functional, Nimiq powered app.</p>
        <p>This app template already contains everything you need to build an awesome app.</p>

        <h1>About the Project Setup</h1>
        <p>
            This project setup provides support for writing your UI components with
            <a href="https://vuejs.org/" rel="noopener">Vue</a>
            and comes with
            <a href="https://www.typescriptlang.org/" rel="noopener">Typescript</a>,
            <a href="https://babeljs.io/" rel="noopener">Babel</a>,
            <a href="https://sass-lang.com/" rel="noopener">SCSS/Sass</a>,
            <a href="https://eslint.org/" rel="noopener">ESLint</a>
            and
            <a href="https://jestjs.io/" rel="noopener">Jest</a>
            preinstalled.
        </p>
        <p>
            To learn how to configure the setup, check out the
            <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli</a>,
            <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
               target="_blank"
               rel="noopener"
            >
                @vue/cli-plugin-typescript
            </a>,
            <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
               target="_blank"
               rel="noopener"
            >
                @vue/cli-plugin-babel
            </a>,
            <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
               target="_blank"
               rel="noopener"
            >
                @vue/cli-plugin-eslint
            </a>
            <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest"
               target="_blank"
               rel="noopener"
            >
                @vue/cli-plugin-unit-jest
            </a>
        </p>
        <p>
            To checkout more interesting vue related stuff, see:
            <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a>
            <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
            <a href="https://github.com/vuejs/vue-devtools#vue-devtools"
               target="_blank"
               rel="noopener"
            >
                vue-devtools
            </a>
            <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a>
            <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a>
        </p>

        <h2>What's next?</h2>
        <p>
            Need ideas for what project to realize next?
            Check out our
            <a href="https://www.nimiq.com/use-cases/" rel="noopener">collection of use cases</a>
            for inspiration.
        </p>
        <p>
            Do you have questions or just want to have a chat and nerd out on all things Nimiq?
            Join our
            <a href="https://www.nimiq.com/community/" rel="noopener">very friendly community</a>.
        </p>
        <p>
            You built something awesome?
            Let us now, such that we can add your app to
            <a href="https://www.nimiq.com/apps/" rel="noopener">our website</a>.
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
