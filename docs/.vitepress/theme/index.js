import { h, provide, reactive } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { keycloak } from '../../auth' // Adjust path if necessary
import LogoutButton from './LogoutButton.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => {
        console.log('Rendering nav-bar-content-after slot');
        return h('div', {
          class: 'logout-slot-wrapper',
          style: { marginRight: '28px', display: 'inline-flex', alignItems: 'center' }
        }, [
          h(LogoutButton),
          h('span', { style: { display: 'inline-block', width: '16px' } }) // Spacer element
        ]);
      }
    });
  },
  setup() {
    const reactiveKeycloak = reactive(keycloak);
    console.log('Providing keycloak:', reactiveKeycloak);
    provide('keycloak', reactiveKeycloak);
  },
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        import('../../auth').then(({ initializeKeycloak }) => {
          initializeKeycloak().catch(err => {
            console.error('Failed to initialize Keycloak:', err);
          });
        }).catch(err => {
          console.error('Failed to load Keycloak module:', err);
        });
      }, 100);
    }
  }
}