<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import Button from "@/Components/Button.vue";
import {useStore} from "vuex";
import {ref} from "vue";

const {
    id
} = defineProps<{
    id: string
}>()

const isLoading = ref(false);

const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: boolean): void
    (e: 'confirm'): void
    (e: 'close'): void
}>()

const store = useStore();

const handleDeletion = async (): Promise<void> => {
    isLoading.value = true;
    await store.dispatch('deleteTicket', id);
    emit('close');
    isLoading.value = false;
}

</script>

<template>
    <VueFinalModal
        class="flex justify-center items-center"
        content-class="flex flex-col max-w-xl mx-4 py-6 px-4 dark:text-white bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-5"
        @update:model-value="val => emit('update:modelValue', val)"
    >
        <h1 class="text-3xl font-bold">
            Delete Ticket
        </h1>
        <article class="text-md">
            This action can't be undone. The ticket will be deleted permanently after this action. Are you sure you want to delete this ticket?
        </article>
        <div class="flex items-center justify-end gap-2 w-full mt-4">
            <Button @click="emit('close')" theme="secondary" outline>
                Cancel
            </Button>
            <Button @click="handleDeletion" theme="danger" :loading="isLoading">
                Confirm
            </Button>
        </div>
    </VueFinalModal>
</template>
