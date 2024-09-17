<template>
    <div id="AppFooter">
      <v-footer class="bg-grey-lighten-3">
        <v-row justify="center" no-gutters>
            <NuxtLink to="/">       
      <v-btn       
        class="mx-2"
        color="black"
        rounded="xl"
        variant="text"
      >
        Главная
      </v-btn>   
      </NuxtLink>
      <NuxtLink to="/contacts">
      <v-btn       
        class="mx-2"
        color="black"
        rounded="xl"
        variant="text"
      >
        Контакты
      </v-btn> 
    </NuxtLink>
      <NuxtLink to="/policy">
      <v-btn       
        class="mx-2"
        color="black"
        rounded="xl"
        variant="text"
      >
        Политика обработки данных
      </v-btn>  
    </NuxtLink>
      <!-- <v-btn       
        class="mx-2"
        color="black"
        rounded="xl"
        variant="text"
      >
        Вакансии
      </v-btn>            -->
            
            <v-col class="text-end mt-4" cols="12">
                <v-icon color="cyan" icon="mdi-copyright"></v-icon> {{ new Date().getFullYear() }} — 
                ООО <strong>"Белый Картридж"</strong>
            </v-col>
        </v-row>

    </v-footer>
</div>
</template>