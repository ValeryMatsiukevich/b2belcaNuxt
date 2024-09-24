<template>
  <NuxtLink to="/cart" class="ml-3 hidden-sm-and-down">
    <v-btn label="Корзина" class="text-none" stacked v-tooltip="'Корзина'">
      <v-badge color="primary" :content="getTotalItems()">
        <v-icon size="large" color="white">mdi-cart</v-icon>
      </v-badge>
    </v-btn>
  </NuxtLink>
</template>

<script setup lang="ts">
//const cart = useCookie<Array<any>>("cart");
const cart = inject("cart");
if (!cart.value) {
  cart.value = [];
}
const getTotalItems = () => {
  return cart.value.length;
};
</script>
