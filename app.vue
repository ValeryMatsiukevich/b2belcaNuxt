<template>
  <div id="app">
    <VApp>
      <NuxtLoadingIndicator />
      <VMain>
        <AppHeader :contragents="contragents as Contragents[]" :goodsLength="goodsLength as number"  />
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
let priceType = "";
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
let loginData = <LoginResponse>{};
let contragents = await $fetch("/api/contragents");

const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);

const { data: managers } = await useLazyAsyncData("managers", () =>
  $fetch("/api/managers")
);
const { data: balance } = await useLazyAsyncData("balance", () =>
  $fetch("/api/readBalance")
);
//const invoices = ref([]);
const { data: invoices } = await useLazyAsyncData("invoices", () =>
  $fetch("/api/readInvoices")
);

const getGoods = async () => {
  try {
    goods.value = [];
    console.log("GET goods");
    const goodsData: Goods[] = await $fetch("/api/goods", {
      method: "POST",
      body: JSON.stringify({
        type: priceType,
        spec: selectedContragentData.value?.KodTipSpecCen,
        UNP: loginData.Kontragent[0].UNP,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      onRequest({ request, options }) {
        console.log("REQUEST ", priceType);
        console.log(
          "REQUEST BODY ",
          JSON.stringify({
            type: priceType,
            spec: selectedContragentData.value?.KodTipSpecCen,
          })
        );
      },
      query: { type: priceType },
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
  if(newContragent === undefined) return;
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

  if (selectedContragentData.value && selectedContragentData.value.Tip === 1) {
    priceType = "000000107";
  } else if (
    selectedContragentData.value &&
    selectedContragentData.value.Tip === 2
  ) {
    priceType = "000000009";
  } else if (
    selectedContragentData.value &&
    selectedContragentData.value.Tip === 3
  ) {
    priceType = "000000105";
  } else if (
    selectedContragentData.value &&
    selectedContragentData.value.Tip === 4 &&
    selectedContragentData.value.Priznak === 2
  ) {
    priceType = "000000111";
  } else if (
    selectedContragentData.value &&
    selectedContragentData.value.Tip === 5
  ) {
    priceType = "000000006";
  }

  if (
    selectedContragentData.value &&
    (selectedContragentData.value.Tip === 6 ||
      (selectedContragentData.value.Tip === 4 &&
        selectedContragentData.value.Priznak === 3))
  ) {
    priceType = "000000114";
  }
  goods.value = [];
  console.log("GET goods from SelectContragent");
  getGoods();
  favs.value = [];
  getFavs();
  getOrder();
  orders.value = [];
  getOrders();
  osnManager.value = managers.value.find(
    (o: Managers) => o.ManagerCode === selectedContragentData.value?.OsnmanagerCode
  );
};
const loginProcedures = async () => {
  console.log("loginProcedures");
  //if ((loginCookie.value!=='' || login) && (passwordCookie.value!=='' || password)) {
  let loginD = "";
  let passwordD = "";

  loginD = login.value || loginCookie.value || '';
  passwordD = password.value || passwordCookie.value || '';
  

  const { data: loginDataraw } = await useAsyncData("login", () =>
    $fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        Login: loginD,
        Password: passwordD,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  loginData = loginDataraw.value;
  console.log(loginData);

  if (loginData) {
    if (loginData.Ответ === "Successful !") {
      auth.value = true;
      console.log("Auth:", auth.value);
      if (
        loginData &&
        loginData.Kontragent &&
        loginData.Kontragent[0] &&
        loginData.Kontragent[0].Manager
      ) {
        console.log("Manager:", loginData.Kontragent[0].Manager);
        mng.value = true;
        
      }
      const UNP = loginData.Kontragent[0].UNP.trim();
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
        loginData !== undefined &&
        loginData.Kontragent[0]?.Manager === false
      ) {
        console.log("Enduser");
        selectedContragent.value = loginData.Kontragent[0]?.Kontragent;
        selectedContragentData.value = contragents.find(
          (contragent: Contragents) =>
            contragent.UNP === loginData?.Kontragent[0].UNP
        );
        if (selectedContragentData.value !== undefined) {
          selectContragent(selectedContragentData.value);
          balance.value = balance?.value.filter(
            (co: Balance) => co.UNP === selectedContragentData.value?.UNP
          );
          contragents = contragents.filter(
            (contragent: Contragents) =>
              contragent.UNP === selectedContragentData.value?.UNP
          );
          invoices.value = invoices.value.filter(
            (inv: Invoices) => inv.UNP === selectedContragentData.value?.UNP
          );
          console.log("GET goods from LoginProcedures");
          getGoods();
          getFavs();
          getOrder();
          getOrders();
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
watch(
  selectedContragent,
  async (newValue, oldValue) => {
    console.log("watch selectedContragent", newValue, oldValue);
    let newContragent = contragents.find(
      (cont: Contragents) => cont.Kontragent === newValue
    );
    selectContragent(newContragent);
  },
  { immediate: false }
);

watch(login, async (newValue, oldValue) => {
  console.log("watch login", newValue, oldValue);

  await loginProcedures();
});

// watch(loginCookie, async (newValue, oldValue) => {
//   console.log("watch loginCookie", newValue, oldValue);

//   await loginProcedures();
// });
let goodsLength = computed(() => goods.value ? goods.value.length : 0);
if (!loginCookie.value && !auth.value && route.path !== "/login")
  navigateTo("/login");
await loginProcedures();
provide("contragents", contragents);
provide("goods", goods);
provide("goodsLength", goodsLength);
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

onUnmounted(() => {
  contragents = [];
  goods.value = [];
  tree.value = [];
  folders.value = [];
  auth.value = false;
  favs.value = [];
  favsOnly.value = false;
  orders.value = [];
  ordersInfotronic.value = [];
  cart.value = [];
  mng.value = false;
  osnManager.value = "";
  managers.value = [];
  boss.value = false;
  balance.value = null;
  invoices.value = [];
  selectedContragent.value = "";
  selectedContragentData.value =  undefined;
  login.value = "";
  password.value = "";
  loginData.Kontragent = [];
  loginData.Ответ = "";
  search.value = "";
  infotronicManager.value = false;
});

</script>
