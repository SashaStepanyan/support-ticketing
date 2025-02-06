<template>
    <div class="max-w-[800px] w-full mx-auto min-h-screen flex items-center justify-center py-5">
        <Vueform :endpoint="false" @submit="handleSubmit" class="py-5 px-10 rounded-xl bg-zinc-200 dark:bg-black border-[#06ac8b] border-2" v-bind="vueform" />
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import { useStore } from 'vuex';
import {useRouter} from "vue-router";

const router = useRouter()
const store = useStore();
const errors = ref({});

const isAuthenticated = computed(() => store.getters.isAuthenticated)

if (isAuthenticated.value) {
    router.push({
        name: 'home'
    })
}

const handleSubmit = async (form$) => {
    const requestData = form$.requestData
    form$.submitting = true
    form$.cancelToken = form$.$vueform.services.axios.CancelToken.source()

    let response

    try {
        // Sending the request
        response = await form$.$vueform.services.axios.post(
            '/register',
            requestData,
            {
                cancelToken: form$.cancelToken.token,
            }
        )
    } catch (error) {
        const errorsObject = error.response.data;
        for (let errorsObjectKey in errorsObject) {
            errors.value[errorsObjectKey] = errorsObject[errorsObjectKey].join('</br>');
        }
        form$.messageBag.clear()
        for (let valueKey in errors.value) {
            form$.el$(valueKey).messageBag.clear()
            form$.el$(valueKey).messageBag.append(errors.value[valueKey])
        }
        return
    } finally {
        form$.submitting = false
    }

    form$.messageBag.clear()
    form$.messageBag.append(response.data.message, 'message')
    store.commit('SET_TOKEN', response.data.token)
    store.commit('SET_USER', response.data.user)

    await router.push({
        name: 'home'
    })
}

const getDate18YearsAgo = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits

    return `${year}-${month}-${day}`;
}

const vueform = ref({
    size: 'md',
    displayErrors: false,
    method: 'POST',
    schema: {
        page_title: {
            type: 'static',
            content: 'Sign Up',
            tag: 'h1',
        },
        divider: {
            type: 'static',
            tag: 'hr',
        },
        container: {
            type: 'group',
            schema: {
                first_name: {
                    type: 'text',
                    placeholder: 'First name',
                    columns: {
                        container: 6,
                        label: 12,
                        wrapper: 12,
                    },
                    fieldName: 'First name',
                    rules: [
                        'required',
                        'max:255',
                    ],
                    errors: errors.value['first_name'],
                },
                last_name: {
                    type: 'text',
                    placeholder: 'Last name',
                    columns: {
                        container: 6,
                        label: 12,
                        wrapper: 12,
                    },
                    fieldName: 'Last name',
                    rules: [
                        'required',
                        'max:255',
                    ],
                    errors: errors.value['first_name'],
                },
            },
            description: 'Make sure it matches your legal name',
        },
        birthday: {
            type: 'date',
            placeholder: 'Birthday',
            fieldName: 'Birthday',
            rules: [
                'required',
            ],
            max: getDate18YearsAgo(),
            description: 'Your birthday is not visible others.',
            displayFormat: 'MMMM Do, YYYY',
            errors: errors.value['birthday'],
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
            errors: errors.value['email'],
        },
        password: {
            type: 'text',
            inputType: 'password',
            rules: [
                'required',
                'min:8',
                'same:password_confirmation',
            ],
            fieldName: 'Password',
            placeholder: 'Password',
            errors: errors.value['password'],
        },
        password_confirmation: {
            type: 'text',
            inputType: 'password',
            rules: [
                'required',
            ],
            fieldName: 'Password confirmation',
            placeholder: 'Password again',
            errors: errors.value['password_confirmation'],
        },
        terms: {
            type: 'checkbox',
            text: 'I accept the Terms & Conditions & Privacy Policy',
            rules: [
                'required',
            ],
            errors: errors.value['terms'],
        },
        divider_1: {
            type: 'static',
            tag: 'hr',
        },
        register: {
            type: 'button',
            submits: true,
            buttonLabel: 'Sign Up',
            full: true,
            size: 'lg',
        },
        login: {
            type: 'button',
            submits: false,
            secondary: true,
            buttonLabel: 'Sign In',
            buttonType: 'anchor',
            href: '/login',
            full: true,
            size: 'lg',
            description: 'Click here if you already have an account!',
        },
    },
})

</script>
