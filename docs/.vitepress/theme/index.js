import { h, provide } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { keycloak } from '../../auth'  // Adjust the path if necessary
import LogoutButton from './LogoutButton.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(LogoutButton)
    })
  },
  setup() {
    provide('keycloak', keycloak)
  },
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      import('../../auth').then(({ initializeKeycloak }) => {
        initializeKeycloak()
      }).catch(err => {
        console.error('Failed to load Keycloak:', err)
      })
    }
  }
}