<template>
  <header class="relative flex items-center justify-between h-14 px-4 bg-orange-500 text-black">
    <NuxtLink to="/" class="font-semibold">EPICS Home Page</NuxtLink>

    <!-- Right: locations dropdown -->
    <div ref="dropdownRoot" class="relative">
      <button
        type="button"
        :aria-expanded="open"
        aria-haspopup="listbox"
        class="flex items-center gap-1 px-3 py-1 rounded bg-white text-sm font-medium"
        @click="open = !open"
      >
        <span>{{ currentLabel }}</span>
        <span class="transition-transform" :class="{ 'rotate-180': open }">▾</span>
      </button>

      <ul
        v-if="open"
        role="listbox"
        class="absolute right-0 mt-1 w-40 rounded bg-white text-black shadow-lg overflow-hidden"
      >
        <li v-for="loc in locations" :key="loc.path">
          <NuxtLink
            :to="loc.path"
            role="option"
            class="block px-3 py-2 text-sm hover:bg-gray-100"
            @click="open = false"
          >
            {{ loc.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLocations } from '~/composables/useLocations'

const { locations } = useLocations()
const route = useRoute()

const open = ref(false)
const dropdownRoot = ref<HTMLElement | null>(null)

const currentLabel = computed(() => {
  const match = locations.find((loc) => loc.path === route.path)
  return match ? match.label : 'Locations'
})

// close the dropdown when clicking outside it
function handleClickOutside(event: MouseEvent) {
  if (dropdownRoot.value && !dropdownRoot.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>