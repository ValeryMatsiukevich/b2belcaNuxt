<template>
  <v-sheet>
    <v-img cover max-height="250" src="/bg-header1.png">
      <v-img max-height="150" class="mt-5" src="/logo-index.png"></v-img>
    </v-img>
    <div class="index-header-ornament"></div>
  </v-sheet>
  <v-sheet>
    <v-row>
      <v-col cols="4" class="d-flex align-center justify-center">
        <video
          class="videomain mb-10 p-4"
          muted
          style="height: 320px"
          loop
          autoplay
        >
          <source
            src="https://belca.by/uploads/video/adv_s2_1.mp4"
            style="background: #fff"
          />
          Your browser does not support the video tag.
        </video>
      </v-col>
      <v-col cols="4" class="mb-7 d-flex align-center justify-center">
        <template>
          <div class="pa-4 text-center">
            <v-dialog
              v-model="dialog"
              max-width="600"
              location="bottom"
              transition="dialog-bottom-transition"
              persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-account"
                  text="Войти в b2b"
                  variant="tonal"
                  v-bind="activatorProps"
                ></v-btn>
              </template>

              <v-card prepend-icon="mdi-account" title="Введите логин и пароль">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="login"
                        label="Логин*"
                        required
                        type="text"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="password"
                        label="Пароль*"
                        type="password"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <small class="text-caption text-medium-emphasis"
                    >* Обязательные поля
                  </small>
                </v-card-text>

                <v-divider></v-divider>
                <v-container fluid>
                  <v-checkbox
                    color="cyan"
                    v-model="rememberMe"
                    label="Запомнить меня"
                  ></v-checkbox>
                </v-container>
                <v-card-actions>
                  <v-btn prepend-icon="mdi mdi-email" @click="message = true">
                    Написать<br />руководству
                  </v-btn>

                  <v-btn
                    text="Закрыть"
                    variant="plain"
                    @click="dialog = false"
                  ></v-btn>

                  <v-btn
                    color="primary"
                    text="Войти"
                    variant="tonal"
                    @click="(dialog = false), checkLogin()"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-col>
      <v-col cols="4" class="mb-7 d-flex align-end justify-end">
        <v-img max-height="320px" src="/bg-body-sm.png"></v-img>
      </v-col>
    </v-row>
    <div class="index-footer-ornament"></div>
    <template>
      <div class="pa-4 text-center">
        <v-dialog v-model="message" max-width="600">
          <v-card prepend-icon="mdi-account" title="Написать руководству">
            <form @submit.prevent="submit">
              <v-text-field
                v-model="name.value.value"
                :counter="10"
                :error-messages="name.errorMessage.value"
                label="Имя"
              ></v-text-field>

              <v-text-field
                v-model="phone.value.value"
                :counter="7"
                :error-messages="phone.errorMessage.value"
                label="Телефон"
              ></v-text-field>

              <v-textarea
                v-model="text.value.value"
                :error-messages="name.errorMessage.value"
                label="Сообщение"
              ></v-textarea>
            </form>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Закрыть"
                variant="plain"
                @click="message = false"
              ></v-btn>

              <v-btn
                color="primary"
                text="Отправить"
                variant="tonal"
               
                @click="message = false, submit()"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
const dialog = shallowRef(true);
const rememberMe = useCookie("rememberMe");
if (!rememberMe.value) {
  rememberMe.value = String(true);
}
const auth = inject<Ref<boolean>>("auth", ref(false));
const mng = inject<Ref<boolean>>("mng", ref(false));
const boss = inject<Ref<boolean>>("boss", ref(false));
const loginData =
  inject<Ref<LoginResponse>>("loginData") || ref<LoginResponse>();
const login = inject("login");
const password = inject("password");
const infotronicManager = inject<Ref<boolean>>("infotronicManager");
const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");
const message = shallowRef(false);
const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value) {
      if (value?.length >= 2) return true;

      return "Имя должно быть не менее 2-х символов.";
    },
    phone(value) {
      if (/^[0-9-]{7,}$/.test(value)) return true;

      return "Номер телефона должен содержать минимум 7 цифр.";
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

      return "Must be a valid e-mail.";
    },
    select(value) {
      if (value) return true;

      return "Select an item.";
    },
    checkbox(value) {
      if (value === "1") return true;

      return "Must be checked.";
    },
  },
});
const name = useField("name");
const phone = useField("phone");
const text = useField("text");

const submit = (async() => {
  const mess=`Имя: ${name.value.value} Телефон: ${phone.value.value}  Сообщение: ${text.value.value}`
  const sentEmailResult = await $fetch("/api/sendEmail", {
      method: "POST",
      body: JSON.stringify({
        to: "sg@belca.by",
        text: mess,
        subject: "Сообщение с сайта B2.Belca.by",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(sentEmailResult);
  alert("Сообщение отправлено");
  
});
const checkLogin = async () => {
  console.log(login.value);
  console.log(password.value);
  const loginDataRaw = await $fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      Login: login.value,
      Password: password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  loginData.value = loginDataRaw;
  console.log(loginData.value);
  const route = useRoute();
  if (loginData.value && loginData.value.Ответ !== "") {
    console.log(loginData.value);
    if (loginData.value.Ответ === "Successful !") {
      auth.value = true;
    }
    if (
      loginData.value &&
      loginData.value.Kontragent &&
      loginData.value.Kontragent[0] &&
      loginData.value.Kontragent[0].Manager
    ) {
      mng.value = true;
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
      if (infotronicManager) infotronicManager.value = true;
      mng.value = true;
    }

    if (String(rememberMe.value) === "true") {
      loginCookie.value = login.value;
      passwordCookie.value = password.value;
    }

    if (auth.value && route.path !== "/") {
      navigateTo("/");
    }
  } else if (!auth.value) {
    alert("Неверный логин или пароль!");
  }
};
</script>

<style scoped>
.index-header-ornament {
  background: url(/ornament.png) top left repeat-x;
  height: 100px;
  margin-top: -35px;
  z-index: 10;
  /* Add these properties */
  position: relative;
}

.ornament-img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: url("/ornament.png") repeat-x;
}

.index-footer-ornament {
  background: url(/ornament.png) top left repeat-x;
  height: 100px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.videomain video {
  width: 90%;
}
.index-content {
  background: url(/bg-body-sm2.png) center center no-repeat;
  padding: 0 0;
  position: relative;
  min-height: 100%;
}
.index-header {
  background: url(/bg-header1.png) center center no-repeat;
  background-size: cover;
  text-align: center;
  padding: 0 0;
  min-height: 30vh;
}
</style>
