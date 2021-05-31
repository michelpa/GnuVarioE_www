import { waitFor, baseUrl } from '../lib/helperStore.js'
import { getCodeVerifier, getCodeChallenge } from '../lib/helperDropbox.js'

const env = process.env;

const CLIENT_ID = "lkrmoeyxln6p2tl";

const initialState = {
    codeVerifier: false,
    challenge: false
};

const namespaced = true;

const state = Object.assign({}, initialState);

const actions = {
    getAuthUrl(context) {
        if (!context.state.codeVerifier || !context.state.challenge) {
            const verifier = getCodeVerifier();
            const challenge = getCodeChallenge(verifier);
            context.commit('setCodes', { verifier: verifier, challenge: challenge });
        }

        let dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
        var authUrl = dbx.auth.getAuthenticationUrl(null, null, 'code');
        var url = new URL(authUrl);
        url.searchParams.append('code_challenge', context.state.challenge);
        url.searchParams.append('code_challenge_method', 'S256');

        return url;
    },
    getDropboxToken(context, { dropboxCode }) {
        if (dropboxCode) {
            var config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            let formData = new FormData();
            formData.append("code", dropboxCode);
            formData.append("grant_type", "authorization_code");
            formData.append("code_verifier", context.state.codeVerifier);
            formData.append("client_id", CLIENT_ID);
            return axios
                .post("https://api.dropbox.com/oauth2/token", formData, config)
                .then((response) => {
                    return response.data;
                });
        }
    },
    uploadToDropbox: function (context, { filename, type }) {
        let url = '';
        switch (type) {
            case 'DB':
                url = "/file?path=/db/";
                break;
            case 'VOL':
                url = "/file?path=/vols/";
                break;
            case 'VOLPARSED':
                url = "/file?path=/vols/parsed/";

                break;
            default:
                return;
        }

        url = url + filename;

        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

        if (!context.rootGetters.dropboxpref.token || !context.rootGetters.dropboxpref.enable) {
            alert('Dropbox account misconfigured')
            return;
        }

        return waitFor(function () {
            return context.rootState.loading.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            let axiosConfig = { responseType: 'blob' }
            return axios.get(url, axiosConfig).then(response => {
                let blob = new Blob([response.data]);

                context.dispatch("uploadFileToDBox", { filename: filename, content: blob, type: type }).then(
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
    },
    uploadFileToDBox: function (context, { filename, content, type }) {
        let dbx = new Dropbox.Dropbox({ accessToken: context.rootGetters.dropboxpref.token });
        let path = '';
        switch (type) {
            case 'DB':
                path = "/db/";
                break;
            case 'VOL':
                path = "/vols/";
                break;
            case 'VOLPARSED':
                path = "/vols/parsed/";
                break;
            default:
                return;

        }

        dbx.filesUpload({ path: path + filename, contents: content })
            // eslint-disable-next-line
            .then(function (response) {
                // console.log(response);
            })
            // eslint-disable-next-line
            .catch(function (error) {
                // console.error(error);
            });
    },
};

const mutations = {
    setCodes: function (state, { verifier, challenge }) {
        state.codeVerifier = verifier;
        state.challenge = challenge;
    },
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