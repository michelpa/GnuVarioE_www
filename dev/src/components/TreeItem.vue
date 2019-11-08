<template>
  <li class>
    <div :class="{bold: isFolder}" @click="toggle" @dblclick="makeFolder">
      <i
        class="text-secondary fa"
        :class="{ 'fa-folder': (isFolder && !isOpen), 'fa-folder-open': (isFolder && isOpen), 'fa-file': (!isFolder) }"
      ></i>
      &nbsp;
      <a href="javascript:void(0)" v-if="isFolder">
        {{ item.name }}
        <!-- --{{ basePath }}-- -->
      </a>
      <span v-else>
        {{ item.name }}
        <!-- --{{ fullFilename }}-- -->
      </span>
      <div class="btns">
        <span v-if="!isFolder">
          <button
            class="btn btn-sm btn-success"
            @click="downloadFromSD(item)"
            v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
            title="Télécharger"
          >
            <i class="fa fa-arrow-alt-circle-down"></i>
          </button>
        </span>
        <span v-if="isFolder">
          &nbsp;
          <button
            class="btn btn-sm btn-info"
            @click="uploadToSD(f)"
            v-b-tooltip.hover="{delay: { show: 1000, hide: 50 }}"
            title="Télécharger"
          >
            <i class="fa fa-arrow-alt-circle-up"></i>
          </button>
        </span> &nbsp;
        <click-confirm
          placement="bottom"
          button-size="sm"
          yes-class="btn btn-success"
          no-class="btn btn-danger"
          :messages="{title: 'Êtes-vous sûr?', yes: 'Oui', no: 'Non'}"
        >
          <button
            class="btn btn-sm btn-danger"
            @click="deleteFromSD(f)"
            v-b-tooltip.hover="{ delay: { show: 1000, hide: 50 } }"
            title="Supprimer"
          >
            <i class="fa fa-trash-alt"></i>
          </button>
        </click-confirm>
      </div>
    </div>
    <ul v-show="isOpen" v-if="isFolder" class>
      <tree-item
        class="item"
        v-for="(child, index) in item.contents"
        :key="index"
        :item="child"
        :level="level+1"
        :path="basePath"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      ></tree-item>
    </ul>
  </li>
</template>

<script>
let nbLevelOpened = 2;
export default {
  name: "TreeItem",
  components: {},
  props: {
    item: Object,
    path: { type: String, default: null },
    level: { type: Number, default: 1 }
  },
  data: function() {
    return {
      isOpen: this.level < nbLevelOpened
    };
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    makeFolder: function() {
      return;
    },
    downloadFromSD: function(f) {
      alert("soon");
      console.log(this.fullFilename);
      let self = this;
      // store.dispatch("downloadFlight", f).then(
      //   response => {
      //     const url = window.URL.createObjectURL(new Blob([response.data]));
      //     const link = document.createElement("a");
      //     link.href = url;
      //     link.setAttribute("download", f);
      //     document.body.appendChild(link);
      //     link.click();
      //   },
      //   // eslint-disable-next-line
      //   error => {
      //     self.$bvToast.toast(`Echec du téléchargement du fichier.`, {
      //       title: "Mon vol",
      //       toaster: "b-toaster-top-right",
      //       solid: true,
      //       variant: "danger"
      //     });
      //   }
      // );
    },
    uploadToSD: function() {
      alert("soon");
    },
    deleteFromSD: function() {
      alert("soon");
    }
  },
  computed: {
    isFolder: function() {
      return this.item.type == "directory";
    },
    fullFilename: function() {
      return this.path + this.item.name;
    },
    basePath: function() {
      return this.isFolder && this.path
        ? this.path + this.item.name + "/"
        : this.item.name;
    }
  },
  mounted: function() {}
};
</script>

<style scoped>
.tree ul {
  margin-left: 0 0 0 1em;
  position: relative;
  padding: 0;
  list-style: none;
}
.tree ul ul {
  margin-left: 0.5em;
}
.tree ul:before {
  content: "";
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px solid;
}
.tree li {
  margin: 0;
  padding: 0 1em;
  line-height: 2em;
  /* color: #369; */
  font-weight: 700;
  position: relative;
}
.tree ul li:before {
  content: "";
  display: block;
  width: 10px;
  height: 0;
  border-top: 1px solid;
  margin-top: -1px;
  position: absolute;
  top: 1em;
  left: 0;
}
.tree ul li:last-child:before {
  /* background: #fff; */
  height: auto;
  top: 1em;
  bottom: 0;
}
.indicator {
  margin-right: 5px;
}
.tree li a {
  text-decoration: none;
  /* color: #369; */
}
/* .tree li button,
.tree li button:active,
.tree li button:focus {
  text-decoration: none;
  /* color: #369; */
/* border: none;
  background: transparent;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  outline: 0; */
/* }  */

.tree div.btns {
  margin-left: 15px;
}
.tree div.btns,
.tree .btns div,
.tree div.btns .btn {
  display: inline;
  padding: 0.1rem 0.2rem;
  font-size: 0.65rem;
}
</style>