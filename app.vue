<template>
  <div id="app">
    <VApp>
      <VMain>
        <AppHeader
          v-if="auth"
          :contragents="contragents as Contragents[]"
          :goodsLength="goodsLength as number"
        />
        <v-dialog v-model="dialogVisible" max-width="320" persistent>
          <v-list class="py-2" color="primary" elevation="12" rounded="lg">
            <v-list-item
              prepend-icon="$vuetify-outline"
              title="Загружаю данные..."
            >
              <template v-slot:prepend>
                <div class="pe-4">
                  <v-icon color="primary" size="x-large"></v-icon>
                </div>
              </template>

              <template v-slot:append>
                <v-progress-circular
                  color="primary"
                  indeterminate="disable-shrink"
                  size="16"
                  width="2"
                ></v-progress-circular>
              </template>
            </v-list-item>
          </v-list>
        </v-dialog>
        <NuxtPage />
      </VMain>
    </VApp>
  </div>
</template>

<script lang="ts" setup>
const auth = ref(false);
const mng = ref(false);
const boss = ref(false);
const dialogVisible = shallowRef(false);
const osnManager = ref<Managers>();
const favsOnly = ref(false);
const route = useRoute();
const search = ref("");
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");
const storedSelectedContragent = useCookie("storedSelectedContragent");
// const rememberMe = useCookie("rememberMe");
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
const folders = ref<Goods[]>();
const managers = ref<Managers[]>([]);
const balance = ref<Balance[]>([]);
const invoices = ref<Invoices[]>([]);
const contragents = ref<Contragents[]>([]);
const loginDataraw = ref<LoginResponse>();
let goodsLength = computed(() => (goods.value ? goods.value.length : 0));
const loginProcedures = async () => {
  //if ((loginCookie.value!=='' || login) && (passwordCookie.value!=='' || password)) {
  let loginD = "";
  let passwordD = "";

  loginD = login.value || loginCookie.value || "";
  passwordD = password.value || passwordCookie.value || "";
  if (loginD === "" || passwordD === "") return;
  console.log("loginProcedures");
  loginDataraw.value = await $fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      Login: loginD,
      Password: passwordD,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (loginDataraw.value?.Ответ === "Successful !")
    loginData = loginDataraw.value;
  console.log(loginData);

  if (loginData && loginData.Ответ === "Successful !") {
    auth.value = true;
    console.log("Auth:", auth.value);

    contragents.value = await $fetch("/api/contragents");
    contragents.value = contragents.value.sort((a, b) =>
      a.Kontragent.localeCompare(b.Kontragent)
    );

    folders.value = await $fetch("/api/folders");

    managers.value = await $fetch("/api/managers");
    balance.value = await $fetch("/api/readBalance");

    invoices.value = await $fetch("/api/readInvoices");
    if (
      loginData &&
      loginData.Kontragent &&
      loginData.Kontragent[0] &&
      loginData.Kontragent[0].Manager
    ) {
      console.log("Manager:", loginData.Kontragent[0].Manager);
      mng.value = true;
      if (
        storedSelectedContragent.value !== undefined &&
        storedSelectedContragent.value !== null
      ) {
        selectedContragent.value = storedSelectedContragent.value;
        let contr = contragents.value.find(
          (contragent: Contragents) =>
            contragent.Kontragent === storedSelectedContragent.value
        );
        if (contr) selectContragent(contr);
      }
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
      selectedContragentData.value = contragents.value.find(
        (contragent: Contragents) =>
          contragent.UNP === loginData?.Kontragent[0].UNP
      );
      if (selectedContragentData.value !== undefined) {
        selectContragent(selectedContragentData.value);
        balance.value = balance?.value.filter(
          (co: Balance) => co.UNP === selectedContragentData.value?.UNP
        );
        contragents.value = contragents.value.filter(
          (contragent: Contragents) =>
            contragent.UNP === selectedContragentData.value?.UNP
        );
        invoices.value = invoices.value.filter(
          (inv: Invoices) => inv.UNP === selectedContragentData.value?.UNP
        );
        console.log("GET goods from LoginProcedures");
        getFavs();
        getOrder();
        getOrders();
        getGoods();
        osnManager.value = managers.value.find(
          (o: Managers) =>
            o.ManagerCode === selectedContragentData.value?.OsnmanagerCode
        );
        managers.value = [];
      }
    }
  }
};
//} else navigateTo("/login");

if (
  loginCookie.value === undefined &&
  passwordCookie.value === undefined &&
  auth &&
  auth.value === false &&
  route.path !== "/login"
)
  navigateTo("/login");
if (
  auth.value !== true ||
  loginCookie.value !== undefined ||
  login.value !== ""
)
  loginProcedures();

const getGoods = async () => {
  goods.value = [];
  console.log("GET goods from getGoods");
  if (!loginData) return;
  const maxRetries = 5;
  const retryDelay = 1000; // 500ms

  let retries = 0;
  while (retries < maxRetries) {
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
      break;
    } catch (error) {
      if (error instanceof RTCError) {
        console.error("Error fetching goods:", error);
        retries++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        throw error;
      }
    }
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
  if (!orderData) return;
  cart.value = orderData;
};

const getOrders = async () => {
  try {
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second
    let retries = 0;
    let ordersData;

    while (retries < maxRetries) {
      try {
        ordersData = await $fetch("/api/orderList", {
          method: "POST",
          body: JSON.stringify({
            unp: selectedContragentData.value?.UNP,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        break;
      } catch (error) {
        if (error instanceof RTCError) {
          console.error("Error fetching orders:", error);
          retries++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          throw error;
        }
      }
    }

    if (ordersData) {
      orders.value = ordersData;
    } else {
      console.error("Failed to fetch orders after 5 retries");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};
const selectContragent = async (newContragent: Contragents) => {
  //if (newContragent === undefined) return;
  dialogVisible.value = true;
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
    (o: Managers) =>
      o.ManagerCode === selectedContragentData.value?.OsnmanagerCode
  );
};

watch(
  selectedContragent,
  async (newValue, oldValue) => {
    console.log("watch selectedContragent", newValue, oldValue);

    if (newValue === null) return;
    if (newValue === "") return;
    if (newValue === undefined) return;
    let newContragent = contragents.value.find(
      (cont: Contragents) => cont.Kontragent === newValue
    );
    if (newContragent) selectContragent(newContragent);
  },
  { immediate: false }
);

watch(auth, async (newValue, oldValue) => {
  console.log("watch auth", newValue, oldValue);
  if (auth.value === true) loginProcedures();
});

watch(goods, async (newValue, oldValue) => {
  if (goods && goods?.value?.length > 0) dialogVisible.value = false;
});

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

onBeforeUnmount(() => {
  contragents.value = [];
  goods.value = [];
  tree.value = [];
  folders.value = [];

  favs.value = [];
  favsOnly.value = false;
  orders.value = [];
  ordersInfotronic.value = [];
  cart.value = [];
  mng.value = false;
  boss.value = false;
  managers.value = [];
  auth.value = false;
  balance.value = [];
  invoices.value = [];
  selectedContragent.value = "";
  selectedContragentData.value = undefined;
  login.value = "";
  password.value = "";
  loginData.Kontragent = [];
  loginData.Ответ = "";
  search.value = "";
  infotronicManager.value = false;
});
</script>
