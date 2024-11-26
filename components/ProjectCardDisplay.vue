<template lang="pug">
    mixin RectangleComponent(title, content, indicator, sem)
      .curved-rectangle.bg-pillText-100.rounded-lg.p-6.shadow-lg.max-w-sm.mx-auto.mb-4
        h2.text-xl.font-semibold.text-gray-800.mb-2 {{ title }}
        // Add conditional indicators
        .indicators.flex.gap-2.mt-2
            if indicator.toLowerCase() == 'new'
                .indicator.bg-green-200.rounded-full.px-2.py-1.text-xs.font-semibold.text-pillText {{ indicator }}
            else if indicator.toLowerCase() == 'returning'
                .indicator.bg-yellow-200.rounded-full.px-2.py-1.text-xs.font-semibold.text-pillText {{ indicator }}
            else 
            .indicator.bg-general.rounded-full.px-2.py-1.text-xs.font-semibold.text-pillText {{ indicator }}

        .sem.bg-general.rounded-full.px-2.py-1.text-xs.font-semibold.text-pillText {{sem}}
        p.text-gray-600.text-base.mb-4 {{ content }}
        
        
    </template>
    
    <script>
    export default {
      props: {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        indicator: {
          type: String,
          required: true,
          default: '',  // default to an empty string if not provided
        },
        sem: {
          type: String,
          required: true,
          default: '',  // default to an empty string if not provided
        },
      },
    }
    </script>