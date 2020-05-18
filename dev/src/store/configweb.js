import { waitFor, baseUrl } from '../lib/helperStore.js'
import { preferences } from '../preferences.js'

const env = process.env;

const initialState = {
    configWebLoaded: false,
    configWeb: preferences,
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadConfigWeb: function (context) {
        let url = "/webconfig";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
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
                let configWeb = {
                    ...context.state.configWeb,
                    ...response.data,
                };
                context.commit('setConfigWeb', configWeb);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveConfigWeb: function (context) {
        let url = "/webconfig";

        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, context.state.configWeb).then(_response => {
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
    setConfigWeb: function (state, config) {
        state.configWeb = Object.assign({}, state.configWeb, config);
        state.configWebLoaded = true;
    },
    updateConfigWeb: function (state, payload) {
        var apply = function (data, mods) {
            for (var path in mods) {
                var k = data;
                var steps = path.split('.');
                var last = steps.pop();
                steps.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));
                k[last] = mods[path];
            }
            return data;
        }

        var modsStr = "{\"" + payload.property + "\":\"" + payload.with + "\"}";
        var mods = JSON.parse(modsStr);
        let ob = apply(state.configWeb, mods);
        state.configWeb = Object.assign({}, state.configWeb, ob);
    },
}

const getters = {
    configWeb(state) {
        return state.configWebLoaded ? state.configWeb : false;
    },
    themeName(state) {
        return state.configWeb.theme.name;
    },
    themeVariant(state) {
        return state.configWeb.theme.variant;
    },
    themeType(state) {
        return state.configWeb.theme.type;
    },
    lang(state) {
        return state.configWeb.language;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};