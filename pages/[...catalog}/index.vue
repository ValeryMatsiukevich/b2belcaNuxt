<template>
  <div id="catalog">
    <AppHeader :goods="goods as Goods[]" :folders="folders as Goods[]" :contragents="contragents as Contragents[]" />

    <!-- Catalog {{ route.params }} -->

    <AppDrawer :goods="goods as Goods[]" :folders="folders as Goods[]" />

    <AppProductList :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>

console.log("catalog loaded");

const tree = ref([]);
const route = useRoute();
const goods = inject<Goods[]>("goods");
const folders = inject<Goods[]>("folders");
  const contragents = inject<Contragents[]>("contragents");
provide("tree", tree);
// useHead(() => ({
//   link: [
//     {
//       rel: 'canonical',
//       href: 'https://b2.belca.by' + route.path,
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
