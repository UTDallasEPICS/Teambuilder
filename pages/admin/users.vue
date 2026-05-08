<template lang="pug">
div(class="p-8 max-w-4xl mx-auto")
  h1(class="text-2xl font-bold text-gray-800 mb-2") User Management
  p(class="text-gray-500 text-sm mb-8") Manage who has access to EPICS Teambuilder

  //- Pending users
  div(class="mb-10")
    h2(class="text-lg font-semibold text-gray-700 mb-4") 
      | Pending Approval 
      span(class="ml-2 text-sm font-normal text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full") {{ pendingUsers.length }}
    div(v-if="pendingUsers.length === 0" class="text-gray-400 text-sm") No pending users.
    div(v-for="user in pendingUsers" :key="user.id" class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm")
      div
        p(class="font-medium text-gray-800") {{ user.email }}
        p(class="text-xs text-gray-400") Requested {{ formatDate(user.createdAt) }}
      div(class="flex gap-2")
        button(
          @click="whitelist(user.id)"
          class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
        ) Approve
        button(
          @click="remove(user.id)"
          class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
        ) Deny

  //- Active users
  div(class="mb-10")
    h2(class="text-lg font-semibold text-gray-700 mb-4")
      | Active Users
      span(class="ml-2 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full") {{ activeUsers.length }}
    div(v-if="activeUsers.length === 0" class="text-gray-400 text-sm") No active users.
    div(v-for="user in activeUsers" :key="user.id" class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm")
      div
        p(class="font-medium text-gray-800") {{ user.email }}
        p(class="text-xs text-gray-400")
          span(class="capitalize") {{ user.role }}
          |  · Approved {{ formatDate(user.updatedAt) }}
      div(class="flex gap-2")
        button(
          v-if="user.role !== 'admin'"
          @click="makeAdmin(user.id)"
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
        ) Make Admin
        button(
          v-if="user.id !== currentUser?.id"
          @click="remove(user.id)"
          class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
        ) Remove

  //- Removed users
  div
    h2(class="text-lg font-semibold text-gray-700 mb-4")
      | Removed Users
      span(class="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full") {{ removedUsers.length }}
    div(v-if="removedUsers.length === 0" class="text-gray-400 text-sm") No removed users.
    div(v-for="user in removedUsers" :key="user.id" class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm")
      div
        p(class="font-medium text-gray-800") {{ user.email }}
        p(class="text-xs text-gray-400") Removed {{ formatDate(user.updatedAt) }}
      button(
        @click="whitelist(user.id)"
        class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
      ) Restore
</template>

<script setup lang="ts">
import { useAuthState } from "~/composables/useAuthState";
const { user: currentUser } = useAuthState();

const { data: users, refresh } = await useFetch("/api/users/index.get", {
  default: () => [],
});

const pendingUsers = computed(() =>
  (users.value as any[]).filter((u) => !u.whitelisted && !u.removed)
);

const activeUsers = computed(() =>
  (users.value as any[]).filter((u) => u.whitelisted && !u.removed)
);

const removedUsers = computed(() =>
  (users.value as any[]).filter((u) => u.removed)
);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const whitelist = async (id: string) => {
  await $fetch("/api/users", {
    method: "PUT",
    body: { id, whitelisted: true, removed: false },
  });
  await refresh();
};

const remove = async (id: string) => {
  await $fetch("/api/users", {
    method: "PUT",
    body: { id, whitelisted: false, removed: true },
  });
  await refresh();
};

const makeAdmin = async (id: string) => {
  await $fetch("/api/users", {
    method: "PUT",
    body: { id, role: "admin" },
  });
  await refresh();
};
</script>