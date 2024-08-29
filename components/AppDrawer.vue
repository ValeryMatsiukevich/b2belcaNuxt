<script setup lang="ts">
//import type { Goods } from "../server/api/goods";
export interface Goods {
  NomCode: string;
  NomNaim: string;
  RoditelCode: string;
  slug: string;
  IsGropup: string;
  Quantity: number;
  Akcionniy: string;
  Vigr7712: string;
  ZapretProdazhiNARD: string;
  Price: string;
  inCart: number;
}

const props = defineProps({
  folders: {
    type: Array as PropType<Goods[]>,
    required: true,
  },
  goods: {
    type: Array as PropType<Goods[]>,
    required: true,
  },
});

const filteredFolders = computed(() => {
  return props.folders.filter(
    (el: Goods) =>
      el.RoditelCode === "00000000001" &&
      el.NomCode !== "99990001" &&
      el.NomCode !== "D2616486"
  );
});

const foldersToTree = (folders: Goods[], parentCode = "00000000001") => {
  const children = folders.filter(
    (folder) => folder.RoditelCode === parentCode
  );

  if (children.length === 0) {
    return "";
  }

  return children.map((folder) => ({
    id: folder.NomCode,
    title: folder.NomNaim,
    slug: folder.slug,
    children: foldersToTree(folders, folder.NomCode),
  }));
};

const items = foldersToTree(props.folders);

const tree = inject("tree");

// const ourURL = "https://7712.belca.by/";
// const url = new URL(window.location.href);
// const urlNormalize = url.search.replace(/%2F/g, "/").replace(/%3A/g, ":");
// const indexStartURL = urlNormalize.indexOf(ourURL);
// const indexEndtURL = urlNormalize.indexOf("%", indexStartURL + 1);
// const patchToGo = urlNormalize.substring(indexStartURL, indexEndtURL);
// if (patchToGo && patchToGo.length > 20) {
//   document.location.href = patchToGo;
// } else {
//   document.location.href = ourURL;
// }
const generateRoute = (item: any) => {
  const parent = props.folders.find((folder) => folder.NomCode === item.id);
  if (parent) {
    const parent1 = props.folders.find(
      (folder) => folder.NomCode === parent.RoditelCode
    );
    // console.log(`/catalog/${parent.slug}`)
    if (parent.RoditelCode === "00000000001") {
      //console.log(`/catalog/${parent.slug}`)
      //return `/catalog/${parent.slug}/`;
    }
    if (parent1) {
      if (parent1.RoditelCode === "00000000001") {
        //console.log(`/catalog/${parent.slug}`)
        return `/catalog/${parent1.slug}/${parent.slug}/`;
      }
    }
  }

  // return `/${item.slug}`;
};
</script>

<script lang="ts">
export default {
  name: "AppDrawer",
  // Add keep-alive to the component
  keepAlive: true,
};
</script>
<template>
  <div id="drawer">
    <v-navigation-drawer>
      <v-treeview
        v-model:selected="tree"
        :items="items"
        density="compact"
        item-value="id"
        
        selectable
       selected-color="cyan"
        select-strategy="single-leaf"
      >
        <template v-slot:title="{ item }" >
         <p class="text-xs"> {{ item.title }} </p>
        </template>
      </v-treeview>
      <!-- <v-list>
          <div
            v-for="(folder0, index) in filteredFolders"
            :key="index"
            :value="folder0.NomCode"
          >
            <v-menu location="end center" origin="auto" hover>
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" hover v-ripple>
                  {{ folder0.NomNaim }}
                </v-list-item>
              </template>
              <v-list>
                <v-list-item
                  v-for="(folder1, index1) in props.folders.filter(
                  (folder:Goods) => folder.RoditelCode === folder0.NomCode
                )"
                  :key="index1"
                  :value="folder1.NomCode"
                >
                  <NuxtLink
                    :to="'/catalog/' + folder0.slug + '/' + folder1.slug + '/'"
                  >
                    <v-list-item-title>{{ folder1.NomNaim }}</v-list-item-title>
                  </NuxtLink>
                  <v-menu
                    open-on-hover
                    location="end center"
                    origin="auto"
                    activator="parent"
                  >
                    <v-list>
                      <v-list-item
                        v-for="(folder2, index2) in props.folders.filter(
                        (folder:Goods) => folder.RoditelCode === folder1.NomCode
                      )"
                        :key="index2"
                        :value="folder2.NomCode"
                      >
                        <NuxtLink
                          :to="
                            '/catalog/' +
                            folder0.slug +
                            '/' +
                            folder1.slug +
                            '/' +
                            folder2.slug +
                            '/'
                          "
                        >
                          <v-list-item-title>{{
                            folder2.NomNaim
                          }}</v-list-item-title>
                        </NuxtLink>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-list> -->
    </v-navigation-drawer>
  </div>
</template>
