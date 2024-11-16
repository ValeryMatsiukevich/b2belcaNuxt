<template>
  <div v-if="serviceMode === 1">
    <Visits />
  </div>
  <div v-if="serviceMode === 3">
    <SpecialOrdersMng />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const serviceMode = inject<Ref<number>>("serviceMode") ?? ref(0);
</script>

<style scoped></style>
