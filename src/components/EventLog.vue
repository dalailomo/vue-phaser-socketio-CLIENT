<template>
    <pre>
        <li v-for="(message, i) in messages" :key="i">{{ message }}</li>
    </pre>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent, inject, Ref, ref } from 'vue'
import { HANDLE_IO_EMIT_LOG_EVENT } from '../../vue-phaser-socketio-SERVER/modules/socket-handlers/handle-io-emit-log'

export default defineComponent({
    setup() {
        const socket = inject("socket") as Socket;
        const messages: Ref<string[]> = ref([]);

        socket.on(HANDLE_IO_EMIT_LOG_EVENT.SE_LogMessage, (payload) => {
            messages.value.push(`${payload} at ${new Date()}`)
        });

        return { messages }
    },
})
</script>

<style lang="scss" scoped>
pre {
    position: absolute;
    bottom: 0;
    overflow-y: auto;
    left: 0;
    width: 100%;
    height: 80px;
    color: white;
    background: rgba(0,0,0,.3);

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
</style>
