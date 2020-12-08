//import Vue from 'vue'
import store from "./store"
import App from './App.vue'

// import BootstrapVue from 'bootstrap-vue'

// import { ButtonPlugin, FormPlugin, FormFilePlugin, FormInputPlugin, NavbarPlugin, LinkPlugin, CardPlugin, ListGroupPlugin, FormGroupPlugin, ProgressPlugin, TablePlugin } from 'bootstrap-vue'
// import VueI18n from 'vue-i18n'
import router from './router'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faFolder, faFolderOpen, faFile, faTrashAlt, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './css/commun.scss'
import './css/custom.scss'
// import BootstrapVue from 'bootstrap-vue'

// library.add(faFolder, faFolderOpen, faFile, faTrashAlt, faArrowAltCircleDown)

// Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue.use(VueI18n)
// Vue.use(BootstrapVue)

// eslint-disable-next-line no-undef
Vue.component('click-confirm', clickConfirm.component);
Vue.component('apexchart', VueApexCharts)
Vue.component('vue-color', VueColor)


// eslint-disable-next-line no-undef
Vue.use(vueMoment, {
  moment
});

import { languages, defaultLocale } from './translation/index.js'

const messages = Object.assign(languages)

// eslint-disable-next-line no-undef
var i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages
})

Vue.config.productionTip = false

Vue.filter('pluralize', (word, amount) => (amount > 1 || amount === 0) ? `${word}s` : word)

Vue.filter('secondstohms', function (second) {
  return new Date(second * 1000).toISOString().substr(11, 8);
})

Vue.filter('nl2br', function (str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
})

Vue.filter('string2classname', function (name) {
  return name.replace(/[^a-z0-9]/g, function (s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

