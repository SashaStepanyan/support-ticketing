<template>
    <div class="flex flex-col gap-5 w-full">
        <div class="flex justify-end">
            <Button @click="() => openCreate()">Create new Ticket</Button>
        </div>
        <TicketFilters v-model="filterOptions" />
        <hr>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4" v-if="tickets.length > 0">
            <TicketItem v-for="ticket of tickets" :key="ticket.id" :id="ticket.id" :title="ticket.title" :description="ticket.description" :status="ticket.status" />
        </div>
        <div class="text-3xl text-center font-extrabold uppercase pt-18" v-else>
            There are no any tickets yet!
        </div>
        <hr>
        <TicketPagination />
    </div>
</template>

<script setup lang="ts">
import TicketItem from "@/Components/TicketItem.vue";
import TicketFilters from "@/Components/TicketFilters.vue";
import Button from "@/Components/Button.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {useModal} from "vue-final-modal";
import TicketCreateModal from "@/Components/TicketCreateModal.vue";
import TicketPagination from "@/Components/TicketPagination.vue";

const store = useStore();
const tickets = computed(() => store.getters.tickets)

const filterOptions = ref({
    search: '',
    status: '',
    created_by_me: false
})

onMounted(async () => {
    await store.dispatch('loadTickets')
})

const filtersTimeout = ref();

watch(filterOptions, (newFilterOptions) => {
    // Debounce
    clearTimeout(filtersTimeout.value);
    filtersTimeout.value = setTimeout(async () => {
        await store.dispatch("setFilters", newFilterOptions)
        await store.dispatch("loadTickets")
    }, 300);
}, { deep: true })

const {open: openCreate, close: closeCreate} = useModal({
    component: TicketCreateModal,
    attrs: {
        onClose() {
            closeCreate()
        },
    }
})

</script>
