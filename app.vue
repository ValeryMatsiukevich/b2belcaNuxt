<template>
  <div id="app">
    <VApp>
      <VMain>
    <NuxtLoadingIndicator />
      <NuxtPage />
  </VMain>
  </VApp>  
  </div>
</template>

<script lang="ts" setup>

const { data: contragents } = await useAsyncData("contragents", () =>
  $fetch("/api/contragents")
);
const { data: goods } = await useAsyncData("goods", () => $fetch("/api/goods"));
const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);
const selectedContragent = ref("");
provide("contragents",contragents);
provide("goods",goods);
provide("folders",folders);
provide("selectedContragent",selectedContragent);
useHead({
  title: "b2.belca.by",
  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
  // script: [
  //   {
  //     src: "https://www.googletagmanager.com/gtag/js?id=AW-10987447766",
  //     async: true,
  //   },
  //   {
  //     innerHTML: `
  //       window.dataLayer = window.dataLayer || [];
  //       function gtag(){dataLayer.push(arguments);}
  //       gtag('js', new Date());
  //       gtag('config', 'AW-10987447766');
        
  //     `,
  //     type: "text/javascript",
  //   },
  // ],
});

useSeoMeta({
  title: "b2.belca.by",
  ogTitle: "b2.belca.by",
  description:
    "Расходные материалы к принтерам в Минске - картриджи, тонер, чернила, фотобарабаны и другое.",
  ogDescription:
    "Расходные материалы к принтерам в Минске - картриджи, тонер, чернила, фотобарабаны и другое",
  ogImage: "https://b2.belca.by/logo.png",
});
</script>
