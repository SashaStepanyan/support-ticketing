<template>
    <label class="flex flex-col items-start gap-2 w-full">
        <span class="text-lg font-bold" v-if="label">{{label}}</span>
        <input
            class="w-full px-5 py-3 border-2 border-gray-500 rounded-lg outline-none focus-within:border-b-white focus-within:border-b-2 box-border"
            @input="handleInput"
            :type="type"
            :placeholder="placeholder"
            :id="id ?? null"
        >
    </label>
</template>

<script setup lang="ts">
interface Props {
    type?: 'text' | 'number' | 'email' | 'password',
    value?: string,
    placeholder?: string,
    label?: string,
    id?: string,
}

const emit = defineEmits(['input'])
const {
    label = '',
    placeholder = '',
    type = 'text',
    value = '',
} = defineProps<Props>()

const handleInput = (event) => {
    emit('input', event.target.value)
}

</script>
