import { waitFor, baseUrl, triParNomInverse } from '../lib/helperStore.js'
import { parseIGC } from '../lib/parseigc.js'
const env = process.env;

const initialState = {
    flightsLoaded: false,
    flights: false,
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadFlights: function (context) {
        let url = "/flights";
        if (env.NODE_ENV == "development") {
            //url = "config/flights.jso";
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
                // eslint-disable-next-line no-unused-vars
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFlight: function (context, { filename, parsed }) {
        let url = "/file?path=/vols/";
        if (parsed == true) {
            url = url + "parsed/"
        }
        url = url + filename;

        if (env.NODE_ENV == "development") {
            //url = "config/flights.jso";
            url = baseUrl + url;
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
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
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.delete(url, axiosConfig).then(response => {
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    flightToBook: function (context, filename) {
        let url = "/parseigc?path=/vols/" + filename;

        if (env.NODE_ENV == "development") {
            // url = "config/20010500_concat.IGC";
            url = baseUrl + url;
        }


        let axiosConfig = {}
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
    },
    infoFlight: function (context, filename) {
        let url = "/file?path=/vols/" + filename;

        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

        // if (env.NODE_ENV == "development") {
        //     url = "/19022402.IGC";
        // }

        let axiosConfig = {}
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                const data = response.data;
                const igc = parseIGC(data);
                return igc;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },

}

export const mutations = {
    setFlights: function (state, flights) {
        //state.flights = Object.assign({}, state.flights, flights);
        state.flights = Object.assign({}, flights);
        state.flightsLoaded = true;
    },
}

const getters = {
    flights(state) {
        return state.flightsLoaded ? state.flights : false;
    },
}

export default {
    state,
    actions,
    mutations,
    getters
};