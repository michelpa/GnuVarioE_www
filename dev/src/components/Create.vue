<template>
  <div>
    <b-modal id="modal-create" @cancel="doCancel" @ok="doCreate" @hidden="doHidden" ref="modal">
      <template v-slot:modal-title>Création d'un répertoire dans "{{createPath}}"</template>
      <b-form-input v-model="folderName" placeholder="Entrer le nom du répertoire"></b-form-input>
      <div class="clearfix"></div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "Create",
  props: {
    show: { type: Boolean, default: false },
    createPath: { type: String }
  },
  data: function() {
    return { folderName: "" };
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    showModal: function() {
      this.$bvModal.show("modal-create");
    },

    doCreate: function(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      const newPath = this.createPath + this.folderName;
      var self = this;
      store.dispatch("createFolder", newPath).then(
        // eslint-disable-next-line
        response => {
          self.$bvToast.toast(
            `Le répertoire  ${self.folderName} a été correctement créée sur le vario.`,
            {
              title: "SD",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "success"
            }
          );
          store.dispatch("loadSDFiles", self.createPath);
          self.$bvModal.hide("modal-create");
        },
        // eslint-disable-next-line
        error => {
          self.$bvToast.toast(
            `Echec de création du répertoire ${self.folderName}.`,
            {
              title: "SD",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger"
            }
          );
        }
      );
    },
    doCancel: function() {
      this.folderName = "";
    },
    doHidden: function() {
      this.folderName = "";
      this.$emit("createClosed");
    }
  }
};
</script>

<style scoped>
</style>