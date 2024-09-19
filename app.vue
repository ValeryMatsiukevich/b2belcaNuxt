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

const favsOnly = ref(false);
const route = useRoute();
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");
let priceType = ref("");
const tree = ref([]);
const favs = ref<Goods[]>([]);
const goods = ref<Goods[]>([]);
const selectedContragent = ref("");
const selectedContragentData = ref<Contragents>();
const loginData = ref<LoginResponse>();
const { data: contragents } = await useAsyncData("contragents", () =>
  $fetch("/api/contragents")
);

const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);

const { data: rates } = await useAsyncData("rates", () =>
  $fetch("/api/exchRates")
);

if (loginCookie && passwordCookie) {
  const { data: loginDataraw } = await useAsyncData("login", () =>
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
  loginData.value = loginDataraw.value;
  //  console.log(loginData.value);
  if (loginData.value !== null) {
    if (loginData.value !== null && loginData.value !== undefined) {
      if (loginData.value.Ответ === "Successful !") {
        auth.value = true;
        if (loginData.value.Kontragent[0].Manager !== false) {
          mng.value = true;
        }
        if (loginData.value.Kontragent[0].UNP.trim() === "0000000055") {
          boss.value = true;
        } else {
          boss.value = false;
          mng.value = false;
        }
      }
    }
  }
}

watch(selectedContragent, async (newValue, oldValue) => {
  let newContragent = contragents.value.find(
    (cont: Contragents) => cont.Kontragent === newValue
  );
  if (newContragent) {
    //console.log("selectedContragent changed:", "->", newContragent);
    selectedContragentData.value = newContragent;
    if (
      selectedContragentData.value &&
      (selectedContragentData.value.Tip === 4 ||
        selectedContragentData.value.Tip === 6 ||
        selectedContragentData.value.Gorod === "rf")
    )
      selectedContragentData.value.priceCurrency = "RUB";
    else if (selectedContragentData.value)
      selectedContragentData.value.priceCurrency = "BYN";

    //     let priceType = "";
    if (
      selectedContragentData.value &&
      selectedContragentData.value.Tip === 1
    ) {
      priceType.value = "000000107";
    } else if (
      selectedContragentData.value &&
      selectedContragentData.value.Tip === 2
    ) {
      priceType.value = "000000009";
    } else if (
      selectedContragentData.value &&
      selectedContragentData.value.Tip === 3
    ) {
      priceType.value = "000000105";
    } else if (
      selectedContragentData.value &&
      selectedContragentData.value.Tip === 4 &&
      selectedContragentData.value.Priznak === 2
    ) {
      priceType.value = "000000111";
    } else if (
      selectedContragentData.value &&
      selectedContragentData.value.Tip === 5
    ) {
      priceType.value = "000000006";
    }

    if (
      selectedContragentData.value &&
      (selectedContragentData.value.Tip === 6 ||
        (selectedContragentData.value.Tip === 4 &&
          selectedContragentData.value.Priznak === 3))
    ) {
      priceType.value = "000000114";
    }

    await getGoods();
    await getFavs();
  }
});

const getGoods = async () => {
  const goodsData = await $fetch("/api/goods", {
    method: "POST",
    body: JSON.stringify({
      type: priceType.value,
      spec: selectedContragentData.value?.KodTipSpecCen,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    onRequest({ request, options }) {
      console.log("REQUEST ", priceType.value);
      console.log(
        "REQUEST BODY ",
        JSON.stringify({
          type: priceType.value,
          spec: selectedContragentData.value?.KodTipSpecCen,
        })
      );
    },
    query: { type: priceType.value },
  });
  goods.value = goodsData;
};

const getFavs = async () => {
  const favsData = await $fetch("/api/readFavs", {
    method: "POST",
    body: JSON.stringify({
      unp: selectedContragentData.value?.UNP,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  favs.value = favsData;
};

if (!auth.value && route.path !== "/login") navigateTo("/login");
provide("contragents", contragents);
provide("goods", goods);
provide("tree", tree);
provide("folders", folders);
provide("auth", auth);
provide("favs", favs);
provide("favsOnly", favsOnly);
provide("mng", mng);
provide("boss", boss);
provide("selectedContragent", selectedContragent);
provide("selectedContragentData", selectedContragentData);
provide("loginData", loginData);
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
