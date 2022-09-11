<template>
    <NamePrompt v-if="showNamePrompt" />
    <template v-else>
        <OnlineUsers />
        <EventLog />
        <div class="game-view" :id="containerId" />
    </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref } from "vue";
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

        // Emits the request for connected users from the client socket
        socket.emit(HANDLE_USER_CONNECTIONS_EVENT.CE_ConnectedUsers);

        // Initialize the game instance once component is mounted to have the DOM present for phaser to mount it on a div
        const containerId = "game-container";
        onMounted(() => {
            const gameInstance: Game = launch(containerId);

            // Emits an event to the server to notify all users that a game object has been clicked
            // TODO this should be done somewhere else but for the purpose of this demo its ok to leave it here for now
            gameInstance.events.on(PLAY_SCENE_EVENT.gameEmitsClickedBomb, (id: string) => {
                socket.emit(HANDLE_IO_EMIT_LOG_EVENT.CE_LogMessage, `${localStorage.getItem('name')} clicked gameobject id: ${id}`);
            });
        });

        return { containerId, showNamePrompt }
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
.game-view {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100vw;
    height: 100vh;
}
</style>
