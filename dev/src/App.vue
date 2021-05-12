<template>
  <div id="monapp">
    <div class="container-fluid">
      <b-navbar toggleable="lg" :type="themeType" :variant="themeVariant">
        <b-navbar-brand href="#">
          <a class="navbar-brand mr-auto" href="#">
            <div class="logo" id="my-logo" v-html="monlogo"></div>
          </a>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :to="{ name: 'mesvols' }" exact active-class="active">{{
              $t("menu.FLIGHTS")
            }}</b-nav-item>
            <b-nav-item :to="{ name: 'sd' }" active-class="active">{{
              $t("menu.SD")
            }}</b-nav-item>
            <b-nav-item :to="{ name: 'wifi' }" active-class="active">{{
              $t("menu.WIFI")
            }}</b-nav-item>
            <b-nav-item :to="{ name: 'config' }" active-class="active">{{
              $t("menu.CONFIG")
            }}</b-nav-item>
            <b-nav-item :to="{ name: 'ota' }" active-class="active">{{
              $t("menu.MAJ")
            }}</b-nav-item>
            <b-nav-item :to="{ name: 'about' }" active-class="active">{{
              $t("menu.ABOUT")
            }}</b-nav-item>

            <!-- <b-nav-item :to="{ name: 'home'}" active-class="active">Home</b-nav-item> -->
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-text>
              <span class="env">
                <em>{{ env.NODE_ENV }}</em>
              </span>
            </b-nav-text>
            <b-nav-item @click="saveDBtoDropbox" v-if="isdropboxenabled">
              <i class="fa fa-cog"></i>
              {{ $t("menu.SAVEDB") }}
            </b-nav-item>
            <b-nav-item @click="showPopupPref = true">
              <i class="fa fa-cog"></i>
              {{ $t("menu.SETTINGS") }}
            </b-nav-item>
            <b-nav-text>
              <span class="text-secondary">
                <i id="app-version" class="fa fa-info-circle"> </i>
                <b-tooltip target="app-version">
                  {{ $t("menu.WEBAPPVERSION") }}<br />
                  <strong>{{ env.VUE_APP_VERSION }}</strong>
                </b-tooltip>
              </span>
            </b-nav-text>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <pref
        :show="showPopupPref"
        @themeClosed="showPopupPref = false"
        :themeHelper="themeHelper"
      ></pref>
      <div class="wait" v-show="isLoading">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div :key="lang">
        <!-- component matched by the route will render here -->
        <router-view :class="{ loading: isLoading }"></router-view>
      </div>
    </div>

    <!-- <span>Selected: {{ themeHelper.theme }}</span> -->
    <footer class="footer fixed-bottom">
      <div class="container">
        <span class="text-muted"
          >GNUVario : The open source and open hardware variometer</span
        >
      </div>
    </footer>
  </div>
</template>


<script>
import store from "@/store";
import { logo } from "@/lib/logo";
import { mapGetters } from "vuex";
import { ThemeHelper } from "@/lib/themeHelper";
import Pref from "./components/Pref";
export default {
  name: "App",
  components: { Pref },
  data: function () {
    return {
      monlogo: logo,
      env: process.env,
      variant: "info",
      type: "dark",
      showPopupPref: false,
      themeHelper: new ThemeHelper(),
    };
  },
  computed: {
    ...mapGetters([
      "isLoading",
      "themeName",
      "themeVariant",
      "themeType",
      "lang",
      "dropboxpref",
      "isdropboxenabled",
    ]),

    // language: function () {
    //   return this.lang;
    // },
  },
  methods: {
    changeLocale: function (locale) {
      store.commit("updateConfigWeb", {
        property: "language",
        with: locale,
      });
    },
    saveDBtoDropbox: function () {
      store
        .dispatch("uploadToDropbox", { filename: "vol.db", type: "DB" })
        .then(
          // eslint-disable-next-line no-unused-vars
          (response) => {},
          // eslint-disable-next-line
          (error) => {}
        );
    },
  },
  watch: {
    themeName: function (newtheme, oldtheme) {
      if (newtheme != oldtheme) {
        // eslint-disable-next-line no-unused-vars
        let added = this.themeHelper.addNewTheme(newtheme).then((sheets) => {
          this.loading = false;
          this.themeHelper.theme = newtheme;
        });
      }
    },
    lang: function (newValue, oldValue) {
      if (oldValue != newValue) {
        this.$i18n.locale = newValue;
        this.$moment.locale(newValue);
        // moment.locale(newValue);
      }
    },
  },
  mounted: function () {
    // eslint-disable-next-line no-unused-vars
    let added = this.themeHelper.addNewTheme(this.themeName).then((sheets) => {
      this.loading = false;
      this.themeHelper.theme = this.themeName;
    });
  },
  created: function () {
    window.setTimeout(function () {
      Promise.all([store.dispatch("loadConfig")]).then(() => {
        //next();
      });
    }, 100);
    window.setTimeout(function () {
      Promise.all([store.dispatch("loadConfigWeb")]).then(() => {
        //next();
      });
    }, 300);
  },
};
</script>


<style>
#monapp {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
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

