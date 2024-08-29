<template>
  <div>
    <AppHeader :goods="goods" :folders="folders" />
    <v-stepper
      :items="['Шаг 1', 'Шаг 2', 'Шаг 3']"
      next-text="Далее"
      prev-text="Назад"
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
                      :text="item.inCart"
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
                    Сумма:
                    <v-chip class="text-uppercase" size="small" label>
                      {{ sum(item).toFixed(2) }} BYN
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
              <v-chip>ИТОГО: {{ getTotalPrice() }} BYN</v-chip>
            </div>
          </v-card>
        </v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="Выберите доставку и оплату" flat>
          <form @submit.prevent="submit">
            <v-text-field
              v-model="name.value.value"
              :error-messages="name.errorMessage.value"
              label="Имя*"
            ></v-text-field>

            <v-text-field
              v-model="phone.value.value"
              :error-messages="phone.errorMessage.value"
              label="Номер телефона*"
            ></v-text-field>

            <v-text-field
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              label="E-mail"
            ></v-text-field>

            <v-select
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
            ></v-checkbox>

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
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { useField, useForm } from "vee-validate";

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
const { data: goods } = await useAsyncData("goods", () => $fetch("/api/goods"));
const { data: folders } = await useAsyncData("folders", () =>
  $fetch("/api/folders")
);
const search = ref("");
//Cart
const cart = useCookie<Array<any>>("cart");
if (!cart.value) {
  cart.value = [];
}

const confirmation = ref(true);
const addToCart = (item: any) => {
  item.inCart = 1;
  cart.value.push(item);
};

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
};
const getTotalItems = () => {
  return cart.value.length;
};
const getTotalPrice = () => {
  return cart.value.reduce((total, item) => total + sum(item), 0).toFixed(2);
};

const goodPicture = (article: String) => {
  // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
  return "https://b2.belca.by/images/720/" + article + ".jpg";
};

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 2) {
        nameCookie.value = value;
        return true;
      }
      return "Имя должно быть минимум 2 символа.";
    },
    address(value: string) {
      if (select.value.value === "Самовывоз" || value?.length >= 10) {
        addressCookie.value = value;
        return true;
      }

      return "Вы выбрали вариант доставки. Адрес должен быть заполнен.";
    },
    phone(value: string) {
      if (value) {
        if (value.length >= 9) {
          phoneCookie.value = value;
          return true;
        }
        return "Номер телефона должен быть минимум 9 цифр.";
      }
      return "Номер телефона обязателен для заполнения.";
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
    select(value: string) {
      if (value) {
        selectCookie.value = value;
        return true;
      }
      return "Выберите вариант доставки.";
    },
    select1(value: string) {
      if (value) {
        select1Cookie.value = value;
        return true;
      }

      return "Выберите вариант оплаты.";
    },
    checkbox(value: string) {
      if (value === "1") {
        checkboxCookie.value = value;
        return true;
      }

      return "Должен быть отмечен.";
    },
  },
});
const name = useField("name");
const address = useField("address");
const phone = useField("phone");
const email = useField("email");
const select = useField<string>("select");
const select1 = useField<string>("select1");
const checkbox = useField("checkbox");

// Retrieve cookies
const nameCookie = useCookie<string>("name");
const addressCookie = useCookie<string>("address");
const phoneCookie = useCookie<string>("phone");
const emailCookie = useCookie<string>("email");
const selectCookie = useCookie<string>("select");
const select1Cookie = useCookie<string>("select1");
const checkboxCookie = useCookie<string>("checkbox");

// Set initial form values from cookie values
if (nameCookie.value) name.value.value = nameCookie.value;
if (addressCookie.value) address.value.value = addressCookie.value;
if (phoneCookie.value) phone.value.value = phoneCookie.value;
if (emailCookie.value) email.value.value = emailCookie.value;
if (selectCookie.value) select.value.value = selectCookie.value;
if (select1Cookie.value) select1.value.value = select1Cookie.value;
if (checkboxCookie.value) checkbox.value.value = checkboxCookie.value;

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
    text += " Сумма: " + value.Price.replace(",", ".") * value.inCart + '\r\n';
  });
     $mail.send({
     from: 'order@belca.by',
     subject: 'Заказ с cайта 7712',
     text: text,
   })

  //alert(text);
  alert("Заказ успешно отправлен в обработку");
  cart.value=[]
});
</script>

<style></style>
