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
          <v-card min-width="700" title="" flat>
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
            <form>
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

              <v-btn class="mt-1 mb-2 mr-2" @click="handleReset">
                Очистить
              </v-btn>
              <v-btn class="me-4" @click="submitOrder()"> Отправить </v-btn>
            </form>
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
//const managers = inject<Managers[]>("managers") || [];
const contragents = inject<Contragents[]>("contragents");
const selectedContragentData = inject<Ref<Contragents>>(
  "selectedContragentData"
);

//Cart
// const cart = useCookie<Array<any>>("cart");
// if (!cart.value) {
//   cart.value = [];
// }
const cart = inject<Ref<Goods[]>>("cart");

const sum = (item: any) => {
  return item.inCart * Number(item.Price.replace(",", "."));
};
const incrementQuantity = (item: any) => {
  if (item.Quantity > item.inCart) {
    item.inCart++;
  }
  writeOrder();
};

const decrementQuantity = (item: any) => {
  if (item.inCart > 0) {
    item.inCart--;
  }
  writeOrder();
};

const writeOrder = async () => {
  if (cart && selectedContragentData) {
    const favsData = await $fetch("/api/writeOrder", {
      method: "POST",
      body: JSON.stringify({
        unp: selectedContragentData.value?.UNP,
        order: cart.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

const removeFromCart = (item: any) => {
  if (cart) {
    const index = cart.value.indexOf(item);

    if (index !== -1) {
      cart.value.splice(index, 1);
    }
    // Find the corresponding good in the goods array and set inCart to 0
    if (goods) {
      const good = Array.from(goods).find(
        (good: Goods) => good.NomCode === item.NomCode
      );
      if (good) {
        good.inCart = 0;
        good.Quantity = 0;
      }
    }
    writeOrder();
  }
};

const getTotalPrice = () => {
  if (cart)
    return cart.value.reduce((total, item) => total + sum(item), 0).toFixed(2);
};

const goodPicture = (article: String) => {
  // console.log('https://b2.belca.by/images/720/'+article+'.jpg')
  return "https://b2.belca.by/images/720/" + article + ".jpg";
};

const name = useField("name");
if(selectedContragentData && selectedContragentData.value === undefined) navigateTo('/');
if (selectedContragentData && auth && selectedContragentData.value !== undefined) {
  name.value.value = selectedContragentData.value.Kontragent;
}
const osnManager = inject<Ref<Managers>>("osnManager");
const comment = useField("comment");
const email = useField("email");
if (auth && selectedContragentData)
  email.value.value = selectedContragentData.value.EmailDlyaRassylky;
const emailMng = useField("emailMng");
if (osnManager) emailMng.value.value = osnManager.value.EMail;


// Initialize form

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 2) {

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

          return true;
        }

        return "Введите правильный e-mail.";
      } else return true;
    },
  },
});
const submitOrder = async () => {
  let text = "";

  if (cart) {
    cart.value.forEach((value) => {
      text += "Арт: " + value.NomCode;
      text += " Наим: " + value.NomNaim;
      text += " Кол-во: " + value.inCart;
      text += " Цена: " + value.Price.replace(",", ".");
      text +=
        " Сумма: " +
        Number(value.Price.replace(",", ".")) * value.inCart +
        "\r\n";
    });

    const sentEmailResult = await $fetch("/api/sendEmail", {
      method: "POST",
      body: JSON.stringify({
        to: osnManager?.value.EMail,
        text: comment.value.value,
        subject: "Заказ с сайта B2.Belca.by",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(sentEmailResult);

    if (selectedContragentData) {
      const sentResult = await $fetch("/api/sendOrderTo1C", {
        method: "POST",
        body: JSON.stringify({
          UNP: selectedContragentData.value.UNP,
          Comment: comment.value.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(
        "Заказ успешно отправлен в обработку." + JSON.stringify(sentResult)
      );
    }

    cart.value = [];
    navigateTo("/");
  }
};
</script>

<style></style>
