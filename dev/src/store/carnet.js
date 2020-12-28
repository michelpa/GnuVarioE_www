import { waitFor, baseUrl, sumFlightsDuration, sumByKey, sumDuration, getTimeInterval } from '../lib/helperStore.js'
//compareFlight
import { parseIGC } from '../lib/parseigc.js'




const env = process.env;

const initialState = {
    sitesLoaded: false,
    sites: [],
    bddflightsLoaded: false,
    bddflights: {},
    bddflightsRaw: [],
    offsetFlights: 0,
    limitFlights: 10000
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadSites: function (context) {
        let url = "/site";
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
                context.commit('setSites', response.data);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveSite: function (context, site) {
        let url = "/site";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }
        if (site.id) {
            url = url + "?id=" + site.id;
        }
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, site).then(_response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },

    deleteSite: function (context, id) {
        let url = "/site";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }

        url = url + "?id=" + id;

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.delete(url).then(_response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadBddFlights: function (context, { reload, nbLoop }) {

        if (!nbLoop) {
            nbLoop = 1;
        }

        if (reload && reload == true) {
            //     //on recharge l'ensemble des vols jusqu'a l'offset precedent
            //     const offsetPrec = context.state.offsetFlights - 1;
            //     context.commit('resetData');
            //     nbLoop = Math.trunc(offsetPrec / context.state.limitFlights) + 1;
        }

        let url = "/flightsbdd";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }
        url = url + "?offset=" + context.state.offsetFlights + "&limit=" + context.state.limitFlights;

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
                let data = response.data;

                context.commit('setRawData', data);

                //     context.commit('setBddFlights', parsed);
                //     if (nbLoop > 1) {
                //         nbLoop--;
                //         context.dispatch('loadBddFlights', { 'nbLoop': nbLoop });
                //     }
                // }
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                if (nbLoop <= 1) {
                    context.commit('setLoadingState', false);
                }
            });
        });
    },
    saveFlight: function (context, flight) {
        let url = "/flightsbdd";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }
        if (flight.id) {
            url = url + "?id=" + flight.id;
        }
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, flight).then(_response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    infoFlightParsed: function (context, filename) {
        let url = "/file?path=/vols/parsed/" + filename;

        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

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
    deleteFlightParsed: function (context, flight) {
        let url = "/flightsbdd?id=" + flight.id;

        if (flight.filename) {
            url = url + "&filename=" + flight.filename;
        }

        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line no-unused-vars
            return axios.delete(url, axiosConfig).then(response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    resetBddFlights: function (context) {
        context.commit('resetData');
        context.dispatch('loadBddFlights', { reload: true });
    }
}

export const mutations = {
    setSites: function (state, sites) {
        state.sites = sites;// Object.assign({}, sites);
        state.sitesLoaded = true;
    },
    setBddFlights(state, data) {
        state.bddflights = Object.assign({}, data);
        state.bddflightsLoaded = true;
        state.offsetFlights = data.all.nb_flights;
    },
    resetData(state) {
        state.offsetFlights = 0;
        state.bddflights = {};
    },
    setRawData(state, data) {
        state.bddflightsRaw = data;
    }

}

const getters = {
    sites(state) {
        return state.sitesLoaded ? state.sites : false;
    },
    bddflights(state) {
        return state.bddflightsLoaded ? state.bddflights : false;
    },
    // eslint-disable-next-line
    isLoadMore(state) {
        return false;
        // return (state.offsetFlights % state.limitFlights == 0) ? true : false;
    },
    nbFlights: function (state) {
        return state.bddflightsRaw.length;
    },
    minDate: function (state) {
        if (state.bddflightsRaw) {
            let m = moment(state.bddflightsRaw[0].flight_date, "YYYY-MM-DD");
            return m;
        } else {
            return "";
        }
    },
    totalDuration: function (state) {
        let dur = "00:00:00";
        state.bddflightsRaw.forEach((d) => {
            dur = getTimeInterval(d.start_flight_time, d.end_flight_time, dur);
        });
        return dur;
    },
    sitesIds: function (state) {
        const distinctSites = [...new Set(state.bddflightsRaw.map((d) => d.site_id))];
        var index = distinctSites.indexOf(0);
        if (index > -1) {
            distinctSites.splice(index, 1);
        }
        return distinctSites;
    },
    parsedData: function (state) {
        let data = state.bddflightsRaw;

        data = data.map(d => {
            d.duration = getTimeInterval(d.start_flight_time, d.end_flight_time, "00:00:00");
            return d;
        });

        data = _.chain(data)
            //regroupement par jour
            .groupBy(function (d) {
                return d.flight_date;
            })
            .map((value, key) => ({
                day: key,
                flights: _.orderBy(value, ['start_flight_time'], ['asc']),
                nb_flights: value.length,
                sites_id: _.uniq(_.map(value, "site_id")),
                duration: sumFlightsDuration(value),
            }))
            .orderBy(['day'], ['desc'])
            //regroupement par mois
            .groupBy(function (d) {
                let m = moment(d.day, "YYYY-MM-DD");
                return m.format("YYYY-MM");
            })
            .map((value, key) => ({
                month: key,
                days: value,
                nb_flights: sumByKey(value, "nb_flights"),
                sites_id: _.uniq(_.flattenDeep(_.map(value, "sites_id"))),
                duration: sumDuration(value),
            }))
            .orderBy(['month'], ['desc'])
            //regroupement par an
            .groupBy(function (d) {
                let m = moment(d.month, "YYYY-MM");
                return m.format("YYYY");
            })
            .map((value, key) => ({
                year: key,
                months: value,
                nb_flights: sumByKey(value, "nb_flights"),
                sites_id: _.uniq(_.flattenDeep(_.map(value, "sites_id"))),
                duration: sumDuration(value),
            }))
            .orderBy(['year'], ['desc'])
            .value();

        return data;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};