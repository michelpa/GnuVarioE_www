<template>
  <div>
    <b-modal
      id="modal-theme"
      @cancel="doCancel"
      @ok="doSave"
      @hidden="doHidden"
      ref="modal"
      title="Thèmes"
    >
      <div>
        <b-form @submit.prevent>
          <b-form-group id="input-group-1" label="Thème:" label-for="input-2">
            <b-form-select v-model="themeSelected" :options="themesLibs"></b-form-select>
          </b-form-group>
          <b-form-group id="input-group-2" label="Variant:" label-for="input-2">
            <b-form-select v-model="variantSelected" :options="tabVariant"></b-form-select>
          </b-form-group>
          <b-form-group id="input-group-3" label="Type:" label-for="input-2">
            <b-form-select v-model="typeSelected" :options="tabType"></b-form-select>
          </b-form-group>
        </b-form>
        <div class="clearfix"></div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "Theme",
  props: {
    show: { type: Boolean, default: false }
  },
  data: function() {
    return {
      themeSelected: "",
      variantSelected: "",
      typeSelected: "",
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
      }
    };
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    }
  },
  computed: {
    themesLibs: function() {
      return Object.keys(this.themes);
    }
  },
  methods: {
    changeTheme: function(name) {
      this.themeSelected = name;
    },
    changeVariant: function(v) {
      this.variantSelected = v;
    },
    changeType: function(t) {
      this.typeSelected = t;
    },
    showModal: function() {
      this.$bvModal.show("modal-theme");
    },
    doSave: function(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      let self = this;

      //   store.dispatch("uploadFile", formData).then(
      //     // eslint-disable-next-line
      //     response => {
      //       self.removeFile(f);
      //       self.endOneFileUpload();
      //       self.$bvToast.toast(
      //         `Le fichier ${f.name} a été correctement téléchargée sur le vario.`,
      //         {
      //           title: "SD",
      //           toaster: "b-toaster-top-right",
      //           solid: true,
      //           variant: "success"
      //         }
      //       );
      //     },
      //     // eslint-disable-next-line
      //     error => {
      //       self.removeFile(f);
      //       self.endOneFileUpload();
      //       self.$bvToast.toast(
      //         `Echec du téléchargement du fichier  ${f.name}.`,
      //         {
      //           title: "SD",
      //           toaster: "b-toaster-top-right",
      //           solid: true,
      //           variant: "danger"
      //         }
      //       );
      //     }
      //   );
    },
    doCancel: function() {},
    doHidden: function() {
      this.$emit("themeClosed");
    }
  }
};
</script>

<style scoped>
</style>