<template>
  <div class="row">
    <div class="offset-md-3 col-md-6">
      <br />
      <b-card header="Mise à jour OTA" header-tag="header">
        <div class="bg-default">
          <b-form @submit="onSubmitFirmware" @reset="onResetFirmware">
            <b-form-group
              id="input-group-firmware"
              label-cols-sm="12"
              label="Veuillez sélectionner le fichier du firmware à envoyer sur le vario:"
              label-for="input-firmware"
              description="Habituellement, il s'agit d'un fichier au format .bin"
            >
              <b-form-file id="input-firmware" v-model="file" :state="Boolean(file)" plain></b-form-file>
              <b-form-invalid-feedback
                id="input-file-feedback"
                v-show="error"
              >Vous devez sélectionner un fichier...</b-form-invalid-feedback>
              <br />
              <b-progress
                v-show="uploading"
                :value="percentCompleted"
                :max="100"
                show-progress
                animated
              ></b-progress>
            </b-form-group>

            <b-button variant="primary" type="submit">Envoyer</b-button>
          </b-form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "OTA",
  props: {
    msg: String
  },
  data: function() {
    return {
      file: null,
      percentCompleted: 0,
      uploading: false,
      error: false
    };
  },

  methods: {
    onSubmitFirmware: function() {
      if (!this.file) {
        this.error = true;
        return;
      }
      this.error = false;

      let formData = new FormData();
      formData.append("data", this.file, "update.bin");

      let self = this;
      var config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: function(progressEvent) {
          self.percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      };

      this.uploading = true;

      axios
        .post("/fupdate", formData, config)
        .then(function() {
          self.uploading = false;
          self.$bvToast.toast(
            `Le fichier a été correctement téléchargée sur le vario. Il va maintenant être redémarré pour terminer la mise à jour`,
            {
              title: "Mise à jour OTA",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "success"
            }
          );
        })
        .catch(function() {
          self.uploading = false;
          self.$bvToast.toast(
            `Echec du téléchargement du fichier, la mise à jour est abandonnée.`,
            {
              title: "Mise à jour OTA",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger"
            }
          );
        });
      return;
    },
    onResetFirmware: function() {
      this.file = null;
      return;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#input-firmware {
  margin: auto;
  width: auto;
}
</style>
