import { parseIGC } from '../lib/parseigc.js'
import { waitFor, triFichiers, triParNomInverse } from '../lib/helper.js'

const env = process.env;

const initialState = {
    configLoaded: false,
    config: false,
    configWifi: false,
    configWifiLoaded: false,
    flightsLoaded: false,
    flights: false,
    fileslistLoaded: false,
    fileslist: false,
    isLoading: false,
    uploadPct: 0
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadConfig: function (context) {
        let url = "/params";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = "http://192.168.1.70/params";
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
                return true;
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadWifiConfig: function (context) {
        let url = "/wifi";
        if (env.NODE_ENV == "development") {
            url = "config/wifi.cfg";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/octet-stream"
            }
        };

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let config = response.data;
                context.commit('setconfigWifi', config);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveWifiConfig: function (context) {
        let url = "/wifi";

        return waitFor(function () {
            return context.state.isLoading === false
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
                triParNomInverse(d);
                let traceFiles;
                d = d.filter(function (e) {
                    return e.type == "file";
                });
                traceFiles = d.map(f => {
                    return { name: f.name.substring(f.name.lastIndexOf("/") + 1), size: f.size };
                });
                context.commit('setFlights', traceFiles);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFlight: function (context, filename) {
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
            //url = "config/tree.jso";
            url = "http://192.168.1.70/list";
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
                let tree = response.data;
                triFichiers(tree);
                context.commit('setFiles', tree);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFile: function (context, filename) {
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
    uploadFile: function (context, formData) {
        let url = "/upload";
        if (env.NODE_ENV == "development") {
            url = "http://192.168.1.70/upload";
        }
        context.commit('setUploadpct', 0);
        return waitFor(function () {
            return (context.state.isLoading === false);
        }).then(function () {
            context.commit('setLoadingState', true);

            var config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: function (progressEvent) {
                    let pct = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    context.commit('setUploadpct', pct);
                }
            };

            return axios.post(url, formData, config).then(response => {
                // console.log(response);
                return response;
            }).catch(function (error) {
                // handle error
                // console.log('err', error.response);
                return error.response;
            }).finally(function () {
                context.commit('setUploadpct', 0);
                context.commit('setLoadingState', false);
            });
        });
    },
    deleteFile: function (context, filename) {
        let url = "/file?path=" + filename;
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
}

export const mutations = {
    setConfig: function (state, config) {
        state.config = Object.assign({}, state.config, config);
        state.configLoaded = true;
    },
    setconfigWifi: function (state, config) {
        state.configWifi = config;
        state.configWifiLoaded = true;
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
    setUploadpct: function (state, pct) {
        state.uploadPct = pct;
    }

}

const getters = {
    config(state) {
        return state.configLoaded ? state.config : false;
    },
    configWifi(state) {
        return state.configWifiLoaded ? state.configWifi : false;
    },
    flights(state) {
        return state.flightsLoaded ? state.flights : false;
    },
    fileslist(state) {
        return state.fileslistLoaded ? state.fileslist : false;
    },
    isLoading(state) {
        return state.isLoading;
    },
    uploadPct(state) {
        return state.uploadPct;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};
