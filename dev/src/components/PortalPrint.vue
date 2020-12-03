<template>
  <html>
    <head></head>
    <body class="A4" v-if="openpapier">
      <!-- Each sheet element should have the class "sheet" -->
      <!-- "padding-**mm" is optional: you can set 10, 15, 20 or 25 -->
      <section class="sheet padding-10mm" ref="monElement">
        <!-- Write HTML just like a web page -->
        <h1>
          <!-- {{ $t("flights.MY_LOGBOOK") }} -->
          <button @click="printWindow()" class="btn-print">
            {{ $t("actions.print_but") }}
          </button>
        </h1>
        <div v-for="data in bddflights.slice().reverse()" :key="data.year">
          <h2>{{ data.year }}</h2>
          <div class="year-zone">
            <div
              v-for="datamonth in data.months.slice().reverse()"
              :key="datamonth.month"
              class="un-mois"
            >
              <h3>
                {{
                  [datamonth.month, "YYYY-MM"] | moment("MMMM YYYY")
                }}
                <div class="subtitle">
                  ({{ datamonth.nb_flights }}
                  {{ $t("flights.FLIGHTS") | pluralize(datamonth.nb_flights) }},
                  {{ datamonth.duration }}, {{ datamonth.sites_id.length }}
                  {{
                    $t("carnet.site") | pluralize(datamonth.sites_id.length)
                  }})
                </div>
              </h3>
              <div
                v-for="dataday in datamonth.days.slice().reverse()"
                :key="dataday.day"
                class="un-jour"
              >
                <h4>
                  {{ dataday.day | moment("dddd D MMMM") }}
                  <div class="subtitle">
                    ({{ dataday.nb_flights }}
                    {{ $t("flights.FLIGHTS") | pluralize(dataday.nb_flights) }},
                    {{ dataday.duration }}, {{ dataday.sites_id.length }}
                    {{
                      $t("carnet.site") | pluralize(dataday.sites_id.length)
                    }})
                  </div>
                </h4>

                <div class="un-vol" v-for="f in dataday.flights" :key="f.id">
                  <div class="filename" v-if="f.filename && f.filename != ''">
                    {{ f.filename }}
                  </div>
                  <br />
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td>
                          {{ $t("carnet.Site") }}
                          <strong>{{ f.site_lib }}</strong>
                        </td>
                        <td>
                          {{ $t("carnet.Pilote") }}
                          <strong>{{ f.pilot }}</strong>
                        </td>
                        <td>
                          {{ $t("carnet.Voile") }}
                          <strong>{{ f.wing }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t("carnet.Start_time") }}
                          <strong>{{ f.start_flight_time }}</strong>
                        </td>
                        <td>
                          {{ $t("carnet.End_time") }}
                          <strong>{{ f.end_flight_time }}</strong>
                        </td>
                        <td>
                          {{ $t("carnet.Duration") }}
                          <strong>{{ f.duration }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t("carnet.Alt") }}
                          <strong
                            >{{ f.start_height }}m / {{ f.end_height }}m</strong
                          >
                        </td>
                        <td>
                          {{ $t("carnet.Alt_min") }}
                          <strong>{{ f.min_height }}m</strong>
                        </td>
                        <td>
                          {{ $t("carnet.Alt_max") }}
                          <strong>{{ f.max_height }}m</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    v-if="f.comment && f.comment != ''"
                    class="comments"
                    v-html="$options.filters.nl2br(f.comment)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <h2 class="bottom">
            {{ data.year }}
            <div class="subtitle">
              ({{ data.nb_flights }}
              {{ $t("flights.FLIGHTS") | pluralize(data.nb_flights) }},
              {{ data.duration }}, {{ data.sites_id.length }}
              {{ $t("carnet.site") | pluralize(data.sites_id.length) }})
            </div>
          </h2>
          <hr />
        </div>
        <slot />
      </section>
    </body>
  </html>
</template>

<script>
let papercss = `
@page{margin:0}body{margin:0}.sheet{margin:0;overflow:hidden;position:relative;box-sizing:border-box;page-break-after:always}body.A3 .sheet{width:297mm;height:419mm}body.A3.landscape .sheet{width:420mm;height:296mm}body.A4 .sheet{width:210mm;height:296mm}body.A4.landscape .sheet{width:297mm;height:209mm}body.A5 .sheet{width:148mm;height:209mm}body.A5.landscape .sheet{width:210mm;height:147mm}body.letter .sheet{width:216mm;height:279mm}body.letter.landscape .sheet{width:280mm;height:215mm}body.legal .sheet{width:216mm;height:356mm}body.legal.landscape .sheet{width:357mm;height:215mm}.sheet.padding-10mm{padding:10mm}.sheet.padding-15mm{padding:15mm}.sheet.padding-20mm{padding:20mm}.sheet.padding-25mm{padding:25mm}@media screen{body{background:#e0e0e0}.sheet{background:#fff;box-shadow:0 .5mm 2mm rgba(0,0,0,.3);margin:5mm auto}}@media print{body.A3.landscape{width:420mm}body.A3,body.A4.landscape{width:297mm}body.A4,body.A5.landscape{width:210mm}body.A5{width:148mm}body.legal,body.letter{width:216mm}body.letter.landscape{width:280mm}body.legal.landscape{width:357mm}}
`;
papercss =
  papercss +
  `
@page {
  size: A4;
}
.sheet {
  overflow: visible;
  height: auto !important;
}

body {
font: 10pt Georgia, "Times New Roman", Times, serif;
	color: #000; 
}

h1,h2,h3,h4,h5,h6 {
	font-family: Helvetica, Arial, sans-serif;
	color: #0088B4;
  margin: 4pt 0;
  padding:4pt;
  font-variant: small-caps;
}
h4 {
  color: #3BB4D8;
}
.subtitle{
  float: right;
  font-weight: 100;
  font-size: 10pt;
  padding-left:10pt;
  font-style: italic;
  font-variant: normal;
}

h1 { font-size: 160%; text-align: center; margin-bottom: 7pt;}
h2 { font-size: 135%; border: 1px solid #0088B4; background-color: #eee; margin-bottom: -5px }
h2.bottom { font-size: 135%; border: 1px dotted #0088B4; background-color: #eee; margin-top: -2px; margin-bottom: 5px;}
h3 { font-size: 125%;  border-bottom: 1px solid #0088B4 }
h4 { font-size: 100%;  }
h5 { font-size: 100%; font-variant: small-caps;}
h6 { font-size: 90%; font-style: italic; }

hr {
  color: #0088B4;
}
.year-zone {
  border-left: 2px solid #0088B4;
  padding-left: 5px;
}

table {
  width: 100%;
}
.un-mois {
  /* page-break-inside : avoid; */
}
.un-jour {
  /*page-break-inside : avoid;*/
}
.un-vol {
  border: 1px solid #666;
  padding: 1pt;
  margin: 5pt 0 2pt 0;
  page-break-inside : avoid;
}
.filename {
  float: right;
  font-weight: 100;
  font-size: 10pt;
  font-style: italic;
  margin: 0;
}
.comments {
  border: 1px dotted #ccc;
  padding: 3pt;
  margin: 1pt;
  background-color: #fafafa;
}
.btn-print {
  float: right;
}
@media print {
  .btn-print {
    display: none;
  }
}
`;
export default {
  name: "PortalPrint",
  model: {
    prop: "openpapier",
    event: "close",
  },
  props: {
    openpapier: {
      type: Boolean,
      default: false,
    },
    bddflights: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      windowRef: null,
    };
  },
  watch: {
    openpapier(newOpen) {
      if (newOpen) {
        this.openPortal();
      } else {
        this.closePortal();
      }
    },
  },
  methods: {
    openPortal() {
      this.windowRef = window.open(
        "",
        "",
        "width=768,height=1024,left=200,top=200"
      );

      this.windowRef.document.replaceChild(
        this.$el,
        this.windowRef.document.documentElement
      );

      const newStyleEl = window.document.createElement("style");
      const newContent = window.document.createTextNode(papercss);

      newStyleEl.appendChild(newContent);
      this.windowRef.document.head.appendChild(newStyleEl);
      this.windowRef.addEventListener("beforeunload", this.closePortal);

      //console.log(this.$el.children.querySelector("#monElement").clientHeight);
    },
    closePortal() {
      if (this.windowRef) {
        this.windowRef.close();
        this.windowRef = null;
        this.$emit("close");
      }
    },
    printWindow: function () {
      //  console.log(this.$refs.monElement.clientHeight);
      this.windowRef.print();
    },
  },
  mounted() {
    if (this.open) {
      this.openPortal();
    }
  },
  beforeDestroy() {
    if (this.windowRef) {
      this.closePortal();
    }
  },
};
</script>
<style scoped>
</style>
