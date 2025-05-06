import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: process.env.KEYCLOAK_ISSUER,
  realm: 'AxonDocs',
  clientId: process.env.KEYCLOAK_CLIENT_ID,
});