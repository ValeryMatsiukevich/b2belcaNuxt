<template>
  <div id="catalog">
    <AppHeader :goods="goods as Goods[]" :folders="folders as Goods[]" />

    <!-- Catalog {{ route.params }} -->

    <AppDrawer :goods="goods as Goods[]" :folders="folders as Goods[]" />

    <AppProductList :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
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
console.log("catalog loaded");
const tree = ref([]);
const route = useRoute();
const goods = inject<Goods[]>("goods");
const folders = inject<Goods[]>("folders");
provide("tree", tree);
// useHead(() => ({
//   link: [
//     {
//       rel: 'canonical',
//       href: 'https://7712.by' + route.path,
//     },
//   ],
// }))
</script>

<style scoped>
@media (max-width: 768px) {
  #catalog .AppDrawer {
    display: none;
  }
}
</style>
