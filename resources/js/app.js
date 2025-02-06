import './bootstrap';
import { createApp } from "vue";
import router from "./router";
import Vueform from '@vueform/vueform'
import vueformConfig from './../../vueform.config'
import { createVfm } from 'vue-final-modal'

import App from "./App.vue";
import axios from 'axios';
import store from './store';

axios.defaults.baseURL = 'http://localhost/api';
axios.interceptors.request.use(config => {
    const token = store.state.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const vfm = createVfm()

createApp(App).use(router).use(store).use(Vueform, vueformConfig).use(vfm).mount("#app");
