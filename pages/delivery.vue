<template>
  <AppHeader :goods="goods" :folders="folders" />   
  <div class="d-flex justify-center mb-6 bg-cyan text-white mt-5">
    <h1>Оплата и доставка</h1>
  </div>
  <v-row class="mt-5" justify="center">
   
    <v-card class="mx-auto" prepend-icon="mdi-clock-outline" width="300">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Обработка заказов</span>
      </template>
      <v-card-text class="pt-4">
        Пн-Чт: 9:00-18:00
        Пт: 9:00-17:00
      </v-card-text>
    </v-card>
  
    <v-card class="mx-auto" prepend-icon="mdi-package-check" width="300">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Способ доставки</span>
      </template>

      <v-card-text class="pt-4">
        <p>Курьер (Минск)</p>
        <p>Служба доставки. Регионы. Самовывоз.</p>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" prepend-icon="mdi-truck-delivery-outline" width="300">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Доставка заказов</span>
      </template>
      <v-card-text class="pt-4">
        Пн-Чт: 9:00-18:00
        Пт: 9:00-17:00
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" prepend-icon="mdi-cash" width="300">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Способ оплаты</span>
      </template>
      <v-card-text class="pt-4">
        Наличные
        Система «Расчет» Безналичный
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" prepend-icon="mdi-earth" width="300">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">География доставки</span>
      </template>
      <v-card-text class="pt-4">
        Вся Беларусь
      </v-card-text>
    </v-card>
    <v-col class="text-center mt-4" cols="12">

    </v-col>
  </v-row>

  <v-row justify="center">
  <v-col cols="6">
    <v-card class="h-100 grey-lighten-5" prepend-icon="mdi-truck-delivery-outline" width="auto" 
    subtitle="При заказе до 50 BYN — 5 BYN. При заказе от 50 BYN — бесплатно">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Условия доставки по г. Минск</span>
      </template>
      <v-card-text class="pt-4">
        <p>Доставка заказа осуществляется курьером.
        В обязанности курьера входит доставка товара и оформление гарантийных документов.
        Интересующие вопросы и необходимые характеристики уточняйте во время заказа у менеджеров магазина.
        Оплата покупок производится в момент доставки товара.</p>
      </v-card-text>
    </v-card>
    </v-col>
    <v-col cols="6">
    <v-card class="h-100" prepend-icon="mdi-moped"
      subtitle="г. Минск, ул. Якуба Коласа, 53 корп. 3 (въезд с улицы Ломоносова, 10)">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Самовывоз</span>
      </template>

      <v-card-text class="pt-4">
        <p>Предварительно согласованный по телефону заказ можно забрать из нашего офиса
        Условия и стоимость доставки по РБ уточняйте по телефонам, указанным на сайте</p>
      </v-card-text>
    </v-card>
    </v-col>
    <v-col class="text-center mt-4" cols="12">

    </v-col>
  </v-row>

  <v-row class="mb-5" justify="center">
    <v-col cols="6">
    <v-card class="h-100" prepend-icon="mdi-account-credit-card" >
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Способ оплаты</span>
      </template>
      <v-card-text class="pt-4">
      <p>Наличный расчет<br>
        Безналичный расчет<br>
        Система расчета ЕРИП<br>
        Банковская карта(Visa/Mastercard)<br>
        электронными деньгами (iPay, Webmoney [WMB] и др.)<br>
        платежной карточкой (интернет-банк, мобильный-банк, банкомат, инфокиоск, касса банка и Белпочты*)<br>
        наличными (устройство cash-in, касса банка и Белпочты*).</p>
      </v-card-text>
    </v-card>
    </v-col>
    <v-col cols="6">
    <v-card class="h-100" prepend-icon="mdi-cellphone"
      subtitle="г. Минск, ул. Якуба Коласа, 53 корп. 3 (въезд с улицы Ломоносова, 10)">
      <template v-slot:prepend>
        <v-icon color="cyan"></v-icon>
      </template>
      <template v-slot:title>
        <span class="font-bold">Расположение услуги в дереве ЕРИП:</span>
      </template>

      <v-card-text class="pt-4">
      <p>  Система «Расчет» (ЕРИП) <br>
        Интернет-магазины/сервисы <br>
        0-9 Цифровые домены <br>
        7<br>
        7712.by<br>
        Расположение услуги в дереве услуг системы «Расчет» (ЕРИП) в некоторых пунктах оплаты <br> 
        может отличаться от описанного выше. В связи с этим, в случае возникновения проблем с <br> 
        поиском услуги, предлагаем выполнить поиск по номеру УНП: 691461733</p>
      </v-card-text>
    </v-card>
  </v-col>
  </v-row>
  <AppFooter />

</template>
<script lang="ts" setup>

  const route = useRoute();
  const { data : goods } = await useAsyncData(
  'goods',
  () => $fetch('/api/goods')
)
const { data : folders} = await useAsyncData(
  'folders',
  () => $fetch('/api/folders')
)
</script>