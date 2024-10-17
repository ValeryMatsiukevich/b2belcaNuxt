<template>
  <div id="catalog" v-if="auth">
    <AppDrawer :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppProductList :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
// Catalog {{ route.params }}
//
console.log("catalog loaded");

let goods = inject<Goods[]>("goods");

let folders = inject<Goods[]>("folders");
//console.log(goods.length);

const auth = inject<Ref<boolean>>("auth", ref(false));
if (!auth || !goods) navigateTo("/");

</script>

<style scoped>
@media (max-width: 768px) {
  #catalog .AppDrawer {
    display: none;
  }
}
</style>
