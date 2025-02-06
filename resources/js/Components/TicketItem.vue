<template>
    <div class="flex flex-col items-start gap-2 border-2 border-gray-300 rounded-xl py-4 px-5">
        <h3 class="text-2xl font-bold">
            {{ title }}
        </h3>
        <article class="text-sm">
            {{ description.length > 200 ? description.substring(0, 200) + '...' : description }}
        </article>
        <span class="text-sm">
                Status:
                <span :class="statusBadgeClasses">
                    <template v-if="status === 'closed'">
                        Closed
                    </template>
                    <template v-else-if="status === 'open'">
                        Open
                    </template>
                    <template v-else>
                        In Progress
                    </template>
                </span>
        </span>
        <div class="flex items-center flex-wrap gap-3">
            <Button theme="primary" @click="() => openView()">
                View
            </Button>
            <Button theme="warning" size="sm" @click="() => openEdit()" outline>
                Edit
            </Button>
            <Button theme="danger" size="sm" @click="() => openDelete()" outline>
                Delete
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useModal} from 'vue-final-modal'
import TicketViewModal from './TicketViewModal.vue'
import Button from "@/Components/Button.vue";
import {computed} from "vue";
import TicketDeleteModal from "@/Components/TicketDeleteModal.vue";
import TicketEditModal from "@/Components/TicketEditModal.vue";

const {
    id,
    title = '',
    description = '',
    status = 'open',
} = defineProps<{
    id: string,
    title?: string,
    description?: string,
    status?: 'open' | 'closed' | 'in_progress'
}>()

const {open: openView, close: closeView} = useModal({
    component: TicketViewModal,
    attrs: {
        title,
        description,
        status,
        onClose() {
            closeView()
        },
    }
})

const {open: openDelete, close: closeDelete} = useModal({
    component: TicketDeleteModal,
    attrs: {
        id,
        onClose() {
            closeDelete()
        },
    }
})

const {open: openEdit, close: closeEdit} = useModal({
    component: TicketEditModal,
    attrs: {
        id,
        title,
        description,
        status,
        onClose() {
            closeEdit()
        },
    }
})

const statusBadgeClasses = computed(() => {
    const baseClass = "ml-2 before:inline-block before:w-3 before:h-3 before:mr-1 before:rounded-full";

    const statusColor = {
        in_progress: 'dark:before:bg-yellow-300 before:bg-yellow-600',
        closed: 'dark:before:bg-red-300 before:bg-red-600',
        open: 'dark:before:bg-green-300 before:bg-green-600',
    };
    return statusColor[status] + ' ' + baseClass;
});
</script>
