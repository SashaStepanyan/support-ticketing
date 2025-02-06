<template>
    <div>
        <p class="text-xl mb-5">Pagination</p>
        <div class="flex">
            <Button v-for="page in totalPages" :outline="activePage !== page" :disabled="activePage === page" @click="() => handlePaginationChange(page)">
                {{page}}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {computed} from "vue";
import Button from "@/Components/Button.vue";

const store = useStore();

const totalPages = computed(() => store.getters.totalPages)
const activePage = computed(() => store.getters.activePage)
const filters = computed(() => store.getters.filters)

const handlePaginationChange = (page) => {
    store.dispatch("setFilters", {
        ...filters.value,
        page: page,
    });
    store.dispatch("loadTickets");
}

</script>
