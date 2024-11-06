<template>
  <v-card
    v-if="serviceMode === 1"
    class="mx-auto text-center"
    color="cyan"
    dark
  >
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :model-value="value"
          width="500"
          :gradient="gradients[5]"
          gradient-direction="top"
          color="rgba(255, 255, 255, .7)"
          height="90"
          padding="12"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            {{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">Посещения за последние 18 дней</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn variant="text" block> Go to Report </v-btn>
    </v-card-actions>
  </v-card>
  <div v-if="serviceMode === 3">
    <v-card>
      <v-data-iterator
        float
        :items="[
          ...groupedSpecialOrders
            .filter((order) => order[0].number === '')
            .slice(),

          ...groupedSpecialOrders
            .filter((order) => order[0].number !== '')
            .slice()
            .sort((a, b) => {
              const numberA = -Number(a[0].number);
              const numberB = -Number(b[0].number);
              return numberA - numberB;
            }),
        ]"
        :items-per-page="ipp ? Number(ipp) : 5"
        :return-object="false"
        :loading="loading"
        :search="search"
        :custom-filter="customSearch"
      >
        <template v-slot:default="{ items }">
          <v-container
            class="d-flex"
            justify="center"
            width="100%"
            v-if="!loading"
          >
            <v-row dense class="mt-14">
              <v-col
                class="d-flex align-center justify-center flex-grow-0"
                style="width: 100%"
                v-for="(order, i) in items"
                :key="i"
                cols="12"
                sm="12"
                md="12"
                xs="12"
              >
                <v-card
                  style="width: 100%"
                  variant="tonal"
                  class="pb-0 pt-0 mb-1"
                  rounded="0"
                >
                  <v-row dense>
                    <v-col cols="12" md="1">
                      <v-text-field
                        variant="solo"
                        hide-details
                        v-model="order.raw[0].number"
                        label="Номер"
                        readonly
                        density="compact"
                        style="font-size: xx-small"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                      <v-text-field
                        variant="solo"
                        hide-details
                        v-model="order.raw[0].date"
                        :value="
                          dayjs(order.raw[0].date).format('DD.MM.YYYY HH:mm:ss')
                        "
                        label="Дата и время"
                        density="compact"
                        style="font-size: xx-small"
                        readonly
                      ></v-text-field>
                    </v-col>

                    <v-select
                      :items="specialOrdersSkladList"
                      density="compact"
                      item-title="name"
                      item-value="id"
                      v-model="order.raw[0].sklad"
                      label="Склад"
                      readonly
                      hide-details
                      variant="solo"
                      :return-object="false"
                      v-on:update:model-value="orderChanged(order.raw[0].guid)"
                      v-on:update:focused="updateSpecialOrder(order.raw[0].UNP)"
                    ></v-select>

                    <v-col cols="12" md="2">
                      <v-text-field
                        class="text-caption"
                        variant="solo"
                        density="compact"
                        hide-details
                        v-model="order.raw[0].manager"
                        label="Менеджер"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field
                        variant="solo"
                        density="compact"
                        hide-details
                        v-model="order.raw[0].client"
                        label="Клиент"
                        readonly
                        v-on:update:model-value="
                          orderChanged(order.raw[0].guid)
                        "
                        v-on:update:focused="
                          updateSpecialOrder(order.raw[0].UNP)
                        "
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        variant="solo"
                        hide-details
                        density="compact"
                        v-model="order.raw[0].good"
                        label="Товар"
                        required
                        v-on:update:model-value="
                          orderChanged(order.raw[0].guid)
                        "
                        v-on:update:focused="
                          updateSpecialOrder(order.raw[0].UNP)
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field
                        variant="solo"
                        density="compact"
                        hide-details
                        v-model="order.raw[0].quantity"
                        label="Количество"
                        required
                        v-on:update:model-value="
                          orderChanged(order.raw[0].guid)
                        "
                        v-on:update:focused="
                          updateSpecialOrder(order.raw[0].UNP)
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <div
                    v-for="(item, ind) in order.raw as SpecialOrders"
                    :key="`${i}-${ind}`"
                  >
                    <v-card
                      variant="tonal"
                      :color="
                        changed === item.guid
                          ? 'red'
                          : item.status === 0
                          ? 'grey-lighten-2'
                          : item.status === 1
                          ? 'grey-lighten-2'
                          : item.status === 2
                          ? 'light-blue-lighten-2'
                          : item.status === 3
                          ? 'lime-lighten-3'
                          : item.status === 4
                          ? 'yellow-lighten-3'
                          : item.status === 5
                          ? 'green-lighten-3'
                          : item.status === 6
                          ? 'orange-lighten-2'
                          : item.status === 7
                          ? 'blue -lighten-5'
                          : item.status === 8
                          ? 'red-lighten-5'
                          : 'grey-lighten-5'
                      "
                    >
                      <v-row dense class="pb-0 pt-1 mb-2">
                        <v-col cols="12" md="1">
                          <v-text-field
                            density="compact"
                            variant="solo"
                            hide-details
                            v-model="item.price"
                            label="Цена"
                            v-on:update:model-value="orderChanged(item.guid)"
                            v-on:update:focused="updateSpecialOrder(item.UNP)"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="1">
                          <v-text-field
                            variant="solo"
                            density="compact"
                            hide-details
                            v-model="item.term"
                            label="Срок"
                            v-on:update:model-value="orderChanged(item.guid)"
                            v-on:update:focused="updateSpecialOrder(item.UNP)"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="5">
                          <v-text-field
                            variant="solo"
                            density="compact"
                            hide-details
                            v-model="item.response"
                            label="Комментарий"
                            v-on:update:model-value="orderChanged(item.guid)"
                            v-on:update:focused="updateSpecialOrder(item.UNP)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="1">
                          <v-select
                            :items="ordertype"
                            density="compact"
                            item-title="name"
                            item-value="id"
                            v-model="item.type"
                            label="Tип"
                            hide-details
                            variant="solo"
                            :return-object="false"
                            v-on:update:model-value="orderChanged(item.guid)"
                            v-on:update:focused="updateSpecialOrder(item.UNP)"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-autocomplete
                            clearable
                            :items="suppliers"
                            density="compact"
                            item-title="name"
                            item-value="id"
                            v-model="item.supplier"
                            label="Поставщик"
                            hide-details
                            variant="solo"
                            :return-object="false"
                            v-on:update:model-value="orderChanged(item.guid)"
                            v-on:update:focused="updateSpecialOrder(item.UNP)"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="1">
                          <v-select
                            :items="specialOrdersStatusList"
                            v-on:update:menu="
                              statusBeforeUpdate(item.status, item.guid)
                            "
                            density="compact"
                            item-title="name"
                            item-value="id"
                            v-model="item.status"
                            label="Статус"
                            hide-details
                            variant="solo"
                            :return-object="false"
                            v-on:update:model-value="orderChanged(item.guid)"
                            v-on:update:focused="updateStatus(item.status)"
                          ></v-select>
                        </v-col>
                        <v-col
                          class="d-flex align-self-center justify-center"
                          cols="12"
                          md="1"
                        >
                          <v-btn
                            v-if="item.status !== 7"
                            variant="tonal"
                            size="x-small"
                            hide-details
                            icon="mdi-check-bold"
                            :color="changed === item.guid ? 'red' : 'blue'"
                          ></v-btn>

                          <v-chip
                            v-if="item.status !== 7"
                            variant="tonal"
                            size="x-small"
                            color="green"
                            @click="addSpecialOrder(item)"
                          >
                            <v-icon icon="mdi-plus"></v-icon>
                          </v-chip>

                          <v-text-field
                            v-if="item.status === 7"
                            variant="solo"
                            density="compact"
                            hide-details
                            v-model="item.ordernumber"
                            label="Накладная"
                            readonly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <v-toolbar class="px-2 position-fixed" style="z-index: 1000">
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="Поиск"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 300px"
              variant="solo"
              clearable
              hide-details
            ></v-text-field>
            <div>
              <v-select
                :items="ordertype"
                density="compact"
                item-title="name"
                item-value="id"
                v-model="typeFilter"
                label="Tип"
                hide-details
                variant="solo"
                :return-object="false"
                v-on:update:model-value=""
                v-on:update:focused=""
              ></v-select>
            </div>
            <div>
              <v-autocomplete
                width="150"
                clearable
                :items="suppliers"
                density="compact"
                item-title="name"
                item-value="id"
                v-model="supplierFilter"
                label="Поставщик"
                hide-details
                variant="solo"
                :return-object="false"
                v-on:update:model-value=""
                v-on:update:focused=""
              ></v-autocomplete>
            </div>
            <div>
              <v-select
                :items="specialOrdersStatusList"
                density="compact"
                item-title="name"
                item-value="id"
                v-model="statusFilter"
                label="Статус"
                hide-details
                variant="solo"
                :return-object="false"
                v-on:update:model-value=""
                v-on:update:focused=""
              ></v-select>
            </div>
            <div>
              <v-btn
                class="mx-2"
                density="comfortable"
                icon="mdi-update"
                variant="tonal"
                rounded
                v-tooltip="'Обновить список заказов'"
                @click="refreshSpecialOrders()"
              ></v-btn>

              <v-btn
                class="mx-2"
                density="comfortable"
                icon="mdi-file-export"
                variant="tonal"
                rounded
                v-tooltip="'Сохранить в файл Excel'"
                @click="exportSpecialOrders()"
              ></v-btn>
            </div>

            <div
              class="d-flex align-center justify-center pa-4 hidden-md-and-down"
              style="flex-grow: 1"
            >
              <v-btn
                :disabled="page === 1"
                density="comfortable"
                icon="mdi-arrow-left"
                variant="tonal"
                rounded
                @click="prevPage"
              ></v-btn>

              <div class="mx-2 text-caption">
                Стр {{ page }} из {{ pageCount }}
              </div>

              <v-btn
                :disabled="page >= pageCount"
                density="comfortable"
                icon="mdi-arrow-right"
                variant="tonal"
                rounded
                @click="nextPage"
              ></v-btn>
            </div>

            <span class="subheading mx-2 text-caption hidden-md-and-down"
              >Заказов на странице:</span
            >
            <v-chip-group
              mandatory
              filter
              class="subheading mx-2 text-caption hidden-md-and-down"
            >
              <v-chip @click="ipp = 5">5</v-chip>
              <v-chip @click="ipp = 7">7</v-chip>
              <v-chip @click="ipp = 12">12</v-chip>
              <v-chip @click="ipp = 24">24</v-chip>
            </v-chip-group>
          </v-toolbar>
        </template>

        <template v-slot:loader>
          <v-row dense>
            <v-col
              v-for="(_, k) in [0, 1, 2, 3]"
              :key="k"
              cols="auto"
              md="3"
              max-width="400px"
              min-width="200px"
              height="500"
              density="dense"
            >
              <v-skeleton-loader
                class="border"
                type="image, list-item-two-line, table,table-row"
                flat
                max-width="1800"
                min-width="1000"
                height="800"
                density="dense"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}

        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="snackbar = false">
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import dayjs from "dayjs";

import ExcelJS from "exceljs";
const serviceMode = inject<Ref<number>>("serviceMode") ?? ref(0);
const value = ref([]);
const visits = ref([]);
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];
const maxNumber = ref(0);
watchEffect(async () => {
  console.log("serviceMode", serviceMode.value);
  if (serviceMode.value === 1) {
    visits.value = await $fetch("/api/readLoginLog");
    const groupedVisits = visits.value.reduce((acc, curr) => {
      const date = dayjs(curr.Date).format("YYYY-MM-DD");
      if (!acc[date]) acc[date] = {};
      if (!acc[date][curr.Login]) acc[date][curr.Login] = 0;
      acc[date][curr.Login]++;
      return acc;
    }, {});
    value.value = Object.entries(groupedVisits)
      .slice(-18)
      .map(([date, logins]) => {
        return Object.keys(logins).length;
      });
  }
});
dayjs.locale("ru");
const loginData = inject<Ref<LoginResponse>>("loginData");
const specialOrders = ref<SpecialOrders[]>([]);

const loading = ref(false);
const ipp = ref(5);
const typeFilter = ref(0);
const statusFilter = ref(0);
const supplierFilter = ref(0);
const currstatus = ref(0);
const search = shallowRef("");
const changed = shallowRef("");
const mng = inject<Ref<boolean>>("mng", ref(false));
if (!mng.value) navigateTo("/");

const snackbar = ref(false);
const text = ref("Данные успешно записаны.");
const timeout = ref(1000);

const specialOrdersSkladList = [
  { id: 0, name: "Минск" },
  { id: 1, name: "Москва" },
];

const ordertype = [
  { id: 0, name: "ВСЕ" },
  { id: 1, name: "РБ-РФ" },
  { id: 2, name: "СЕТ" },
  { id: 3, name: "Европа" },
];

const suppliers = [
  { id: 0, name: "ВСЕ" },
  { id: 1, name: "СЛУЧАЙНЫЙ" },
  { id: 2, name: "СЕТ" },
  { id: 3, name: "КиП" },
  { id: 4, name: "Булат/ 7Q" },
  { id: 5, name: "Рамис" },
  { id: 6, name: "РМ" },
  { id: 7, name: "Колортек" },
  { id: 8, name: "ЗипЗИп" },
  { id: 9, name: "МАМОНТ" },
  { id: 10, name: "Ресурс Медиа" },
  { id: 11, name: "Оптикарт" },
  { id: 12, name: "Бигцмык" },
  { id: 13, name: "Файлер Мастер" },
  { id: 14, name: "ВТТ" },
  { id: 15, name: "а1Тис" },
  { id: 16, name: "Снами" },
  { id: 17, name: "Нереида" },
  { id: 18, name: "Артронас" },
  { id: 19, name: "Белхард" },
  { id: 20, name: "Канцмашины" },
  { id: 21, name: "Сдлайф (корп стандарт)" },
  { id: 22, name: "Бизнес Акила Плюс" },
  { id: 23, name: "Асбис" },
  { id: 24, name: "Байпринт" },
  { id: 25, name: "Спринкс" },
  { id: 26, name: "Принтлюкс" },
  { id: 27, name: "Шаргуд" },
  { id: 28, name: "АРАД" },
  { id: 29, name: "Будаев" },
  { id: 30, name: "Побач" },
  { id: 31, name: "Принттехника" },
  { id: 32, name: "Все про офис" },
  { id: 33, name: "Копиклаб" },
  { id: 34, name: "Копимедиа (КМГ)" },
  { id: 35, name: "Инкор" },
  { id: 36, name: "Изипринт" },
  { id: 37, name: "Мартел" },
  { id: 38, name: "Центр обслуживания оргтехники" },
  { id: 39, name: "Элпай" },
  { id: 40, name: "Троцкий" },
  { id: 41, name: "Штайгертех" },
  { id: 42, name: "Копирка бай" },
  { id: 43, name: "Трайдекс бел" },
  { id: 44, name: "Мипс" },
  { id: 45, name: "НордПринт" },
  { id: 46, name: "Приоритет Качества" },
  { id: 47, name: "Гига маркет" },
  { id: 48, name: "Саулюс" },
  { id: 49, name: "Биуро" },
  { id: 50, name: "Лига Тим" },
  { id: 51, name: "Скорпион" },
  { id: 52, name: "Германия" },
];
const specialOrdersStatusList = [
  { id: 0, name: "ВСЕ" },
  { id: 1, name: "Новый" },
  { id: 2, name: "Запросила" },
  { id: 3, name: "Обработан" },
  { id: 4, name: "Везти" },
  { id: 5, name: "Заказан" },
  { id: 6, name: "Отменен" },
  { id: 7, name: "Прибыл" },
  { id: 8, name: "Удалить" },
];
//const ordertype = ["Все", "РБ-РФ", "СЕТ", "Европа"];
onMounted(async () => {
  //loading.value = true;
  //specialOrders.value = await getSpecialOrders();
  //loading.value = false;
});

const refreshSpecialOrders = async () => {
  loading.value = true;
  specialOrders.value = await getSpecialOrders();

  loading.value = false;
};
//if (loginData) console.log(loginData?.Kontragent[0]?.UNP);

const getSpecialOrders = async () => {
  const orderData = await $fetch("/api/readAllSpecialOrders");
  if (!orderData) return [];
  maxNumber.value =
    orderData.reduce((max, order) => {
      const number = Number(order.number);
      return number > max ? number : max;
    }, 0) + 1;
  orderData.forEach((order) => {
    if (order.number === "" || order.number === 0) {
      maxNumber.value++;
      order.number = String(maxNumber.value);
    }
    if (order.sklad === null || order.sklad === undefined) order.sklad = 0;
  });
  return orderData.filter((order: SpecialOrders) => order.status !== 8);
};

//specialOrders.value = await getSpecialOrders();

const writeSpecialOrderMng = async (UNP: string) => {
  if (specialOrders.value) {
    await $fetch("/api/writeSpecialOrderMng", {
      method: "POST",
      body: JSON.stringify({
        unp: UNP,
        order: specialOrders.value.filter((order) => order.UNP === UNP),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    changed.value = "";
  }
};
const updateSpecialOrder = async (UNP) => {
  //console.log(specialOrders.value);
  snackbar.value = true;
  await writeSpecialOrderMng(UNP);
};
const orderChanged = (uid: string) => {
  const idx = specialOrders.value?.findIndex((item) => item.guid === uid);
  if (idx !== -1 && specialOrders) {
    specialOrders.value[idx].date = String(
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    );
  }
  changed.value = uid;
};

const customSearch = (value: any, search: string, item: any) => {
  //console.log(item.raw);
  const searchKeys = [
    "client",
    "good",
    "response",
    "manager",
    "number",
  ] as const; // Add the keys you want to search within
  const searchWords = search.toLowerCase().split(" "); // Разбить строку поиска на отдельные слова

  return searchWords.every((word) =>
    searchKeys.some((key) =>
      item.raw.find((i) => String(i[key]).toLowerCase().includes(word))
    )
  );
};
const exportSpecialOrders = async () => {
  // ...
  const specialOrdersData = specialOrders.value;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Special Orders");
  worksheet.columns = [
    { header: "УНП", key: "UNP" },
    { header: "Клиент", key: "client" },
    { header: "УНП клиента", key: "ClientUNP" },
    { header: "Дата", key: "date" },
    { header: "Товар", key: "good" },
    { header: "Склад", key: "sklad" },
    { header: "Менеджер", key: "manager" },
    { header: "Номер", key: "number" },

    { header: "Цена", key: "price" },
    { header: "Срок", key: "term" },
    { header: "Количество", key: "quantity" },
    { header: "Ответ", key: "response" },
    { header: "Статус", key: "status" },

    { header: "Поставщик", key: "supplier" },
    { header: "Номер приходной", key: "ordernumber" },

    { header: "Тип", key: "type" },
    { header: "Версия", key: "version" },
    { header: "GUID", key: "guid" },
  ];
  specialOrdersData.forEach((order) => {
    worksheet.addRow(order);
  });
  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "special_orders.xlsx";
  a.click();
};

const filteredSpecialOrders = computed(() => {
  const type =
    typeFilter.value === 0
      ? specialOrders.value.map((order) => order.type)
      : [typeFilter.value];
  const status =
    statusFilter.value === 0
      ? specialOrders.value.map((order) => order.status)
      : [statusFilter.value];
  const supplier =
    supplierFilter.value === 0
      ? specialOrders.value.map((order) => order.supplier)
      : [supplierFilter.value];

  return specialOrders.value
    .filter(
      (order) =>
        type.includes(order.type) &&
        status.includes(order.status) &&
        supplier.includes(order.supplier)
    )
    
});
const groupedSpecialOrders = computed(() => {
  // const emptyNumberOrders = filteredSpecialOrders.value.filter(
  //   (order) => order.number === ""
  // );

  const nonEmptyNumberOrders = filteredSpecialOrders.value.filter(
    (order) => order.number !== ""
  );

  const groupedNonEmpty = nonEmptyNumberOrders
    .slice()

    .reduce((acc, order) => {
      const key = `${order.number}-${order.manager}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});

  // console.log("sortedGroupedNonEmpty:", nonEmptyNumberOrders);

  // const groupedEmpty = emptyNumberOrders.slice().reduce((acc, order) => {
  //   const key = `${order.guid}`;
  //   if (!acc[key]) {
  //     acc[key] = [];
  //   }
  //   acc[key].push(order);
  //   return acc;
  // }, {});

  const allGrouped = [...Object.values(groupedNonEmpty)];
  return allGrouped;
});

const statusBeforeUpdate = (status: number, guid: string) => {
  changed.value = guid;
  console.log("guid:", guid, "New:", status, " Old:", currstatus.value);
  let specialorder = specialOrders.value.find((order) => order.guid === guid);
  if (status >= currstatus.value) {
    currstatus.value = status;
  } else {
    specialorder = specialOrders.value.find((order) => order.guid === guid);
    if (specialorder) {
      specialorder.status = currstatus.value;
      console.log("set status:", currstatus.value);
    }
  }

  currstatus.value = status;
  if (specialorder) {
    updateSpecialOrder(specialorder.UNP);
  }
};

const updateStatus = (status: number) => {
  console.log("New:", status, " Old:", currstatus.value);
  // currstatus.value = status;
};

const addSpecialOrder = async (order: SpecialOrders) => {
  specialOrders.value?.push({
    ClientUNP: order.ClientUNP,
    UNP: order.UNP,
    client: order.client,
    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    good: order.good,
    guid: crypto.randomUUID(),
    manager: order.manager,
    number: order.number,
    ordernumber: order.ordernumber,
    price: "",
    quantity: order.quantity,
    response: "",
    status: 1,
    sklad: order.sklad,
    supplier: 0,
    term: "",
    type: order.type,
    version: order.version++,
  });
  await writeSpecialOrderMng(order.UNP);
};
</script>

<style scoped>
:deep(.v-container) {
  padding: 5px !important;
  max-width: 100% !important;
}
:deep(.v-text-field input) {
  font-size: smaller !important;
}
:deep(.v-text-field input::placeholder) {
  font-size: smaller !important;
  margin-top: 4px !important;
}
:deep(.v-select .v-select__selection-text) {
  font-size: x-small !important;
}
:deep(.v-autocomplete .v-field) {
  font-size: x-small !important;
}
:deep(.v-list-item-title) {
  font-size: x-small !important;
}
:deep(.xsmalltext) {
  font-size: xx-small !important;
}
</style>
