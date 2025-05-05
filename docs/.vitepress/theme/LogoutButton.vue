<!-- .vitepress/theme/LogoutButton.vue -->
<template>
    <button v-if="isAuthenticated" @click="logout">Logout</button>
  </template>
  
  <script setup>
  import { inject, computed } from 'vue'
  
  const keycloak = inject('keycloak')
  
  const isAuthenticated = computed(() => keycloak && keycloak.authenticated)
  
  const logout = () => {
    if (keycloak) {
      keycloak.logout()
    }
  }
  </script>