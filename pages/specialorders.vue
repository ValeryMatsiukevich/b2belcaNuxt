<template>
  <div>
    <ClientOnly>
      <v-card>
        <v-data-iterator
          float
          :items="groupedSpecialOrders"
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
              <!-- <div v-for="(order, i) in items" :key="i">
                {{ order.raw[0].}}
                <p>Number raw: {{ order.raw[0].0].number }}</p>
               
               
                <div v-for="(item, ind) in order.raw[0]. :key="`${i}-${ind}`">
                  <div>
                    <p>Number: {{ item.number }}</p>
                    
                    <p>Version: {{ item.version }}</p>
                  
                  </div>
                </div>
              </div> -->

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
                            dayjs(order.raw[0].date).format(
                              'DD.MM.YYYY HH:mm:ss'
                            )
                          "
                          label="Дата и время"
                          density="compact"
                          style="font-size: xx-small"
                        ></v-text-field>
                      </v-col>
                 
                        <v-select
                          :items="specialOrdersSkladList"
                          density="compact"
                          item-title="name"
                          item-value="id"
                          v-model="order.raw[0].sklad"
                          label="Склад"
                          hide-details
                          variant="solo"
                          :return-object="false"
                          v-on:update:model-value="
                            orderChanged(order.raw[0].guid)
                          "
                          v-on:update:focused="updateSpecialOrder()"
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
                          required
                          v-on:update:model-value="
                            orderChanged(order.raw[0].guid)
                          "
                          v-on:update:focused="updateSpecialOrder()"
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
                          v-on:update:focused="updateSpecialOrder()"
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
                          v-on:update:focused="updateSpecialOrder()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <div
                     
                      v-for="(item, ind) in order.raw"
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
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="1">
                            <v-text-field
                              variant="solo"
                              density="compact"
                              hide-details
                              v-model="item.term"
                              label="Срок"
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="5">
                            <v-text-field
                              variant="solo"
                              density="compact"
                              hide-details
                              v-model="item.response"
                              label="Комментарий"
                              readonly
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
                              v-on:update:focused="updateSpecialOrder()"
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
                              v-on:update:focused="updateSpecialOrder()"
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
                              color="red"
                              @click="(item.status = 8), updateSpecialOrder()"
                            >
                              <v-icon icon="mdi-close"></v-icon>
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
                  icon="mdi-plus"
                  variant="tonal"
                  rounded
                  @click="addSpecialOrder()"
                  v-tooltip="'Создать новый заказ'"
                ></v-btn>
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
                <v-btn
                  class="mx-2"
                  density="comfortable"
                  icon="mdi-file-import"
                  variant="tonal"
                  rounded
                  v-tooltip="'Загрузить из файла Excel'"
                  @click="importSpecialOrders()"
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
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import ExcelJS from "exceljs";

dayjs.locale("ru");
const loginData = inject<Ref<LoginResponse>>("loginData");
const specialOrders = ref<SpecialOrders[]>([]);
const specialOrdersMng = ref<SpecialOrders[]>([]);

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
  loading.value = true;
  specialOrders.value = await getSpecialOrder();
  specialOrdersMng.value = await getSpecialOrderMng();

  combineOrders();
  loading.value = false;
});

const combineOrders = () => {
  console.log("combineOrders");
  specialOrdersMng.value.forEach((mngOrder) => {
    const specialOrder = specialOrders.value?.find(
      (order) => order.guid === mngOrder.guid
    );

    if (specialOrder && dayjs(mngOrder.date) > dayjs(specialOrder.date)) {
      console.log(
        "mngOrder.date:",
        mngOrder.date,
        "specialOrder.date:",
        specialOrder.date
      );
      specialOrder.price = mngOrder.price;
      specialOrder.number = mngOrder.number;
      specialOrder.version = mngOrder.version;
      specialOrder.term = mngOrder.term;
      specialOrder.response = mngOrder.response;
      specialOrder.date = mngOrder.date;
      specialOrder.status = mngOrder.status;
      specialOrder.supplier = mngOrder.supplier;
      specialOrder.ordernumber = mngOrder.ordernumber;
    } else if (!specialOrder) {
      specialOrders.value.push(mngOrder);
    }
  });
};
const refreshSpecialOrders = async () => {
  loading.value = true;
  specialOrders.value = await getSpecialOrder();
  specialOrdersMng.value = await getSpecialOrderMng();
  combineOrders();
  loading.value = false;
};
//if (loginData) console.log(loginData?.Kontragent[0]?.UNP);
const getSpecialOrder = async () => {
  const orderData = await $fetch("/api/readSpecialOrder", {
    method: "POST",
    body: JSON.stringify({
      unp: loginData?.value?.Kontragent[0]?.UNP,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!orderData) return [];
  const filteredOrderData = orderData; //.filter(
  //(order: SpecialOrders) => order.status !== 8
  //);
  //console.log(filteredOrderData);

  return filteredOrderData;
  // .sort(
  //   (a: SpecialOrders, b: SpecialOrders) =>
  //     dayjs(b.date).unix() - dayjs(a.date).unix()
  // );
};

const getSpecialOrderMng = async () => {
  const orderData = await $fetch("/api/readSpecialOrderMng", {
    method: "POST",
    body: JSON.stringify({
      unp: loginData?.value?.Kontragent[0]?.UNP,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!orderData) return;

  //console.log(orderData);

  return orderData;
  // .sort(
  //   (a: SpecialOrders, b: SpecialOrders) =>
  //     dayjs(b.date).unix() - dayjs(a.date).unix()
  // );
};

specialOrders.value = await getSpecialOrder();
specialOrdersMng.value = await getSpecialOrderMng();
const writeSpecialOrder = async () => {
  if (specialOrders.value) {
    await $fetch("/api/writeSpecialOrder", {
      method: "POST",
      body: JSON.stringify({
        unp: loginData?.value?.Kontragent[0]?.UNP,
        order: specialOrders.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    changed.value = "";
  }
};
const updateSpecialOrder = async () => {
  //console.log(specialOrders.value);
  snackbar.value = true;
  await writeSpecialOrder();
};
const orderChanged = (uid: string) => {
  const idx = specialOrders.value?.findIndex((item) => item.guid === uid);
  if (idx !== -1 && specialOrders.value) {
    specialOrders.value[idx].date = String(
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    );
  }
  changed.value = uid;
};
const customSearch = (value: any, search: string, item: any) => {
  const searchKeys = ["client", "good", "response"] as const; // Add the keys you want to search within
  const searchWords = search.toLowerCase().split(" "); // Разбить строку поиска на отдельные слова

  return searchWords.every((word) =>
    searchKeys.some((key) => String(item.raw[key]).toLowerCase().includes(word))
  );
};
const addSpecialOrder = async () => {
  specialOrders.value?.push({
    ClientUNP: "",
    UNP: loginData?.value?.Kontragent[0]?.UNP,
    client: "",
    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    good: "",
    guid: crypto.randomUUID(),
    manager: loginData?.value?.Kontragent[0]?.Kontragent,
    number: "",
    ordernumber: "",
    price: "",
    quantity: 0,
    response: "",
    status: 1,
    sklad: 0,
    supplier: 0,
    term: "",
    type: 1,
    version: 0,
  });
  await writeSpecialOrder();
  await refreshSpecialOrders();
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

const importSpecialOrders = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0]; // access the first worksheet
    if (worksheet) {
      const specialOrdersData: SpecialOrders[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // skip the header row
          const order: SpecialOrders = {
            UNP: loginData?.value?.Kontragent[0]?.UNP,
            client: row.getCell(2).value as string,
            ClientUNP: row.getCell(3).value as string,
            date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            good: row.getCell(5).value as string,
            guid: crypto.randomUUID(),
            manager: loginData?.value?.Kontragent[0]?.Kontragent,
            number: "",
            ordernumber: "",
            price: "",
            quantity: row.getCell(11).value as number,
            response: "",
            status: 1,
            sklad: row.getCell(6).value as number,
            supplier: 0,
            term: "",
            type: row.getCell(16).value as number,
            version: 0,
          };
          specialOrdersData.push(order);
        }
      });
      specialOrders.value.push(...specialOrdersData);
      await writeSpecialOrder();
    } else {
      console.error("No worksheets found in the workbook");
    }
  };
  input.click();
};
const groupedSpecialOrders = computed(() => {
  const grouped = filteredSpecialOrders.value
    .slice()
    .sort((a, b) => a.version - b.version)
    .reduce((acc, order) => {
      const key = `${order.number}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});

  return Object.values(grouped).sort((a, b) => {
    const numberA = a[0].number === "" ? -Infinity : -Number(a[0].number);
    const numberB = b[0].number === "" ? -Infinity : -Number(b[0].number);
    return numberA - numberB;
  });
});
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
    .sort(
      (a: SpecialOrders, b: SpecialOrders) =>
        dayjs(b.date).unix() - dayjs(a.date).unix()
    );
});

const statusBeforeUpdate = (status: number, guid: string) => {
  changed.value = guid;
  console.log("guid:", guid, "New:", status, " Old:", currstatus.value);
  
  if (status >= currstatus.value) {
    currstatus.value = status;
  } else {
    let specialorder = specialOrders.value.find((order) => order.guid === guid);
    if (specialorder) {
      specialorder.status = currstatus.value;
      console.log("set status:", currstatus.value);
    }
  }
    
  currstatus.value = status;
  updateSpecialOrder();
  
};

const updateStatus = (status: number) => {
  console.log("New:", status, " Old:", currstatus.value);
  // currstatus.value = status;
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
