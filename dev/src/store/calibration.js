import { waitFor, baseUrl } from '../lib/helperStore.js'

const env = process.env;



const initialState = {

};

export const state = Object.assign({}, initialState);

export const actions = {
    uploadToCalibration: function (context) {
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
                    // eslint-disable-next-line
                    (error) => {
                        error.custommsg = 'cannot upload to remote server'
                        return Promise.reject(error);
                    }
                );
                // eslint-disable-next-line
            }).catch(function (error) {
                error.custommsg = 'no RECORD00.CAL'
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
                return context.dispatch("uploadFile", formData).then(response => {
                    context.dispatch("loadSDFiles", '/').then(response => {
                        return response;
                    });
                });
            }
        }).catch(function (error) {
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
    state,
    actions,
    mutations,
    getters
};