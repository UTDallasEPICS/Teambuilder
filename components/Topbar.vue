<template>
  <header class="relative bg-sky-100 text-black p-6 px-10">
    <div class="relative flex items-center h-14 px-4">
      <!-- Left: user icon -->
      <NuxtLink to="/user" class="flex items-center" aria-label="User account">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9Z"
          />
        </svg>
      </NuxtLink>

      <!-- Center: page title -->
      <NuxtLink to="/login" class="absolute left-1/2 -translate-x-1/2 font-semibold">
      </NuxtLink>

      <!-- Right (desktop): one dropdown per top-level location -->
      <nav class="ml-auto hidden md:flex items-center gap-2">
        <div
          v-for="(loc, index) in locations"
          :key="loc.path"
          :ref="(el) => setDropdownRef(el as HTMLElement | null, index)"
          class="relative"
        >
          <button
            type="button"
            :aria-expanded="openPath === loc.path"
            aria-haspopup="listbox"
            class="flex items-center gap-1 px-3 py-1 rounded bg-white text-sm font-medium"
            @click="toggle(loc.path)"
          >
            <span>{{ loc.label }}</span>
            <span class="transition-transform" :class="{ 'rotate-180': openPath === loc.path }">▾</span>
          </button>

          <ul
            v-if="openPath === loc.path"
            role="listbox"
            class="absolute right-0 mt-1 w-44 rounded bg-white text-black shadow-lg overflow-hidden z-10"
          >
            <li v-for="sub in loc.children" :key="sub.path">
              <NuxtLink
                :to="sub.path"
                role="option"
                class="block px-3 py-2 text-sm hover:bg-gray-100"
                @click="openPath = null"
              >
                {{ sub.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Right (mobile): hamburger toggle -->
      <button
        type="button"
        class="ml-auto md:hidden flex items-center justify-center w-9 h-9 rounded bg-white"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path v-if="!mobileMenuOpen" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          <path
            v-else
            d="M6.4 4.9 12 10.6l5.6-5.7 1.4 1.4-5.6 5.7 5.6 5.7-1.4 1.4L12 13.4l-5.6 5.7-1.4-1.4 5.6-5.7-5.6-5.7z"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu panel: stacked per location -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white text-black border-t border-sky-200">
      <div v-for="loc in locations" :key="loc.path" class="border-b border-gray-200">
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
          :aria-expanded="openMobileSection === loc.path"
          @click="toggleMobileSection(loc.path)"
        >
          <span>{{ loc.label }}</span>
          <span class="transition-transform" :class="{ 'rotate-180': openMobileSection === loc.path }">▾</span>
        </button>

        <ul v-if="openMobileSection === loc.path" class="pb-2">
          <li v-for="sub in loc.children" :key="sub.path">
            <NuxtLink
              :to="sub.path"
              class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="closeMobileMenu"
            >
              {{ sub.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onBeforeUpdate, onMounted, onBeforeUnmount } from 'vue'

const { locations } = useLocations()

// --- desktop dropdowns ---
const openPath = ref<string | null>(null)

function toggle(path: string) {
  openPath.value = openPath.value === path ? null : path
}

let dropdownRoots: (HTMLElement | null)[] = []
onBeforeUpdate(() => {
  dropdownRoots = []
})
function setDropdownRef(el: HTMLElement | null, index: number) {
  dropdownRoots[index] = el
}

function handleClickOutside(event: MouseEvent) {
  const clickedInsideAny = dropdownRoots.some((el) => el && el.contains(event.target as Node))
  if (!clickedInsideAny) openPath.value = null
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// --- mobile menu ---
const mobileMenuOpen = ref(false)
const openMobileSection = ref<string | null>(null)

function toggleMobileSection(path: string) {
  openMobileSection.value = openMobileSection.value === path ? null : path
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  openMobileSection.value = null
}
</script>