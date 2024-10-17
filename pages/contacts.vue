<template>
  <div>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card
          class="mt-5 mb-5"
          title="Наши контакты"
          prepend-icon="mdi-phone"
        >
          <div class="row">
            <div class="col-md-4 col-sm-6 col-xs-6">
              <p><strong>Отдел оптовых продаж:</strong></p>
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6">
              <p><strong>Контактный телефон:</strong></p>
            </div>
            <div class="col-md-4 hidden-sm hidden-xs">
              <p><strong>Внутренний номер:</strong></p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 col-sm-6 col-xs-6"><p>Ольга Климович</p></div>
            <div class="col-md-4 col-sm-6 col-xs-6">
              <p>
                <a class="tel" href="tel:+375295864105">+375 29 586-41-05</a>
                <a
                  class="tg"
                  title="Telegram"
                  href="https://t.me/VolhaKlimovich"
                  target="_blank"
                ></a>
              </p>
            </div>
            <div class="col-md-4 hidden-sm hidden-xs"><p>401</p></div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card
          class="mt-5 mb-5"
          title="Мы на карте"
          prepend-icon="mdi-map-marker"
        >
          <v-img src="/page-contact-map.png"></v-img>
          <!-- <AppMap /> -->
        </v-card>
      </v-col>
    </v-row>
  </div>
  <AppFooter />
</template>

<script lang="ts" setup>

</script>

<style></style>
