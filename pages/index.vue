<template>
  <div id="start">
    <v-card rounded="0" text-center color="cyan">
      <v-card-title class="text-white text-3xl text-center"
        >БЕЛЫЙ КАРТРИДЖ</v-card-title
      >
      <v-card-text class="text-center"> Помогаем печатать бизнес </v-card-text>
    </v-card>
    <v-no-ssr>
      <v-carousel show-arrows="hover" cycle>
        <v-carousel-item>
          <v-img cover :src="img1"> </v-img>
        </v-carousel-item>
        <v-carousel-item>
          <v-img cover :src="img2"> </v-img>
        </v-carousel-item>
        <v-carousel-item>
          <v-img cover :src="img3"> </v-img>
        </v-carousel-item>
      </v-carousel>
    </v-no-ssr>
  </div>
  <!-- <AppProductList /> -->

  <AppFooter />
</template>
<script lang="ts" setup>
//import { gsap } from "gsap";

const getRandomPicture = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  var pic = "";
  pic = String(
    "https://b2.belca.by/Slider/belca" +
      Math.floor(Math.random() * (max - min) + min) +
      ".jpg"
  );
 // console.log(pic);
  return pic;
};

const img1 = getRandomPicture(0, 8);
const img2 = getRandomPicture(9, 18);
const img3 = getRandomPicture(19, 26);
//console.log("page index");
// const accepted = useCookie("accepted");
// accepted.value = <string>accepted.value || "no";
</script>

<style scoped>
/* Add the font-display property to your CSS */
.font-display-swap {
  font-display: swap;
}
</style>
