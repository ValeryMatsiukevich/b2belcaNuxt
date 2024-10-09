import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  imports: {
    dirs: [
      // Scan top-level modules
      "composables",
    ],
  },

  site: {
    url: "https://b2.belca.by",
    name: "Оптовая продажа расходных материалов к принтерам и МФУ",
    description: "Картриджи к принтеру, чернила, тонер, фотобарабаны",
    defaultLocale: "ru", // not needed if you have @nuxtjs/i18n installed
  },
  // scripts: {
  //   registry: {
  //     googleTagManager: {
  //       id: 'AW-10987447766'
  //     }
  //   }
  // },

  ssr: true,
  devtools: { enabled: true },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },

  build: {
    transpile: ["vuetify", "VueDebounce"],
  },
  experimental: {
    asyncContext: true,
  },

  modules: [
    
    [
      "nuxt-mail",
      
      {
        message: {
          to: "valery@infotronic.by",
          cc: "valery@infotronic.by",
        },
        smtp: {
          host: "smtp.mail.ru",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "order@belca.by",
            pass: "fdtwvd41j3uxM6mAs1ib",
          },
        },
      },
      
    ],
    
    
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        if (!config.plugins) {
          config.plugins = [];
        }
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    
    
    "@nuxtjs/tailwindcss",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    // 'vue-yandex-maps/nuxt',
    '@nuxt/scripts',
    'nuxt-scheduler'
  ],
  //  yandexMaps: {
  //    apikey: 'e724701e-8b3c-4092-be9d-daabb8272ee6',
  //    initializeOn:"onPluginInit",
  //    mapsScriptWaitDuration : false,
  //    mapsRenderWaitDuration : false
  //  },
  
  plugins: [
    
    
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: "2024-07-22",
  
  
});
