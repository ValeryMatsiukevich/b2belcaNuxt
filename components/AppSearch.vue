<template>
  <div id="search">
    <v-card elevation="0">
      <template v-slot:text>
        <v-text-field
          id="search-activator"
          density="compact"
          variant="outlined"
     
          clearable
          :loading="loading"
          prepend-inner-icon="mdi-magnify"
          v-model="searchInput"
          :rules="firstNameRules"
          label="Что вы хотите найти?"
          placeholder="Что вы хотите найти?"
          type="search"
          hide-details
          single-line
          hint="hint"
          v-debounce:1s="searchedGoods"
        >
        </v-text-field>
      </template>
    </v-card>
    <v-card min-width="300">
      <v-menu
        :activator="searchInput.length > 0 ? '#search-activator' : ''"
        v-model="menu"
        :close-on-content-click="true"
        location-strategy="connected"
        scroll-strategy="close"
      >
        <v-list :lines="false" density="compact" nav>
          <v-virtual-scroll
            :height="virtualScrollHeight"
            :items="foundGoods"
            v-mutate="StopLoading"
          >
            <div v-for="(good, index) in foundGoods" :key="index">
              <NuxtLink :to="routeUtils(good.NomCode)">
                <v-list-item
                  :prepend-avatar="goodPicture(good.NomCode)"
                  :subtitle="good.NomCode"
                  :title="good.NomNaim"
                  rounded="xl"
                >
                  <template v-slot:append>
                    <p class="mx-2 text-xs">{{ good.Price }} BYN</p>
                  </template>
                </v-list-item>
              </NuxtLink>
            </div>
          </v-virtual-scroll>
        </v-list>
      </v-menu>
    </v-card>
  </div>
</template>
<script setup lang="ts">
//console.log("search loaded");

//import type { Goods } from "../server/api/goods";
import { computed, ref, watch } from "vue";
// import { useIntersectionObserver } from "@vueuse/core";
//import { debounce } from 'vue-debounce';
//import {vueDebounce} from 'vue-debounce';
import { vueDebounce } from "../node_modules/vue-debounce/src/index.js";
export interface Goods {
  NomCode: string;
  NomNaim: string;
  RoditelCode: string;
  slug: string;
  IsGropup: string;
  Quantity: number;
  Akcionniy: string;
  Vigr7712: string;
  ZapretProdazhiNARD: string;
  Price: string;
  inCart: number;
}
//const vDebounce = debounce;
const props = defineProps<{
  folders: Goods[];
  goods: Goods[];
}>();
const vDebounce = vueDebounce({ lock: true });
const loading = ref(false);
const menu = ref(false);
const tooManyGoods = ref(false);
const searchInput = ref("");
const foundGoods = ref<any[]>([]);

const firstNameRules = [
  (value: string | any[]) => {
    if (value?.length > 2) return true;
    return "Введите минимум 3 символа";
  },
];

const searchedGoods = () => {
  menu.value = false;
  StartLoading();
  setTimeout(() => {
    if (!searchInput.value) {
      foundGoods.value = [];
      menu.value = false;
      StopLoading();
      return;
    }

    const searchWords = searchInput.value.toLowerCase().split(" ");
    console.log(searchWords);
    foundGoods.value = props.goods.filter((el: Goods) => {
      const goodName = el.NomNaim?.toLowerCase();

      // const goodArticul = el.NomCode?.toLowerCase();

      return searchWords.every(
        (word: string) => goodName?.includes(word) ?? false
      ); // ||

      // searchWords.every((word: string) => goodArticul?.includes(word) ?? false)
    });
  }, 500); // 500 milliseconds delay
};
const routeUtils = (NomCode: string) => {
  const item = props.goods.find((good) => good.NomCode === NomCode);
  if (!item) {
    return ""; // or any default value
  }
  if(item) {
    return `/catalog/${item.NomCode}`;
  }

  // const folder2 = props.folders.find(
  //   (folder) => folder.NomCode === item.RoditelCode
  // );
  // const folder1 = folder2
  //   ? props.folders.find((folder) => folder.NomCode === folder2.RoditelCode)
  //   : null;
  // const folder = folder1
  //   ? props.folders.find((folder) => folder.NomCode === folder1.RoditelCode)
  //   : null;

  // if (folder2 && folder2.RoditelCode === "00000000001") {
  //   return `/catalog/${folder2.slug}/${item.NomCode}`;
  // }

  // if (folder1 && folder1.RoditelCode === "00000000001") {
  //   return `/catalog/${folder1.slug}/${folder2?.slug}/${item.NomCode}`;
  // }

  // if (folder && folder.RoditelCode === "00000000001") {
  //   return `/catalog/${folder.slug}/${folder1?.slug}/${folder2?.slug}/${item.NomCode}`;
  // }

  // return `/catalog/${folder?.slug}/${folder1?.slug}/${folder2?.slug}/${item.NomCode}`;
};
const StartLoading = () => {
  console.log("StartLoading");
  loading.value = true;
};
const StopLoading = () => {
 // console.log("StopLoading");
  loading.value = false;
};
const virtualScrollHeight = computed(() => {
  const maxItems = 10;
  const minHeight = 200;
  const maxHeight = 300;
  const itemsCount = foundGoods.value.length;

  if (itemsCount > maxItems) {
    return maxHeight;
  } else if (itemsCount > 0) {
    return Math.min(itemsCount * 48, maxHeight); // Assuming each item has a height of 48px
  } else {
    return minHeight;
  }
});
watch(foundGoods, (newVal) => {
  menu.value = newVal.length > 0 && newVal.length < 200;
  if (newVal.length >= 200) {
    tooManyGoods.value = true;
    StopLoading();
  } else tooManyGoods.value = false;
  if (newVal.length === 0) {
    searchInput.value = "";
    StopLoading();
  }
 // console.log(newVal.length);
});

const goodPicture = (article: String) => {
  // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
  return "https://b2.belca.by/images/720/" + article + ".jpg";
};
</script>
