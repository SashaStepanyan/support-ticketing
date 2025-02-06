<template>
    <div class="container mx-auto min-h-screen flex flex-col items-center gap-5 py-5 relative">
        <h1 class="text-3xl font-bold uppercase">Support Ticketing System</h1>
        <TicketList />
        <Button class="absolute top-4 right-4 px-2 border rounded-lg cursor-pointer" @click="() => handleLogout()" outline theme="danger">
            Logout
        </Button>
    </div>
</template>

<script setup>
import TicketList from "@/Components/TicketList.vue";
import Button from "@/Components/Button.vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

const handleLogout = async () => {
    await store.dispatch("logout");
    await router.push({
        name: 'login'
    })
}
</script>
