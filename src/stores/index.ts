import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { Router } from 'vue-router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})
