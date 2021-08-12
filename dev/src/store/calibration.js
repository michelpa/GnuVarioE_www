import { waitFor, baseUrl } from '../lib/helperStore.js'

const env = process.env;

const namespaced = true;

const initialState = {

};

export const state = Object.assign({}, initialState);

export const actions = {
    performCalibration: function (context) {
        let url = "/file?path=/RECORD00.CAL";

        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            let axiosConfig = { responseType: 'text' }
            return axios.get(url, axiosConfig).then(response => {
                let content = response.data;
                context.commit('setLoadingState', false);
                return context.dispatch("uploadFileToCalibration", { content: content }).then(
                    // eslint-disable-next-line
                    (response) => {
                        return response;
                    },
                    (error) => {
                        return Promise.reject(error);
                    }
                );
            }).catch(function (error) {
                if (!error.custommsg) {
                    error.custommsg = 'no RECORD00.CAL on SD'
                }
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    // eslint-disable-next-line
    uploadFileToCalibration: function (context, { content }) {

        let url = 'http://home.symplex.fr:8484/calib234789/runcalibration.php';

        context.commit('setLoadingState', true);

        return axios.post(url, { record: content }).then(response => {
            if (response.data.result !== false) {

                context.commit('setLoadingState', false);
                let cont = response.data.result;

                const formData = new FormData();
                const calFile = new File([cont], '/variocal.cfg', {
                    type: 'text/plain',
                });
                formData.append('data', calFile);

                // eslint-disable-next-line
                return context.dispatch("uploadFile", formData, { root: true }).then(
                    // eslint-disable-next-line
                    (response) => {
                        return context.dispatch("loadSDFiles", '/', { root: true }).then(response => {
                            return response;
                        }).catch(function (error) {
                            error.custommsg = 'Cannot refresh files display'
                            return Promise.reject(error);
                        });
                    },
                    (error) => {
                        if (!error.custommsg) {
                            error.custommsg = 'Cannot upload calibration file to SD'
                        }
                        return Promise.reject(error);
                    }
                ).catch(function (error) {
                    if (!error.custommsg) {
                        error.custommsg = 'Cannot upload calibration file to SD'
                    }
                    return Promise.reject(error);
                }
                );
            } else {
                let error = {}
                error.custommsg = 'No data from remote server'
                return Promise.reject(error);
            }
        }).catch(function (error) {
            if (!error.custommsg) {
                error.custommsg = 'Cannot perform calibration on remote server'
            }
            return Promise.reject(error);
        }).finally(function () {
            context.commit('setLoadingState', false);
        });
    },
};

export const mutations = {
}

const getters = {
}

export default {
    namespaced,
    state,
    actions,
    mutations,
    getters
};