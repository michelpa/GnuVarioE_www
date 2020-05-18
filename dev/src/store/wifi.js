import { waitFor, baseUrl } from '../lib/helperStore.js'

const env = process.env;

const initialState = {
    configWifiLoaded: false,
    configWifi: false,
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadWifiConfig: function (context) {
        let url = "/wifi";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/octet-stream"
            }
        };

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let config = response.data;
                context.commit('setconfigWifi', config);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveWifiConfig: function (context) {
        let url = "/wifi";

        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }
        
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);

            var config = {
                headers: {
                    'Content-Type': 'text/plain'
                },
                responseType: 'text'
            };

            // eslint-disable-next-line
            return axios.post(url, context.state.configWifi, config).then(response => {
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
    setconfigWifi: function (state, config) {
        state.configWifi = config;
        state.configWifiLoaded = true;
    },
}

const getters = {
    configWifi(state) {
        return state.configWifiLoaded ? state.configWifi : false;
    },
}

export default {
    state,
    actions,
    mutations,
    getters
};