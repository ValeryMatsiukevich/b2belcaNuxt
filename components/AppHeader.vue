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
        <v-btn
          v-if="mng && route.path === '/service'"
          class="text-none"
          @click="serviceMode = 1"
          stacked
          v-tooltip="'Статистика посещений'"
        >
          <v-icon size="large" icon="mdi mdi-chart-bell-curve-cumulative"></v-icon>
        </v-btn>
        <v-btn
          v-if="mng && route.path === '/service'"
          class="text-none"
          @click="serviceMode = 2"
          stacked
          v-tooltip="'CRM'"
        >
          <v-icon size="large" icon="mdi mdi-chart-box-multiple"></v-icon>
        </v-btn>
        <v-btn
          v-if="mng && route.path === '/service' && purchasingManager"
          @click="serviceMode = 3"
          class="text-none"
          stacked
          v-tooltip="'Заказные'"
        >
          <v-icon size="large" icon="mdi mdi-truck"></v-icon>
        </v-btn>
        <v-combobox
          v-if="mng && props.contragents && route.path !== '/service'"
          label="Контрагент"
          clearable
          min-width="350px"
          density="compact"
          class="mt-5"
          :items="[
            ...new Set(
              props.contragents.map((contragent) => contragent.Kontragent)
            ),
          ]"
          v-model="selectedContragent"
        ></v-combobox>
      </ClientOnly>
      <v-divider></v-divider>

      <NuxtLink
        v-if="auth && route.path !== '/service'"
        to="/catalog"
        class="ml-3 hidden-sm-and-down"
      >
        <v-btn
          class="text-none"
          stacked
          v-tooltip="'Создать резерв'"
          @click="favsOnly = false"
        >
          <v-badge v-if="goodsLength" color="primary" :content="goodsLength">
            <v-icon size="large" icon="mdi mdi-warehouse"></v-icon>
          </v-badge>
        </v-btn>
      </NuxtLink>

      <AppCart v-if="auth && route.path !== '/service'" />

      <NuxtLink
        to="/invoices"
        class="ml-3 hidden-sm-and-down"
        v-if="orders && route.path !== '/service'"
      >
        <v-btn class="text-none" stacked v-tooltip="'Список заказов'" @click="callGetOrdersEvent">
          <v-badge
            v-if="orders && auth"
            color="primary"
            :content="orders.length"
          >
            <v-icon size="large" icon="mdi mdi-invoice-list"></v-icon>
          </v-badge>
        </v-btn>
      </NuxtLink>
      <NuxtLink
        v-if="
          selectedContragent === 'Инфотроник (опт)' && route.path !== '/service'
        "
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
      <NuxtLink
        v-if="boss && route.path !== '/service'"
        to="/specialorders"
        class="ml-3 hidden-sm-and-down"
      >
        <v-btn class="text-none" stacked v-tooltip="'Список заказных'">
          <v-icon size="large" icon="mdi mdi-truck"></v-icon>
        </v-btn>
      </NuxtLink>

      <NuxtLink
        v-if="auth && route.path !== '/service'"
        to="/catalog"
        class="ml-3 hidden-sm-and-down"
      >
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
      <v-btn v-if="auth && !mng&& route.path !== '/service'"
          variant="text"
          v-tooltip="'Скачать прайс'"
          class="hidden-sm-and-down"
          :href="'https://b2.belca.by/1c/Prices/' + priceType() + '.xlsx'" download
          
        >
          <v-icon size="large" color="white" icon="mdi-file-download" />
          
        </v-btn>
      <v-dialog v-if="auth && route.path !== '/service'" max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            @click="calculateDebt()"
            stacked
            class="text-none"
            v-tooltip="'Долг. Нажмите для расшифровки.'"
          >
            <v-badge
              v-if="selectedContragentData"
              color="primary"
              :content="
                contragentBalance() +
                ' ' +
                selectedContragentData?.priceCurrency
              "
            >
              <v-icon size="large" icon="mdi mdi-account-credit-card"></v-icon>
            </v-badge>
          </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card width="700px" :title="selectedContragent">
            <v-card-text>
              <v-table height="300px" fixed-header>
                <thead>
                  <tr>
                    <th class="text-left">№</th>
                    <th class="text-left">Дата</th>
                    <th class="text-left">Сумма к оплате</th>
                    <th class="text-left">Дней отсрочки</th>
                    <th class="text-left">Дней до оплаты</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in debt" :key="item.number">
                    <td width="200px">{{ item?.number }}</td>
                    <td width="200px">{{ item?.date }}</td>
                    <td>{{ item?.sum }}</td>
                    <td>{{ item?.dniOtsrochki }}</td>
                    <td>{{ item?.dniOplaty }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Закрыть"
                variant="flat"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

      <v-divider></v-divider>
     
      <div
        class="text-center"
        v-if="osnManager?.ManagerTel && route.path !== '/service'"
      >
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
      <NuxtLink class = "hidden-sm-and-down" v-if="mng && route.path !== '/service'" to="/service">
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
      </NuxtLink>

      <v-btn @click="logout()" elevation="8" v-bind="props" v-tooltip="'Выйти'">
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
import dayjs from "dayjs";

const props = defineProps({
  contragents: {
    type: Array as PropType<Contragents[]>,
    required: true,
  },
  goodsLength: {
    type: Number,
    required: false,
    default: () => 0,
  },
});
const auth = inject<Ref<boolean>>("auth", ref(false));
const mng = inject<Ref<boolean>>("mng", ref(false));
const boss = inject<Ref<boolean>>("boss", ref(false));
const purchasingManager = inject<Ref<boolean>>("purchasingManager", ref(false));
const favs = inject<Ref<Favs[]>>("favs", ref<Favs[]>([]));
const balance = inject<Ref<Balance[]>>("balance");
const osnManager = inject<Ref<Managers>>("osnManager");
let favsOnly = inject<Ref<boolean>>("favsOnly", ref(false));
const ordersInfotronic = inject<Ref<orderInfotronic[]>>("ordersInfotronic");
const infotronicManager = inject<Ref<boolean>>("infotronicManager", ref(false));
const invoices = inject<Ref<Invoices[]>>("invoices");
let orders = inject<Orders[]>("orders") || [];
const serviceMode = inject<Ref<number>>("serviceMode");
const route = useRoute();
const debt = ref<Invoices[]>([]);
const selectedContragent = inject<Ref<string>>("selectedContragent", ref(""));
const selectedContragentData = inject<Ref<Contragents | undefined>>(
  "selectedContragentData"
);

const storedSelectedContragent = useCookie("storedSelectedContragent");
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");

const priceType = () => {
  if (selectedContragentData.value?.Tip === 1) return  '000000107'
      else if (selectedContragentData.value?.Tip === 2) return '000000009'
      else if (selectedContragentData.value?.Tip === 3) return '000000105'
      else if (selectedContragentData.value?.Tip === 4 && selectedContragentData.value?.Priznak === 2) return '000000111'
      else if (selectedContragentData.value?.Tip === 5) this.priceType = '000000006'
      else if (selectedContragentData.value?.Tip === 6 || (selectedContragentData.value?.Tip === 4 && selectedContragentData.value?.Priznak === 3)) return '000000114' 

     
}

// const rememberMe = useCookie("rememberMe");
const getOrdersEvent = inject<Function>('getOrdersEvent');
  const callGetOrdersEvent = () => {
  if (getOrdersEvent) {
    getOrdersEvent();
  }
};  
const contragentBalance = () => {
  if (
    !selectedContragent ||
    selectedContragent.value === null ||
    selectedContragentData === undefined
  )
    return 0;
  if (selectedContragentData.value === undefined || !balance) return 0;
  const bal = balance?.value.find(
    (co: Balance) => co.UNP === selectedContragentData?.value?.UNP
  );
  if (bal?.Summa !== undefined) return bal?.Summa;
  else return 0;
};
const logout = () => {
  // Remove all cookies
  loginCookie.value = null;
  passwordCookie.value = null;
  storedSelectedContragent.value = null;
  // rememberMe.value = null;
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

// function startViberChat() {
//   // Replace 'your_viber_username' with the actual Viber username
//   const viberUsername = "your_viber_username";
//   const viberLink = `https://viber.com/chat/${viberUsername}`;
//   window.open(viberLink, "_blank");
// }
// function startTelegramChat() {
//   // Replace 'tg://resolve?domain=your_telegram_username' with the actual Telegram chat link
//   const telegramLink = "tg://resolve?domain=your_telegram_username";
//   window.open(telegramLink, "_blank");
// }

function startPhoneCall() {
  // Replace '+375293607712' with the actual phone number
  const phoneNumber = osnManager?.value.ManagerTel;
  window.open(`tel:${phoneNumber}`, "_blank");
}

const calculateDebt = () => {
  console.log("CALCULATE DEBT");
  let currBalance = contragentBalance();
  let ostBalance = currBalance;
  let contragentInvoices = <Invoices[]>[];
  debt.value = [];
  if (invoices)
    contragentInvoices = invoices.value
      .filter((inv: Invoices) => inv.UNP === selectedContragentData?.value?.UNP)
      .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  if (currBalance > 0 && invoices) {
    //  console.log(contragentInvoices);
    if (contragentInvoices) {
      for (let i = 0; i < contragentInvoices.length; i++) {
        console.log(
          "ostBalance ",
          ostBalance,
          "CurrBalance ",
          currBalance,
          "contragentInvoices[i].Summa ",
          contragentInvoices[i].Summa
        );
        if (ostBalance < 0 && contragentInvoices[0].Summa > currBalance) {
          console.log("DEBT1", contragentInvoices[i].NUM);
          debt.value.push({
            number: contragentInvoices[i].NUM,
            date: dayjs(new Date(contragentInvoices[i].Date)).format(
              "DD-MM-YYYY"
            ), // or any other format you need,
            sum: currBalance, // also, you probably want to use Summa here, not Date
            dniOtsrochki: contragentInvoices[i].DneyOtsrochki,
            dniOplaty:
              contragentInvoices[i].DneyOtsrochki -
              dayjs().diff(new Date(contragentInvoices[i].Date), "days"),
          });
          console.log("DEBT", debt.value);
          break;
        }
        if (ostBalance < 0) {
          break;
        }
        if (ostBalance > 0 && contragentInvoices[i].Summa > ostBalance) {
          console.log("DEBT3", contragentInvoices[i].NUM);

          debt.value.push({
            number: contragentInvoices[i]?.NUM,
            date: dayjs(new Date(contragentInvoices[i].Date)).format(
              "DD-MM-YYYY"
            ),

            sum: ostBalance.toFixed(2), // also, you probably want to use Summa here, not Date
            dniOtsrochki: contragentInvoices[i].DneyOtsrochki,
            dniOplaty: dayjs().diff(
              new Date(contragentInvoices[i].Date),
              "days"
            ),
          });
          break;
        }
        if (ostBalance > 0 && contragentInvoices[i].Summa < currBalance) {
          console.log("DEBT2", contragentInvoices[i].NUM);
          ostBalance = ostBalance - contragentInvoices[i].Summa;
          debt.value.push({
            number: contragentInvoices[i]?.NUM,
            date: dayjs(new Date(contragentInvoices[i].Date)).format(
              "DD-MM-YYYY"
            ), // or any other format you need,
            sum: contragentInvoices[i].Summa, // also, you probably want to use Summa here, not Date
            dniOtsrochki: contragentInvoices[i].DneyOtsrochki,
            dniOplaty:
              contragentInvoices[i].DneyOtsrochki -
              dayjs().diff(new Date(contragentInvoices[i].Date), "days"),
          });
        }
      }
    }
  }
};
</script>
