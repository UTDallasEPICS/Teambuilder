<template lang="pug">
    .p-4
      .border-2.border-gray-300.rounded-lg.p-4.w-full.max-w-md
        h3.text-xl.font-semibold.mb-4 List of Items:
        ul.list-disc.list-inside.ml-5
          li(
            v-for="(item, index) in items"
            :key="index"
            class="p-2 bg-gray-100 rounded-lg mb-2"
          )
            | {{ item }}
        .mt-4
          input(
            v-model="newItem"
            type="text"
            placeholder="Add a new item"
            class="p-2 border border-gray-300 rounded-lg w-full"
          )
          button(
            @click="addItem"
            class="mt-2 p-2 bg-blue-500 text-white rounded-lg w-full"
          )
            | Add Item
  </template>
  
  <script>
  export default {
    data() {
      return {
        items: ["Apple", "Banana", "Cherry"], // Initial list of items
        newItem: "", // Store the new item being added
      };
    },
    methods: {
      addItem() {
        if (this.newItem.trim()) {
          this.items.push(this.newItem); // Add new item to the list
          this.newItem = ""; // Clear the input field after adding
        }
      },
    },
  };
  </script>