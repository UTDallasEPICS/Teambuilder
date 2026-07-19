<template>
  <section class="max-w-3xl mx-auto px-6 py-12">
    <h1 class="text-xl font-semibold mb-6">Members</h1>

    <ul class="divide-y rounded border">
      <li
        v-for="member in members"
        :key="member.id"
        class="flex items-center justify-between p-4"
      >
        <div>
          <p class="font-medium">{{ member.name }}</p>
          <p class="text-sm text-gray-500 italic">{{ member.email }}</p>
          <p class="text-sm text-gray-500 italic">{{ member.phone }}</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            title="Approve"
            class="w-5 h-5 rounded-full bg-green-600 text-white text-xs"
          >
            o
          </button>
          <button
            type="button"
            title="Remove"
            class="w-5 h-5 rounded-full bg-red-600 text-white text-xs"
            @click="pendingDeleteId = member.id"
          >
            x
          </button>
        </div>
      </li>
    </ul>

    <!-- confirm-delete panel, per the wireframe -->
    <div
      v-if="pendingDeleteId"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded p-6 w-80 text-center">
        <p class="mb-4">Confirm to delete user?</p>
        <div class="flex justify-center gap-4">
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-green-600 text-white"
            @click="confirmDelete"
          >
            o
          </button>
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-red-600 text-white"
            @click="pendingDeleteId = null"
          >
            x
          </button>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-8 px-4 py-2 rounded bg-red-600 text-white font-medium"
      @click="logout"
    >
      LOGOUT
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Member {
  id: string
  name: string
  email: string
  phone: string
}

// placeholder data for now, until we hook up to a backend
const members = ref<Member[]>([
  { id: '1', name: 'Member number one', email: 'member1@example.com', phone: '555-0100' },
])

const pendingDeleteId = ref<string | null>(null)

function confirmDelete() {
  members.value = members.value.filter((m) => m.id !== pendingDeleteId.value)
  pendingDeleteId.value = null
}

function logout() {
  // useAuth().logout()
}
</script>