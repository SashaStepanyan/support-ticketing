import axios from 'axios';

const state = {
    token: localStorage.getItem('token') || null,
    user: null,
};

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem('token', token);
    },
    SET_USER(state, user) {
        state.user = user;
    },
    LOGOUT(state) {
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
    }
};

const actions = {
    async login({ commit }, credentials) {
        try {
            const response = await axios.post('/api/login', credentials);
            commit('SET_TOKEN', response.data.token);
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    async fetchUser({ commit, state }) {
        if (!state.token) return;

        try {
            const response = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${state.token}` }
            });
            commit('SET_USER', response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            commit('LOGOUT');
        }
    },

    logout({ commit }) {
        commit('LOGOUT');
    }
};

const getters = {
    isAuthenticated: state => !!state.token,
    getUser: state => state.user,
};

export default {
    state,
    mutations,
    actions,
    getters
};
