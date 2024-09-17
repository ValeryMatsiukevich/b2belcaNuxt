<template>
  <div id="ProductList">
    <!-- Product list {{ route.params }}   -->

    <!-- <v-breadcrumbs :items="breadcrumbs" density="compact"> </v-breadcrumbs> -->

    <v-card>
      <v-data-iterator
        :items="filteredGoods()"
        :items-per-page="ipp ? Number(ipp) : 8"
        :return-object="false"
        :loading="loading"
        fluid
        @update:loading="StartLoading"
        @update:options="StopLoading"
      >
        <template v-slot:default="{ items }">
          <v-container class="pa-2">
            <v-row dense>
              <v-col
                v-for="(item, i) in items"
                :key="i"
                cols="auto"
                md="6"
                xs="12"
              >
                <v-card
                  :color="isInCart(item.raw.NomCode) ? 'blue' : 'default'"
                  height="25vh"
                  variant="tonal"
                  :title="item.raw.NomCode"
                  rounded="0"
                >
                  <template v-slot:append>
                    <v-avatar rounded="0">
                      <v-img :src="goodPicture(item.raw.NomCode)"></v-img>
                    </v-avatar>
                  </template>
                  <v-card-text class="text-s">
                    {{
                      item.raw.NomNaim.charAt(0).toUpperCase() +
                      item.raw.NomNaim.slice(1)
                    }}
                  </v-card-text>

                  <v-card-subtitle>
                    <v-row>
                      <v-col cols="8" class="d-flex align-self-end price-tag">
                        <v-chip> {{ item.raw.Price }} </v-chip>
                        <v-chip variant="flat" color="primary"
                          >{{ item.raw.Quantity }}
                          <v-tooltip
                            class="opacity-80"
                            activator="parent"
                            location="top"
                            >На главном складе Тростенец</v-tooltip
                          >
                        </v-chip>
                      </v-col>
                      <v-col cols="4" class="d-flex align-self-end quantity">
                        <v-text-field
                          v-model="item.raw.inCart"
                          type="number"
                          density="compact"
                          variant="outlined"
                          append-icon="mdi-cart"
                          @click:append="addToCart(item.raw)"
                          :value="item.raw.inCart === 0 ? '' : item.raw.inCart"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <v-toolbar class="px-2">
            <v-text-field
              class="mt-5"
              v-model="search"
              append-inner-icon="mdi-close-circle"
              density="compact"
              placeholder="Фильтр списка товаров"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 30%"
              @click:append-inner="clearSearch"
              variant="outlined"
            ></v-text-field>
            <div
              class="d-flex align-center justify-center pa-4 hidden-md-and-down"
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
              >Товаров на странице:</span
            >
            <v-chip-group
              mandatory
              filter
              class="subheading mx-2 text-caption hidden-md-and-down"
            >
              <v-chip @click="ipp = '6'">6</v-chip>
              <v-chip @click="ipp = '12'">12</v-chip>
              <v-chip @click="ipp = '24'">24</v-chip>
              <v-chip @click="ipp = '48'">48</v-chip>
            </v-chip-group>
          </v-toolbar>
        </template>

        <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-4">
            <v-btn
              :disabled="page === 1"
              density="comfortable"
              icon="mdi-arrow-left"
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
              rounded
              @click="nextPage"
            ></v-btn>
          </div>
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
                type="image, article"
                flat
                max-width="400px"
                min-width="200px"
                height="500"
                density="dense"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tree = inject<Ref<string[]>>("tree", ref([])); // Initialize tree with an empty array
const selectedContragentData = inject<Contragents>("selectedContragentData");
//const goods = inject<Ref<Goods[]>>("goods", ref([]));
//const folders = inject<Ref<Goods[]>>("folders");
  const props = defineProps({
  folders: {
    type: Array as PropType<Goods[]>,
    required: true,
  },
  goods: {
    type: Array as PropType<Goods[]>,
    required: true,
  },
});
useHead(() => ({
  link: [
    {
      rel: "canonical",
      href: "https://b2.belca.by" + route.path,
    },
  ],
}));

const search = ref("");
const loading = ref(false);
const ipp = useCookie("ipp") || 6; // Add default value
const clearSearch = () => {
  search.value = "";
};
const StartLoading = () => {
  //console.log("StartLoading");
  loading.value = true;
};
const StopLoading = () => {
  //console.log("StopLoading");
  loading.value = false;
};

const filteredGoods = () => {
   const searchWords = search.value.trim().split(" ");

   if (route.params.catalog) {
     const id = route.params.catalog[1];

     if (id && tree && tree.value.length === 0) {
       return props.goods.filter(
         (good: Goods) => String(good.NomCode) === String(id)
       );
     }
   }

   if (tree && tree.value.length > 0) {
     const selectedCategory = tree.value[0];
     const filteredByCategory = props.goods.filter(
       (good: Goods) => good.RoditelCode === selectedCategory
     );

     if (searchWords.length > 0) {
       const filteredBySearch = filteredByCategory.filter((good: Goods) => {
         const goodName = good.NomNaim.toLowerCase();
         const goodCode = good.NomCode.toLowerCase();
         return (
           searchWords.every((word) => goodName.includes(word.toLowerCase())) ||
           searchWords.every((word) => goodCode.includes(word.toLowerCase()))
         );
       });
       return filteredBySearch;
     }

     return filteredByCategory;
   }

  // // Search the entire catalog when tree length is 0
   if (searchWords.length > 0) {
     const filteredBySearch = props.goods.filter((good: Goods) => {
       const goodName = good.NomNaim.toLowerCase();
       const goodCode = good.NomCode.toLowerCase();
       return (
         searchWords.every((word) => goodName.includes(word.toLowerCase())) ||
         searchWords.every((word) => goodCode.includes(word.toLowerCase()))
       );
     });
     return filteredBySearch;
   }
  
  return props.goods;
};

const goodPicture = (article: String) => {
  // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
  return "https://b2.belca.by/images/720/" + article + ".jpg";
};

const routeUtils = (NomCode: string) => {
  const item = props.goods.find((good: Goods) => good.NomCode === NomCode);
  //console.log(item?.RoditelCode);
  if (!item) {
    // console.log("!item");
    return "/catalog"; // Return default route if item is not found
  }
  if (item) {
    return "/catalog/" + item.NomCode;
  }
};

//Cart
const cart = useCookie<Array<any>>("cart");

if (!cart.value) {
  cart.value = [];
}

const isInCart = (NomCode: string) => {
  if (cart.value) {
    return cart.value.some((cartItem: any) => cartItem.NomCode === NomCode);
  }
  return false;
};
// Function to sync cart with goods
const syncCartWithGoods = () => {
  cart.value.forEach((cartItem: any) => {
    const goodIndex = props.goods.findIndex(
      (good: Goods) => good.NomCode === cartItem.NomCode
    );

    if (goodIndex !== -1) {
      props.goods[goodIndex].inCart = cartItem.inCart;
    }
  });
};

onMounted(() => {
  syncCartWithGoods();
});

const addToCart = (item: any) => {
  console.log(item.NomCode);

  item.Price = String(item.Price).replace(",", ".");
  cart.value.push(item);
};
</script>

<style scoped>
.price-tag {
  position: absolute;
  bottom: 5%;
  width: 50%;
  padding: 5px;
}

.quantity {
  position: absolute;
  bottom: -7%;
  right: 5%;
  width: auto;
  padding: 5px;
}
</style>

<script lang="ts">
export default {
  name: "AppProductList",
  // Add keep-alive to the component
  keepAlive: true,
};
</script>
