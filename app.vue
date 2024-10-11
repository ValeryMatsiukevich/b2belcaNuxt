<template>
  <div id="app">
    <VApp>
      <NuxtLoadingIndicator />
      <VMain>
        <NuxtPage />
      </VMain>
    </VApp>
  </div>
</template>

<script lang="ts" setup>
const auth = ref(false);
const mng = ref(false);
const boss = ref(false);
const osnManager = ref("");
const favsOnly = ref(false);
const route = useRoute();
const search = ref("");
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");
const infotronicManager = ref(false);
let priceType = ref("");
const tree = ref([]);
const orders = ref([]);
const ordersInfotronic = ref<orderInfotronic[]>([]);
const favs = ref<Goods[]>();
const goods = ref<Goods[]>();
const cart = ref<Goods[]>();
const selectedContragent = ref("");
const selectedContragentData = ref<Contragents>();
const login = ref("");
const password = ref("");
const loginData = ref<LoginResponse>();
const { data: contragents } = await useAsyncData("contragents", () =>
  $fetch("/api/contragents")
);

const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);

const { data: managers } = await useAsyncData("managers", () =>
  $fetch("/api/managers")
);
const { data: balance } = await useAsyncData("balance", () =>
  $fetch("/api/readBalance")
);
const invoices = ref([]);
// const { data: invoices } = await useAsyncData("invoices", () =>
//   $fetch("/api/readInvoices")
// );

const getGoods = async () => {
  try {
    goods.value = [];
    console.log("GET goods");
    const goodsData = await $fetch("/api/goods", {
      method: "POST",
      body: JSON.stringify({
        type: priceType.value,
        spec: selectedContragentData.value?.KodTipSpecCen,
        UNP: loginData.value.Kontragent[0].UNP,
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
  } catch (error) {
    console.error("Error fetching goods:", error);
  }
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
const getOrder = async () => {
  const orderData = await $fetch("/api/readOrder", {
    method: "POST",
    body: JSON.stringify({
      unp: selectedContragentData.value?.UNP,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  cart.value = orderData;
};

const getOrders = async () => {
  const ordersData = await $fetch("/api/orderList", {
    method: "POST",
    body: JSON.stringify({
      unp: selectedContragentData.value?.UNP,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  orders.value = ordersData;
};
const selectContragent = async (newContragent: Contragents) => {
  console.log("selectedContragent changed:", "->", newContragent);
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
  if (selectedContragentData.value && selectedContragentData.value.Tip === 1) {
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
  await getOrder();
  await getOrders();
  osnManager.value = managers.value.find(
    (o) => o.ManagerCode === selectedContragentData.value?.OsnmanagerCode
  );
};
const loginProcedures = async () => {
  console.log("loginProcedures");
  //if ((loginCookie.value!=='' || login) && (passwordCookie.value!=='' || password)) {
    const loginD = ref("");
    const passwordD = ref("");

    if (login.value !== "") {
      loginD.value = login.value;
    } else {
      loginD.value = loginCookie.value;
    }
    if (password.value !== "") {
      passwordD.value = password.value;
    } else {
      passwordD.value = passwordCookie.value;
    }

    const { data: loginDataraw } = await useAsyncData("login", () =>
      $fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          Login: loginD.value,
          Password: passwordD.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    loginData.value = loginDataraw.value;
    console.log(loginData.value);

    if (loginData.value) {
      if (loginData.value.Ответ === "Successful !") {
        auth.value = true;
        console.log("Auth:", auth.value);
        if (
          loginData.value &&
          loginData.value.Kontragent &&
          loginData.value.Kontragent[0] &&
          loginData.value.Kontragent[0].Manager
        ) {
          console.log("Manager:", loginData.value.Kontragent[0].Manager);
          mng.value = true;
          // if (selectedContragentData.value === undefined) {
          //   console.log("selectContragent UNDEFINED");
          //   selectedContragent.value = contragents.value.find(
          //     (cont: Contragents) => cont.UNP === "101352704"
          //   ).Kontragent;
          //   let newContragent = contragents.value.find(
          //     (cont: Contragents) => cont.UNP === "101352704"
          //   );
          //   selectContragent(newContragent);
          // }
        }
        const UNP = loginData.value.Kontragent[0].UNP.trim();
        if (UNP === "0000000055" || UNP === "000000100") {
          boss.value = true;
        }

        if (
          UNP === "000000053" ||
          UNP === "000000054" ||
          UNP === "0000000055" ||
          UNP === "100511773"
        ) {
          infotronicManager.value = true;
          mng.value = true;
        }

        if (
          loginData &&
          loginData.value !== undefined &&
          loginData.value.Kontragent[0].Manager === false
        ) {
          console.log("Enduser");
          selectedContragent.value = loginData.value.Kontragent[0].Kontragent;
          selectedContragentData.value = contragents.value.find(
            (contragent: Contragents) =>
              contragent.UNP === loginData.value.Kontragent[0].UNP
          );
          if (selectedContragentData.value !== undefined) {
            selectContragent(selectedContragentData.value);
            // balance.value = balance?.value.filter(
            //   (co: Balance) => co.UNP === selectedContragentData?.value.UNP
            // );
            // contragents.value = contragents.value.filter(
            //   (contragent: Contragents) =>
            //     contragent.UNP === selectedContragentData?.value.UNP
            // );
            // invoices.value = invoices.value.filter(
            //   (inv: Invoices) => inv.UNP === selectedContragentData?.value.UNP
            // );
            await getGoods();
            await getFavs();
            await getOrder();
            await getOrders();
            osnManager.value = managers.value.find(
              (o: Managers) =>
                o.ManagerCode === selectedContragentData.value?.OsnmanagerCode
            );
            managers.value = [];
          }
        }
      }
    }
  //} else navigateTo("/login");
};
watch(selectedContragent, async (newValue, oldValue) => {
  console.log("watch selectedContragent", newValue, oldValue);
  let newContragent = contragents.value.find(
    (cont: Contragents) => cont.Kontragent === newValue
  );
  selectContragent(newContragent);
});
 
 watch(login, async (newValue, oldValue) => {
   console.log("watch login", newValue, oldValue);

   await loginProcedures();
 });

 watch(loginCookie, async (newValue, oldValue) => {
   console.log("watch loginCookie", newValue, oldValue);

   await loginProcedures();
 });

if (!loginCookie.value && !auth.value && route.path !== "/login") navigateTo("/login");
loginProcedures();
provide("contragents", contragents);
provide("goods", goods);
provide("tree", tree);
provide("folders", folders);
provide("auth", auth);
provide("favs", favs);
provide("favsOnly", favsOnly);
provide("orders", orders);
provide("ordersInfotronic", ordersInfotronic);
provide("cart", cart);
provide("mng", mng);
provide("osnManager", osnManager);
provide("managers", managers);
provide("boss", boss);
provide("balance", balance);
provide("invoices", invoices);
provide("selectedContragent", selectedContragent);
provide("selectedContragentData", selectedContragentData);
provide("login", login);
provide("password", password);
provide("loginData", loginData);
provide("search", search);
provide("infotronicManager", infotronicManager);

//useHead({
//  title: "b2.belca.by",
//  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
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
//});

// useSeoMeta({
//   title: "b2.belca.by",
//   ogTitle: "b2.belca.by",
//   description:
//     "Расходные материалы к принтерам в Минске - картриджи, тонер, чернила, фотобарабаны и другое.",
//   ogDescription:
//     "Расходные материалы к принтерам в Минске - картриджи, тонер, чернила, фотобарабаны и другое",
//   ogImage: "https://b2.belca.by/logo.png",
// });
</script>
