<template>
  <div id="invoices" v-if="auth">
    
    <template v-if="orders?.length>0">
      <v-card>
        <v-table height="500" fixed-header hover>
          <thead>
            <tr>
              <th class="text-left">Номер</th>
              <th class="text-left">Дата</th>
              <th class="text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orders" :key="item.Zakaz">
              <v-tooltip
                origin="overlap"
                :open-delay="200"
                :close-delay="300"
                opacity-10
              >
                <v-icon icon="mdi-magnify-plus"></v-icon>
                <template v-slot:activator="{ props }">
                  <td v-bind="props" @click="getOrder(item.Zakaz, item.Дата)">
                    {{ item.Zakaz }}
                  </td>
                  <td v-bind="props" @click="getOrder(item.Zakaz, item.Дата)">
                    {{
                      new Date(item.Дата).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }}
                  </td>
                  <td v-bind="props" @click="getOrder(item.Zakaz, item.Дата)">
                    {{ item.Status }}
                  </td>
                </template>
              </v-tooltip>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </template>
    <template>
      <div class="pa-4 text-center">
        <v-dialog activator="table">
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-title>
                Заказ № {{ selectedOrderNumber }} от
                {{
                  new Date(selectedOrderDate).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                }}
                г
              </v-card-title>
              <v-table density="compact" height="450" fixed-header hover>
                <thead>
                  <tr>
                    <th class="text-left">Код</th>
                    <th class="text-left">Наименование</th>
                    <th class="text-left">Кол-во</th>
                    <th class="text-left">Цена, {{ order.Valuta }}</th>
                    <th class="text-left" style="width: 150px;">Сумма, {{ order.Valuta }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in order.products" :key="i">
                    <td>
                      {{ item.Code }}
                    </td>
                    <td>
                      {{ item.naim }}
                    </td>
                    <td>
                      {{ item.quantity }}
                    </td>
                    <td>
                      {{ item.PriceWithNDS }}
                    </td>
                    <td>
                      {{ item.SummaWithNDS }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">ИТОГО:</td>
                    <td>{{ order.SummaDokumenta }} {{ order.Valuta }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-card-text> Комментарий: {{ order.Comment }} </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="surface-variant"
                  text="Закрыть"
                  variant="flat"
                  @click="isActive.value = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </template>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>

const auth = inject<Ref<boolean>>("auth", ref(false));
// if (!auth) navigateTo("/");
// const mng = inject<Ref<boolean>>("mng", ref(false));
// const boss = inject<Ref<boolean>>("boss", ref(false));
// const selectedContragentData = inject<Contragents>("selectedContragentData");
  const orders = inject<Orders[]>("orders", []);
const order = ref<Order>({
  Comment: "",
  SummaDokumenta: "",
  Valuta: "",
  products: [],
});

const isActive = ref(false);
const selectedOrderNumber = ref("");
const selectedOrderDate = ref("");
const getOrder = async (orderNumber: string, orderDate: string) => {
  const orderData = await $fetch("/api/getOrder", {
    method: "POST",
    body: JSON.stringify({
      order: orderNumber,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  order.value = orderData;
  isActive.value = true;
  selectedOrderNumber.value = orderNumber;
  selectedOrderDate.value = orderDate;
};


</script>

<style></style>
