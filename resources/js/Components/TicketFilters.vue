<template>
    <div class="flex justify-between items-center">
        <div>
            <Input label="Search" @input="(data) => model.search = data" :value="model.search"/>
        </div>
        <div class="flex items-end gap-3">
            <div class="flex flex-col items-start gap-2 w-full min-w-[300px]">
                <span class="text-lg font-bold">Status</span>
                <VueSelect
                    v-model="model.status"
                    :options="[
                        { label: 'Open', value: 'open' },
                        { label: 'Closed', value: 'closed' },
                        { label: 'In Progress', value: 'in_progress' },
                    ]"
                />
            </div>
            <Checkbox :modelValue="model.created_by_me" @update:modelValue="(val) => model.created_by_me = val">
                Created by Me
            </Checkbox>
        </div>
    </div>
</template>

<script setup lang="ts">
import VueSelect from "vue3-select-component";
import Checkbox from "@/Components/Checkbox.vue";
import Input from "@/Components/Input.vue";
import {watch} from "vue";

const model = defineModel({
    default: {
        search: '',
        status: '',
        created_by_me: false
    }
})

watch(model, (newModel) => {
    console.log("newModel:", newModel)
})

</script>
