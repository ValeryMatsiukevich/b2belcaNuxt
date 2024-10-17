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
const cart = inject<Ref<Goods[]>>("cart") || ref([]);

const getTotalItems = () => {
  if (cart.value === undefined) return 0;

  return cart.value.length;
};
onUnmounted(() => {
  
  cart.value = [];
  
});
</script>
