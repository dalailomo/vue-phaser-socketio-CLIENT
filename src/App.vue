<template>
    <NamePrompt v-if="showNamePrompt" />
    <template v-else>
        <OnlineUsers />
    </template>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import { connect } from "../modules/socket";
import OnlineUsers from "./components/OnlineUsers.vue";
import NamePrompt from "./components/NamePrompt.vue";
import { HANDLE_USER_CONNECTIONS_EVENT } from '../../vue-phaser-socketio-SERVER/modules/socket-handlers/handle-user-connections'

export default defineComponent({
    name: "App",

    components: {
        OnlineUsers,
        NamePrompt
    },

    setup() {
        // Check for user name introduced
        const showNamePrompt = ref(false);

        if (!localStorage.getItem('name')) {
            showNamePrompt.value = true;
        }

        // Provide the socket
        const socket = connect(
            "http://localhost:3000",
            localStorage.getItem("name") || "Unnamed"
        );
        provide("socket", socket);

        // Emits the request for connected users
        socket.emit(HANDLE_USER_CONNECTIONS_EVENT.clientRequestConnectedUsers);

        return { showNamePrompt }
    },
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
// .game-view {
//     position: absolute;
//     z-index: -1;
//     left: 0;
//     top: 0;
// }
</style>
