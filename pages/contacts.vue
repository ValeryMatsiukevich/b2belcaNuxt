<template>
  <div>
    <AppHeader :goods="goods" :folders="folders" />
    <v-row>
      <v-col cols="12" md="6">
        <v-card
          class="mt-5 mb-5"
          title="ООО «КопиксПринт»"
          prepend-icon="mdi-card-account-mail"
        >
          <v-card-subtitle> Юридический адрес: </v-card-subtitle>
          <v-card-text>
            Республика Беларусь, 220113, Минская обл., Минский р-н, Новодворский
            с/с, д. Большой Тростенец, ул. Западная, 43/6, каб. 17
          </v-card-text>
          <v-card-subtitle> Почтовый адрес: </v-card-subtitle>
          <v-card-text>
            220113, г. Минск, ул. Я. Коласа, д. 53, корп. 3, помещ. 1Н
          </v-card-text>
          <v-card-subtitle> Банковские реквизиты: </v-card-subtitle>
          <v-card-text>
            Р/с BY95PJCB30120263921000000933 в «Приорбанк» ОАО ЦБУ 114 г. Минск,
            пр. Партизанский, 56/2, БИК PJCBBY2X УНП 691461733 ОКПО 300908456000
          </v-card-text>
          <v-card-subtitle> Реквизиты: </v-card-subtitle>
          <v-card-text>
            УНП 691461733 Свидетельство 691461733, Минским районным
            исполнительным комитетом
          </v-card-text>
          <v-card-subtitle> Контактные телефоны: </v-card-subtitle>
          <v-card-text> +375-29-390-7712 </v-card-text>
          <v-card-text> E-mail: 7712@cprint.by </v-card-text>
          <v-card-title>
            <v-icon icon="mdi-credit-card-marker"></v-icon> Пункт самовывоза
          </v-card-title>
          <v-card-text>
            г. Минск, ул. Якуба Коласа, 53 корп. 3, пом 1 (въезд со стороны ул.
            Ломоносова, 10)
          </v-card-text>
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


const { data: goods } = await useAsyncData("goods", () => $fetch("/api/goods"));
const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);
</script>

<style></style>
