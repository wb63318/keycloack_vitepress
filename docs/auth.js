import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'https://kc.axondevspace.work/', // Your Keycloak server URL
    realm: 'AxonDocs',                 // Your Keycloak realm
    clientId: 'axon_pay',                // Your Keycloak client ID
});

export async function initializeKeycloak() {
    try {
        const authenticated = await keycloak.init({
            onLoad: 'login-required',
            pkceMethod: 'S256',
            checkLoginIframe: false
        });

        if (authenticated) {
            console.log('User is authenticated');
            console.log('Token:', keycloak.token);
        } else {
            console.warn('Not authenticated');
            keycloak.login();
        }
    } catch (error) {
        console.error('Keycloak initialization error:', error);
    }
}

export { keycloak };