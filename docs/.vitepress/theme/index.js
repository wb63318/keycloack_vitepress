import DefaultTheme  from 'vitepress/theme'

export default {
  ...DefaultTheme,
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
