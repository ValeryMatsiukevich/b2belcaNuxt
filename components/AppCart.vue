<template>
     <NuxtLink to="/cart" class="mx">
      <v-btn label="Корзина"  stacked>
      <v-badge v-if="getTotalItems()>0" color="error" :content="getTotalItems()">
        <v-icon color="cyan">mdi-cart</v-icon>
      </v-badge>
      
    </v-btn>
    

    </NuxtLink>
</template>

<script setup lang="ts">

const cart = useCookie<Array<any>>('cart')
if (!cart.value) {
  cart.value = []
}
const getTotalItems = () => {
  return cart.value.length
}

</script>