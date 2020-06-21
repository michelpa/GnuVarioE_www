import { waitFor, baseUrl, triFichiers, updateTreeContent } from '../lib/helperStore.js'

const env = process.env;

const initialState = {
    fileslistLoaded: false,
    fileslist: false,
    uploadPct: 0,
};

export const state = Object.assign({}, initialState);

export const actions = {
    loadSDFiles: function (context, path) {
        let url = "/list";
        if (path) {
            console.log(path);
            if (path.length > 1 && path.slice(-1) == "/") {
                path = path.slice(0, -1);
            }
            url = url + "?dir=" + path + "&norecursive=true";
        }
        if (env.NODE_ENV == "development") {
            //url = "config/tree.jso";
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
                let tree = response.data;
                triFichiers(tree);
                context.commit('setFiles', { fileslist: tree, path: path });
                // eslint-disable-next-line no-unused-vars
            }).catch(function (error) {
                return Promise.reject(error);
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
    uploadFile: function (context, formData) {
        let url = "/upload";
        if (env.NODE_ENV == "development") {
            url = baseUrl + "/upload";
        }
        context.commit('setUploadpct', 0);
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
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
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setUploadpct', 0);
                context.commit('setLoadingState', false);
            });
        });
    },
    deleteFile: function (context, filename) {
        let url = encodeURI("/file?path=" + filename);
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
    createFolder: function (context, filename) {
        let url = encodeURI("/create?path=" + filename);
        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line no-unused-vars
            return axios.put(url, axiosConfig).then(response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },

}

export const mutations = {
    setFiles: function (state, { fileslist, path }) {
        if (state.fileslist) {
            //on doit juste remplacer un morceau de l'arbre
            var newTree = {};
            let dirs = path.split('/').filter(function (el) {
                return el != "";
            });
            dirs.unshift('/');
            var subPart = state.fileslist[0];
            newTree = subPart;
            updateTreeContent(newTree, dirs, fileslist);
        } else {
            state.fileslist = Object.assign({}, state.fileslist, fileslist);
        }

        state.fileslistLoaded = true;
    },
    setUploadpct: function (state, pct) {
        state.uploadPct = pct;
    },
}

const getters = {
    fileslist(state) {
        return state.fileslistLoaded ? state.fileslist : false;
    },
    uploadPct(state) {
        return state.uploadPct;
    },
}

export default {
    state,
    actions,
    mutations,
    getters
};