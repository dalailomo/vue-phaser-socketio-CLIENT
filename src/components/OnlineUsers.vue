<template>
    <div class="connected-users-view">
        <strong>Online users</strong>
        <hr />
        <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </div>
</template>

<script lang="ts">
import { Socket } from "socket.io-client";
import { defineComponent, onUnmounted, inject, ref,Ref } from "vue";
import { User } from "../../vue-phaser-socketio-SERVER/modules/socket-handlers/handle-user-connections/types";
import { HANDLE_USER_CONNECTIONS_EVENT } from '../../vue-phaser-socketio-SERVER/modules/socket-handlers/handle-user-connections'

export default defineComponent({
    setup() {
        const socket = inject("socket") as Socket;
        const users: Ref<{ [key: string]: User }> = ref({});

        socket.on(HANDLE_USER_CONNECTIONS_EVENT.SB_ConnectedUsers, (userList: { [key: string]: User }) => {
            users.value = userList;
        });

        onUnmounted(() => {
            socket.off(HANDLE_USER_CONNECTIONS_EVENT.SB_ConnectedUsers);
        });

        return { users };
    },
});
</script>

<style lang="scss" scoped>
.connected-users-view {
    position: absolute;
    right: 0;
    top: 0;
    padding: 16px 32px;
    background: rgba(0, 0, 0, 0.2);
}
</style>
