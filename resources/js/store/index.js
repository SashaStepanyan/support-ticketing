import { createStore } from 'vuex';
import auth from './auth';
import ticket from './ticket';

const store = createStore({
    modules: {
        auth,
        ticket
    }
});

export default store;
