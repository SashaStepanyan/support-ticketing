import axios from 'axios';

const state = {
    tickets: [],
    filters: {
        perPage: 12,
        page: 1,
        search: null,
        status: null,
        created_by_current: null
    },
    totalPages: 1,
};

const mutations = {
    SET_TICKETS(state, tickets) {
        state.tickets = tickets;
    },
    SET_FILTERS(state, filters) {
        state.filters = filters;
    },
    SET_TOTAL_PAGES(state, total) {
        state.totalPages = total;
    },
    SET_CURRENT_PAGE(state, currentPage) {
        state.filters.page = currentPage;
    }
};

const actions = {
    async loadTickets({ state, dispatch, commit }) {
        try {
            const response = await axios.get('/tickets', {params: state.filters});
            const totalPages = Math.ceil(response.data.total/response.data.perPage);
            commit('SET_TOTAL_PAGES', Math.ceil(response.data.total/response.data.perPage));
            commit('SET_CURRENT_PAGE', (totalPages >= response.data.page) ? response.data.page : totalPages);
            if (totalPages !== 0 && totalPages < response.data.page) {
                dispatch('loadTickets');
            }
            commit('SET_TICKETS', response.data.tickets);
        } catch (error) {
            throw error;
        }
    },
    async deleteTicket({ state, commit, dispatch }, id) {
        try {
            await axios.delete('/tickets/' + id);

            dispatch('loadTickets');
        } catch (error) {
            throw error;
        }
    },
    setFilters({commit}, filters) {
        commit('SET_FILTERS', filters);
    }
};

const getters = {
    tickets: state => state.tickets,
    filters: state => state.filters,
    totalPages: state => state.totalPages,
    activePage: state => state.filters.page,
};

export default {
    state,
    mutations,
    actions,
    getters
};
