import { waitFor, baseUrl } from '../lib/helperStore.js'
import { parseIGC } from '../lib/parseigc.js'

function getTimeInterval(startTime, endTime, addTime) {
    var start = moment(startTime, "HH:mm:ss");
    var end = moment(endTime, "HH:mm:ss");
    var seconds = end.diff(start, 'seconds');
    var interval = moment().hour(0).minute(0).second(seconds);
    var delta = moment.duration(addTime).asSeconds()
    interval.add(delta, "s");
    return interval.format("HH:mm:ss");
}

function compareFlight(a, b) {
    if (a.flight_date > b.flight_date) {
        return -1;
    }
    if (a.flight_date < b.flight_date) {
        return 1;
    }

    if (a.start_flight_time < b.start_flight_time) {
        return -1;
    }
    if (a.start_flight_time > b.start_flight_time) {
        return 1;
    }
    return 0;
}

const env = process.env;

const initialState = {
    sitesLoaded: false,
    sites: [],
    bddflightsLoaded: false,
    bddflights: {},
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
            //on recharge l'ensemble des vols jusqu'a l'offset precedent
            const offsetPrec = context.state.offsetFlights - 1;
            context.commit('resetData');
            nbLoop = Math.trunc(offsetPrec / context.state.limitFlights) + 1;
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
                if (data.length > 0) {
                    let parsed = context.state.bddflights;
                    if (!parsed.all) {
                        parsed.all = {
                            "nb_flights": 0,
                            "duration": "00:00:00",
                            "sites_id": [],
                            "data": [],
                            "min_date": null
                        };
                    }
                    const distinctSites = [...new Set(data.map(d => d.site_id)), ...parsed.all.sites_id];
                    var index = distinctSites.indexOf(0);
                    if (index > -1) {
                        distinctSites.splice(index, 1);
                    }
                    let dur = parsed.all.duration;
                    data.forEach(d => {
                        dur = getTimeInterval(d.start_flight_time, d.end_flight_time, dur);
                    });

                    parsed.all = {
                        "nb_flights": parsed.all.nb_flights + data.length,
                        "duration": dur,
                        "sites_id": distinctSites,
                        "data": []
                    };

                    if (!parsed.data) {
                        parsed.data = [];
                    }

                    //tri des vols par ordre flight_date DESC, start_flight_time ASC 
                    data.sort(compareFlight);

                    //console.log(parsed.data.filter(function (e) { return Object.prototype.hasOwnProperty.call(e, "2010") }));
                    data.forEach(d => {
                        let m = moment(d.flight_date, "YYYY-MM-DD");
                        parsed.all.min_date = m;
                        let year = m.year();
                        let month = m.format('MM');
                        //recherche si un element existe pour l'annee sinon création
                        var indexYear = -1;
                        // eslint-disable-next-line no-unused-vars
                        var filteredObjYear = parsed.data.find(function (item, i) {
                            if (item.year === year) {
                                indexYear = i;
                                return i;
                            }
                        });

                        let tabForYear = {};

                        if (indexYear == -1) {
                            tabForYear = {
                                "year": year,
                                "nb_flights": 0,
                                "duration": "00:00:00",
                                "sites_id": [],
                                "months": []
                            };

                            parsed.data.push(tabForYear);
                        } else {
                            tabForYear = parsed.data[indexYear];
                            // tabForYear = filteredObjYear;
                        }

                        tabForYear.nb_flights++;

                        if (d.site_id != 0 && tabForYear.sites_id.indexOf(d.site_id) === -1) {
                            tabForYear.sites_id.push(d.site_id);
                        }
                        var indexMonth = -1;
                        // eslint-disable-next-line no-unused-vars
                        var filteredObjMonth = tabForYear.months.find(function (item, i) {
                            if (item.month === month) {
                                indexMonth = i;
                                return i;
                            }
                        });

                        let tabForMonth = {};
                        if (indexMonth == -1) {
                            tabForMonth = {
                                "month": month,
                                "nb_flights": 0,
                                "duration": "00:00:00",
                                "sites_id": [],
                                "days": [],
                                "flights": []
                            };

                            tabForYear.months.push(tabForMonth);
                        } else {
                            tabForMonth = tabForYear.months[indexMonth];

                        }
                        tabForYear.duration = getTimeInterval(d.start_flight_time, d.end_flight_time, tabForYear.duration);

                        tabForMonth.nb_flights++;
                        tabForMonth.duration = getTimeInterval(d.start_flight_time, d.end_flight_time, tabForMonth.duration);

                        if (d.site_id != 0 && tabForMonth.sites_id.indexOf(d.site_id) === -1) {
                            tabForMonth.sites_id.push(d.site_id);
                        }

                        var indexDay = -1;
                        // eslint-disable-next-line no-unused-vars
                        var filteredObjDay = tabForMonth.days.find(function (item, i) {
                            if (item.day === d.flight_date) {
                                indexDay = i;
                                return i;
                            }
                        });

                        let tabForDay = {};
                        if (indexDay == -1) {
                            tabForDay = {
                                "day": d.flight_date,
                                "nb_flights": 0,
                                "duration": "00:00:00",
                                "sites_id": [],
                                "flights": []
                            };

                            tabForMonth.days.push(tabForDay);
                        } else {
                            tabForDay = tabForMonth.days[indexDay];

                        }

                        if (d.site_id != 0 && tabForDay.sites_id.indexOf(d.site_id) === -1) {
                            tabForDay.sites_id.push(d.site_id);
                        }


                        tabForDay.nb_flights++;
                        tabForDay.duration = getTimeInterval(d.start_flight_time, d.end_flight_time, tabForDay.duration);
                        d.duration = getTimeInterval(d.start_flight_time, d.end_flight_time, "00:00:00");
                        tabForDay.flights.push(d);
                    });

                    // console.log("parse", JSON.stringify(parsed));

                    context.commit('setBddFlights', parsed);
                    if (nbLoop > 1) {
                        nbLoop--;
                        context.dispatch('loadBddFlights', { 'nbLoop': nbLoop });
                    }
                }
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
    }

}

const getters = {
    sites(state) {
        return state.sitesLoaded ? state.sites : false;
    },
    bddflights(state) {
        return state.bddflightsLoaded ? state.bddflights : false;
    },
    isLoadMore(state) {
        return (state.offsetFlights % state.limitFlights == 0) ? true : false;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};