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

import { languages } from './translation/index.js'
import { defaultLocale } from './translation/index.js'
require('./lib/momentfr.js');

const messages = Object.assign(languages)

// eslint-disable-next-line no-undef
var i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages
})

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
