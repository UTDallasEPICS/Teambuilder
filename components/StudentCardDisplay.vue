<template lang="pug">
    mixin RectangleComponent(fName, lName, indicator, netID)
    .curved-rectangle.bg-pillText-100.rounded-lg.p-6.shadow-lg.max-w-sm.mx-auto.mb-4
    h2.text-xl.font-semibold.text-gray-800.mb-2 {{ `${lName}, ${fName}` }}
    
    // This is the "pill" component
    .indicator.flex.justify-start.mt-2
      if indicator.toLowerCase() == 'new'
        span.bg-green-200.text-pillText.px-3.py-1.rounded-full.text-xs.font-semibold {{ indicator }}
      else if indicator.toLowerCase() == 'returning'
        span.bg-orange-200.text-pillText.px-3.py-1.rounded-full.text-xs.font-semibold {{ indicator }}
      else
        span.bg-gray-300.text-pillText.px-3.py-1.rounded-full.text-xs.font-semibold {{ indicator }}
    
  
    p.text-gray-600.text-base.mt-4 {{ netID }}

        
    style(lang="css" scoped)
    h2 {
        color: "76A5C0";
    }
</template>

<script>
    export default {
      props: {
        fName: {
          type: String,
          required: true,
        },
        lName: {
          type: String,
          required: true,
        },
        indicator: {
          type: String,
          required: true,
          default: 'New',  // default to an empty string if not provided
        },
        netID: {
          type: String,
          required: true,
          default: '',  // default to an empty string if not provided
        },
      },
    }
</script>

