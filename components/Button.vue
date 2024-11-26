<template lang="pug">
    button(:class="buttonClass") {{title}}
</template>
    
<script>
  export default {
    name: "MyButton",
    props: {
      title: {
        type: String,
        required: true,
      },
      variant: {
        type: String,
        default: "primary",
      },
    },
    computed: {
      buttonClass() {
        if (this.$route.name === 'Project') {
          return 'ml-5 mt-12 border-8 border-solid border-transparent p-1 rounded-xl bg-[rgba(96,241,135,0.9)] text-xl';
        } 
        else if (this.$route.name === 'Upload') {
          return 'ml-8 mt-12 border-8 border-solid border-transparent p-1 rounded-xl bg-[rgba(96,241,135,0.9)] text-xl';
        }
        return 'bg-gray-500 text-white px-4 py-2 rounded';
      }
    },
    /*
    methods: {
      handleClick(event) {
        this.$emit("click", event); // Emits a click event for parent listeners
      },
    },
    */
  };

</script>