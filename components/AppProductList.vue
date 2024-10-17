<template>
  <div id="ProductList">
    <!-- Product list {{ route.params }}   -->

    <!-- <v-breadcrumbs :items="breadcrumbs" density="compact"> </v-breadcrumbs> -->

    <v-card>
      <v-data-iterator
        :items="filteredGoods()"
        :items-per-page="ipp ? Number(ipp) : 6"
        :return-object="false"
        :loading="loading"
        :search="search"
        :custom-filter="customSearch"
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
                cols="12"
                sm="6"
                md="4"
                xs="12"
              >
                <v-card
                  :color="
                    isInCart(item.raw.NomCode) ? 'cyan-darken-3' : 'default'
                  "
                  height="30vh"
                  variant="elevated"
                  class="border-opacity-100"
                  :title="item.raw.NomCode"
                  :subtitle="item.raw.Articul"
                  rounded="0"
                >
                  <v-dialog v-model="dialog" max-width="40%">
                    <v-card>
                      <v-img cover :src="currentImage"></v-img>
                    </v-card>
                  </v-dialog>
                  <template v-slot:append>
                    <v-avatar
                      width="100%"
                      height="100%"
                      rounded="0"
                      @click="
                        dialog = true;
                        currentImage = goodPicture(item.raw.NomCode);
                      "
                    >
                      <v-tooltip
                        origin="overlap"
                        :open-delay="100"
                        :close-delay="200"
                        opacity-10
                      >
                        <v-icon icon="mdi-magnify-plus"></v-icon>
                        <template v-slot:activator="{ props }">
                          <v-img
                            v-bind="props"
                            :src="goodPicture(item.raw.NomCode)"
                          >
                            <template v-slot:placeholder>
                              <div
                                class="d-flex align-center justify-center fill-height"
                              >
                                <v-progress-circular
                                  color="grey-lighten-4"
                                  model-value="100"
                                ></v-progress-circular>
                              </div>
                            </template>
                          </v-img>
                        </template>
                      </v-tooltip>
                    </v-avatar>
                    <v-btn
                      @click="toggleFav(item.raw.NomCode)"
                      variant="text"
                      :color="isFav(item.raw.NomCode) ? 'red' : 'grey'"
                      icon="mdi-heart"
                    ></v-btn>
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
                        <v-chip  variant="elevated" color="black">
                          {{ item.raw.Price }}
                          {{ selectedContragentData?.priceCurrency }}
                        </v-chip>
                        <v-chip
                          variant="flat"
                          :color="
                            item.raw.Skl000000006 > 0 ? 'primary' : 'orange'
                          "
                          >{{ item.raw.Skl000000006 || 0 }}
                          <v-tooltip
                            class="opacity-80"
                            activator="parent"
                            location="top"
                            >На главном складе Тростенец. В резервах
                            {{ item.raw.Res000000006 || 0 }}</v-tooltip
                          >
                        </v-chip>
                        <v-chip
                          variant="flat"
                          :color="
                            item.raw.Skl000000014 > 0 ? 'primary' : 'orange'
                          "
                          >{{ item.raw.Skl000000014 || 0 }}
                          <v-tooltip
                            class="opacity-80"
                            activator="parent"
                            location="top"
                            >На складе Коласа. В резервах
                            {{ item.raw.Res000000014 || 0 }}</v-tooltip
                          >
                        </v-chip>
                        <div
                          v-if="
                            selectedContragentData?.NePokazyvatSklandRegion !==
                            'Да'
                          "
                        >
                          <v-chip
                            v-if="selectedContragentData?.Gorod === 'brest'"
                            variant="flat"
                            :color="
                              item.raw.Skl000000055 > 0 ? 'primary' : 'orange'
                            "
                            >{{ item.raw.Skl000000055 || 0 }}
                            <v-tooltip
                              class="opacity-80"
                              activator="parent"
                              location="top"
                              >На складе Брест. В резервах
                              {{ item.raw.Res000000055 || 0 }}</v-tooltip
                            >
                          </v-chip>
                          <v-chip
                            v-if="selectedContragentData?.Gorod === 'gomel'"
                            variant="flat"
                            :color="
                              item.raw.Skl000000031 > 0 ? 'primary' : 'orange'
                            "
                            >{{ item.raw.Skl000000031 || 0 }}
                            <v-tooltip
                              class="opacity-80"
                              activator="parent"
                              location="top"
                              >На складе Гомель. В резервах
                              {{ item.raw.Res000000031 || 0 }}</v-tooltip
                            >
                          </v-chip>
                          <v-chip
                            v-if="selectedContragentData?.Gorod === 'grodno'"
                            variant="flat"
                            :color="
                              item.raw.Skl000000052 > 0 ? 'primary' : 'orange'
                            "
                            >{{ item.raw.Skl000000052 || 0 }}
                            <v-tooltip
                              class="opacity-80"
                              activator="parent"
                              location="top"
                              >На складе Гродно. В резервах
                              {{ item.raw.Res000000052 || 0 }}</v-tooltip
                            >
                          </v-chip>
                          <v-chip
                            v-if="selectedContragentData?.Gorod === 'mogilev'"
                            variant="flat"
                            :color="
                              item.raw.Skl000000065 > 0 ? 'primary' : 'orange'
                            "
                            >{{ item.raw.Skl000000065 || 0 }}
                            <v-tooltip
                              class="opacity-80"
                              activator="parent"
                              location="top"
                              >На складе Могилев. В резервах
                              {{ item.raw.Res000000065 || 0 }}</v-tooltip
                            >
                          </v-chip>
                          <v-chip
                            v-if="
                              selectedContragentData?.Gorod === 'moskva' ||
                              selectedContragentData?.Gorod === 'rf'
                            "
                            variant="flat"
                            :color="
                              item.raw.Skl000000263 > 0 ? 'primary' : 'orange'
                            "
                            >{{ item.raw.Skl000000263 || 0 }}
                            <v-tooltip
                              class="opacity-80"
                              activator="parent"
                              location="top"
                              >На складе Москва. В резервах
                              {{ item.raw.Res000000263 || 0 }}</v-tooltip
                            >
                          </v-chip>
                        </div>
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
              v-model="search"
              density="comfortable"
              placeholder="Поиск"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 300px"
              variant="solo"
              clearable
              hide-details
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
import { shallowRef } from "vue";
const cart = inject<Ref<Goods[]>>("cart");
const dialog = ref(false);
const currentImage = ref("");
const route = useRoute();
const tree = inject<Ref<string[]>>("tree", ref([])); // Initialize tree with an empty array
const favs = inject<Ref<Favs[]>>("favs", ref<Favs[]>([]));
let favsOnly = inject<Ref<boolean>>("favsOnly", ref(false));
const selectedContragentData = inject<Ref<Contragents>>(
  "selectedContragentData"
);
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
// useHead(() => ({
//   link: [
//     {
//       rel: "canonical",
//       href: "https://b2.belca.by" + route.path,
//     },
//   ],
// }));

const search = shallowRef("");
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

const isFav = (nomCode: string) => {
  if(!favs.value) return false
  const fav = favs.value.find((el: Favs) => el.NomCode === nomCode);
  if (fav) return true;
  else return false;
};

const toggleFav = (nomCode: string) => {
  const favIndex = favs.value.findIndex((el: Favs) => el.NomCode === nomCode);

  if (favIndex !== -1) {
    // Remove item from favs
    favs.value.splice(favIndex, 1);
  } else {
    // Add item to favs
    favs.value.push({
      NomCode: nomCode,
      filter: (predicate: (fav: Favs) => boolean) =>
        favs.value.filter(predicate),
      map: (mapper: (fav: Favs) => any) => favs.value.map(mapper),
      find: (predicate: (fav: Favs) => boolean) => favs.value.find(predicate),
      push: (item: Favs) => {
        favs.value.push(item);
        return favs.value.length;
      },
    });
  }
  writeFavs();
};

const writeFavs = async () => {
  if (selectedContragentData) {
    const favsData = await $fetch("/api/writeFavs", {
      method: "POST",
      body: JSON.stringify({
        unp: selectedContragentData.value.UNP,
        favs: favs.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    console.error("selectedContragentData is undefined");
  }
};

const writeOrder = async () => {
  if (selectedContragentData && cart) {
    const cartValue = (cart as Ref<Goods[]>).value; // Cast cart to Ref<Goods[]>
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

const customSearch = (value: any, search: string, item: any) => {
  const searchKeys = ["NomCode", "NomNaim", "Price"]; // Add the keys you want to search within
  const searchWords = search.toLowerCase().split(" "); // Разбить строку поиска на отдельные слова

  return searchKeys.some((key) => {
    const itemValue = String(item.raw[key]).toLowerCase();
    const wordsFound = searchWords.filter((word) => itemValue.includes(word)); // Найти слова, которые есть в itemValue

    return wordsFound.length === searchWords.length; // Если все слова найдены, вернуть true
  });
};

const filteredGoods = () => {
  if (favsOnly.value) {
    // Return only favorites when favsOnly is true
    return props.goods.filter((good: Goods) =>
      favs.value.some((fav: Favs) => fav.NomCode === good.NomCode)
    );
  }

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

    return filteredByCategory;
  }

  // // Search the entire catalog when tree length is 0

  return props.goods;
};

const goodPicture = (article: String) => {
  //console.log('https://b2.belca.by/images/720/'+article+'.jpg')
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
//const cart = useCookie<Array<any>>("cart");

// if (!cart.value) {
//   cart.value = [];
// }

const isInCart = (NomCode: string) => {
  if (cart) {
    return cart.value.some((cartItem: any) => cartItem.NomCode === NomCode);
  }
  return false;
};
// Function to sync cart with goods
const syncCartWithGoods = () => {
  if (cart &&cart.value && props.goods) {
    cart.value.forEach((cartItem: any) => {
      const goodIndex = props.goods.findIndex(
        (good: Goods) => good.NomCode === cartItem.NomCode
      );

      if (goodIndex !== -1 && props.goods[goodIndex]) {
        props.goods[goodIndex].inCart = cartItem.inCart;
        props.goods[goodIndex].Quantity = cartItem.inCart;
      }
    });
  }
};

onMounted(() => {
  syncCartWithGoods();
});

const addToCart = (item: any) => {
  if (cart) {
    console.log(item.NomCode);

    item.Price = String(item.Price).replace(",", ".");
    item.Quantity = item.inCart;
    cart.value.push(item);
    writeOrder();
  }
};
</script>

<style scoped>
.price-tag {
  position: absolute;
  bottom: 5%;
  width: 60%;
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
