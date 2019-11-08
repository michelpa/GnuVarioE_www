<template>
  <div class="screen">
    <div class="row">
      <div class="col-md-3">
        <label for>
          Largeur en px:
          <input type="text" v-model="width" />
        </label>
        <label for>
          Hauteur en px:
          <input type="text" v-model="height" />
        </label>

        <a :href="'./traces/' + f" v-for="f in listing" :key="f">{{f}}</a>
        {{ listing }}
        {{ getConfForScreen(1)}}
        <div>
          <ul>
            <li v-for="w in widgets" :key="w.name">{{w.name}}</li>
          </ul>
        </div>
      </div>
      <div class="col-md-9">
        <nav class="nav nav-tabs">
          <a
            class="nav-item nav-link"
            v-for="s in screensConf"
            :key="s._attributes.id"
            :href="'#screen' + s._attributes.id"
            data-toggle="tab"
            @click.prevent="setActive('screen' + s._attributes.id)"
            :class="{ active: isActive('screen' + s._attributes.id) }"
          >{{ s._attributes.id }}</a>
        </nav>
        <div class="tab-content">
          <div
            class="tab-pane"
            v-for="s in screensConf"
            :key="s._attributes.id"
            :id="'screen' + s._attributes.id"
            :class="{ 'active show': isActive('screen' + s._attributes.id) }"
          >
            <div class="viewport" :style="{'height':viewportHeight, 'width' :viewportWidth}">
              <vue-draggable-resizable
                v-for="c in getConfForScreen(s._attributes.id)"
                :key="c.id._text"
                :parent="true"
                :isResizable="false"
                :isActive="true"
                :x="c.posX._text * zoom"
                :y="c.posY._text * zoom"
                :w="60"
                :h="50"
                v-on:resizing="resize($event, c)"
                v-on:dragging="resize($event, c)"
                class="item"
              >
                <span class="title">
                  <strong>{{c.type._text}}</strong>
                </span>
                <div class="dim">
                  <span>{{ c.posX._text }} х {{ c.posY._text }}</span>
                </div>
              </vue-draggable-resizable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <h3>Config</h3>
        <div>{{ getConfForScreen(1) }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button class="btn btn-success">Sauver la configuration</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
// import axios from "axios";
// import convert from "xml-js";

export default {
  name: "ScreenConfigurator",
  components: {
    VueDraggableResizable
  },
  props: {
    msg: String
  },
  data: function() {
    return {
      listing: [],
      activeItem: "screen1",
      width: 300,
      height: 200,
      zoom: 3,
      screensConf: [],
      widgets: [
        {
          w: 80,
          h: 80,
          t: 0,
          l: 0,
          Xtext: "VARIOSCREEN_ALTI_ANCHOR_X",
          Ytext: "VARIOSCREEN_ALTI_ANCHOR_Y",
          name: "Altitude",
          shortName: "A"
        },
        {
          w: 120,
          h: 100,
          t: 0,
          l: 0,
          Xtext: "VARIOSCREEN_TIME_ANCHOR_X",
          Ytext: "VARIOSCREEN_TIME_ANCHOR_Y",
          name: "Time",
          shortName: "T"
        }
      ]
    };
  },
  methods: {
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },
    resize(newRect, widget) {
      widget;
      return true;
      //   console.log(widget);
      // widget.t = newRect.top;
      // widget.l = newRect.left;
      //   w.w = newRect.w;
      //   this.w.h = newRect.h;
      //   this.w.t = newRect.t;
      //   this.w.l = newRect.l;
    },
    getWidgetByName: function(name) {
      // console.log(name);
      var result = this.widgets.filter(widget => {
        return widget.name === name;
      });
      return result;
    },
    getConfForScreen: function(id) {
      var result = this.screensConf.filter(c => {
        return parseInt(c._attributes.id) == id;
      });

      if (result.length == 1) {
        return result[0].info;
      }
    }
  },
  computed: {
    viewportWidth: function() {
      return this.width * 2 + "px";
    },
    viewportHeight: function() {
      return this.height * 2 + "px";
    },
    config: function() {
      var c = "";
      for (var key in this.widgets) {
        var obj = this.widgets[key];
        c = c + "#define " + obj.Xtext + " " + obj.l + "<br>";
        c = c + "#define " + obj.Ytext + " " + obj.t + "<br>";
      }
      return c;
    }
  },
  mounted: function() {
    axios.get("./traces").then(response => {
      //let listing = parseDirectoryListing(response.data);
      //this.listing = JSON.stringify(response.data);
      this.listing = response.data;
      //console.log(listing);
      //  $("body").append(JSON.stringify(listing));
    });

    axios.get("./config/config.xml").then(response => {
      this.xmlText = response.data;
      var result2 = convert.xml2json(this.xmlText, {
        compact: true,
        spaces: 4
      });
      var json = JSON.parse(result2);
      this.screensConf = json.config.screen;
    });
  }
};

// function parseDirectoryListing(text) {
//   console.log("text", text);
//   let docs = text
//     .match(/href="([\w]+)/g) // pull out the hrefs
//     .map(x => x.replace('href="', "")); // clean up
//   console.log(docs);
//   // return docs;
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.viewport {
  position: relative;
  border: 1px solid red;
  background-color: rgb(201, 201, 201);
}
.item {
  background-color: rgb(168, 255, 133);
  margin: 0;
  padding: 0;
  border: 1px solid green;
}
.dim {
  font-size: 0.7em;
}
.title {
  font-size: 0.7em;
}
.config {
  text-align: left;
}
</style>
