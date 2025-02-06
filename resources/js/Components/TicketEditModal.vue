<template>
    <VueFinalModal
        content-class="absolute bottom-0 w-full p-4 dark:bg-black bg-white shadow-[0_-5px_35px_rgba(0,0,0,0.25)] dark:shadow-[0_-5px_35px_rgba(255,255,255,0.25)] dark:text-white text-black space-y-2"
        content-transition="vfm-slide-down"
        swipe-to-close="down"
        overlay-transition="vfm-fade"
    >
        <h1 class="text-4xl">
            Edit Ticket
        </h1>
        <div class="px-12">
            <Vueform :endpoint="false" @submit="handleSubmit" v-bind="vueform"/>
        </div>
        <Button class="absolute top-4 right-4 px-2 border rounded-lg cursor-pointer" @click="emit('close')" outline theme="black">
            Cancel
        </Button>
    </VueFinalModal>
</template>

<script setup lang="ts">
import {VueFinalModal} from 'vue-final-modal'
import Button from "@/Components/Button.vue";
import {ref} from "vue";
import {useStore} from 'vuex';

const store = useStore();
const errors = ref({});

const emit = defineEmits(['close', 'save']);

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

const handleSubmit = async (form$) => {
    const requestData = form$.requestData
    form$.submitting = true
    form$.cancelToken = form$.$vueform.services.axios.CancelToken.source()
    form$.messageBag.clear()

    let response;

    try {
        // Sending the request
        response = await form$.$vueform.services.axios.put(
            '/tickets/' + id,
            requestData,
            {
                cancelToken: form$.cancelToken.token,
            }
        )
    } catch (error) {
        const errorsObject = error.response.data;
        for (let errorsObjectKey in errorsObject) {
            errors.value[errorsObjectKey] = errorsObject[errorsObjectKey]?.join('</br>') ?? '';
        }
        for (let valueKey in errors.value) {
            if (errors.value[valueKey]) {
                form$.el$(valueKey).messageBag.clear()
                form$.el$(valueKey).messageBag.append(errors.value[valueKey])
            }
        }
        return
    } finally {
        form$.submitting = false
    }

    form$.messageBag.clear()
    form$.messageBag.append('Ticket Create Successfully', 'message')
    await store.dispatch('loadTickets')

    emit('close')
}

const vueform = ref({
    size: 'md',
    displayErrors: false,
    schema: {
        divider: {
            type: 'static',
            tag: 'hr',
        },
        title: {
            type: 'text',
            inputType: 'text',
            rules: [
                'required',
                'max:255',
            ],
            default: title ?? '',
            placeholder: 'Title',
            fieldName: 'Title'
        },
        description: {
            type: 'textarea',
            inputType: 'textarea',
            rules: [
                'required',
            ],
            default: description ?? '',
            placeholder: 'Description',
            fieldName: 'Description'
        },
        status: {
            type: 'select',
            inputType: 'select',
            rules: [
                'required',
            ],
            placeholder: 'Status',
            fieldName: 'Status',
            default: status ?? 'open',
            items: {
                open: 'Open',
                closed: 'Closed',
                in_progress: 'In Progress',
            }
        },
        divider_1: {
            type: 'static',
            tag: 'hr',
        },
        save: {
            type: 'button',
            submits: true,
            buttonLabel: 'Save changes',
            full: false,
            size: 'lg',
        },
    },
})
</script>
