<template>
  <div id="AppBar">
    <v-app-bar color="blue-grey-darken-4">
      <v-app-bar-nav-icon class="hidden-md-and-up" id="menu-activator">
      </v-app-bar-nav-icon>
      <v-menu bottom left activator="#menu-activator">
        <v-list>
          <v-list-item prepend-icon="mdi-home" to="/">
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-book-open-variant" to="/catalog">
            <v-list-item-title>Каталог</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-package-check" to="/delivery">
            <v-list-item-title>Оплата и доставка</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-contacts" to="/contacts">
            <v-list-item-title>Контакты</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-cart" to="/cart">
            <v-list-item-title>Корзина</v-list-item-title>
          </v-list-item>
          <v-spacer></v-spacer>

          <v-btn v-bind="props" @click="startPhoneCall">
            <v-icon color="cyan" icon="mdi-phone-outline" />
            {{ osnManager?.ManagerTel }}
          </v-btn>
        </v-list>
      </v-menu>

      <NuxtLink to="/" class="ml-3 hidden-sm-and-down">
        <v-avatar border="0" size="x-large" rounded="0">
          <v-img
            alt="logo"
            max-height="120"
            max-width="120"
            src="/public/logo.png"
          />
        </v-avatar>
      </NuxtLink>
      <v-divider></v-divider>
      <ClientOnly>
        <v-combobox
          v-if="mng && props.contragents"
          label="Контрагент"
          clearable
          min-width="350px"
          density="compact"
          class="mt-5"
          :items="props.contragents.map((contragent) => contragent.Kontragent)"
          v-model="selectedContragent"
        ></v-combobox>
      </ClientOnly>
      <v-divider></v-divider>

      <NuxtLink to="/catalog" class="ml-3 hidden-sm-and-down" v-if="goods">
        <v-btn class="text-none" stacked v-tooltip="'Создать резерв'">
          <v-badge v-if="goods" color="primary" :content="goods.length">
            <v-icon size="large" icon="mdi mdi-warehouse"></v-icon>
          </v-badge>
        </v-btn>
      </NuxtLink>

      <AppCart />

      <NuxtLink to="/invoices" class="ml-3 hidden-sm-and-down" v-if="orders">
        <v-btn class="text-none" stacked v-tooltip="'Список заказов'">
          <v-badge v-if="orders" color="primary" :content="orders.length">
            <v-icon size="large" icon="mdi mdi-invoice-list"></v-icon>
          </v-badge>
        </v-btn>
      </NuxtLink>
      <NuxtLink
        v-if="infotronicManager === true"
        @click="getOrdersInfotronic()"
        to="/invoicesInfotronic"
        class="ml-3 hidden-sm-and-down"
      >
        <v-btn
          class="text-none"
          stacked
          v-tooltip="'Список заказов Инфотроник'"
        >
          <v-badge
            v-if="ordersInfotronic"
            color="primary"
            :content="ordersInfotronic.length"
          >
            <v-icon size="large" icon="mdi mdi-truck-fast"></v-icon>
          </v-badge>
        </v-btn>
      </NuxtLink>
      <NuxtLink to="/catalog" class="ml-3 hidden-sm-and-down">
        <v-btn
          :color="favsOnly ? 'red' : 'white'"
          @click="changeFavsOnly()"
          class="text-none"
          stacked
          v-tooltip="'Избранное'"
        >
          <v-badge v-if="favs" color="primary" :content="favs.length">
            <v-icon size="large" icon="mdi mdi-heart"></v-icon>
          </v-badge>
        </v-btn>
      </NuxtLink>
      <v-btn v-tooltip="'Долг'" class="ml-3 hidden-sm-and-down">{{
        contragentBalance()
      }}</v-btn>
      <v-divider></v-divider>

      <div class="text-center" v-if="osnManager?.ManagerTel">
        <v-btn
          variant="outlined"
          class="hidden-sm-and-down"
          @click="startPhoneCall"
          v-tooltip="osnManager.ManagerCode"
        >
          <v-icon color="cyan" icon="mdi-phone-outline" />
          {{ osnManager?.ManagerTel }}
        </v-btn>
      </div>
      <v-divider></v-divider>
      <v-btn
        v-if="mng"
        elevation="8"
        v-bind="props"
        v-tooltip="'Служебный раздел'"
      >
        <v-icon
          :class="{ 'text-red': boss && mng, 'text-orange': mng && !boss }"
          size="x-large"
          icon="mdi mdi-home-analytics"
        ></v-icon>
      </v-btn>
      <v-btn
        v-if="auth"
        @click="logout()"
        elevation="8"
        v-bind="props"
        v-tooltip="'Выйти'"
      >
        <v-icon
          :class="{ 'text-red': boss && mng, 'text-orange': mng && !boss }"
          size="x-large"
          icon="mdi mdi-logout"
        ></v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  contragents: {
    type: Array as PropType<Contragents[]>,
    required: true,
  },
  goods: {
    type: Array as PropType<Goods[]>,
    required: true,
  },
});
const auth = inject<Ref<boolean>>("auth", ref(false));
const mng = inject<Ref<boolean>>("mng", ref(false));
const boss = inject<Ref<boolean>>("boss", ref(false));
const favs = inject<Ref<Favs[]>>("favs", ref<Favs[]>([]));
const balance = inject<Ref<Balance[]>>("balance");
const osnManager = inject<Ref<Managers>>("osnManager");
let favsOnly = inject<Ref<boolean>>("favsOnly", ref(false));
const ordersInfotronic = inject<Ref<orderInfotronic[]>>("ordersInfotronic");
const infotronicManager = inject<Ref<boolean>>("infotronicManager", ref(false));
const orders = inject<Orders[]>("orders") || [];
const route = useRoute();
const telmenu = ref(false);
const telmenumob = ref(false);
const selectedContragent = inject<Ref<string>>("selectedContragent", ref(""));
const selectedContragentData = inject<Ref<Contragents>>(
  "selectedContragentData"
);
const loginData = inject("loginData");
const storedSelectedContragent = useCookie("storedSelectedContragent");
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");
const rememberMe = useCookie("rememberMe");

const contragentBalance = () => {
  if (
    !selectedContragent ||
    selectedContragent.value === null ||
    selectedContragentData === undefined
  )
    return "";
  if (selectedContragentData.value === undefined || !balance) return "";
  const bal = balance?.value.find(
    (co) => co.UNP === selectedContragentData?.value.UNP
  );
  if (bal?.Summa !== undefined)
    return bal?.Summa + " " + selectedContragentData.value.priceCurrency;
  else return "";
};
const logout = () => {
  // Remove all cookies
  loginCookie.value = null;
  passwordCookie.value = null;
  storedSelectedContragent.value = null;
  rememberMe.value = null;
  // Reset the auth state
  auth.value = false;
  mng.value = false;
  boss.value = false;

  // Reset the selected contragent cookie
  // storedSelectedContragent.value = "";
  if (!auth.value && route.path !== "/login") navigateTo("/login");
};

const getOrdersInfotronic = async () => {
  if (ordersInfotronic) {
    const ordersInfotronicRaw = await $fetch("/api/getInfotronicOrders");
    ordersInfotronic.value = ordersInfotronicRaw;
  }
};

const changeFavsOnly = () => {
  favsOnly.value = !favsOnly.value;
};

if (storedSelectedContragent && storedSelectedContragent.value !== undefined)
  selectedContragent.value = storedSelectedContragent.value as string;

watch(selectedContragent, (newValue: string) => {
  // Store the selected contragent in the cookie
  storedSelectedContragent.value = newValue;
});

function startViberChat() {
  // Replace 'your_viber_username' with the actual Viber username
  const viberUsername = "your_viber_username";
  const viberLink = `https://viber.com/chat/${viberUsername}`;
  window.open(viberLink, "_blank");
}
function startTelegramChat() {
  // Replace 'tg://resolve?domain=your_telegram_username' with the actual Telegram chat link
  const telegramLink = "tg://resolve?domain=your_telegram_username";
  window.open(telegramLink, "_blank");
}

function startPhoneCall() {
  // Replace '+375293607712' with the actual phone number
  const phoneNumber = osnManager?.value.ManagerTel;
  window.open(`tel:${phoneNumber}`, "_blank");
}
</script>
