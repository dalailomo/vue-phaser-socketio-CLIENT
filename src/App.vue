<template>
    <NamePrompt v-if="showNamePrompt" />
    <template v-else-if="ready">
        <OnlineUsers />
        <EventLog />
        <div class="game-view" :id="containerId" />
    </template>
    <div v-else>Loading...</div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import { Game } from "phaser";
import { connect } from "../modules/socket";
import OnlineUsers from "./components/OnlineUsers.vue";
import EventLog from "./components/EventLog.vue";
import NamePrompt from "./components/NamePrompt.vue";
import { HANDLE_USER_CONNECTIONS_EVENT } from '../vue-phaser-socketio-SERVER/modules/socket-handlers/handle-user-connections';
import { HANDLE_IO_EMIT_LOG_EVENT } from '../vue-phaser-socketio-SERVER/modules/socket-handlers/handle-io-emit-log'
import { launch } from '../vue-phaser-socketio-GAME/index';
import { PLAY_SCENE_EVENT } from '../vue-phaser-socketio-GAME/scenes/play-scene';

export default defineComponent({
    name: "App",

    components: {
        OnlineUsers,
        EventLog,
        NamePrompt
    },

    setup() {
        // Check for user name introduced
        const showNamePrompt = ref(false);

        if (!localStorage.getItem('name')) {
            showNamePrompt.value = true;
        }

        // Provide the socket
        const socket = connect("http://localhost:3000", localStorage.getItem("name") || `Unnamed.${Math.random() * 10}`);
        provide("socket", socket);

        // Provide phaser game instance once is ready
        const containerId = "game-container";
        const gameInstance: Game = launch(containerId);
        provide("gameInstance", gameInstance);

        // Let template know when game instance is ready
        const ready = ref(false);
        gameInstance.events.on('ready', () => {
            ready.value = true;
        });

        // Emits the request for connected users
        socket.emit(HANDLE_USER_CONNECTIONS_EVENT.CE_ConnectedUsers);

        // Emits an event to the server to notify all users that a game object has been clicked
        gameInstance.events.on(
            PLAY_SCENE_EVENT.gameEmitsClickedBomb,
            (payload: string) => {
                socket.emit(HANDLE_IO_EMIT_LOG_EVENT.CE_LogMessage, payload);
            }
        );

        return { containerId, ready, showNamePrompt }
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
