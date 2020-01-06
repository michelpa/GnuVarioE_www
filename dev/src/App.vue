<template>
  <div id="monapp">
    <div class="container-fluid">
      <b-navbar toggleable="lg" :type="type" :variant="variant">
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
            <!-- 
            <b-nav-item @click="showTheme=true">Thème</b-nav-item>
             -->
             
            <b-nav-item-dropdown :text="$i18n.locale" right>
              <b-dropdown-item @click="changeLocale('fr')">FR</b-dropdown-item>
              <b-dropdown-item @click="changeLocale('en')">EN</b-dropdown-item>
            </b-nav-item-dropdown>
            <!--
            <b-nav-item-dropdown :text="'Thème : ' + themeHelper.theme" right>
              <b-dropdown-item
                v-for="(href, name) of themes"
                @click="changeTheme(name)"
                :key="name"
              >{{ name }}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown :text="'Variant: ' + variant" right>
              <b-dropdown-item v-for="v in tabVariant" @click="changeVariant(v)" :key="v">{{ v }}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown :text="'Type: ' + type" right>
              <b-dropdown-item v-for="v in tabType" @click="changeType(v)" :key="v">{{ v }}</b-dropdown-item>
            </b-nav-item-dropdown>
             -->
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <!-- 
      <theme :show="showTheme" @themeClosed="showTheme=false"></theme>
       -->
      <div class="wait" v-show="isLoading">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <!-- component matched by the route will render here -->
      <router-view :class="{ 'loading': isLoading }"></router-view>
    </div>

    <!-- <span>Selected: {{ themeHelper.theme }}</span> -->
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
import { ThemeHelper } from "@/lib/themeHelper";
import Theme from "./components/Theme";
export default {
  name: "App",
  components: { Theme },
  data: function() {
    return {
      monlogo: logo,
      env: process.env,
      tabVariant: [
        "primary",
        "success",
        "info",
        "warning",
        "danger",
        "dark",
        "light"
      ],
      tabType: ["light", "dark"],
      variant: "info",
      type: "dark",
      showTheme: false,
      themes: {
        Default:
          "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
        Cerulean:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/cerulean/bootstrap.min.css",
        Cosmo:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/cosmo/bootstrap.min.css",
        Cyborg:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/cyborg/bootstrap.min.css",
        Darkly:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/darkly/bootstrap.min.css",
        Flaty:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/flatly/bootstrap.min.css",
        Journal:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/journal/bootstrap.min.css",
        Litera:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/litera/bootstrap.min.css",
        Lumen:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/lumen/bootstrap.min.css",
        LUX:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/lux/bootstrap.min.css",
        Materia:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/materia/bootstrap.min.css",
        Minty:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/minty/bootstrap.min.css",
        Pulse:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/pulse/bootstrap.min.css",
        Sandstone:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/sandstone/bootstrap.min.css",
        Simplex:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/simplex/bootstrap.min.css",
        Sketchy:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/sketchy/bootstrap.min.css",
        Slate:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/slate/bootstrap.min.css",
        Solar:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/solar/bootstrap.min.css",
        Spacelab:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/spacelab/bootstrap.min.css",
        Supehero:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/superhero/bootstrap.min.css",
        United:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/united/bootstrap.min.css",
        Yeti:
          "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/yeti/bootstrap.min.css"
      },
      themeHelper: new ThemeHelper()
    };
  },
  computed: {
    ...mapGetters(["isLoading"])
  },
  methods: {
    changeLocale: function(l) {
      this.$i18n.locale = l;
    },
    changeTheme: function(name) {
      this.themeHelper.theme = name;
    },
    changeVariant: function(v) {
      this.variant = v;
    },
    changeType: function(t) {
      this.type = t;
    }
  },
  created: function() {
    window.setTimeout(function() {
      Promise.all([store.dispatch("loadConfig")]).then(() => {
        //next();
      });
    }, 100);
    let added = Object.keys(this.themes).map(name => {
      return this.themeHelper.add(name, this.themes[name]);
    });

    Promise.all(added).then(sheets => {
      this.loading = false;
      this.themeHelper.theme = "Default";
    });
  }
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

