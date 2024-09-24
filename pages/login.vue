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
        <video class="videomain p-4" muted style="height: 320px" loop autoplay>
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
                  <v-btn prepend-icon="mdi mdi-email"
                    >Написать руководству</v-btn
                  >
                  <v-spacer></v-spacer>

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
      <v-col cols="4" class="mb-7 d-flex align-start justify-start">
        <v-img max-height="320px" src="/bg-body-sm.png"></v-img>
      </v-col>
    </v-row>
    <div class="index-footer-ornament"></div>
  </v-sheet>
</template>

<script lang="ts" setup>
const dialog = shallowRef(true);
const rememberMe = useCookie("rememberMe");
if (!rememberMe.value) {
  rememberMe.value = String(true);
}
const auth = inject<Ref<boolean>>("auth", ref(false));
const mng = inject<Ref<boolean>>("mng", ref(false));
const boss = inject<Ref<boolean>>("boss", ref(false));
const login = ref("");
const password = ref("");

const loginCookie = useCookie("loginCookie");
const passwordCookie = useCookie("passwordCookie");

const checkLogin = async () => {
  console.log(login.value);
  console.log(password.value);
  const {data:loginData} = await useFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      Login: login.value,
      Password: password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(loginData.value);
  const route = useRoute();
   if (loginData.value !== "") {
     console.log(loginData.value);
     if (loginData.value.Ответ === "Successful !") {
       auth.value = true;
     }
     if (loginData.value &&
        loginData.value.Kontragent &&
        loginData.value.Kontragent[0] &&
        loginData.value.Kontragent[0].Manager) {
       mng.value = true;
     }
     if (loginData.value.Kontragent[0].UNP.trim() === "0000000055") {
       boss.value = true;
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
  margin-top: -25px;
  z-index: 100;
}
.index-header-bg {
  background: #00acc1;
  padding: 10px 0;
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
