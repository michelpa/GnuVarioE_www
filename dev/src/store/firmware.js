
import { waitFor, baseUrl } from '../lib/helperStore.js'


const env = process.env;

const initialState = {
    firmwareVersion: ''
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadFirmwareVersion: function (context) {
        let url = "/firmwareversion";
        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
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
                context.commit('setFirmwareVersion', response.data);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    upgradeFirmware: function (context, beta) {
        let url = "/upgradeweb?beta=" + beta;
        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }
        let axiosConfig = {

        };
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line no-unused-vars
            return axios.get(url, axiosConfig).then(response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    }
}

export const mutations = {
    setFirmwareVersion: function (state, v) {
        state.firmwareVersion = v;
    },
}

const getters = {
    firmwareVersion(state) {
        return state.firmwareVersion;
    },
}

export default {
    state,
    actions,
    mutations,
    getters
};


