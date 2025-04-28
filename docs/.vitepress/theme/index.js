import { DefaultTheme } from 'vitepress/theme';
import { initializeKeycloak } from '../../auth';  // Adjust path if needed

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    initializeKeycloak();  // 👈 Initialize Keycloak when app loads
  }
}