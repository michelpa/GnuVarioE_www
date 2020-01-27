<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h1>A propos</h1>
        <section class="jumbotron text-center">
          <div class="container">
            <!-- <h1 class="jumbotron-heading text-info">GNU Vario</h1> -->
            <p class="lead text-muted">
              <!-- The open source and open hardware variometer.
              <br />-->

              <em class="small" v-if="firmwareVersion">
                Type {{ firmwareVersion.Firmware.type }}
                <br />
                Version: {{ firmwareVersion.Firmware.version + '.' + firmwareVersion.Firmware.subversion }} + '.' + firmwareVersion.Firmware.betaversion }}
              </em>
            </p>
            <!-- <p>{{ $t('home.hello') }}</p> -->
          </div>
        </section>
      </div>
      <div class="offset-md-1 col-md-2">
        <transition name="fadeRightBig">
          <div class="img-fluid mx-auto d-block animated bounceInDown" v-html="logo"></div>
        </transition>
      </div>
      <div class="col-md-6">
        <div class="zone">
          <b-card
            title="The open source and open hardware variometer."
            header-tag="header"
            footer-tag="footer"
            bg-variant="dark"
            text-variant="white"
          >
            <template v-slot:header>
              <h6 class="mb-0">GNU Vario</h6>
            </template>
            <b-card-text>
              <p>Contributeurs principaux par ordre alphabétique</p>
              <b-list-group>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">jpg63</span>
                  <em class="small">- Développeur</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">pixyz</span>
                  <em class="small">- Développeur web</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">prunkdump</span>
                  <em class="small">- Développeur</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">ratamuse</span>
                  <em class="small">- PCB / Développeur</em>
                </b-list-group-item>
              </b-list-group>
            </b-card-text>
            <!-- 
            <template v-slot:footer>
              <em>Footer Slot</em>
            </template>
            -->
          </b-card>
        </div>
      </div>
      <div class="col-md-2">
        <transition name="fadeRightBig">
          <div class="img-fluid mx-auto d-block animated bounceInDown" v-html="logo"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { logo } from "@/lib/logo";
import store from "@/store";
export default {
  name: "About",
  props: {
    msg: String
  },
  data: function() {
    return {
      logo: logo
    };
  },
  computed: {
    ...mapGetters(["config", "firmwareVersion"]),
    versionFull: function() {
      let v = "";
      if (this.firmwareVersion) {
        v =
          this.firmwareVersion.Firmware.version +
          "." +
          this.firmwareVersion.Firmware.subversion;
        if (this.firmwareVersion.Firmware.betaversion > 0) {
          v = v + "b";
        }
      }
      return v;
    }
  },
  mounted: function() {
    store.dispatch("loadFirmwareVersion");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
  width: 120px;
}
.zone {
  padding: 15px;
}
</style>
