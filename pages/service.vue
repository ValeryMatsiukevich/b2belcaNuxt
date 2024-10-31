<template>
  <v-card
    v-if="serviceMode === 1"
    class="mx-auto text-center"
    color="cyan"
    dark
  >
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :model-value="value"
          width="500"
          :gradient="gradients[5]"
          gradient-direction="top"
          color="rgba(255, 255, 255, .7)"
          height="90"
          padding="12"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            {{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">Посещения за последние 18 дней</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn variant="text" block> Go to Report </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import dayjs from "dayjs";
const serviceMode = inject<Ref<number>>("serviceMode") ?? ref(0);
const value = ref([]);
const visits = ref([]);
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];
watchEffect(async () => {
  console.log("serviceMode", serviceMode.value);
  if (serviceMode.value === 1) {
    visits.value = await $fetch("/api/readLoginLog");
    const groupedVisits = visits.value.reduce((acc, curr) => {
      const date = dayjs(curr.Date).format("YYYY-MM-DD");
      if (!acc[date]) acc[date] = {};
      if (!acc[date][curr.Login]) acc[date][curr.Login] = 0;
      acc[date][curr.Login]++;
      return acc;
    }, {});
    value.value = Object.entries(groupedVisits)
      .slice(-18)
      .map(([date, logins]) => {
        return Object.keys(logins).length;
      });
  }
});
</script>

<style></style>
