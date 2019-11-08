import { parseIGC } from '../lib/parseigc.js'

function waitFor(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) {
            resolve();
        } else {
            setTimeout(function () {
                poll(resolve);
            }, 30);
        }
    };

    return new Promise(poll);
}

const env = process.env;

const initialState = {
    configLoaded: false,
    config: false,
    flightsLoaded: false,
    flights: false,
    fileslistLoaded: false,
    fileslist: false,
    isLoading: false,
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadConfig: function (context) {
        let url = "/params";
        if (env.NODE_ENV == "development") {
            url = "config/params.jso";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            axios.get(url, axiosConfig).then(response => {
                let config = response.data;
                context.commit('setConfig', config);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveConfig: function (context) {
        let url = "/params";

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, context.state.config).then(response => {
                // context.commit('setConfig', config);
                return true;
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadFlights: function (context) {
        let url = "/flights";
        if (env.NODE_ENV == "development") {
            url = "config/flights.jso";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            axios.get(url, axiosConfig).then(response => {
                let d = response.data;
                let traceFiles;
                traceFiles = d.map(f => {
                    return f.name.substring(f.name.lastIndexOf("/") + 1);
                });
                context.commit('setFlights', traceFiles);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFlight: function (context, filename) {
        // let param = encodeURIComponent('?path=/vols/' + filename);
        let url = "/file?path=/vols/" + filename;
        if (env.NODE_ENV == "development") {
            url = "/19022402.IGC";
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                return response;
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    deleteFlight: function (context, filename) {
        // let param = encodeURIComponent('?path=/vols/' + filename);
        let url = "/file?path=/vols/" + filename;
        if (env.NODE_ENV == "development") {
            url = "/index.htm";
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.delete(url, axiosConfig).then(response => {
                return response;
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    infoFlight: function (context, filename) {
        // let param = encodeURIComponent('?path=/vols/' + filename);
        let url = "/file?path=/vols/" + filename;
        if (env.NODE_ENV == "development") {
            url = "/19022402.IGC";
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                const data = response.data;
                const igc = parseIGC(data);
                return igc;
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadSDFiles: function (context) {
        let url = "/list";
        if (env.NODE_ENV == "development") {
            url = "config/tree.jso";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            axios.get(url, axiosConfig).then(response => {
                context.commit('setFiles', response.data);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFile: function (context, filename) {
        // let param = encodeURIComponent('?path=/vols/' + filename);
        let url = "/file?path=" + filename;
        if (env.NODE_ENV == "development") {
            url = "/19022402.IGC";
        }
        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                return response;
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
    },
    setConfigValue: function (state, { path, value }) {
        var deep_value = function (obj, path) {
            // eslint-disable-next-line no-redeclare
            for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
                obj = obj[path[i]];
            }
            return obj;
        };

        let ob = deep_value(state.config, path);

        ob = Object.assign({}, ob, value);

        state.config = Object.assign({}, state.config, ob);
    },
    setFlights: function (state, flights) {
        state.flights = Object.assign({}, state.flights, flights);
        state.flightsLoaded = true;
    },
    setLoadingState: function (state, isLoading) {
        state.isLoading = isLoading;
    },
    setFiles: function (state, fileslist) {
        state.fileslist = Object.assign({}, state.fileslist, fileslist);
        state.fileslistLoaded = true;
    },

}

const getters = {
    config(state) {
        return state.configLoaded ? state.config : false;
    },
    flights(state) {
        return state.flightsLoaded ? state.flights : false;
    },
    fileslist(state) {
        return state.fileslistLoaded ? state.fileslist : false;
    },
    isLoading(state) {
        return state.isLoading;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};