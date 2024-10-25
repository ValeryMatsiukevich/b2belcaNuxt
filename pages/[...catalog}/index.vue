<template>
  <div id="catalog" v-if="auth">
    <AppDrawer :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppProductList :goods="goods as Goods[]" :folders="folders as Goods[]" />
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
const auth = inject<Ref<boolean>>("auth", ref(false));
if (!auth.value) navigateTo("/");
//console.log("catalog loaded");
let goods = inject<Goods[]>("goods");
let folders = inject<Goods[]>("folders");




</script>

<style scoped>
@media (max-width: 768px) {
  #catalog .AppDrawer {
    display: none;
  }
}
</style>
