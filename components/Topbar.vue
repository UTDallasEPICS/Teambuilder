<template>
  <header class="relative flex items-center h-14 px-4 bg-orange-500 text-black">
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
    <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-semibold">
      EPICS Home Page
    </NuxtLink>

    <!-- Right: one dropdown per top-level location -->
    <nav class="ml-auto flex items-center gap-2">
      <div v-for="loc in locations" :key="loc.path" class="relative" ref="setDropdownRef">
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
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { locations } = useLocations()

// tracks which top-level dropdown (by path) is currently open, if any
const openPath = ref<string | null>(null)

function toggle(path: string) {
  openPath.value = openPath.value === path ? null : path
}

// collect each dropdown's root element so outside clicks can close whichever is open
const dropdownRoots: HTMLElement[] = []
function setDropdownRef(el: HTMLElement | null) {
  if (el) dropdownRoots.push(el)
}

function handleClickOutside(event: MouseEvent) {
  const clickedInsideAny = dropdownRoots.some((el) => el.contains(event.target as Node))
  if (!clickedInsideAny) openPath.value = null
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>