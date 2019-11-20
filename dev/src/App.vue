<template>
  <div id="monapp">
    <div class="container-fluid">
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">
          <a class="navbar-brand mr-auto" href="#">
            <div class="logo" id="my-logo" v-html="monlogo"></div>
          </a>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              :to="{ name: 'mesvols'}"
              exact
              active-class="active"
            >{{ $t('menu.FLIGHTS') }}</b-nav-item>
            <b-nav-item :to="{ name: 'sd'}" active-class="active">{{ $t('menu.SD') }}</b-nav-item>
            <b-nav-item :to="{ name: 'wifi'}" active-class="active">{{ $t('menu.WIFI') }}</b-nav-item>
            <b-nav-item :to="{ name: 'config'}" active-class="active">{{ $t('menu.CONFIG') }}</b-nav-item>
            <b-nav-item :to="{ name: 'ota'}" active-class="active">{{ $t('menu.MAJ') }}</b-nav-item>
            <b-nav-item :to="{ name: 'about'}" active-class="active">{{ $t('menu.ABOUT') }}</b-nav-item>
            <!-- <b-nav-item :to="{ name: 'home'}" active-class="active">Home</b-nav-item> -->
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-text>
              <span class="env">
                <em>{{ env.NODE_ENV }}</em>
              </span>
            </b-nav-text>
            <b-nav-item-dropdown :text="$i18n.locale" right>
              <b-dropdown-item @click="changeLocale('fr')">FR</b-dropdown-item>
              <b-dropdown-item @click="changeLocale('en')">EN</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <div class="wait" v-show="isLoading">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <!-- component matched by the route will render here -->
      <router-view :class="{ 'loading': isLoading }"></router-view>
    </div>
    <footer class="footer fixed-bottom">
      <div class="container">
        <span class="text-muted">GNUVario : The open source and open hardware variometer</span>
      </div>
    </footer>
  </div>
</template>


<script>
import store from "@/store";
import { logo } from "@/lib/logo";
import { mapGetters } from "vuex";
export default {
  name: "App",

  data: function() {
    return {
      monlogo: logo,
      env: process.env
    };
  },
  computed: {
    ...mapGetters(["isLoading"])
  },
  methods: {
    changeLocale: function(l) {
      this.$i18n.locale = l;
    }
  },
  created: function() {
    window.setTimeout(function() {
      Promise.all([store.dispatch("loadConfig")]).then(() => {
        //next();
      });
    }, 100);
  }
};
</script>


<style>
#monapp {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  margin-top: 60px;
  padding-bottom: 50px;
}
#nav-collapse {
  margin-left: 120px;
}
#my-logo {
  position: absolute;
  z-index: 1;
  left: 20px;
  top: -31px;
  height: 100px;
}
#my-logo svg {
  height: 100px;
}

.footer {
  height: 50px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
  background-color: #f5f5f5;
  text-align: center;
}
.loading {
  opacity: 0.6;
  transition: opacity 1s ease-in-out;
}
.wait {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1000;
}
.env {
  font-size: 0.9em;
  opacity: 0.5;
  padding-right: 15px;
}
</style>

