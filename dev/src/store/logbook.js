import { waitFor, baseUrl, convertArrayToObject, sumFlightsDuration, getTimeInterval } from '../lib/helperStore.js'
//compareFlight
// import { parseIGC } from '../lib/parseigc.js'

const env = process.env;

const initialState = {
    bddflightsshortY: {},
    bddflightsshortM: {},
    bddflightsM: {},
    showPopupVisu: false,
    currentIgc: null,
    currentFlight: {},
    showPopupFlight: false,
};

const namespaced = true;

const state = Object.assign({}, initialState);

const actions = {
    loadFlightsBddShort: function (context, { mode, parcel, force = false }) {
        if (!force) {
            //check if loading is required
            if (mode == "M") {
                if ((context.state.bddflightsshortY[parcel] === undefined) || (context.state.bddflightsshortY[parcel].needDetailsLoading === false)) {
                    return
                }
            }
        }
        let url = "/flightsshort";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }

        // add parameters
        let params = {};
        if (mode) {
            params.mode = mode
        }
        if (parcel) {
            params.parcel = parcel
        }
        const searchParams = new URLSearchParams(params);
        if (searchParams) {
            url = url + "?" + searchParams
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
                let arr = response.data
                arr.forEach(function (element) {
                    element.needDetailsLoading = true;
                    element.collapseShown = false;
                });
                if (mode == 'Y') {
                    context.commit('setBddflightsshortY', convertArrayToObject(arr, 'gr'));
                } else if (mode == 'M') {
                    context.commit('setNeedLoadingY', { year: parcel, status: false })
                    context.commit('setBddflightsshortM', { year: parcel, data: convertArrayToObject(arr, 'gr') });
                }
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadFlightsBdd: function (context, { parcel, force = false }) {
        const year = parcel.substring(0, 4)
        if (!force) {
            //check if loading is required
            if ((context.state.bddflightsshortM[year] === undefined) || (context.state.bddflightsshortM[year][parcel] === undefined) || (context.state.bddflightsshortM[year][parcel].needDetailsLoading === false)) {
                return
            }
        }

        let url = "/flightsbdd";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + url;
        }

        // add parameters
        let params = {};
        if (parcel) {
            params.parcel = parcel
        }
        const searchParams = new URLSearchParams(params);
        if (searchParams) {
            url = url + "?" + searchParams
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
                let arr = response.data;
                arr = arr.map(d => {
                    d.duration = getTimeInterval(d.start_flight_time, d.end_flight_time, "00:00:00");
                    return d;
                });
                context.commit('setBddflightstM', { month: parcel, data: convertArrayToObject(arr, 'id') });
                context.commit('setNeedLoadingM', { year: year, month: parcel, status: false })
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    collapseToggleY: function (context, { year }) {
        context.commit('collapseToggleY', { year: year })
    },
    collapseToggleM: function (context, { month }) {
        const year = month.substring(0, 4)
        context.commit('collapseToggleM', { year: year, month: month })
    },
}

const mutations = {
    setBddflightsshortY(state, data) {
        state.bddflightsshortY = data//Object.assign({}, data);
    },
    setBddflightsshortM(state, { year, data }) {
        state.bddflightsshortM[year] = data//Object.assign({}, data);
    },
    setNeedLoadingY(state, { year, status }) {
        state.bddflightsshortY[year].needDetailsLoading = status
    },
    setNeedLoadingM(state, { year, month, status }) {
        state.bddflightsshortM[year][month].needDetailsLoading = status
    },
    setBddflightstM(state, { month, data }) {
        Vue.set(state.bddflightsM, month, data)
    },
    collapseToggleY(state, { year }) {

        state.bddflightsshortY[year].collapseShown = !state.bddflightsshortY[year].collapseShown
    },
    collapseToggleM(state, { year, month }) {
        const obj = state.bddflightsshortM;
        obj[year][month]['collapseShown'] = !obj[year][month]['collapseShown']
        state.bddflightsshortM = Object.assign({}, state.bddflightsshortM, obj)
    },
    setShowPopupVisu(state, data) {
        state.showPopupVisu = data;
    },
    setCurrentIgc(state, data) {
        state.currentIgc = data;
    },
    setCurrentFlight(state, data) {
        state.currentFlight = data;
    },
    setShowPopupFlight(state, data) {
        state.showPopupFlight = data;
    },
}

const getters = {
    totalFlightTime(state) {
        return Object.values(state.bddflightsshortY).reduce((dur, { du }) => {
            const a = moment.duration(du);
            let b = moment.duration(dur);
            let interval = moment().hour(0).minute(0).second(0);
            b.add(a)
            const delta = moment.duration(b).asSeconds()
            interval.add(delta, "s");

            return interval.format("HH:mm:ss");

        }, "00:00:00")
    },
    totalFlightNumber(state) {
        return Object.values(state.bddflightsshortY).reduce((t, { nf }) => t + nf, 0)
    },
    maxYear(state, getters) {
        return _.max(getters.years)
    },
    years(state) {
        return _.sortBy(Object.keys(state.bddflightsshortY), function (i) {
            return -i
        })
    },
    daysForMonth: function (state) {
        return function (month) {
            if (state.bddflightsM[month]) {
                let data = _.chain(Object.values(state.bddflightsM[month]))
                    //regroupement par jour
                    .groupBy(function (d) {
                        return d.flight_date
                    }).map((value, key) => ({
                        day: key,
                        flights: _.orderBy(value, ['start_flight_time'], ['asc']),
                        nb_flights: value.length,
                        sites_id: _.uniq(_.map(value, "site_id")),
                        duration: sumFlightsDuration(value),
                    }))
                    .orderBy(['day'], ['desc'])
                    .value()

                return data
            } else {
                return [];
            }
        }
    }
}

export default {
    namespaced,
    state,
    actions,
    mutations,
    getters
};