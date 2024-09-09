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
const auth = ref(false);
const mng = ref(false);
const boss = ref(false);
const { data: contragents } = await useAsyncData("contragents", () =>
  $fetch("/api/contragents")
);
const route = useRoute();
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");

console.log("Login:", loginCookie);
console.log("Password:", passwordCookie);
const { data: goods } = await useAsyncData("goods", () => $fetch("/api/goods"));

const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);
const selectedContragent = ref("");

if (loginCookie.value !== undefined && passwordCookie.value !== undefined) {
  const { data: login } = await useAsyncData("login", () =>
    $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        Login: loginCookie.value,
        Password: passwordCookie.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  console.log(login);
  if (login !== undefined) {
    if (login.value.Ответ === "Successful !") {
      auth.value = true;
      if (login.value.Kontragent[0].UNP.trim() === "0000000055") {
        mng.value = true;
      }
      if (login.value.Kontragent[0].UNP.trim() === "0000000055") {
        boss.value = true;
      } else {
        boss.value = false;
        mng.value = false;
      }
    }
  }
}
const tree = ref([]);
if (!auth.value && route.path !== "/login") navigateTo("/login");
provide("contragents", contragents);
provide("goods", goods);
provide("tree", tree);
provide("folders", folders);
provide("auth", auth);
provide("mng", mng);
provide("boss", boss);
provide("selectedContragent", selectedContragent);
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
