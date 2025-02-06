<template>
    <div class="max-w-[800px] w-full mx-auto min-h-screen flex items-center justify-center py-5">
        <Vueform :endpoint="false" @submit="handleSubmit"
                 class="py-5 px-10 rounded-xl bg-zinc-200 dark:bg-black border-[#06ac8b] border-2" v-bind="vueform"/>
    </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {useStore} from 'vuex';
import {useRouter} from "vue-router";

const router = useRouter()
const store = useStore();
const errors = ref({});

const isAuthenticated = computed(() => store.getters.isAuthenticated)

if (isAuthenticated) {
    router.push({
        name: 'home'
    })
}

const handleSubmit = async (form$) => {
    const requestData = form$.requestData
    form$.submitting = true
    form$.cancelToken = form$.$vueform.services.axios.CancelToken.source()
    form$.messageBag.clear()

    let response;

    try {
        // Sending the request
        response = await form$.$vueform.services.axios.post(
            '/login',
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

    // Handle success (status is 2XX)
    form$.messageBag.clear() // clear message bag
    form$.messageBag.append('Form submitted', 'message') // add success message
    store.commit('SET_TOKEN', response.data.token)
    store.commit('SET_USER', response.data.user)

    await router.push({
        name: 'home'
    })
}

const vueform = ref({
    size: 'md',
    displayErrors: false,
    schema: {
        page_title: {
            type: 'static',
            content: 'Sign In',
            tag: 'h1',
        },
        divider: {
            type: 'static',
            tag: 'hr',
        },
        email: {
            type: 'text',
            inputType: 'email',
            rules: [
                'required',
                'max:255',
                'email',
            ],
            placeholder: 'Email',
            fieldName: 'Email',
            description: 'You will receive a confirmation letter to this email.',
        },
        password: {
            type: 'text',
            inputType: 'password',
            rules: [
                'required',
                'min:8',
            ],
            fieldName: 'Password',
            placeholder: 'Password',
        },
        divider_1: {
            type: 'static',
            tag: 'hr',
        },
        login: {
            type: 'button',
            submits: true,
            buttonLabel: 'Sign In',
            full: true,
            size: 'lg',
        },
        register: {
            type: 'button',
            submits: false,
            secondary: true,
            buttonLabel: 'Sign Up',
            buttonType: 'anchor',
            href: '/register',
            full: true,
            size: 'lg',
            description: 'Click here if you doesn\'t have an account!',
        },
    },
})

</script>
