<template>
  <div id="ProductList">
    <!-- Product list {{ route.params }}   -->

    <v-breadcrumbs :items="breadcrumbs" density="compact"> </v-breadcrumbs>

    <v-card>
      <v-data-iterator
        :items="filteredGoods"
        :items-per-page="ipp ? Number(ipp) : 8"
        :return-object="false"
        :search="search"
        :loading="loading"
        fluid
        @update:loading="StartLoading"
        @update:options="StopLoading"
      >
        <template v-slot:default="{ items }">
          <v-container class="pa-2">
            <v-row dense>
              <v-col v-for="(item, i) in items" :key="i" cols="auto" md="3">
                <v-card
                  class="pb-3"
                  flat
                  max-width="400px"
                  min-width="200px"
                  height="550px"
                  density="default"
                >
                  <NuxtLink :to="routeUtils(item.raw.NomCode)">
                    <v-img
                      height="300"
                      gradient="to top right, rgba(100,115,201,.1), rgba(25,32,72,.05)"
                      :src="goodPicture(item.raw.NomCode)"
                      ><template v-slot:placeholder>
                        <div
                          class="d-flex align-center justify-center fill-height"
                        >
                          <v-progress-circular
                            color="grey-lighten-4"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>

                    <v-list-item
                      :subtitle="
                        item.raw.NomNaim.charAt(0).toUpperCase() +
                        item.raw.NomNaim.slice(1)
                      "
                      class="mb-5 text-sm"
                    >
                      <template v-slot:title>
                        <strong class="text-h6 mb-2"
                          >Арт.{{ item.raw.NomCode }}</strong
                        >
                      </template>
                    </v-list-item>

                    <div
                      class="d-flex align-center justify-space-evenly price-tag text-caption"
                    >
                      <v-chip>Цена: {{ item.raw.Price }} BYN</v-chip>
                      <v-chip>В наличии {{ item.raw.Quantity }} шт.</v-chip>
                    </div>
                  </NuxtLink>
                  <div class="d-flex justify-center align-end">
                    <v-card-actions>
                      <v-btn
                        color="deep-purple-lighten-2"
                        text="В корзину"
                        block
                        border
                        @click="addToCart(item.raw)"
                      ></v-btn>
                    </v-card-actions>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <v-toolbar class="px-2">
            <v-text-field
              v-model="search"
              flat
              density="compact"
              placeholder="Фильтр списка товаров"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 30%"
              variant="solo-filled"
              clearable
              hide-details
            ></v-text-field>
            <div
              class="d-flex align-center justify-center pa-4 hidden-md-and-down"
            >
              <v-btn
                :disabled="page === 1"
                density="comfortable"
                icon="mdi-arrow-left"
                variant="tonal"
                rounded
                @click="prevPage"
              ></v-btn>

              <div class="mx-2 text-caption">
                Стр {{ page }} из {{ pageCount }}
              </div>

              <v-btn
                :disabled="page >= pageCount"
                density="comfortable"
                icon="mdi-arrow-right"
                variant="tonal"
                rounded
                @click="nextPage"
              ></v-btn>
            </div>

            <span class="subheading mx-2 text-caption hidden-md-and-down"
              >Товаров на странице:</span
            >
            <v-chip-group
              mandatory
              filter
              class="subheading mx-2 text-caption hidden-md-and-down"
            >
              <v-chip @click="ipp = '4'">4</v-chip>
              <v-chip @click="ipp = '8'">8</v-chip>
              <v-chip @click="ipp = '12'">12</v-chip>
              <v-chip @click="ipp = '24'">24</v-chip>
              <v-chip @click="ipp = '48'">48</v-chip>
            </v-chip-group>
          </v-toolbar>
        </template>

        <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-4">
            <v-btn
              :disabled="page === 1"
              density="comfortable"
              icon="mdi-arrow-left"
              variant="tonal"
              rounded
              @click="prevPage"
            ></v-btn>

            <div class="mx-2 text-caption">
              Стр {{ page }} из {{ pageCount }}
            </div>

            <v-btn
              :disabled="page >= pageCount"
              density="comfortable"
              icon="mdi-arrow-right"
              variant="tonal"
              rounded
              @click="nextPage"
            ></v-btn>
          </div>
        </template>
        <template v-slot:loader>
          <v-row dense>
            <v-col
              v-for="(_, k) in [0, 1, 2, 3]"
              :key="k"
              cols="auto"
              md="3"
              max-width="400px"
              min-width="200px"
              height="500"
              density="dense"
            >
              <v-skeleton-loader
                class="border"
                type="image, article"
                flat
                max-width="400px"
                min-width="200px"
                height="500"
                density="dense"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

import { inject, computed, ref } from "vue";
import { useRoute } from "vue-router";
const breadcrumbs = reactive<
  Array<{ title: string; disabled: boolean; href: string }>
>([]);
breadcrumbs.splice(0, breadcrumbs.length);
breadcrumbs.push({
  title: "Каталог",
  disabled: true,
  href: "/catalog",
});

const props = defineProps<{
  folders: Goods[];
  goods: Goods[];
}>();

const route = useRoute();
const tree = inject<Ref<string[]>>("tree");
useHead(() => ({
  link: [
    {
      rel: "canonical",
      href: "https://7712.by" + route.path,
    },
  ],
}));

const search = ref("");
const loading = ref(false);
const ipp = useCookie("ipp") || 8; // Add default value

const StartLoading = () => {
  //console.log("StartLoading");
  loading.value = true;
};
const StopLoading = () => {
  //console.log("StopLoading");
  loading.value = false;
};

const filteredGoods = computed(() => {
  var hr = `/catalog/`;
  if (route.params.catalog) {
    var id = route.params.catalog[1];

    if (id && tree && tree.value.length === 0) {
      breadcrumbs.splice(0, breadcrumbs.length);
      breadcrumbs.push({
        title: "Каталог",
        disabled: false,
        href: "/catalog",
      });
      hr += `${id}/`;
      breadcrumbs.push({
        title: id,
        disabled: true,
        href: hr,
      });
      return props.goods.filter((good:Goods) => String(good.NomCode) === String(id));
    }
  }
  if (tree && tree.value.length === 0) return props.goods.map((good:Goods) => good);
  if (tree && tree.value.length > 0) {
    //console.log(tree.value[0])
    return props.goods.filter((good:Goods) => good.RoditelCode === tree.value[0]);
  }
  return props.goods;
});

// const filteredGoods = computed(() => {
//   //if (route.params.name !== "catalog") return props.goods.map((good) => good);

//   if (route.path === "/" || route.path === "/catalog") {

//     return props.goods.map((good) => good);
//   }
//   breadcrumbs.splice(0, breadcrumbs.length);
//   breadcrumbs.push({
//       title: "Каталог",
//       disabled: true,
//       href: "/catalog",
//     });
//   if (route.params.catalog && route.params.catalog.length > 1) {
//     const folderSlug = route.params.catalog[1];
//     const folder1Slug = route.params.catalog[2];
//     const folder2Slug = route.params.catalog[3];
//     var id = route.params.catalog[4];

//     const folder = props.folders.find((folder) => folder.slug === folderSlug);
//     const folder1 = props.folders.find((folder) => folder.slug === folder1Slug);
//     const folder2 = props.folders.find((folder) => folder.slug === folder2Slug);
//     // console.log(folder, folder1, folder2, id);

//     if (!folder2) {
//       id = folder2Slug;
//       // console.log(id);
//     }

//     if (id) {
//       // console.log("id");

//       const good = props.goods.find((good) => good.NomCode === id);
//       if (!good) {
//         return []; // Return an empty array if the good is not found
//       }
//       const ancestorFolders = getAncestorFolders(good.RoditelCode);
//       //console.log(JSON.stringify(ancestorFolders));
//       var hr = `/catalog/`;
//       ancestorFolders.forEach((folder) => {
//         hr += `${folder.slug}/`;
//         breadcrumbs.push({
//           title: folder.NomNaim,
//           disabled: true,
//           href: hr,
//         });
//       });
//       hr += `${good.NomCode}/`;
//       breadcrumbs.push({
//         title: good.NomCode,
//         disabled: true,
//         href: hr,
//       });

//       return props.goods.filter((good) => good.NomCode === id);
//     }

//     if (folder2) {
//       // console.log(folder2);

//       const descendantFolders = getAllDescendantFolders(folder2);
//       const ancestorFolders = getAncestorFolders(folder2.RoditelCode);

//       if (descendantFolders.size > 0) {
//         // console.log("folder2-1 ", ancestorFolders);
//         var hr = `/catalog/`;
//         ancestorFolders.forEach((folder) => {
//           hr += `${folder.slug}/`;
//           breadcrumbs.push({
//             title: folder.NomNaim,
//             disabled: true,
//             href: hr,
//           });
//         });
//         hr += `${folder2.slug}/`;
//         breadcrumbs.push({
//           title: folder2.NomNaim,
//           disabled: true,
//           href: hr,
//         });
//         return props.goods.filter((good) =>
//           descendantFolders.has(good.RoditelCode)
//         );
//       } else {
//         if (folder2.IsGropup === "Да") {
//           // console.log("folder2-2 ", ancestorFolders);
//           var hr = `/catalog/`;
//           ancestorFolders.forEach((folder) => {
//             hr += `${folder.slug}/`;
//             breadcrumbs.push({
//               title: folder.NomNaim,
//               disabled: true,
//               href: hr,
//             });
//           });
//           hr += `${folder2.slug}/`;
//           breadcrumbs.push({
//             title: folder2.NomNaim,
//             disabled: true,
//             href: hr,
//           });
//           return props.goods.filter(
//             (good) => good.RoditelCode === folder2.NomCode
//           );
//         } else {
//           // console.log("folder2.IsGropup ", folder2.IsGropup);
//           if (folder2.IsGropup === "Да") {
//             // console.log("folder2-3 ", ancestorFolders);
//             var hr = `/catalog/`;
//             ancestorFolders.forEach((folder) => {
//               hr += `${folder.slug}/`;
//               breadcrumbs.push({
//                 title: folder.NomNaim,
//                 disabled: true,
//                 href: hr,
//               });
//             });
//             hr += `${folder2.slug}/`;
//             breadcrumbs.push({
//               title: folder2.NomNaim,
//               disabled: true,
//               href: hr,
//             });

//             return props.goods.filter(
//               (good) => good.RoditelCode === folder2.NomCode
//             );
//           } else {
//             // console.log("folder2-4 ", ancestorFolders);
//             var hr = `/catalog/`;
//             ancestorFolders.forEach((folder) => {
//               hr += `${folder.slug}/`;
//               breadcrumbs.push({
//                 title: folder.NomNaim,
//                 disabled: true,
//                 href: hr,
//               });
//             });
//             hr += `${folder2.slug}/`;
//             breadcrumbs.push({
//               title: folder2.NomNaim,
//               disabled: true,
//               href: hr,
//             });
//             return props.goods.filter(
//               (good) => good.RoditelCode === folder2.NomCode
//             );
//           }
//         }
//       }
//     }

//     if (folder1) {
//       const descendantFolders = getAllDescendantFolders(folder1);
//       const ancestorFolders = getAncestorFolders(folder1.RoditelCode);
//       // console.log("folder1");
//       if (descendantFolders.size > 0) {
//         // console.log("folder1-1 ", ancestorFolders);
//         var hr = `/catalog/`;
//         ancestorFolders.forEach((folder) => {
//           hr += `${folder.slug}/`;
//           breadcrumbs.push({
//             title: folder.NomNaim,
//             disabled: true,
//             href: hr,
//           });
//         });
//         hr += `${folder1.slug}/`;
//         breadcrumbs.push({
//           title: folder1.NomNaim,
//           disabled: true,
//           href: hr,
//         });
//         return props.goods.filter((good) =>
//           descendantFolders.has(good.RoditelCode)
//         );
//       } else {
//         // console.log("folder1.IsGropup ", folder1.IsGropup);
//         if (folder1.IsGropup === "Да") {
//           let ancestorFolders = getAncestorFolders(folder1.RoditelCode);
//           // console.log("folder1-2 ", ancestorFolders);
//           var hr = `/catalog/`;
//           ancestorFolders.forEach((folder) => {
//             hr += `${folder.slug}/`;
//             breadcrumbs.push({
//               title: folder.NomNaim,
//               disabled: true,
//               href: hr,
//             });
//           });
//           hr += `${folder1.slug}/`;
//           breadcrumbs.push({
//             title: folder1.NomNaim,
//             disabled: true,
//             href: hr,
//           });
//           return props.goods.filter(
//             (good) => good.RoditelCode === folder1.NomCode
//           );
//         } else {
//           // console.log("folder1-3 ", ancestorFolders);
//           var hr = `/catalog/`;
//           ancestorFolders.forEach((folder) => {
//             hr += `${folder.slug}/`;
//             breadcrumbs.push({
//               title: folder.NomNaim,
//               disabled: true,
//               href: hr,
//             });
//           });
//           hr += `${folder1.slug}/`;
//           breadcrumbs.push({
//             title: folder1.NomNaim,
//             disabled: true,
//             href: hr,
//           });
//           return props.goods.filter((good) => good.NomCode === folder1.NomCode);
//         }
//       }
//     }

//     if (folder) {
//       const descendantFolders = getAllDescendantFolders(folder);
//       const ancestorFolders = getAncestorFolders(folder.NomCode);
//       //  console.log("folder-1 ", ancestorFolders);
//       var hr = `/catalog/`;
//       ancestorFolders.forEach((folder) => {
//         hr += `${folder.slug}/`;
//         breadcrumbs.push({
//           title: folder.NomNaim,
//           disabled: true,
//           href: hr,
//         });
//       });
//       return props.goods.filter((good) =>
//         descendantFolders.has(good.RoditelCode)
//       );
//     }
//   }
//   return props.goods.map((good) => good);
// });

const getAllDescendantFolders = (folder: any): Set<string> => {
  const descendantFolders = new Set<string>();

  const findDescendantFolders = (folder: any) => {
    for (const childFolder of props.folders) {
      if (childFolder.RoditelCode === folder.NomCode) {
        descendantFolders.add(childFolder.NomCode);
        findDescendantFolders(childFolder);
      }
    }
  };

  findDescendantFolders(folder);

  return descendantFolders;
};

const getAncestorFolders = (folderCode: string) => {
  const ancestorFolders: any[] = [];

  const findAncestorFolders = (folderCode: string) => {
    const folder = <Goods>props.folders.find(
      (folder: Goods) => folder.NomCode === folderCode
    );

    if (folder && folder.NomCode !== "00000000001") {
      ancestorFolders.unshift(folder);
      findAncestorFolders(folder.RoditelCode);
    }
  };

  findAncestorFolders(folderCode);

  return ancestorFolders;
};

const goodPicture = (article: String) => {
  // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
  return "https://b2.belca.by/images/720/" + article + ".jpg";
};

const routeUtils = (NomCode: string) => {
  const item = props.goods.find((good:Goods) => good.NomCode === NomCode);
  //console.log(item?.RoditelCode);
  if (!item) {
    // console.log("!item");
    return "/catalog"; // Return default route if item is not found
  }
  if (item) {
    return "/catalog/" + item.NomCode;
  }
  // const roditel = props.folders.find(
  //   (good) => good.NomCode === item?.RoditelCode
  // );
  // if (roditel) {
  //   const roditelName = roditel.NomNaim;
  //   // console.log(item.NomNaim, '/', roditelName)
  // }

  // const folder2 = props.folders.find(
  //   (folder) => folder.NomCode === item.RoditelCode
  // );
  // if (!folder2) {
  //   // console.log("!folder2");
  //   return `/catalog/${item.NomCode}`; // Return item route if folder2 is not found
  // }

  // const folder1 = props.folders.find(
  //   (folder) => folder.NomCode === folder2.RoditelCode
  // );

  // if (!folder1) {
  //   console.log("!folder1");
  //   return `/catalog/${folder2.slug}/${item.NomCode}`; // Return folder2 route if folder1 is not found
  // }

  // const folder = props.folders.find(
  //   (folder) => folder.NomCode === folder1.RoditelCode
  // );

  // if (!folder) {
  //   // console.log("!folder");
  //   return `/catalog/${folder1.slug}/${folder2.slug}/${item.NomCode}`; // Return folder1 route if folder is not found
  // }

  // if (folder2 && folder2.RoditelCode === "00000000001") {
  //   return `/catalog/${folder2.slug}/${item.NomCode}`;
  // }

  // if (folder1 && folder1.RoditelCode === "00000000001") {
  //   return `/catalog/${folder1.slug}/${folder2.slug}/${item.NomCode}`;
  // }

  // if (folder && folder.RoditelCode === "00000000001") {
  //   return `/catalog/${folder.slug}/${folder1.slug}/${folder2.slug}/${item.NomCode}`;
  // }

  // return `/catalog/${folder.slug}/${folder1.slug}/${folder2.slug}/${item.NomCode}`;
};

//Cart
const cart = useCookie<Array<any>>("cart");
if (!cart.value) {
  cart.value = [];
}

const addToCart = (item: any) => {
  item.inCart = 1;
  cart.value.push(item);
};
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
<script lang="ts">
export default {
  name: "AppProductList",
  // Add keep-alive to the component
  keepAlive: true,
};
</script>
