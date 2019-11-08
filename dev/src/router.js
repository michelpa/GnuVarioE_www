// import Vue from 'vue'
// import Router from 'vue-router'
import Home from './components/Home.vue'
import About from './components/About.vue'
import MesVols from './components/MesVols.vue'
import Configuration from './components/Configuration.vue'
import ScreenConfigurator from './components/ScreenConfigurator.vue'
import SD from './components/SD.vue'
import OTA from './components/OTA.vue'

//Vue.use(Router)

// eslint-disable-next-line no-undef
export default new VueRouter({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    }, {
      path: '/',
      name: 'mesvols',
      component: MesVols
    }, {
      path: '/about',
      name: 'about',
      component: About
    }, {
      path: '/sd',
      name: 'sd',
      component: SD
    }, {
      path: '/config',
      name: 'config',
      component: Configuration
    }, {
      path: '/config/screen',
      name: 'screen',
      component: ScreenConfigurator
    },
    {
      path: '/ota',
      name: 'ota',
      component: OTA
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
