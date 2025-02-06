<template>
    <button
        :class="[baseClasses, themeClasses, { 'opacity-50 cursor-not-allowed': props.disabled }]"
        :type="props.type || 'button'"
        :disabled="props.disabled || props.loading"
        @click="emit('click')"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    theme?: 'primary' | 'secondary' | 'black' | 'white' | 'warning' | 'danger';
    outline?: boolean;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    fluid?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['click']);

const baseClasses = "px-4 py-2 rounded-lg cursor-pointer outline-none font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 enabled:hover:translate-y-[-1px] enabled:active:translate-y-[1px]" + (props.fluid ? ' w-full' : '');

const themeClasses = computed(() => {
    const themes = {
        primary: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-black dark:hover:bg-green-600',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:text-black dark:hover:bg-gray-600',
        black: 'bg-black text-white hover:bg-gray-900 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
        white: 'bg-white text-black hover:bg-gray-200 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400',
        danger: 'bg-white text-black hover:bg-red-200 dark:bg-red-300 dark:text-black dark:hover:bg-red-400',
        warning: 'bg-white text-black hover:bg-orange-200 dark:bg-orange-300 dark:text-black dark:hover:bg-orange-400',
    };

    const outlineThemes = {
        primary: 'border border-green-600 text-green-600 hover:bg-green-100 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-black',
        secondary: 'border border-gray-600 text-gray-600 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-500 dark:hover:bg-gray-600',
        black: 'border border-black text-black hover:bg-gray-100 dark:border-gray-300 dark:text-white dark:hover:bg-gray-700',
        white: 'border border-white text-white hover:bg-gray-700 dark:border-gray-300 dark:text-white dark:hover:bg-gray-700',
        danger: 'border border-white text-red-700 hover:bg-red-700 hover:text-white dark:border-red-300 dark:text-red-300 dark:hover:bg-red-700 dark:hover:border-red-700 dark:hover:text-black',
        warning: 'border border-white text-orange-700 hover:bg-orange-700 hover:text-white dark:border-orange-300 dark:text-orange-300 dark:hover:bg-orange-700 dark:hover:border-orange-700 dark:hover:text-black',
    };

    return props.outline ? outlineThemes[props.theme || 'primary'] : themes[props.theme || 'primary'];
});
</script>
