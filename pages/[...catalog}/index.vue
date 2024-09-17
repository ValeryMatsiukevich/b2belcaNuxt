<template>
  <div id="catalog" v-if="auth">
    <AppHeader :contragents="contragents as Contragents[]" :goods="goods as Goods[]"  />
    <AppDrawer :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppProductList :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>

 // Catalog {{ route.params }}
//
console.log("catalog loaded");

const goods = inject<Goods[]>("goods");
const folders = inject<Goods[]>("folders");
//console.log(goods.length);
const contragents = inject<Contragents[]>("contragents");
const auth = inject<Ref<boolean>>("auth", ref(false));
if (!auth) navigateTo("/");
const mng = inject<Ref<boolean>>("mng", ref(false));
const boss = inject<Ref<boolean>>("boss", ref(false));
const open = ref([]);
</script>

<style scoped>
@media (max-width: 768px) {
  #catalog .AppDrawer {
    display: none;
  }
}
</style>
