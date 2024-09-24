<template>
  <div>
    <AppHeader
      :contragents="contragents as Contragents[]"
      :goods="goods as Goods[]"
    />
    <div class="d-flex justify-center">
      <v-stepper
        :items="['Шаг 1', 'Шаг 2']"
        next-text="Далее"
        prev-text="Назад"
        max-width="1200"
      >
        <template v-slot:item.1>
          <v-card title="" flat>
            <v-card flat>
              <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
                Проверьте товары
                <v-spacer></v-spacer>
              </v-card-title>

              <v-divider></v-divider>
              <v-list>
                <v-card-subtitle inset>Заказ</v-card-subtitle>

                <v-list-item v-for="item in cart" :key="item.NomCode">
                  <v-card
                    class="mx-auto"
                    :prepend-avatar="goodPicture(item.NomCode)"
                    :hover="true"
                    rounded="true"
                    variant="outlined"
                  >
                    <template v-slot:subtitle class="text-sm">
                      {{ item.NomNaim }}
                      <v-chip
                        :color="item.Quantity ? 'green' : 'red'"
                        :text="item.Quantity ? 'В наличии' : 'Нет на складе'"
                        class="text-uppercase"
                        size="small"
                        label
                      ></v-chip>
                    </template>
                    <template v-slot:title>
                      <p class="text-cyan-900">Арт.{{ item.NomCode }}</p>
                    </template>
                    <template v-slot:text class="text-sm">
                      Кол-во
                      <v-chip
                        text="-"
                        @click="decrementQuantity(item)"
                        size="small"
                        label
                      >
                      </v-chip>

                      <v-chip
                        :text="String(item.inCart)"
                        class="text-uppercase"
                        size="small"
                        label
                      ></v-chip>

                      <v-chip
                        text="+"
                        @click="incrementQuantity(item)"
                        size="small"
                        label
                      >
                      </v-chip>

                      Цена:
                      <v-chip class="text-uppercase" size="small" label>
                        {{ item.Price }}
                        {{ selectedContragentData?.priceCurrency }}
                      </v-chip>
                      Сумма:
                      <v-chip class="text-uppercase" size="small" label>
                        {{ sum(item).toFixed(2) }}
                        {{ selectedContragentData?.priceCurrency }}
                      </v-chip>
                    </template>

                    <template v-slot:append>
                      <v-chip
                        color="red"
                        @click="removeFromCart(item)"
                        class="text-uppercase"
                        size="small"
                        label
                      >
                        <v-icon icon="mdi-cart" start></v-icon>
                      </v-chip>
                    </template>
                  </v-card>
                </v-list-item>
              </v-list>

              <div class="d-flex align-end flex-column">
                <v-chip
                  >ИТОГО: {{ getTotalPrice() }}
                  {{ selectedContragentData?.priceCurrency }}
                </v-chip>
              </div>
            </v-card>
          </v-card>
        </template>

        <template v-slot:item.2>
          <v-card title="Детали заказа" flat>
            <form @submit.prevent="submit">
              <v-text-field
                v-model="name.value.value"
                :error-messages="name.errorMessage.value"
                label="Наименование*"
              ></v-text-field>

              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="E-mail"
              ></v-text-field>

              <v-text-field
                v-model="emailMng.value.value"
                :error-messages="email.errorMessage.value"
                label="E-mail менеджера"
              ></v-text-field>

              <v-text-field
                v-model="comment.value.value"
                :error-messages="comment.errorMessage.value"
                label="Комментарий"
              ></v-text-field>

              <!-- <v-select
              v-model="select.value.value"
              :error-messages="select.errorMessage.value"
              :items="delivery"
              label="Выберите вариант доставки"
            ></v-select>
            <v-text-field
              v-if="
                select.value.value !== 'Самовывоз' &&
                select.value.value !== undefined
              "
              v-model="address.value.value"
              :counter="10"
              :error-messages="address.errorMessage.value"
              label="Адрес доставки*"
            ></v-text-field>
            <v-select
              v-model="select1.value.value"
              :error-messages="select1.errorMessage.value"
              :items="payment"
              label="Выберите вариант оплаты"
            ></v-select>

            <v-checkbox
              v-model="checkbox.value.value"
              :error-messages="checkbox.errorMessage.value"
              label="Даю согласие на обработку персональных данных"
              type="checkbox"
              value="1"
            ></v-checkbox> -->

              <v-btn class="mt-1 mb-2 mr-2" @click="handleReset">
                Очистить
              </v-btn>
              <v-btn class="me-4" type="submit"> Отправить </v-btn>
            </form>
          </v-card>
        </template>

        <template v-slot:item.3>
          <v-card title="Спасибо за заказ!">
            <v-card-text>
              Ваш заказ успешно размещен, в ближайшее время с вами свяжется
              менеджер для уточнения деталей.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </template>
      </v-stepper>
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
const auth = inject<Ref<boolean>>("auth", ref(false));
if (!auth) {
  abortNavigation();
  navigateTo("/");
}

declare module "#app" {
  interface NuxtApp {
    $mail: {
      send: (options: {
        from: string;
        subject: string;
        text: string;
      }) => Promise<void>;
    };
  }
}

const { $mail } = useNuxtApp();
const goods = inject<Goods[]>("goods");
const managers = inject<Managers[]>("managers") || [];
const contragents = inject<Contragents[]>("contragents");
const selectedContragentData = inject<Contragents>("selectedContragentData");

//Cart
// const cart = useCookie<Array<any>>("cart");
// if (!cart.value) {
//   cart.value = [];
// }
const cart = inject("cart");

const sum = (item: any) => {
  return item.inCart * Number(item.Price.replace(",", "."));
};
const incrementQuantity = (item: any) => {
  if (item.Quantity > item.inCart) {
    item.inCart++;
  }
};

const decrementQuantity = (item: any) => {
  if (item.inCart > 0) {
    item.inCart--;
  }
};

const removeFromCart = (item: any) => {
  const index = cart.value.indexOf(item);

  if (index !== -1) {
    cart.value.splice(index, 1);
  }
  // Find the corresponding good in the goods array and set inCart to 0
  if (goods) {
    const good = goods.find((good: Goods) => good.NomCode === item.NomCode);
    if (good) {
      good.inCart = 0;
    }
  }
};

const getTotalPrice = () => {
  return cart.value.reduce((total, item) => total + sum(item), 0).toFixed(2);
};

const goodPicture = (article: String) => {
  // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
  return "https://b2.belca.by/images/720/" + article + ".jpg";
};

const name = useField("name");
if(auth && selectedContragentData) name.value.value = selectedContragentData.Kontragent;
const osnManager = inject<Ref<Managers>>("osnManager") || [];
const comment = useField("comment");
const email = useField("email");
if(auth && selectedContragentData) email.value.value = selectedContragentData.EmailDlyaRassylky;
const emailMng = useField("emailMng");
emailMng.value.value = osnManager.value.EMail;

//const select = useField<string>("select");
//const select1 = useField<string>("select1");
//const checkbox = useField("checkbox");

// Retrieve cookies
const nameCookie = useCookie<string>("name");
//const addressCookie = useCookie<string>("address");
const phoneCookie = useCookie<string>("phone");
const emailCookie = useCookie<string>("email");
//const selectCookie = useCookie<string>("select");
//const select1Cookie = useCookie<string>("select1");
//const checkboxCookie = useCookie<string>("checkbox");

// Set initial form values from cookie values
//if (nameCookie.value) name.value.value = nameCookie.value;
//if (addressCookie.value) address.value.value = addressCookie.value;
//if (phoneCookie.value) phone.value.value = phoneCookie.value;
//if (emailCookie.value) email.value.value = emailCookie.value;
//if (selectCookie.value) select.value.value = selectCookie.value;
//if (select1Cookie.value) select1.value.value = select1Cookie.value;
//if (checkboxCookie.value) checkbox.value.value = checkboxCookie.value;

// Initialize form
//const { handleSubmit, values } = useForm();

const delivery = ref([
  "Самовывоз",
  "Доставка курьером по г.Минск",
  "Доставка перевозчиком по РБ",
]);
const payment = ref([
  "Оплата при получении",
  "Оплата картой",
  "Оплата через ЕРИП",
]);
const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 2) {
        nameCookie.value = value;
        return true;
      }
      return "Наименование должно быть минимум 2 символа.";
    },
    comment(value: string) {
      if (value) return true;
    },

    email(value: string) {
      if (value) {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          emailCookie.value = value;
          return true;
        }

        return "Введите правильный e-mail.";
      } else return true;
    },
  },
});
const submit = handleSubmit((values) => {
  let text = "";
  for (let key in values) {
    text += `${key}: ${values[key]}\n`;
  }
  cart.value.forEach((value) => {
    text += "Арт: " + value.NomCode;
    text += " Наим: " + value.NomNaim;
    text += " Кол-во: " + value.inCart;
    text += " Цена: " + value.Price.replace(",", ".");
    text += " Сумма: " + value.Price.replace(",", ".") * value.inCart + "\r\n";
  });

  $mail.send({
    from: "order@belca.by",
    subject: "Заказ с cайта b2.belca.by",
    text: text,
  });

  //alert(text);
  alert("Заказ успешно отправлен в обработку");
  cart.value = [];
});
</script>

<style></style>
