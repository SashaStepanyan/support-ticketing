<template>
    <label class="flex items-center w-full">
        <input
            type="checkbox"
            class="hidden"
            :checked="isChecked"
            @change="toggleCheck"
        />
        <div
            class="w-5 cursor-pointer h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200"
            :class="[checkboxClasses, { 'bg-transparent': !isChecked }]"
        >
            <svg v-if="isChecked" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
            </svg>
        </div>
        <span class="ml-2 text-sm">
            <slot></slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
    modelValue: boolean;
    color?: 'black' | 'white' | 'green';
    label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const isChecked = ref(props.modelValue);

const toggleCheck = () => {
    isChecked.value = !isChecked.value;
    emit("update:modelValue", isChecked.value);
};

const checkboxClasses = computed(() => {
    const colors = {
        black: 'bg-black border-black dark:bg-gray-800 dark:border-gray-700',
        white: 'bg-white border-white dark:bg-gray-300 dark:border-gray-400',
        green: 'bg-transparent border-green-600 dark:bg-transparent dark:border-green-400',
    };
    return colors[props.color || 'green'];
});
</script>

<style scoped>
input:focus + div {
    outline: 2px solid rgba(0, 0, 0, 0.2);
}
</style>
