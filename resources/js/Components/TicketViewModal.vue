<template>
    <VueFinalModal
        content-class="absolute bottom-0 w-full p-4 dark:bg-black bg-white shadow-[0_-5px_35px_rgba(0,0,0,0.25)] dark:shadow-[0_-5px_35px_rgba(255,255,255,0.25)] dark:text-white text-black space-y-2"
        content-transition="vfm-slide-down"
        swipe-to-close="down"
        overlay-transition="vfm-fade"
    >
        <h1 class="text-4xl">
            {{ title }}
        </h1>
        <div class="text-3xl">
            {{ description }}
        </div>
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
        <slot/>
        <Button class="absolute top-4 right-4 px-2 border rounded-lg cursor-pointer" @click="emit('close')" outline>
            Close
        </Button>
    </VueFinalModal>
</template>

<script setup lang="ts">
import {VueFinalModal} from 'vue-final-modal'
import Button from "@/Components/Button.vue";
import {computed} from "vue";

const {
    title = '',
    description = '',
    status = 'open',
} = defineProps<{
    title?: string,
    description?: string,
    status?: 'open' | 'closed' | 'in_progress'
}>()

const statusBadgeClasses = computed(() => {
    const baseClass = "ml-2 before:inline-block before:w-3 before:h-3 before:mr-1 before:rounded-full";

    const statusColor = {
        in_progress: 'dark:before:bg-yellow-300 before:bg-yellow-600',
        closed: 'dark:before:bg-red-300 before:bg-red-600',
        open: 'dark:before:bg-green-300 before:bg-green-600',
    };
    return statusColor[status] + ' ' + baseClass;
});

const emit = defineEmits(['close']);
</script>
