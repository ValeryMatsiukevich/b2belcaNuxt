<script setup lang="ts">
interface Goods {
  NomCode: string
  NomNaim: string
  Price: number
  IsGropup: string
  Vigr7712: string
  rating: number
  votes: number
  hot: boolean
  Quantity: number
}
const props = defineProps<{
  good:Goods,
}>()


const goodPicture = (article : String) => {
   // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
   return 'https://b2.belca.by/images/720/'+article+'.jpg'
 }
 const folders = inject<any[]>("folders") ?? [];
 const goods = inject<any[]>("goods") ?? []; // Initialize goods with an empty array if it's undefined
 const routeUtils = (NomCode: string) => {
  
  
  console.log("NomCode:", NomCode);
 
    const item = folders.find((folder) => folder.NomCode === NomCode) || goods.find((good) => good.NomCode === NomCode);
    console.log(item)
    if (!item) {
      return ""; // Return an empty string if the item is not found
    }

    if (item.RoditelCode === "00000000001") {
      return `/catalog/${item.NomCode}`; // Return the direct route for top-level folders
    }

    const parentFolder = folders.find((folder) => folder.NomCode === item.RoditelCode);

    if (!parentFolder) {
      return ""; // Return an empty string if the parent folder is not found
    }

    return `/catalog/${parentFolder.NomCode}/${item.NomCode}`; // Return the nested route
  }
</script>
<style scoped>
.v-card-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 5px;
}
.price-tag {
  position: absolute;
  bottom: 10%;
  width: 100%;
  padding: 5px;
}
</style>
<template>

  

    <div id="CatalogItem">
    <!-- <p>{{ good }}</p> -->
    <v-card 
    :value="props.good.NomNaim"
    :disabled="false"
    :loading="false"
    class="mx-auto my-12"
    max-width="374"
    height="550"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="cyan"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      :src=goodPicture(props.good.NomCode)
      
    ><template v-slot:placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="grey-lighten-4"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>
  </v-img>

    <v-card-item>
      <v-card-title>{{ props.good.NomNaim }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">Арт. {{ props.good.NomCode }}</span>

        <v-icon v-if="props.good.hot"
          color="error"
          icon="mdi-fire-circle"
          size="small"
        ></v-icon>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-rating
          :model-value="props.good.rating"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">
          {{ props.good.rating }}( {{props.good.votes}} )
        </div>
      </v-row>

      <div class="my-4 text-subtitle-1">
       Цена: {{props.good.Price}} BYN
      </div>

      <div>{{ props.good.NomNaim }}</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title class="price-tag">В наличии:
      <v-chip>{{ props.good.Quantity }} шт.</v-chip>
    </v-card-title>

    
    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="В корзину"
        block
        border
        @click="console.log('click')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</div>
  </template>