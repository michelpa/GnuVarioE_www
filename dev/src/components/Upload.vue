<template>
  <div>
    <b-modal
      id="modal-upload"
      @cancel="doCancel"
      @ok="doUpload"
      @hidden="doHidden"
      ref="modal"
    >
      <template v-slot:modal-title>Upload vers "{{ uploadPath }}"</template>
      <div
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @drop="onDrop"
        class="dropzone"
        :class="[drag ? 'bg-info' : 'dropzoneout', 'dropzone']"
      >
        <div
          v-if="!drag"
          style="
            display: table-cell;
            vertical-align: middle;
            text-align: center;
          "
        >
          <div v-if="files.length == 0">
            <span class="alert alert-info"
              >Déposer les fichiers à uploader ici</span
            >
          </div>
          <b-progress
            v-show="uploading"
            :value="uploadPct"
            :max="100"
            show-progress
            animated
          ></b-progress>
          <b-list-group v-if="files.length > 0">
            <b-list-group-item v-for="file in files" :key="file.name">
              {{ file.name }}
              <button
                @click="removeFile(file)"
                title="Remove"
                class="btn btn-sm btn-danger"
              >
                <i class="fa fa-trash-alt"></i>
              </button>
              <br />
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="clearfix"></div>
      </div>
      <p><br><em>Ou utiliser le bouton ci dessous:</em></p>
      <b-form-file v-model="files" class="mt-3" multiple plain></b-form-file>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "UPLOAD",
  props: {
    show: { type: Boolean, default: false },
    uploadPath: { type: String },
  },
  data: function () {
    return {
      files: [],
      drag: false,
      percentCompleted: 0,
      uploading: false,
      nbEncoursUpload: 0,
    };
  },
  watch: {
    show: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.showModal();
      }
    },
  },
  computed: {
    ...mapGetters(["uploadPct"]),
  },
  methods: {
    showModal: function () {
      this.$bvModal.show("modal-upload");
    },
    endOneFileUpload: function () {
      this.nbEncoursUpload--;
      if (this.nbEncoursUpload == 0) {
        this.uploading = false;
        store.dispatch("loadSDFiles", this.uploadPath);
        this.$nextTick(() => {
          this.$refs.modal.hide();
        });
      }
    },
    doUpload: function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      let self = this;
      this.nbEncoursUpload = 0;
      // eslint-disable-next-line no-unused-vars
      this.files.forEach((f, x) => {
        this.nbEncoursUpload++;
        let filenameWithPath = self.uploadPath + f.name;
        let formData = new FormData();
        formData.append("data", f, filenameWithPath);
        this.uploading = true;

        window.setTimeout(function () {
          store.dispatch("uploadFile", formData).then(
            // eslint-disable-next-line
            (response) => {
              self.removeFile(f);
              self.endOneFileUpload();
              self.$bvToast.toast(
                `Le fichier ${f.name} a été correctement téléchargée sur le vario.`,
                {
                  title: "SD",
                  toaster: "b-toaster-top-right",
                  solid: true,
                  variant: "success",
                }
              );
            },
            // eslint-disable-next-line
            (error) => {
              console.log(error);
              self.removeFile(f);
              self.endOneFileUpload();
              self.$bvToast.toast(
                `Echec du téléchargement du fichier  ${f.name}.`,
                {
                  title: "SD",
                  toaster: "b-toaster-top-right",
                  solid: true,
                  variant: "danger",
                }
              );
            }
          );
        }, 100);
      });
    },
    doCancel: function () {
      this.files = [];
    },
    doHidden: function () {
      this.files = [];
      this.$emit("uploadClosed");
    },
    onDragLeave: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.drag = false;
    },
    onDragOver: function (e) {
      e.preventDefault();
      this.drag = true;
    },
    onDrop: function (e) {
      // This prevents browser's default behaviour to render dropped item itself
      e.preventDefault();
      this.drag = false;
      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) return;
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      [...droppedFiles].forEach((f) => {
        this.files.push(f);
      });
    },
    removeFile(file) {
      this.files = this.files.filter((f) => {
        return f != file;
      });
    },
  },
};
</script>

<style scoped>
.dropzone {
  width: 100%;
  height: 150px;
  display: table;
}
.dropzoneout {
  background-color: #ccc;
}
</style>