<template>
    <main class="text-black dark:text-white bg-white dark:bg-zinc-950">
        <RouterView></RouterView>
    </main>
    <ModalsContainer />
    test
</template>

<script>
import {ModalsContainer} from "vue-final-modal";

export default {
    components: {ModalsContainer},
    data() {
        return {
            title: "Ticketing App",
        }
    }
}
</script>
