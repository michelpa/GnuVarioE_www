<template>
  <div class="row">
    <div class="col-md-12">
      <br />
      <b-card :header="$t('sd.SD_CONTENT')" header-tag="header">
        <div class="bg-default">
          <div class="tree">
            <ul class="mb-1 pl-3 pb-2">
              <tree-item
                v-for="t in fileslist"
                :key="t.key"
                class="item"
                :item="t"
                path
                v-on:uploadAsked="askUpload"
                v-on:createAsked="askCreateFolder"
              ></tree-item>
            </ul>
          </div>
        </div>
      </b-card>
      <upload
        :show="showUpload"
        :uploadPath="uploadPath"
        @uploadClosed="showUpload = false"
      ></upload>
      <create
        :show="showCreate"
        :createPath="createPath"
        @createClosed="showCreate = false"
      ></create>
    </div>
  </div>
</template>

<script>
import TreeItem from "./TreeItem";
import Upload from "./Upload";
import Create from "./Create";
import { mapGetters } from "vuex";

export default {
  name: "SD",
  components: { TreeItem, Upload, Create },
  props: {},
  data: function () {
    return {
      showUpload: false,
      uploadPath: "",
      showCreate: false,
      createPath: "",
    };
  },
  methods: {
    guid() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },
    askUpload(path) {
      this.uploadPath = path;
      this.showUpload = true;
    },
    askCreateFolder(path) {
      this.createPath = path;
      this.showCreate = true;
    },
  },
  computed: {
    ...mapGetters(["fileslist", "isLoading"]),
    treeWithKey: function () {
      return this.fileslist.map((t) => {
        return { t, key: this.guid() };
      });
    },
  },
  mounted: function () {
    this.$store.dispatch("loadSDFiles", "/");
  },
};
</script>

<style scoped>
.tree {
  text-align: left;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tree ul {
  margin-left: 0 0 0 1em;
  position: relative;
  padding: 0;
  list-style: none;
}
</style>
