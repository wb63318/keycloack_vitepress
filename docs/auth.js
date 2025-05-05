import Keycloak from 'keycloak-js';
import { reactive } from 'vue';

const keycloak = new Keycloak({
    url: 'https://kc.axondevspace.work/', // Your Keycloak server URL
    realm: 'AxonDocs',                 // Your Keycloak realm
    clientId: 'axon_pay',                // Your Keycloak client ID
});

const state = reactive({
    isReady: false,
    authenticated: false
});

function resetState() {
    state.isReady = false;
    state.authenticated = false;
}

export async function initializeKeycloak() {
    try {
        console.log('Initializing Keycloak...');
        resetState();
        const authenticated = await keycloak.init({
            onLoad: 'login-required',
            pkceMethod: 'S256',
            checkLoginIframe: false
        });
        state.isReady = true;
        state.authenticated = authenticated;
        console.log('Keycloak initialized, authenticated:', authenticated);
        if (authenticated) {
            console.log('User is authenticated, token:', keycloak.token);
            // Start token refresh
            keycloak.onTokenExpired = () => {
                console.log('Token expired, refreshing...');
                keycloak.updateToken(30).catch(err => {
                    console.error('Token refresh failed:', err);
                    state.authenticated = false;
                });
            };
        } else {
            console.warn('User is not authenticated, triggering login');
            keycloak.login();
        }
        return authenticated;
    } catch (error) {
        state.isReady = false;
        state.authenticated = false;
        console.error('Keycloak initialization error:', error);
        throw error;
    }
}

export { keycloak, state };