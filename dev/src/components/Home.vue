<template>
  <div class="row">
    <div class="col-md-12">
      <section class="jumbotron text-center">
        <div class="container">
          <h1 class="jumbotron-heading">GNU Vario</h1>
          <p class="lead text-muted">
            The open source and open hardware variometer.
            <br />
            

            <em class="small" v-if="config.gnuvarioe">(version : {{ config.gnuvarioe.version }})</em>
          </p>
          <p>{{ $t('home.hello') }}</p>
        </div>
      </section>

      <div class="py-5 bg-light">
        <div class="container">
          <div class="row">
            <div class="col-md-4 d-flex align-items-stretch">
              <div class="card mb-4 box-shadow">
                <img
                  class="card-img-top"
                  src="https://prunkdump.github.io/GNUVario-TTGO-T5-website/assets/tuto_img/20191011_121646_resizeda.jpg"
                />
                <!-- <img class="card-img-top" src="./../assets/banner.jpg" alt="Card image cap" /> -->
                <div class="card-body p-2">
                  <p class="card-text">Le nouveau PCB.</p>

                  <!-- <div class="d-flex justify-content-between align-items-center float-right">
                    <small class="text-muted">Par Ratamuse</small>
                  </div>-->
                </div>
              </div>
            </div>
            <div class="col-md-4 d-flex align-items-stretch">
              <div class="card mb-4 box-shadow">
                <img
                  class="card-img-top"
                  src="https://prunkdump.github.io/GNUVario-TTGO-T5-website/assets/Fashion%20week%20Rouge%20gris.jpg"
                />
                <div class="card-body">
                  <p class="card-text">Un boitier imprimé en 3D.</p>
                  <!-- <div class="d-flex justify-content-between align-items-center float-right">
                    <small class="text-muted">Par xxxxxxx xxxxxxxxxxx</small>
                  </div>-->
                </div>
              </div>
            </div>
            <div class="col-md-4 d-flex align-items-stretch">
              <div class="card mb-4 box-shadow">
                <img
                  class="card-img-top"
                  src="https://prunkdump.github.io/GNUVario-TTGO-T5-website/assets/tuto_img/20191011_122119_resizeda.jpg"
                />
                <div class="card-body">
                  <p class="card-text">Les seuls composants nécessaires...</p>
                  <!-- <div class="d-flex justify-content-between align-items-center float-right">
                    <small class="text-muted">Par xxxxxxx xxxxxxxxxxx</small>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  props: {
    msg: String
  },
  data: function() {
    return {
      env: process.env,
      params: {}
    };
  },
  computed: {
    ...mapGetters(["config"])
  },
  mounted: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
