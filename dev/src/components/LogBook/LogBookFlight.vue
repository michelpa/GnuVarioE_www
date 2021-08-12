<template>
  <div>
    <div class="row">
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-12">
            <div class="float-right">
              <div class="btns">
                <button
                  v-if="f.filename"
                  class="btn btn-sm btn-info"
                  @click="flightInfo(f)"
                  v-b-tooltip.hover="{
                    delay: { show: 1000, hide: 50 },
                  }"
                  :title="$t('actions.info')"
                >
                  <i class="fa fa-info-circle"></i>
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  @click="edit(f)"
                  v-b-tooltip.hover="{
                    delay: { show: 1000, hide: 50 },
                  }"
                  :title="$t('actions.edit')"
                >
                  <i class="fa fa-pen"></i>
                </button>
                <button
                  v-if="isdropboxenabled && f.filename"
                  class="btn btn-sm btn-primary"
                  @click="flightToDropbox(f.filename)"
                  v-b-tooltip.hover="{
                    delay: {
                      show: 1000,
                      hide: 50,
                    },
                  }"
                  :title="$t('actions.upload_to') + 'dropbox'"
                >
                  <i class="fab fa-dropbox"></i>
                </button>
                <button
                  v-if="pgenabled"
                  class="btn btn-sm btn-primary"
                  @click="flightToParagliding(f.filename)"
                  v-b-tooltip.hover="{
                    delay: {
                      show: 1000,
                      hide: 50,
                    },
                  }"
                  :title="$t('actions.upload_to') + 'paraglidinglogbook.com'"
                >
                  <i class="fa fa-book"></i>
                </button>
                <button
                  v-if="f.filename"
                  class="btn btn-sm btn-success"
                  @click="downloadFromSD(f)"
                  v-b-tooltip.hover="{
                    delay: { show: 1000, hide: 50 },
                  }"
                  :title="$t('actions.download')"
                >
                  <i class="fa fa-arrow-alt-circle-down"></i>
                </button>
                <click-confirm
                  placement="bottom"
                  button-size="sm"
                  yes-class="btn btn-success"
                  no-class="btn btn-danger"
                  :messages="{
                    title: $t('actions.del_message'),
                    yes: $t('actions.yes'),
                    no: $t('actions.no'),
                  }"
                >
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteFromBDD(f)"
                    v-b-tooltip.hover="{
                      delay: {
                        show: 1000,
                        hide: 50,
                      },
                    }"
                    :title="$t('actions.delete')"
                  >
                    <i class="fa fa-trash-alt"></i>
                  </button>
                </click-confirm>
              </div>
            </div>
            <h5>{{ f.filename }}</h5>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>{{ $t("carnet.Site") }}</td>
                  <th style="font-size:1.1em;">{{ f.site_lib }}</th>
                </tr>
                <tr>
                  <td>{{ $t("carnet.Pilote") }}</td>
                  <th>{{ f.pilot }}</th>
                </tr>
                <tr>
                  <td>{{ $t("carnet.Voile") }}</td>
                  <th>{{ f.wing }}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-4">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>
                    {{ $t("carnet.Start_time") }}
                  </td>
                  <th>{{ f.start_flight_time }}</th>
                </tr>
                <tr>
                  <td>
                    {{ $t("carnet.End_time") }}
                  </td>
                  <th>{{ f.end_flight_time }}</th>
                </tr>
                <tr>
                  <td>
                    {{ $t("carnet.Duration") }}
                  </td>
                  <th>{{ f.duration }}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-4">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>{{ $t("carnet.Alt") }}</td>
                  <th>{{ f.start_height }}m / {{ f.end_height }}m</th>
                </tr>
                <tr>
                  <td>
                    {{ $t("carnet.Alt_min") }}
                  </td>
                  <th>{{ f.min_height }}m</th>
                </tr>
                <tr>
                  <td>
                    {{ $t("carnet.Alt_max") }}
                  </td>
                  <th>{{ f.max_height }}m</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="comments" v-html="$options.filters.nl2br(f.comment)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "LogBookFlight",
  components: {},
  props: {
    f: Object,
  },
  data: function () {
    return {};
  },
  computed: {
    ...mapGetters(["isdropboxenabled", "pg"]),
    pgenabled: function () {
      return this.pg.enable && this.pg.login != "" && this.pg.password != "";
    },
  },
  methods: {
    edit: function (flight) {
      this.$store.commit("logbook/setCurrentFlight", flight);
      this.$store.commit("logbook/setShowPopupFlight", true);
    },
    flightInfo: function (flight) {
      if (!flight.filename) {
        self.$bvToast.toast(this.$i18n.t("carnet.no_trace"), {
          title: this.$i18n.t("flights.MY_LOGBOOK"),
          toaster: "b-toaster-top-right",
          solid: true,
          variant: "danger",
        });
      }
      let self = this;
      this.$store.dispatch("infoFlightParsed", flight.filename).then(
        (response) => {
          this.$store.commit("logbook/setCurrentFlight", flight);
          this.$store.commit("logbook/setCurrentIgc", response);
          this.$store.commit("logbook/setShowPopupVisu", true);
        },
        (error) => {
          this.$store.commit("logbook/setShowPopupVisu", false);
          let msg = error.message;
          this.$bvToast.toast(
            this.$i18n.t("actions.download_failed") + ` ${msg}`,
            {
              title: this.$i18n.t("mesvols.TITLE_MSG_*"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            }
          );
        }
      );
    },
    downloadFromSD: function (flight) {
      let self = this;
      this.$store
        .dispatch("downloadFlight", { filename: flight.filename, parsed: true })
        .then(
          (response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", flight.filename);
            document.body.appendChild(link);
            link.click();
          },
          // eslint-disable-next-line
          (error) => {
            self.$bvToast.toast(this.$i18n.t("actions.download_failed"), {
              title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            });
          }
        );
    },
    deleteFromBDD: function (flight) {
      let self = this;
      this.$store.dispatch("deleteFlightParsed", flight).then(
        // eslint-disable-next-line no-unused-vars
        (response) => {
          const d = flight.flight_date;
          const splittedDate = d.split("-");
          this.$store
            .dispatch("logbook/loadFlightsBddShort", {
              mode: "Y",
              parcel: "",
              force: true,
            })
            .then(() => {
              this.$store
                .dispatch("logbook/loadFlightsBddShort", {
                  mode: "M",
                  parcel: splittedDate[0],
                  force: true,
                })
                .then(() => {
                  this.$store.dispatch("logbook/loadFlightsBdd", {
                    parcel: splittedDate[0] + splittedDate[1],
                    force: true,
                  });
                });
            });
        },
        (error) => {
          let msg = error.message;
          self.$bvToast.toast(
            this.$i18n.t("actions.del_failed_fly") + ` ${msg}`,
            {
              title: this.$i18n.t("mesvols.TITLE_MSG_modal"),
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            }
          );
        }
      );
    },
    flightToDropbox: function (f) {
      this.$store
        .dispatch("dropbox/uploadToDropbox", { filename: f, type: "VOLPARSED" })
        .then(
          // eslint-disable-next-line no-unused-vars
          // eslint-disable-next-line
          (response) => {
            this.$bvToast.toast("OK", {
              title: "Dropbox",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "success",
            });
          },
          // eslint-disable-next-line
          (error) => {
            this.$bvToast.toast(error, {
              title: "Dropbox",
              toaster: "b-toaster-top-right",
              solid: true,
              variant: "danger",
            });
          }
        );
    },
    flightToParagliding: function (f) {
      // let self = this;
      this.$store
        .dispatch("uploadIgcToParagliding", { filename: f, parsed: true })
        .then(
          // eslint-disable-next-line no-unused-vars
          (response) => {},
          // eslint-disable-next-line
          (error) => {}
        );
    },
  },
  mounted: function () {},
};
</script>

<style scoped>
.un-vol {
  padding: 5px 0;
  margin-bottom: 10px;
}
.miniature {
  margin-top: auto;
  margin-bottom: auto;
}
.btns div {
  display: inline;
}

.btns button {
  margin-right: 10px;
}

.comments {
  border: 1px solid #ccc;
  padding: 5px;
  min-height: 100%;
  text-align: left;
}
.card-day {
  border-left: 4px solid var(--cyan);
}
</style>