<template>
    <input type="text" @input="onInput" v-model="introducedName" />
    <button @click="onClick">Submit</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const introducedName = ref('');

        const onInput = () => {
            localStorage.setItem('name', introducedName.value);
        }

        const onClick = () => {
            window.location.href = '/';
        }

        return { introducedName, onClick, onInput };
    },
})
</script>

