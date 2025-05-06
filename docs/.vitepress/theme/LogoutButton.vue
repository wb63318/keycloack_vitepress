<script setup>
import { inject, computed, onMounted, watch, ref } from 'vue'
import { state } from '../../auth' // Adjust path if necessary

const keycloak = inject('keycloak')
const isComponentReady = ref(false)
const isDropdownOpen = ref(false)

const isAuthenticated = computed(() => {
  return state.isReady && keycloak && state.authenticated === true
})

const isLoading = computed(() => {
  return !state.isReady || !isComponentReady.value
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const logout = () => {
  if (keycloak) {
    console.log('Initiating logout')
    state.authenticated = false
    keycloak.logout()
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  console.log('LogoutDropdown mounted, keycloak:', keycloak)
  console.log('Initial state - isReady:', state.isReady, 'isAuthenticated:', isAuthenticated.value)

  const checkReady = setInterval(() => {
    if (state.isReady) {
      console.log('Keycloak ready detected, isAuthenticated:', isAuthenticated.value)
      isComponentReady.value = true
      clearInterval(checkReady)
    }
  }, 100)

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.dropdown-container')
    if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen.value = false
    }
  })
})

watch([isAuthenticated, () => state.isReady], ([newAuth, newReady]) => {
  console.log('State changed - isAuthenticated:', newAuth, 'isReady:', newReady)
  if (newReady) {
    isComponentReady.value = true
  }
})
</script>

<template>
  <div class="dropdown-container" v-if="!isLoading">
    <button
      v-if="isAuthenticated"
      @click="toggleDropdown"
      class="avatar-button"
      aria-label="User menu"
    >
      <svg class="user-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </button>
    <span v-else class="not-authenticated-text">Not authenticated</span>

    <transition name="dropdown">
      <div v-if="isDropdownOpen && isAuthenticated" class="dropdown-menu">
        <button @click="logout" class="logout-button">
          <svg class="logout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </transition>
  </div>
  <div v-else class="loading-container">
    <span class="loading-text">Loading...</span>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-right: 24px;
  margin-left: 16px; /* Added to create space from the theme switch icon */
}

.avatar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-button:hover {
  background: var(--vp-c-brand-light);
  border-color: var(--vp-c-brand);
}

.user-icon {
  width: 24px;
  height: 24px;
  stroke: var(--vp-c-text-1);
  transition: stroke 0.3s ease;
}

.avatar-button:hover .user-icon {
  stroke: var(--vp-c-brand);
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  right: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 140px;
  z-index: 1000;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: var(--vp-c-bg-alt);
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

.loading-container {
  display: inline-flex;
  align-items: center;
  margin-right: 24px;
  margin-left: 16px; /* Added for consistency with dropdown-container */
}

.loading-text,
.not-authenticated-text {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* Ensure spacing between theme switch and dropdown in navbar */
:where(.VPNavBar .items) {
  gap: 16px !important; /* Ensure consistent gap between navbar items */
}

:where(.VPNavBar .appearance .VPSwitchAppearance) {
  margin-right: 0 !important; /* Remove extra margin to rely on gap */
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive design */
@media (max-width: 640px) {
  .dropdown-container,
  .loading-container {
    margin-right: 16px;
    margin-left: 12px; /* Adjusted for smaller screens */
  }
  .avatar-button {
    width: 36px;
    height: 36px;
  }
  .user-icon {
    width: 20px;
    height: 20px;
  }
  .dropdown-menu {
    top: 44px;
    min-width: 120px;
  }
  .logout-button {
    padding: 6px 10px;
    font-size: 13px;
  }
  .logout-icon {
    width: 14px;
    height: 14px;
  }
  :where(.VPNavBar .items) {
    gap: 10px !important; /* Smaller gap for mobile */
  }
}
</style>