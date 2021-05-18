import { waitFor, baseUrl } from '../lib/helperStore.js'

const env = process.env;

const initialState = {
    configLoaded: false,
    config: false,
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadConfig: function (context) {
        let url = "/params";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + "/params";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let config = response.data;
                context.commit('setConfig', config);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveConfig: function (context) {
        let url = "/params";

        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + "/params";
        }

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, context.state.config).then(_response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
}

export const mutations = {
    setConfig: function (state, config) {
        state.config = Object.assign({}, state.config, config);
        state.configLoaded = true;
    }
}

const getters = {
    config(state) {
        return state.configLoaded ? state.config : false;
    }
}

export default {
    // namespaced: true,
    state,
    actions,
    mutations,
    getters
};