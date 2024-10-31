<template>
  <div>
    <v-row dense v-if="selectedContragentData?.priceCurrency === 'BYN'">
      <v-col cols="12" sm="4">
        <v-card class="pa-2">
          <v-card-title>Отдел оптовых продаж:</v-card-title>
          <v-card-text>
            Евгений Пилипчук<br />
            Мария Скипор<br />
            Татьяна Деревянко<br />
            Вероника Куленок<br />
            Анна Тумилович
          </v-card-text>
          <v-card-title>Брестский филиал:</v-card-title>
          <v-card-text>Инга Патрушева</v-card-text>
          <v-card-title>Гомельский филиал:</v-card-title>
          <v-card-text>Алла Бандюк</v-card-text>
          <v-card-title>Гродненский филиал:</v-card-title>
          <v-card-text>Елена Менько</v-card-text>
          <v-card-title>Могилевский филиал:</v-card-title>
          <v-card-text>Ольга Антипова</v-card-text>
          <v-card-title
            >Отдел корпоративных клиентов:</v-card-title
          >
          <v-card-text>
            Вера Дахно<br />
            Елена Ярошевич<br />
            Мария Ильеня<br />
            Юлия Поддубицкая
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-2">
          <v-card-title>Контактный телефон:</v-card-title>
          <v-card-text>
            +375 33 667-05-08<br />
            +375 29 390-06-11<br />
            +375 44 704-54-13<br />
            +375 44 736-13-65<br />
            +375 29 771-95-83
          </v-card-text>
          <v-card-title>Контактный телефон:</v-card-title>
          <v-card-text> +375 29 764-16-22 </v-card-text>
          <v-card-title>Контактный телефон:</v-card-title>
          <v-card-text> +375 29 167-75-43 </v-card-text>
          <v-card-title>Контактный телефон:</v-card-title>
          <v-card-text> +375 29 208-03-50 </v-card-text>
          <v-card-title>Контактный телефон:</v-card-title>
          <v-card-text> +375 29 638-30-90 </v-card-text>
          <v-card-title>Контактный телефон:</v-card-title>
          <v-card-text>
            +375 33 687-97-22<br />
            +375 29 575-62-79<br />
            +375 29 331-61-01<br />
            +375 29 566-30-35
          </v-card-text>
          <v-card-title>Офисные телефоны:</v-card-title>
          <v-card-text>
            +375 17 388-07-65<br />
            +375 17 388-07-66<br />
            +375 25 502-90-90<br />
            +375 29 155-44-00<br />
            +375 29 755-45-54<br />
            +375 25 755-44-00
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-2">
          <v-card-title>Внутренний номер:</v-card-title>
          <v-card-text>
            401<br />
            402<br />
            404<br />
            405<br />
            406
          </v-card-text>
          <v-card-title>Внутренний номер:</v-card-title>
          <v-card-text> 421 </v-card-text>
          <v-card-title>Внутренний номер:</v-card-title>
          <v-card-text> 423 </v-card-text>
          <v-card-title>Внутренний номер:</v-card-title>
          <v-card-text> 424 </v-card-text>
          <v-card-title>Внутренний номер:</v-card-title>
          <v-card-text> 426 </v-card-text>
          <v-card-title>Внутренний номер:</v-card-title>
          <v-card-text>
            429<br />
            430<br />
            431<br />
            432
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense v-if="selectedContragentData?.priceCurrency === 'RUB'">
      <v-col cols="12">
        <v-col cols="12">
          <v-card class="pa-2">
            <v-card-title>Офисный телефон:</v-card-title>
            <v-card-text>+7 (481) 222-91-00</v-card-text>
          </v-card>
        </v-col>
        <v-row dense>
          <v-col cols="3" sm="3">
            <v-card class="pa-2">
              <v-card-title>Менеджер:</v-card-title>
              <v-card-text>
                <br />
                Ирина Сяба<br /><br /><br />
                Ольга Карницкая<br />
                <br />
                Светлана Усс<br />
                <br />
                Наталья Ольшевская<br />
                <br />
                Елена Комарова
              </v-card-text>
              
            </v-card>
          </v-col>
          <v-col cols="3" sm="3">
            <v-card class="pa-2">
              <v-card-title>Почтовый адрес:</v-card-title>
              <v-card-text>
                <br />
                is@belca.by<br />
                <br />
                <br />
                oka@belca.by<br />
                <br />
                us@belca.by<br />
                <br />
                no@belca.by<br />
                <br />
                ke@belca.by
              </v-card-text>
              
            </v-card>
          </v-col>
          <v-col cols="3" sm="3">
            <v-card class="pa-2">
              <v-card-title>Внутренний номер:</v-card-title>
              <v-card-text>
                <br />
                411<br />
                <br />
                <br />
                412<br />
                <br />
                413<br />
                <br />
                414<br />
                <br />
                415
              </v-card-text>
              
            </v-card>
          </v-col>
          <v-col cols="3" sm="3">
            <v-card class="pa-2">
              <v-card-title>Мессенджеры:</v-card-title>
              <v-card-text>
                Whatsapp: +375 (29) 387-06-40<br />
                Telegram: +375 (25) 502-78-63<br />
                Viber: +375 (29) 766-79-94<br />
                <br />
                Telegram: +375 (25) 501-59-86 <br />
                <br />
                +375 (29) 657-67-33<br />
                <br />
                +375 (25) 502-21-97<br />
                <br />
                +375 (25) 502-16-26
              </v-card-text>
              
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
  <AppFooter />
</template>

<script lang="ts" setup>
const selectedContragentData = inject("selectedContragentData");
</script>

<style></style>
