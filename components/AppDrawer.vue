<template>
  <div id="drawer">
    <v-navigation-drawer
    width="305"
    >
      
      <div class="d-flex justify-center">
        <v-btn class="mt-5" variant="text" @click="clearSelection">
          Сбросить</v-btn
        >
      </div>
      <client-only>
      <v-treeview
        v-model:opened="open"
        v-model:selected="tree"
        :items="items"
        density="compact"
        item-value="id"
        selectable
        variant="plain"
        selected-color="cyan"
        select-strategy="single-leaf"
      >
        <template v-slot:title="{ item }">
          <p class="text-s">{{ item.title as string }}</p>
        </template>
      </v-treeview>
    </client-only>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
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

const tree = inject<Ref<Tree[]>>("tree");
const open = ref([]);
const clearSelection = () => {
  if(tree) tree.value = [];
  open.value = [];
};
onBeforeUnmount(() => {
  clearSelection();
});

const foldersToTree = (
  folders: Goods[],
  parentCode = "00000000001"
): Tree[] | null => {
  const children = folders.filter(
    (folder) => folder.RoditelCode === parentCode
  );

  if (children.length === 0) {
    return null;
  }

  return children.map((folder: Goods) => {
    const childTree = foldersToTree(folders, folder.NomCode);
    const item: Tree = {
      id: folder.NomCode,
      title: folder.NomNaim,
      slug: folder.slug,
    };

    if (childTree) {
      item.children = childTree;
    }

    return item;
  });
};

const items = computed(() => {
  const tree = foldersToTree(props.folders);
  return tree ?? [];
});
</script>
