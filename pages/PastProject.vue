<template lang="pug">
    .div.backgroundFont.text-pillText
      .div(
        style="padding: 20px; margin: 10px;" 
        class="pt-10 h-screen rounded-3xl bg-[rgba(90,91,88,0.33)] flex flex-row gap-10"
      )
    
        // Left Side (Project List and Student List Preview)
        .div(style="flex: 1; display: flex; flex-direction: column;" class="gap-6")
          // Header Row
          .div(style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;")
            h1(class="text-white text-3xl") Project List
            h1(class="text-white text-3xl") 
            p(class="text-white text-xl")
          // Scrollable Components Row
          .div(style="display: flex; gap: 20px;")
            // Projects Scroll Component
            .div(
              style="flex: 1; height: 450px; overflow-y: scroll; padding: 16px;"
              class="border-solid rounded-3xl bg-[rgba(48,100,162,0.29)]"
            )
              .project-container.space-y-4
                ProjectCardDisplay(
                  v-for="project in projects" 
                  :title="project.title"
                  :content="project.content"
                  :indicator="project.indicator"
                  :sem="project.sem"
                )
            // Student List Scroll Component
            .div(
              v-if="maxTeamSize" 
              style="flex: 2; height: 450px; overflow-y: scroll; padding: 16px;"
              class="border-solid rounded-3xl bg-[rgba(48,100,162,0.29)]"
            )
              .student-container.space-y-4
                StudentCardDisplay(
                  v-for="student in students"
                  :lname="student.lname"
                  :fname="student.fname"
                  :indicator="student.indicator"
                  :netID="student.netID"
                )
    
        .div(style="flex: 1;")
          .div(
            class="border-solid rounded-3xl bg-[rgba(48,100,162,0.29)] p-6 text-pillText"
          )
            h1.text-xl.text-white.mt-3.mb-2 Instruction
            h2.text-white.mb-4 Select your semester and timeframe to see past projects information
    
            .div.mb-4
              label(for="semester" class="block text-sm font-medium text-black") Select Semester
              select(
                id="semester"
                v-model="selectedSemester"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none sm:text-sm rounded-md"
              )
                option(value="Spring") Spring
                option(value="Fall") Fall
    
            .div.mb-4
              label(for="year" class="block text-sm font-medium text-black") Select Year
              select(
                id="year"
                v-model="selectedYear"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none sm:text-sm rounded-md"
              )
                option(v-for="year in years" :key="year" :value="year") {{ year }}
    
          .div(
            style="margin-top: 20px; height: auto; width: 100%; padding: 16px;"
            class="border-solid rounded-3xl bg-[rgba(48,100,162,0.29)]"
          )
            h1.text-white.text-xl.mb-4 Selected Project Details:
    
            // Student Details
            .div.space-y-4
              .div.p-4.rounded-lg.bg-
                p.text-white.text-sm.font-bold Git:
                p.text-white.text-sm Link: {{ gitLink }}
                p.text-white.text-sm.font-bold Doc:
                p.text-white.text-sm {{ docType }}
    
              .div.p-4.rounded-lg.bg-
                p.text-white.text-sm.font-bold Name:
                p.text-white.text-sm {{ student.lname }}, {{ student.fname }}
                p.text-white.text-sm Net ID: {{ student.netID }}
                p.text-white.text-sm Discord User: {{ student.discord }}
                p.text-white.text-sm.font-bold.mt-2 RETURNING
    </template>
    
    <script>
    export default {
      data() {
        return {
          selectedSemester: "Spring", 
          selectedYear: new Date().getFullYear(), 
          years: this.generateYears(), 
          gitLink: "abc123456", 
          docType: "pdf", 
          student: {
            lname: "Last",
            fname: "First",
            netID: "abc123456",
            discord: "@blah",
          },
        };
      },
      methods: {
        generateYears() {
          const currentYear = new Date().getFullYear();
          const range = 10; 
          return Array.from({ length: range }, (_, i) => currentYear - i);
        },
      },
    };
    </script>