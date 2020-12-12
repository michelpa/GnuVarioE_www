<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h1>{{ $t("about.ABOUT") }}</h1>
        <section class="jumbotron text-center">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <p class="lead text-muted">
                  <!-- The open source and open hardware variometer.
                  <br />-->
                  <em class="small" v-if="firmwareVersion">
                    {{ $t("about.CURRENT") }}: {{ versionFull }}
                    <br />
                    Type: {{ firmwareVersion.Firmware.type }}
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="offset-md-1 col-md-2">
        <transition name="fadeRightBig">
          <div
            class="img-fluid mx-auto d-block animated bounceInDown"
            v-html="logo"
          ></div>
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
              <p>{{ $t("about.CONTRIBUTOR") }}</p>
              <b-list-group>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">JeromeV</span>&nbsp;
                  <em class="small">- {{ $t("global.DEVELOPPER") }} (AGL)</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">jpg63</span>&nbsp;
                  <em class="small">- {{ $t("global.DEVELOPPER") }}</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">pixyz</span>&nbsp;
                  <em class="small">- {{ $t("global.DEVELOPPER") }} web / {{ $t("global.DEVELOPPER") }}</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">prunkdump</span>&nbsp;
                  <em class="small">- {{ $t("global.DEVELOPPER") }}</em>
                </b-list-group-item>
                <b-list-group-item variant="dark">
                  <span class="text-monospace">ratamuse</span>&nbsp;
                  <em class="small">- PCB / {{ $t("global.DEVELOPPER") }}</em>
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
          <div
            class="img-fluid mx-auto d-block animated bounceInDown"
            v-html="logo"
          ></div>
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
    msg: String,
  },
  data: function () {
    return {
      logo: logo,
    };
  },
  methods: {},
  computed: {
    ...mapGetters(["config", "firmwareVersion"]),
    versionFull: function () {
      let v = "";
      if (this.firmwareVersion && this.firmwareVersion.Firmware) {
        v =
          this.firmwareVersion.Firmware.version +
          "." +
          this.firmwareVersion.Firmware.subversion +
          (this.firmwareVersion.Firmware.betaversion > 0
            ? "b" + this.firmwareVersion.Firmware.betaversion
            : "");
      }
      return v;
    },
  },
  mounted: function () {
    store.dispatch("loadFirmwareVersion");
  },
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
