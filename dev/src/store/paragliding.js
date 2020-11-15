import { waitFor, baseUrl } from '../lib/helperStore.js'

const env = process.env;


const initialState = {};



export const state = Object.assign({}, initialState);

export const actions = {
    uploadIgcToParagliding: function (context, { filename, parsed }) {
        let pg = context.rootState.configweb.configWeb.paraglidinglogbook;
        if (pg.enable && pg.login != '' && pg.password != '') {
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
                    let blob = new Blob([response.data]);
                    let formData = new FormData();
                    formData.append('userfile', blob);
                    formData.append('email', pg.login);
                    formData.append('pass', pg.password);
                    formData.append('MAX_FILE_SIZE', '5000000');

                    context.dispatch("uploadFileToP", formData).then(
                        // eslint-disable-next-line
                        (response) => {
                        },
                        // eslint-disable-next-line
                        (error) => {
                            console.log(error);
                        }
                    );
                    return response;
                }).catch(function (error) {
                    return Promise.reject(error);
                }).finally(function () {
                    context.commit('setLoadingState', false);
                });
            });
        }
    },
    uploadFileToP: function (context, formData) {
        let url = "https://paraglidinglogbook.com/gnuvario.php";
        // if (env.NODE_ENV == "development") {
        //     url = baseUrl + "/upload";
        // }
        // context.commit('setUploadpct', 0);
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);

            var config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                // onUploadProgress: function (progressEvent) {
                //     let pct = Math.round(
                //         (progressEvent.loaded * 100) / progressEvent.total
                //     );
                //     context.commit('setUploadpct', pct);
                // }
            };

            // eslint-disable-next-line no-unused-vars
            return axios.post(url, formData, config).then(response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                // context.commit('setUploadpct', 0);
                context.commit('setLoadingState', false);
            });
        });
    },
};

export const mutations = {}

const getters = {}

export default {
    state,
    actions,
    mutations,
    getters
};