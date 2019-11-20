<template>
  <div class="row">
    <div class="col-md-12">
      <br />
      <b-card :header="$t('sd.SD_CONTENT')" header-tag="header">
        <div class="bg-default">
          <div class="tree">
            <ul class="mb-1 pl-3 pb-2">
              <tree-item v-for="t in fileslist" :key="t.key" class="item" :item="t" path="/"></tree-item>
            </ul>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import TreeItem from "./TreeItem";
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "SD",
  components: { TreeItem },
  props: {},
  data: function() {
    return {};
  },
  methods: {
    guid() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    }
  },
  computed: {
    ...mapGetters(["fileslist", "isLoading"]),
    treeWithKey: function() {
      return this.fileslist.map(t => {
        return { t, key: this.guid() };
      });
    }
  },
  mounted: function() {
    store.dispatch("loadSDFiles");
  }
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
