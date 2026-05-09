<template lang="pug">
div(class="min-h-screen px-6 py-10")
  div(class="max-w-5xl mx-auto")

    //- Header
    div(class="mb-10")
      h1(
        class="text-4xl font-bold tracking-tight mb-2"
        style="color: #0f4c2a"
      ) User Management

      p(
        class="text-sm"
        style="color: #555"
      ) Manage who has access to EPICS Teambuilder

    //- Pending Users
    section(class="mb-12")
      div(class="flex items-center justify-between mb-5")
        h2(
          class="text-2xl font-semibold"
          style="color: #0f4c2a"
        ) Pending Approval

        span(
          class="text-sm font-semibold px-3 py-1 rounded-full"
          style="background: #f5f5dc; border: 1px solid #c4b49a; color: #0f4c2a"
        ) {{ pendingUsers.length }}

      div(
        v-if="pendingUsers.length === 0"
        class="rounded-xl px-5 py-6 text-sm"
        style="background: #f5f5dc; border: 1px solid #c4b49a; color: #555"
      )
        | No pending users.

      div(
        v-for="user in pendingUsers"
        :key="user.id"
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl mb-4 shadow-sm transition-all"
        style="background: #f5f5dc; border: 1px solid #c4b49a"
      )
        div
          p(
            class="text-lg font-semibold break-all"
            style="color: #0f4c2a"
          ) {{ user.email }}

          p(
            class="text-sm mt-1"
            style="color: #555"
          ) Requested {{ formatDate(user.createdAt) }}

        div(class="flex gap-3")
          button(
            @click="whitelist(user.id)"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style="background: #0f4c2a; color: #f5f5dc"
          ) Approve

          button(
            @click="dismiss(user.id)"
            style="padding: 0.25rem 0.75rem; background: #6b7280; color: white; font-size: 0.875rem; border-radius: 8px; border: none; cursor: pointer;"
          ) Dismiss

          button(
            @click="remove(user.id)"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style="background: #555; color: #f5f5dc"
          ) Deny

    //- Active Users
    section(class="mb-12")
      div(class="flex items-center justify-between mb-5")
        h2(
          class="text-2xl font-semibold"
          style="color: #0f4c2a"
        ) Active Users

        span(
          class="text-sm font-semibold px-3 py-1 rounded-full"
          style="background: #f5f5dc; border: 1px solid #c4b49a; color: #0f4c2a"
        ) {{ activeUsers.length }}

      div(
        v-if="activeUsers.length === 0"
        class="rounded-xl px-5 py-6 text-sm"
        style="background: #f5f5dc; border: 1px solid #c4b49a; color: #555"
      )
        | No active users.

      div(
        v-for="user in activeUsers"
        :key="user.id"
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl mb-4 shadow-sm transition-all"
        style="background: #f5f5dc; border: 1px solid #c4b49a"
      )
        div
          p(
            class="text-lg font-semibold break-all"
            style="color: #0f4c2a"
          ) {{ user.email }}

          p(
            class="text-sm mt-1"
            style="color: #555"
          )
            span(class="capitalize") {{ user.role }}
            |  · Approved {{ formatDate(user.updatedAt) }}

        div(class="flex flex-wrap gap-3")
          button(
            v-if="user.role !== 'admin'"
            @click="makeAdmin(user.id)"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style="background: var(--color-utd-orange); color: #f5f5dc"
          ) Make Admin

          button(
            v-if="user.id !== currentUser?.id"
            @click="remove(user.id)"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style="background: #555; color: #f5f5dc"
          ) Remove

    //- Removed Users
    section
      div(class="flex items-center justify-between mb-5")
        h2(
          class="text-2xl font-semibold"
          style="color: #0f4c2a"
        ) Removed Users

        span(
          class="text-sm font-semibold px-3 py-1 rounded-full"
          style="background: #f5f5dc; border: 1px solid #c4b49a; color: #0f4c2a"
        ) {{ removedUsers.length }}

      div(
        v-if="removedUsers.length === 0"
        class="rounded-xl px-5 py-6 text-sm"
        style="background: #f5f5dc; border: 1px solid #c4b49a; color: #555"
      )
        | No removed users.

      div(
        v-for="user in removedUsers"
        :key="user.id"
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl mb-4 shadow-sm transition-all"
        style="background: #f5f5dc; border: 1px solid #c4b49a"
      )
        div
          p(
            class="text-lg font-semibold break-all"
            style="color: #0f4c2a"
          ) {{ user.email }}

          p(
            class="text-sm mt-1"
            style="color: #555"
          ) Removed {{ formatDate(user.updatedAt) }}

        button(
          @click="whitelist(user.id)"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style="background: #0f4c2a; color: #f5f5dc"
        ) Restore
</template>

<script setup lang="ts">
import { useAuthState } from "~/composables/useAuthState";

const { user: currentUser } = useAuthState();

const { data: users, refresh } = await useFetch("/api/users", {
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
    body: {
      id,
      whitelisted: true,
      removed: false,
    },
  });

  await refresh();
};

const remove = async (id: string) => {
  await $fetch("/api/users", {
    method: "PUT",
    body: {
      id,
      whitelisted: false,
      removed: true,
    },
  });

  await refresh();
};
const dismiss = async (id: string) => {
  await $fetch("/api/users", {
    method: "DELETE",
    query: { id },
  });
  await refresh();
};
const makeAdmin = async (id: string) => {
  await $fetch("/api/users", {
    method: "PUT",
    body: {
      id,
      role: "admin",
    },
  });

  await refresh();
};
</script>