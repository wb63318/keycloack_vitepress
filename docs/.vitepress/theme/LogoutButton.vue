<script setup>
import { inject, computed, onMounted, watch, ref } from 'vue'
import { state } from '../../auth' // Adjust path if necessary

const keycloak = inject('keycloak')
const isComponentReady = ref(false)

const isAuthenticated = computed(() => {
    return state.isReady && keycloak && state.authenticated === true;
})

const isLoading = computed(() => {
    return !state.isReady || !isComponentReady.value;
})

const logout = () => {
    if (keycloak) {
        console.log('Initiating logout');
        state.authenticated = false; // Reset state on logout
        keycloak.logout();
    }
}

onMounted(() => {
    console.log('LogoutButton mounted, keycloak:', keycloak);
    console.log('Initial state - isReady:', state.isReady, 'isAuthenticated:', isAuthenticated.value);

    // Poll for Keycloak initialization
    const checkReady = setInterval(() => {
        if (state.isReady) {
            console.log('Keycloak ready detected, isAuthenticated:', isAuthenticated.value);
            isComponentReady.value = true;
            clearInterval(checkReady);
        }
    }, 100);
})

watch([isAuthenticated, () => state.isReady], ([newAuth, newReady]) => {
    console.log('State changed - isAuthenticated:', newAuth, 'isReady:', newReady);
    if (newReady) {
        isComponentReady.value = true;
    }
})
</script>

<template>
  <div class="logout-container">
    <span v-if="isLoading" class="loading-text">Loading...</span>
    <button
      v-else-if="isAuthenticated"
      @click="logout"
      class="logout-button"
    >
      <svg class="logout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      Logout
    </button>
    <span v-else class="not-authenticated-text">Not authenticated</span>
  </div>
</template>

<style scoped>
.logout-container {
  display: inline-flex;
  align-items: center;
  margin-right: 20px !important;
  padding-right: 8px !important;
  gap: 8px;
}

/* Target the last item in the navbar flexbox */
:where(.VPNavBar .items):last-child .logout-container {
  margin-right: 24px !important;
}

/* Override navbar flexbox gap and adjust padding for last item */
:where(.VPNavBar .items) {
  gap: 16px !important;
  padding-right: 24px !important; /* Add padding to the right of the last item */
}

/* Target the theme switch button directly */
:where(.VPNavBar .appearance .VPSwitchAppearance) {
  margin-right: 16px !important;
}

/* Ensure the slot respects the margin */
:where(.VPNavBar .nav-bar-content-after) .logout-container {
  margin-right: 20px !important;
}

.logout-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.logout-icon {
  width: 16px;
  height: 16px;
  stroke: var(--vp-c-text-2);
}

.logout-button:hover .logout-icon {
  stroke: var(--vp-c-brand);
}

.loading-text,
.not-authenticated-text {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .logout-container {
    margin-right: 12px !important;
    padding-right: 4px !important;
  }
  :where(.VPNavBar .items):last-child .logout-container {
    margin-right: 16px !important;
  }
  :where(.VPNavBar .items) {
    gap: 10px !important;
    padding-right: 16px !important;
  }
  :where(.VPNavBar .appearance .VPSwitchAppearance) {
    margin-right: 10px !important;
  }
  :where(.VPNavBar .nav-bar-content-after) .logout-container {
    margin-right: 12px !important;
  }
  .logout-button {
    padding: 2px 6px;
    font-size: 12px;
  }
  .logout-icon {
    width: 14px;
    height: 14px;
  }
}
</style>