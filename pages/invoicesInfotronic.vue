<template>
  <div id="inovicesInfotronic" v-if="auth">
    
    <template v-if="ordersInfotronic && ordersInfotronic.length > 0">
      <v-card>
        <v-table height="500" fixed-header hover>
          <thead>
            <tr>
              <th class="text-left">Номер</th>
              <th class="text-left">Дата</th>
              <th class="text-left">Просмотреть</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ordersInfotronic" :key="item.Number">
              <v-tooltip
                origin="overlap"
                :open-delay="200"
                :close-delay="300"
                opacity-10
              >
                <v-icon icon="mdi-magnify-plus"></v-icon>
                <template v-slot:activator="{ props }">
                  <td v-bind="props" @click="getOrder(item.Number)">
                    {{ item.Number }}
                  </td>
                  <td v-bind="props" @click="getOrder(item.Number)">
                    {{
                      new Date(item.Date).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }}
                  </td>
                  <td v-bind="props" @click="getOrder(item.Number)"></td>
                </template>
              </v-tooltip>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </template>
    <template v-if="selectedOrder !== null">
      <div class="pa-4 text-center" V-if="selectedOrder !== null">
        <v-dialog activator="table">
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-title>
                Заказ № {{ selectedOrder.Number }} от
                {{
                  new Date(selectedOrder.Date).toLocaleDateString("ru-RU", {
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
                    <th class="text-left">Артикул</th>
                    <th class="text-left">Наименование</th>
                    <th class="text-left">Кол-во</th>
                    <th class="text-left">Ост Трост</th>
                    <th class="text-left">Рез Трост</th>
                    <th class="text-left">Ост Коласа</th>
                    <th class="text-left">Рез Коласа</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in selectedOrder.Товары" :key="i">
                    <td>
                      {{ item.NomCode }}
                    </td>
                    <td>
                      {{ item.Articul }}
                    </td>
                    <td>
                      {{ getNaim(item.Номенклатура_Key) }}
                    </td>
                    <td>
                      {{ item.Количество }}
                    </td>
                    <td>
                      {{ ostTrost(item.Номенклатура_Key) }}
                    </td>
                    <td>
                      {{ resTrost(item.Номенклатура_Key) }}
                    </td>
                    <td>
                      {{ ostKol(item.Номенклатура_Key) }}
                    </td>
                    <td>
                      {{ resKol(item.Номенклатура_Key) }}
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text="Перенести в корзину"
                  variant="flat"
                  @click="(isActive.value = false), copyToBasket()"
                ></v-btn>
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
const goods = inject<Ref<Goods[]>>("goods");

const auth = inject<Ref<boolean>>("auth", ref(false));

const ordersInfotronic = inject<Ref<orderInfotronic[]>>("ordersInfotronic");
const selectedContragentData = inject<Ref<Contragents>>(
  "selectedContragentData"
);
const cart = inject<Ref<Order[]>>("cart", ref([]));

const isActive = ref(false);
const selectedOrder = ref<any>(null);
const getArticle = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good) return good.Articul;
    else return "НЕ БЕЛКА";
  }
};
const getCode = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good) return good.NomCode;
    else return "НЕ БЕЛКА";
  }
};
const getNaim = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good) return good.NomNaim;
    else return "НЕ БЕЛКА";
  }
};
const ostTrost = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good && good.hasOwnProperty("good.Skl000000006"))
      return good.Skl000000006;
    else if (good && good.Quantity !== undefined) return good.Quantity;
    else return 0;
  }
};
const resTrost = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good && good.hasOwnProperty("good.Res000000006"))
      return good.Res000000006;
    else return "0";
  }
};
const ostKol = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good && good.hasOwnProperty("good.Skl000000014"))
      return good.Skl000000014;
    else return "0";
  }
};
const resKol = (Номенклатура_Key: string) => {
  if (goods) {
    let good = goods.value.find((g) => g.Ref_Key === Номенклатура_Key);
    if (good && good.hasOwnProperty("good.Res000000014"))
      return good.Res000000014;
    else return "0";
  }
};
const getOrder = (orderNumber: string) => {
  console.log(orderNumber);
  if (ordersInfotronic && ordersInfotronic.value) {
    selectedOrder.value = ordersInfotronic.value.find(
      (on: any) => on.Number === orderNumber
    );
    if (selectedOrder.value) {
      selectedOrder.value.Товары.forEach((good: Goods) => {
        good.NomCode = getCode(good.Номенклатура_Key);
        good.Articul = getArticle(good.Номенклатура_Key);
        console.log("good.NomCode ", good.NomCode);
      });
    }
    isActive.value = true;
  } else {
    console.error("ordersInfotronic is not defined or empty");
  }
};

const writeOrder = async () => {
  if (selectedContragentData && cart) {
    const cartValue = cart.value; // Cast cart to Ref<Goods[]>
    const orderData = await $fetch("/api/writeOrder", {
      method: "POST",
      body: JSON.stringify({
        unp: selectedContragentData.value.UNP,
        order: cartValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
const copyToBasket = () => {
  // Add order to basket logic here
  cart.value = [];
  if (goods && goods.value && selectedOrder.value) {
    selectedOrder.value.Товары.forEach((good: Goods) => {
      const item = {
        NomCode: good.NomCode,
        Quantity: good.Количество,
        Price: "1,00",
        inCart: good.Количество,
        Valuta: "BYN",
        NomNaim: goods.value.find((g:Goods) => g.NomCode === good.NomCode)?.NomNaim,
      };

      cart.value.push(item);

      console.log("item ", item);
    });

    writeOrder();
    console.log("Order added to cart");
  } else {
    console.error("Selected order is not defined");
  }
};


</script>

<style></style>
