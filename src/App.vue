<template>
    <h1>Hello there</h1>
    <p>Here will be thingies</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "App",

    setup() {},
});
</script>

<style lang="scss">
body {
    background: black;
    color: white;
    font-family: "Courier New", Courier, monospace;
    margin: 0;
    padding: 0;
}
</style>

<style lang="scss" scoped>
.game-view {
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
}
</style>
