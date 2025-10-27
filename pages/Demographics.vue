
<!--THIS ENTIRE PAGE NEEDS TO BE REDONE FROM THE GROUND UP, WHY THE F**K IS A SINGLE PAGE 1200 LINES OF F**KING PURE HTML CODE-->

<!--All of this HTML needs to be turned into concise tailwind elements and use the same coding scheme as the rest of the website-->

<template>  
  <div class="dashboard-container">
    <div class="sidebar">
      <!-- Close Button -->
      <button class="close-button" @click="toggleSidebar">&#x2715;</button>
      <!-- Time Period Tile -->
      <div class="field">
        <button 
          @click="toggleDropdown('timePeriod')" 
          class="field-button"
          type="button"
        >
          {{ getTimePeriodDisplayText() }}
        </button>
  
        <div v-if="isDropdownOpen('timePeriod')" class="dropdown-options">
          <!-- Time Period Options -->
          <div class="time-period-options">
            <label>
              <input 
                type="radio" 
                value="Continuous" 
                v-model="timePeriodOption"
              />
              Continuous
            </label>
            <label>
              <input 
                type="radio" 
                value="Semester-based" 
                v-model="timePeriodOption"
              />
              Semester-based
            </label>
          </div>
  
          <!-- Continuous Option -->
          <div v-if="timePeriodOption === 'Continuous'" class="time-period-inputs">
            <label>Start Year:</label>
            <input type="text" v-model="customYearStart" placeholder="Start Year" class="custom-input" />
  
            <label>End Year:</label>
            <input type="text" v-model="customYearEnd" placeholder="End Year" class="custom-input" />
  
            <label>Start Semester:</label>
            <select v-model="customSemesterStart" class="custom-dropdown">
              <option disabled value="">Select Semester</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Fall</option>
            </select>
  
            <label>End Semester:</label>
            <select v-model="customSemesterEnd" class="custom-dropdown">
              <option disabled value="">Select Semester</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Fall</option>
            </select>
          </div>
  
          <!-- Semester-based Option -->
          <div v-if="timePeriodOption === 'Semester-based'" class="time-period-inputs">
            <label>Start Year:</label>
            <input type="text" v-model="customYearStart" placeholder="Start Year" class="custom-input" />
  
            <label>End Year:</label>
            <input type="text" v-model="customYearEnd" placeholder="End Year" class="custom-input" />
  
            <label>Choose Semesters:</label>
            <div class="semester-options">
              <div 
                v-for="semester in semesters" 
                :key="semester" 
                :class="{'dropdown-item': true, 'selected': selectedSemesters.includes(semester)}"
                @click="toggleSemester(semester)"
              >
                {{ semester }}
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filter Buttons -->
      <div v-for="filter in filters" :key="filter.name" class="field">
        <!-- Only display buttons for "Ethnicity" or "Gender" if selected in Demographics -->
        <button 
          v-if="(filter.name === 'Ethnicity' && filters.find(f => f.name === 'Demographics').selectedOptions.includes('Ethnicity')) || 
                (filter.name === 'Gender' && filters.find(f => f.name === 'Demographics').selectedOptions.includes('Gender')) ||
                (filter.name !== 'Ethnicity' && filter.name !== 'Gender')" 
          @click="toggleDropdown(filter.name)" 
          class="field-button"
        >
          {{ getFilterDisplayText(filter) }}
        </button>

        <div v-if="isDropdownOpen(filter.name)" class="dropdown-options">
          <!-- Show the Demographics filter dropdown -->
          <div v-if="filter.name === 'Demographics'">
            <div 
              v-for="option in filter.options" 
              :key="option" 
              :class="{'dropdown-item': true, 'selected': filter.selectedOptions.includes(option)}"
              @click="toggleOption(filter.name, option)"
            >
              {{ option }}
            </div>
          </div>

          <!-- Show Ethnicity options if Ethnicity is selected in Demographics -->
          <div v-if="filter.name === 'Ethnicity' && filters.find(f => f.name === 'Demographics').selectedOptions.includes('Ethnicity')">
            <div 
              v-for="option in filter.options" 
              :key="option" 
              :class="{'dropdown-item': true, 'selected': filter.selectedOptions.includes(option)}"
              @click="toggleOption(filter.name, option)"
            >
              {{ option }}
            </div>
          </div>

          <!-- Show Gender options if Gender is selected in Demographics -->
          <div v-if="filter.name === 'Gender' && filters.find(f => f.name === 'Demographics').selectedOptions.includes('Gender')">
            <div 
              v-for="option in filter.options" 
              :key="option" 
              :class="{'dropdown-item': true, 'selected': filter.selectedOptions.includes(option)}"
              @click="toggleOption(filter.name, option)"
            >
              {{ option }}
            </div>
          </div>

          <!-- Show the regular dropdown options for filters like Course, Metric Type, and Chart -->
          <!-- Show the regular dropdown options for filters like Course, Metric Type, and Chart -->
          <div v-if="filter.name !== 'Demographics' && filter.name !== 'Ethnicity' && filter.name !== 'Gender'">
            <div 
              v-for="option in filter.options" 
              :key="option" 
              :class="{'dropdown-item': true, 'selected': filter.selectedOptions.includes(option)}"
              @click="toggleOption(filter.name, option)"
            >
              {{ option }}
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-query">
        <button 
          class="submit-button" 
          @click="getRequest"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </button>
      </div>
      <!--import button-->
      <button class="import-button" @click="triggerFileInput">Import File</button>
      <div class="upload-wrapper">
        <div class="file-upload">
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx, .xls, .csv"
            @change="onFileSelected"
            style = "display:none"
            />

          <div v-if="file && !isSent" class="file-info">   
            <div class="file-info">
                <span class="file-name">{{ file.name }}</span>
              <div class="button-group">
                <button class="import-button" @click="removeFile">Cancel</button>
                <button class = "import-button" @click="onFileChange">Send Extracted Data</button>
              </div>   
            </div>       
          </div>
          <p v-if="isSent" class="success-message">Data sent successfully!</p>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div> 
  </div>  
</template>

<script>
import * as XLSX from 'xlsx'; //This will be better used as https://docs.sheetjs.com/docs/getting-started/installation/nodejs#vendoring
import { defineComponent } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

export default defineComponent({
  data() {
    return {
      filters: [
        { name: "Course", options: ["2200", "3200"], selectedOptions: [] },
        { name: "Demographics", options: ["Ethnicity", "Gender", "Total"], selectedOptions: [] }, // New Demographics filter
        { name: "Ethnicity", options: ["African_American", "Asian", "Hispanic", "International", "Other", "White"], selectedOptions: [] },
        { name: "Gender", options: ["Female", "Male"], selectedOptions: [] },
        { name: "Chart", options: ["Bar", "Pie", "Line", "Combined bar and line"], selectedOptions: [] },
        { name: "Metric Type", options: ["Number", "Percentages"], selectedOptions: [] }
      ],
      semesters: ["Fall", "Spring", "Summer"],
      openDropdown: null,
      timePeriodOption: "",
      customYearStart: "",
      customYearEnd: "",
      customSemesterStart: "",
      customSemesterEnd: "",
      selectedSemesters: [],
      chartData: [],
      chart: null,
      isLoading: false,
      file: null,
      fileName: "",
      uploaded: false,
      isSent: false,
      fileUploader: null
    };
  },
  watch: {
    timePeriodOption(newVal) {
      if (newVal === "Continuous") {
        this.selectedSemesters = [];
      } else if (newVal === "Semester-based") {
        this.customSemesterStart = "";
        this.customSemesterEnd = "";
      }
    }
  },
  methods: {
    toggleSidebar() {
      // Implementation can be added if needed
    },
    toggleDropdown(filterName) {
      this.openDropdown = this.openDropdown === filterName ? null : filterName;
    },
    isDropdownOpen(filterName) {
      return this.openDropdown === filterName;
    },
    toggleSemester(semester) {
      const index = this.selectedSemesters.indexOf(semester);
      if (index === -1) {
        this.selectedSemesters.push(semester);
      } else {
        this.selectedSemesters.splice(index, 1);
      }
    },
    toggleOption(filterName, option) {
      const filter = this.filters.find(f => f.name === filterName);

      // If the option is already selected, unselect it
      const optionIndex = filter.selectedOptions.indexOf(option);
      if (optionIndex === -1) {
        // If not selected, add the option to the array (keep multiple selections for Ethnicity and Gender)
        filter.selectedOptions.push(option);
      } else {
        // If already selected, remove it (toggle off)
        filter.selectedOptions.splice(optionIndex, 1);
      }

      // If Demographics filter is selected, ensure that only one of Ethnicity or Gender is chosen
      if (filterName === "Demographics") {
        if (option === "Ethnicity" || option === "Gender") {
          // If one option is selected, reset the other option
          this.filters.find(f => f.name === "Demographics").selectedOptions = [option];
          if (option === "Ethnicity") {
            this.filters.find(f => f.name === "Gender").selectedOptions = []; // Reset Gender
          } else if (option === "Gender") {
            this.filters.find(f => f.name === "Ethnicity").selectedOptions = []; // Reset Ethnicity
          }
        }
        else if (option === "Total"){ //We don't want to select any ethnicities or genders if the total option is selected
          this.filters.find(f => f.name === "Demographics").selectedOptions = [option];
          this.filters.find(f => f.name === "Gender").selectedOptions = []; // Reset Gender
          this.filters.find(f => f.name === "Ethnicity").selectedOptions = []; // Reset Ethnicity
        }
      }

      // Ensure that for Chart and Metric Type filters, only one option is selected at a time
      if (filterName === "Chart" || filterName === "Metric Type" || filterName === "Demographics") {
        filter.selectedOptions = [option];  // Keep only the newly selected option
      }
    },
    getFilterDisplayText(filter) {
      if (filter.selectedOptions.length > 0) {
        if (filter.name === "Demographics") {
          return `Demographics: ${filter.selectedOptions.join(', ')}`;
        }
        return `${filter.name}: ${filter.selectedOptions.join(', ')}`;
      }
      return filter.name;
    },
    getTimePeriodDisplayText() {
      if (this.timePeriodOption === "Continuous") {
        if (this.customYearStart && this.customYearEnd) {
          return `Continuous: ${this.customYearStart}-${this.customYearEnd}, ${this.customSemesterStart || 'Start'} to ${this.customSemesterEnd || 'End'}`;
        }
      }
      if (this.timePeriodOption === "Semester-based") {
        if (this.customYearStart && this.customYearEnd) {
          const semesters = this.selectedSemesters.length ? `(${this.selectedSemesters.join(", ")})` : "";
          return `Semester-based: ${this.customYearStart}-${this.customYearEnd} ${semesters}`;
        }
      }
      return "Time Period";
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    removeFile() {
      this.file = null;
      this.parsedData = null;
      this.$refs.fileInput.value = null;
    },
    

    onFileSelected(event){
      const selectedFile = event.target.files[0]; 
      if(selectedFile){
        this.resetUpload(); 
        this.file = selectedFile; 
      }
    },
    resetUpload() {
      this.file = null;
      this.fileName = "";
      this.parsedData = null;
      this.uploaded = false;
      this.isSent = false;
    },

    //onFileChange ➔ Do all the Excel parsing, JSON conversion, and upload to server.
    async onFileChange(event){
      function getColumnMajor(arr){//Requires a rectangular 2D array
        let transpose = [];
        for(let c = 0; c < arr[0].length; c++){
            let currentCol = [];
            for(let r = 0; r < arr.length; r++){
                currentCol.push(arr[r][c]);
            }
            transpose.push(currentCol); //Pushes it as, essentially, a row
        }
        return transpose;
      }
      function extractCells(worksheet, relevantRange){
        return XLSX.utils.sheet_to_json(worksheet, {header: 1, range: relevantRange});
      }
      function extractColumnMajor(worksheet, relevantRange){
        return getColumnMajor(extractCells(worksheet, relevantRange));
      }
      function determineEndingColumn(worksheet, beginningAddress){//Given a SheetJS worksheet and a valid top-left address for the table, determine the width of the table
        let jsonaddress = {c:beginningAddress.c, r:beginningAddress.r};
        let address = XLSX.utils.encode_cell(jsonaddress);
        let cell = worksheet[address];
        while(cell !== undefined){
          jsonaddress.c += 1;
          address = XLSX.utils.encode_cell(jsonaddress);
          cell = worksheet[address];
        }
        jsonaddress.c -= 2; //the last relevant column is to the left of the total column which is to the left of the first undefined column
        return jsonaddress.c;
      }
      function createSemestersFrom2DArray(arr, courseName){//expects a 2D array extracted from lines 34-45 of the Excel file
        //if the course is 3200, there is no "Other" row
        let otherIndexOffset = 0;
        //The "courseName === "2100"" part, and all similar parts conditional on 2100 and 3100, are irrelevant now that data from those classes is uploaded under the names of 2200 and 3200 respectively
        if((courseName === "2200") || (courseName === "2100")){
          otherIndexOffset = 1;
        }
        let semesterArray = []
        arr.forEach(element => {
          let constructedYear = Number("20"+element[0].substring(0,2));
          let otherAmount = 0;
          //The "Other" amount is constructed from 3 rows for 2200 and 2 rows for 3200 (there's no "Other" row for 3200)
          if((courseName==="2200")||(courseName==="2100")){
            otherAmount = Number(element[5]) + Number(element[6]) + Number(element[7]);
          }
          else{
            otherAmount = Number(element[5]) + Number(element[6]);
          }
          let constructedSemester = "";
          if(element[0][2]==='S'){//third character of the semester entry of the element
            constructedSemester = "Spring";
          }
          else if(element[0][2]==='F'){
            constructedSemester = "Fall";
          }
          else{//No winter semesters yet. This is a consequential assumption. Isaac Philo, April 3rd, 2025.
            constructedSemester = "Summer";
          }
          let semesterToPush = {
            Name: element[0],
            Course: courseName,
            Year: constructedYear,
            Sem: constructedSemester,
            African_American: Number(element[1]) || 0,
            Asian: Number(element[2]) || 0,
            Hispanic: Number(element[3]) || 0,
            International: Number(element[4]) || 0,
            Other: otherAmount || 0,
            //OtherIndexOffset gives us an index that is 1 higher if and only if we are processing EPCS 2200.
            //No incrementation for 2200.
            White: Number(element[7+otherIndexOffset]) || 0,
            Male: Number(element[8+otherIndexOffset]) || 0,
            Female: Number(element[9+otherIndexOffset]) || 0,
            Total: Number(element[10+otherIndexOffset]) || 0
          };
          semesterArray.push(semesterToPush);
          // console.log("Semester being pushed: " + JSON.stringify(semesterToPush));
        });
        return semesterArray;
      }
      //Parsing logic will occur on the frontend
      try{
        const reader = new FileReader();
        const workbook = XLSX.read(await this.file.arrayBuffer()); //Assuming that the whole post body will be the file.
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const range2100 = XLSX.utils.decode_range("C34:I45");
        const range3100 = XLSX.utils.decode_range("C47:I57");
        //Some variables for more flexible row selections
        //The table for 2200 starts at column L and is in rows 34-45 (L34:V45 was the relevant selection as of April 10th, 2025)
        //The table for 3200 starts at column L and is in rows 47-57 (L47:V57 was the relevant selection as of April 10th, 2025)
        //These ranges are of different length because the categories for each class differ slightly (differences are merged in processing)
        const startingColumn = XLSX.utils.decode_col("L");

        const beginningRow2200 = XLSX.utils.decode_row("34");
        const endingRow2200 = XLSX.utils.decode_row("45");

        const beginningRow3200 = XLSX.utils.decode_row("47");
        const endingRow3200 = XLSX.utils.decode_row("57");

        const beginningAddress = XLSX.utils.decode_cell("L34");
        const endingColumn = determineEndingColumn(worksheet, beginningAddress);
        console.log(`Ending column = ${endingColumn}`);

        const calculatedRange2200 = {s: {r: beginningRow2200, c: startingColumn}, e: {r: endingRow2200, c: endingColumn}};
        const calculatedRange3200 = {s: {r: beginningRow3200, c: startingColumn}, e: {r: endingRow3200, c: endingColumn}};

        const dataFrom2200 = extractColumnMajor(worksheet, calculatedRange2200);
        const dataFrom3200 = extractColumnMajor(worksheet, calculatedRange3200);
        const dataFrom2100 = extractColumnMajor(worksheet, range2100);
        const dataFrom3100 = extractColumnMajor(worksheet, range3100);
        const JSONFor2200 = createSemestersFrom2DArray(dataFrom2200, "2200");
        const JSONFor3200 = createSemestersFrom2DArray(dataFrom3200, "3200");
        //Uploading 2100 under the name of 2200 because Andrea considers the two classes synonymous
        const JSONFor2100 = createSemestersFrom2DArray(dataFrom2100, "2200");
        //Uploading 3100 under the name of 3200 because Andrea considers those two classes synonymous as well
        const JSONFor3100 = createSemestersFrom2DArray(dataFrom3100, "3200");
        // console.log(JSONFor2200);//Arrays of JSON objects
        // console.log(JSONFor3200);
        let semestersObject = JSONFor2100.concat(JSONFor3100).concat(JSONFor2200).concat(JSONFor3200); //An array of all of the semester data in total
        
        //Regarding a possible additional column for the ongoing semester, to be extracted from the top right table
        const afterCensusDayBeginningAddress = XLSX.utils.decode_cell("L5");
        const topEndingColumn = determineEndingColumn(worksheet, afterCensusDayBeginningAddress);
        if(topEndingColumn > endingColumn){ //If the file uploaded contains data for the current, ongoing semester, which occurs if the top table is wider than the bottom table
          const currentSemesterRange2200 = {s: {r: XLSX.utils.decode_row("5"), c: topEndingColumn}, e: {r: XLSX.utils.decode_row("16"), c: topEndingColumn}};
          const currentSemesterRange3200 = {s: {r: XLSX.utils.decode_row("18"), c: topEndingColumn}, e: {r: XLSX.utils.decode_row("28"), c: topEndingColumn}};
          const currentSemesterData2200 = extractColumnMajor(worksheet, currentSemesterRange2200);
          const currentSemesterData3200 = extractColumnMajor(worksheet, currentSemesterRange3200);
          const currentSemesterJSON2200 = createSemestersFrom2DArray(currentSemesterData2200, "2200");
          const currentSemesterJSON3200 = createSemestersFrom2DArray(currentSemesterData3200, "3200");
          console.log("Adding current semester: " + JSON.stringify(currentSemesterJSON2200) + JSON.stringify(currentSemesterJSON3200));
          semestersObject = semestersObject.concat(currentSemesterJSON2200).concat(currentSemesterJSON3200);
        }
        
        const res = await $fetch('/api/demographic', {
          method: 'POST',
          body: semestersObject
        })
        console.log("Sending the following JSON objects:");
        semestersObject.forEach(element => {console.log(JSON.stringify(element))});
        console.log("JSON objects sent!");
        // console.log(JSON.stringify(res));
        this.isSent = true;

      }
      catch (error) {
        console.log(error);
      }
    },
    
    async getRequest() {
      if (this.isLoading) return;
      this.isLoading = true;

      const params = new URLSearchParams();
      console.log("Here are the filters now that submit has been called: " + JSON.stringify(this.filters));
      if (this.filters.find(f => f.name === "Metric Type").selectedOptions.length > 0) {
      const yAxis = this.filters.find(f => f.name === "Metric Type").selectedOptions[0];
      params.append("Metric Type", yAxis);
      }
      if (this.timePeriodOption === "Continuous") {
        params.append("Continuous", "true");
        params.append("Year", `${this.customYearStart},${this.customYearEnd}`);
        if (this.customSemesterStart && this.customSemesterEnd) {
          params.append("Semester", `${this.customSemesterStart},${this.customSemesterEnd}`);
        }
      } else if (this.timePeriodOption === "Semester-based") {
        params.append("Continuous", "false");
        params.append("Year", `${this.customYearStart},${this.customYearEnd}`);
        if (this.selectedSemesters.length) {
          params.append("Semester", this.selectedSemesters.join(","));
        }
      }

      this.filters.forEach((filter) => {
        if (filter.selectedOptions.length > 0 && filter.name !== "Chart") {
          params.append(filter.name, filter.selectedOptions.join(","));
        } else if (filter.selectedOptions.length === 0 && filter.name !== "Chart") {
          params.append(filter.name, "Empty");
        }
      });

      const queryString = params.toString();
      const apiUrl = `/api/demographic?${queryString}`;
      
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Response was not ok");
        }
        const data = await response.json();
        
        if (data.success) {
          console.log('Received data:', data.data);
          
          const uniqueData = Array.from(new Map(
            data.data.map(item => [`${item.Name}-${item.Course}`, item])
          ).values());
          
          console.log('Deduplicated data:', uniqueData);
          this.chartData = uniqueData;
          this.plotChart();
        } else {
          console.error(data.message);
        }
      } catch(error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

  // Helper function to generate distinct colors for ethnicities
getColorForEthnicity(ethnicity) {
    const colors = {
        "African_American": "rgba(0, 109, 72, 0.7)",
        "Asian": "rgba(75, 192, 192, 0.7)",
        "Hispanic": "rgba(255, 99, 132, 0.7)",
        "International": "rgba(153, 102, 255, 0.7)",
        "Other": "rgba(255, 159, 64, 0.7)",
        "White": "rgba(54, 162, 235, 0.7)"
    };
    return colors[ethnicity] || "rgba(0, 0, 0, 0.7)";
},

// Helper function to generate distinct colors for genders
getColorForGender(gender) {
    const colors = {
        "Male": "rgba(0, 123, 255, 0.7)",
        "Female": "rgba(255, 99, 132, 0.7)"
    };
    return colors[gender] || "rgba(0, 0, 0, 0.7)";
},
    
  plotChart() {
    console.log('Starting plotChart with data:', this.chartData);
    console.log('Chart type:', this.filters.find(f => f.name === "Chart")?.selectedOptions[0]);

    // Destroy existing chart
    if (this.chart) {
        this.chart.destroy();
        this.chart = null;
    }

    // Basic validation
    if (!this.chartData.length) {
        console.log('No data to plot');
        return;
    }

    const chartType = this.filters.find(f => f.name === "Chart")?.selectedOptions[0];
    if (!chartType) {
        console.log('No chart type selected');
        return;
    }

    const selectedEthnicities = this.filters.find(f => f.name === "Ethnicity")?.selectedOptions;
    const selectedGenders = this.filters.find(f => f.name === "Gender")?.selectedOptions;

    const isOnlyTotalView = (!selectedGenders?.length && !selectedEthnicities?.length) || 
                           (selectedGenders?.[0] === "Empty" && selectedEthnicities?.[0] === "Empty");
    const selectedCourses = this.filters.find(f => f.name === "Course")?.selectedOptions;
    const isBothCoursesSelected = selectedCourses.includes("2200") && selectedCourses.includes("3200");
    console.log('Is total view:', isOnlyTotalView);

    // When the "Total View" is selected, calculate percentage for each course.
    if (isOnlyTotalView) {
  const xValues = this.chartData.map(item => item.Name);
  const totalValues = this.chartData.map(item => item.Total);

  // Calculate grand total for percentage calculations
  const grandTotal = totalValues.reduce((sum, val) => sum + val, 0);

  // Separate data by course
  const courses = [...new Set(this.chartData.map(item => item.Course))];
  const datasets = courses.map(course => ({
    label: `Course ${course}`,
    data: this.chartData
      .filter(item => item.Course === course)
      .map(item => item.Total),
    backgroundColor: course === "2200" ? 'rgba(0, 109, 72, 0.7)' : 'rgba(75, 192, 192, 0.7)',
    borderColor: course === "2200" ? 'rgb(0, 109, 72)' : 'rgb(75, 192, 192)',
    borderWidth: 1
  }));

  let chartConfig = {
    type: chartType === "Bar" ? "bar" : chartType.toLowerCase(),
    data: {
      labels: [...new Set(xValues)],  // Ensure unique semester labels
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Total Students per Semester by Course`
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const percentage = ((value / grandTotal) * 100).toFixed(1);
              return `${context.dataset.label}: ${value} students (${percentage}% of total)`;
            }
          }
        },
        datalabels: {
          display: (context) => context.dataset.data[context.dataIndex] > 10,
          color: 'black',
          anchor: 'end',
          align: 'top',
          formatter: (value) => value
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: '5%',
          title: {
            display: true,
            text: 'Number of Students'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Semester'
          },
          ticks: {
            minRotation: 45,
            maxRotation: 45
          }
        }
      }
    }
  };

  // Modify config based on chart type
  if (chartType === "Pie") {
    // For pie chart, combine course and semester labels
    const combinedLabels = this.chartData.map(item => `${item.Name} - Course ${item.Course}`);
    chartConfig.data.labels = combinedLabels;
    chartConfig.data.datasets = [{
      data: totalValues,
      backgroundColor: this.chartData.map(item => 
        item.Course === "2200" ? 'rgba(0, 109, 72, 0.7)' : 'rgba(75, 192, 192, 0.7)'
      )
    }];
    chartConfig.options.plugins.tooltip.callbacks.label = (context) => {
      const value = context.raw;
      const percentage = ((value / grandTotal) * 100).toFixed(1);
      return `${context.label}: ${value} students (${percentage}% of total)`;
    };
  } else if (chartType === "Line") {
    datasets.forEach(dataset => {
      dataset.fill = false;
      dataset.tension = 0.4;
    });
  } else if (chartType === "Combined bar and line") {
    chartConfig.type = 'bar';
    chartConfig.data.datasets = [
      ...datasets,  // Bar datasets
      ...datasets.map(dataset => ({  // Line datasets
        ...dataset,
        type: 'line',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        order: 1
      }))
    ];
  }

  console.log('Creating chart with config:', chartConfig);
  const ctx = this.$refs.chartCanvas.getContext('2d');
  this.chart = new Chart(ctx, chartConfig);
}else if (isBothCoursesSelected) {
        const xValues = []; // To store the semester labels like '22S-2200/3200'
        const datasets = []; // To store the datasets for each semester (grouped by semester)
        const isGenderMode = selectedGenders && selectedGenders.length > 0;
        const selectedCategories = isGenderMode ? selectedGenders : selectedEthnicities;
        // Object to aggregate data by semester and course (2200/3200)
        const combinedData = {};

        // Loop through each item in chartData
        this.chartData.forEach(item => {
            // Create a label for each combination of Name (semester) and Course (2200/3200)
            const semesterLabel = `${item.Name}-2200/3200`;

            // Initialize semester data if not already created
            if (!combinedData[semesterLabel]) {
                combinedData[semesterLabel] = {
                    total2200: 0,
                    total3200: 0,
                    ethnicityData2200: {},
                    ethnicityData3200: {},
                    genderData2200: {},
                    genderData3200: {},
                };
            }

            const currentData = combinedData[semesterLabel];

            // Aggregate data for 2200 and 3200
            if (item.Course === "2200") {
                currentData.total2200 += item.Total;

                // Aggregate ethnicity data for 2200
                selectedEthnicities.forEach(e => {
                    currentData.ethnicityData2200[e] = (currentData.ethnicityData2200[e] || 0) + item[e];
                });

                // Aggregate gender data for 2200
                selectedGenders.forEach(g => {
                    currentData.genderData2200[g] = (currentData.genderData2200[g] || 0) + item[g];
                });
            } else if (item.Course === "3200") {
                currentData.total3200 += item.Total;

                // Aggregate ethnicity data for 3200
                selectedEthnicities.forEach(e => {
                    currentData.ethnicityData3200[e] = (currentData.ethnicityData3200[e] || 0) + item[e];
                });

                // Aggregate gender data for 3200
                selectedGenders.forEach(g => {
                    currentData.genderData3200[g] = (currentData.genderData3200[g] || 0) + item[g];
                });
            }
        });

        // Now push the combined data into xValues and datasets for each semester
        Object.keys(combinedData).forEach(semesterLabel => {
            xValues.push(semesterLabel); // Add semester-course label (e.g., '22S-2200/3200')
        });

        // Chart configuration for the bar chart
        let chartConfig = {
            type: chartType === "Bar" ? "bar" : chartType.toLowerCase(),
            data: {
                labels: xValues, // Labels like '22S', '23S'
                datasets: [] // Combined data for each semester, ethnicities, and genders
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Total Students per Semester by Demographics (2200 and 3200)`
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                              const value = context.raw;
                              const dataIndex = context.dataIndex; // Get the data index (for accessing the semester)
                              const semesterLabel = xValues[dataIndex]; // Get the semester label
                              const semesterData = combinedData[semesterLabel]; // Get the aggregated data for the current semester

                              // Determine total values for 2200 and 3200
                              const total2200 = semesterData.total2200;
                              const total3200 = semesterData.total3200;
                              const total = total2200 + total3200; // Total students (2200 + 3200)

                              let combinedDataValue = 0;

                              // For gender or ethnicity, calculate the combined value (2200 + 3200)
                              if (isGenderMode) {
                                  combinedDataValue = (semesterData.genderData2200[context.dataset.label] || 0) + (semesterData.genderData3200[context.dataset.label] || 0);
                              } else {
                                  combinedDataValue = (semesterData.ethnicityData2200[context.dataset.label] || 0) + (semesterData.ethnicityData3200[context.dataset.label] || 0);
                              }

                              // Now calculate the percentage and raw value
                              const percentage = (combinedDataValue / total) * 100;
                              const rawValue = combinedDataValue;

                              let tooltipLabel = `${context.dataset.label}: ${rawValue} students`;

                              if (this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages") {
                                  tooltipLabel += ` (${percentage.toFixed(1)}%)`; // Display percentage
                              } else {
                                  tooltipLabel += ` (${((rawValue / total) * 100).toFixed(1)}%)`; // Display raw value with percentage
                              }

                              return tooltipLabel;
                          }
                        }
                    },
                    datalabels: {
                        display: (context) => context.dataset.data[context.dataIndex] > 10,
                        color: 'black',
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value.toFixed(2)
                    }
                },
                scales: {
                  y: {
                        beginAtZero: true,
                        max: this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages" ? 100 : undefined,
                        title: {
                            display: true,
                            text: this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages" ? 'Percentage of Students' : 'Number of Students'
                        },
                        ticks: {
                            callback: function(value) {
                                if (this.options.ticks.max === 100) {
                                    return value + '%'; 
                                }
                                return value; 
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Semester-Course'
                        },
                        ticks: {
                            minRotation: 45,
                            maxRotation: 45
                        }
                    }
                }
            }
        };

        chartConfig.data.datasets = selectedCategories.map((category, index) => ({
            label: category,
            data: xValues.map((semesterLabel) => {
                const semesterData = combinedData[semesterLabel];
                let combinedDataValue = 0;

                // For ethnicity or gender data (combining 2200 and 3200)
                if (isGenderMode) {
                    combinedDataValue = (semesterData.genderData2200[category] || 0) + (semesterData.genderData3200[category] || 0);
                } else {
                    combinedDataValue = (semesterData.ethnicityData2200[category] || 0) + (semesterData.ethnicityData3200[category] || 0);
                }

                const total = semesterData.total2200 + semesterData.total3200;
                return this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages"
                    ? (combinedDataValue / total) * 100
                    : combinedDataValue;
            }),
            backgroundColor: isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category),
            borderColor: isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category),
            fill: false,
            tension: chartType === "Line" ? 0.4 : undefined
        }));

        // Final step: Create the chart with the provided configuration
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, chartConfig);
    } else {
      // Ethnicity or Gender Visualization logic
      const isGenderMode = selectedGenders && selectedGenders.length > 0;
      const selectedCategories = isGenderMode ? selectedGenders : selectedEthnicities;
      const xValues = this.chartData.map(item => `${item.Name}-${item.Course}`);

      let chartConfig = {
        type: chartType === "Bar" ? "bar" : chartType.toLowerCase(),
        data: {
          labels: xValues,
          datasets: []  // Initially empty
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Demographic Data by ${isGenderMode ? 'Gender' : 'Ethnicity'}`
            },
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw;  // The value for the current bar (either percentage or raw count)
                  const dataIndex = context.dataIndex;
                  const dataPoint = this.chartData[dataIndex];  // Getting the data point for this specific bar
                  const total = dataPoint.Total;  // Total number of students for the current data point

                  let percentage = '';
                  let rawValue = '';

                  if (this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages") {
                    percentage = `${(value).toFixed(1)}%`;  // Use context.raw for percentage, rounded to 1 decimal place
                    rawValue = Math.round(value * total / 100);  // Convert percentage to raw value, rounded to nearest whole number
                  } else {
                    percentage = `${((value / total) * 100).toFixed(1)}%`;  // Calculate percentage and round to 1 decimal place
                    rawValue = Math.round(value);  // Raw value (student count), rounded to nearest whole number
                  }

                  return `${context.dataset.label}: ${rawValue} students (${percentage})`;
                }
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages" ? 100 : undefined,  // Max is 100 for percentages
              title: {
                display: true,
                text: this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages" ? 'Percentage of Students' : 'Number of Students'
              },
              ticks: {
                callback: function(value) {
                  if (this.options.ticks.max === 100) {
                    return value + '%'; // Show percentage on Metric Type if percentages are selected
                  }
                  return value; // Show raw number if numbers are selected
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Year-Semester-Course'
              },
              ticks: {
                minRotation: 45,
                maxRotation: 45
              }
            }
          }
        }
      };

      chartConfig.data.datasets = selectedCategories.map((category, index) => {
        // Assign color based on course
        const backgroundColor = isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category);

        return {
          label: category,
          data: this.chartData.map((item, i) => {
            // If "Percentages" is selected, convert to percentage
            return this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages"
              ? (item[category] / item.Total) * 100
              : item[category]; // Return raw number if "Number" is selected
          }),
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          fill: false,
          tension: chartType === "Line" ? 0.4 : undefined
        };
      });

      // Pie chart logic
      if (chartType === "Pie") {
        // Calculate the total for each selected category (Gender or Ethnicity)
        const pieData = selectedCategories.map(category => {
          // Aggregate data for each category across all semesters and courses
          let categoryTotal = 0;

          this.chartData.forEach(item => {
            // Add the count for the selected category (Genders or Ethnicities)
            if (isGenderMode) {
              categoryTotal += item[category] || 0;
            } else {
              categoryTotal += item[category] || 0;
            }
          });

          return categoryTotal;
        });

        const total = pieData.reduce((sum, value) => sum + value, 0);

        // Generate unique colors for each category (Gender or Ethnicity)
        const colors = selectedCategories.map((category, index) => {
          return isGenderMode 
            ? this.getColorForGender(category)  // Use getColorForGender if in Gender Mode
            : this.getColorForEthnicity(category); // Use getColorForEthnicity otherwise
        });

        // Assign the data to the pie chart
        chartConfig.data.datasets = [{
          data: pieData,  // Total per Gender or Ethnicity category
          backgroundColor: colors, // Unique colors for each slice
          hoverOffset: 4
        }];

        chartConfig.options.plugins.tooltip.callbacks.label = (context) => {
          const value = context.raw;  // The value for the current pie slice
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);  // Total of all pie slices
          const percentage = ((value / total) * 100).toFixed(1);  // Calculate percentage for the slice

          // Get the category (this will be from the label of the dataset, i.e., the demographic category like "Male", "Asian")
          const cat = context.dataset.label;  // This gets the label (category) from the dataset
          
          // Return the formatted string for the tooltip
          return `${cat}: ${value} students (${percentage}% of total)`;
        };

      }
      console.log('Creating demographic chart with config:', chartConfig);
      const ctx = this.$refs.chartCanvas.getContext('2d');
      this.chart = new Chart(ctx, chartConfig);
    }
},

    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    }
  }
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}
.upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.file-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sidebar {
  background-color: #006d48;
  padding: 16px;
  display: flex;
  flex-direction: column;
  width: 250px;
  border-radius: 8px;
  height: fit-content;
}

.chart-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
  height: 800px;
  margin: 10px;
}

.close-button {
  color: white;
  font-size: 20px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 16px;
}

.field {
  margin-bottom: 8px;
}

.field-button {
  background-color: #ffffff;
  color: #006d48;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.field-button:hover {
  background-color: #e8f5e9;
}

.dropdown-options {
  background-color: #ffffff;
  color: black;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 8px 12px;
  color: #006d48;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #e8f5e9;
}

.dropdown-item.selected {
  background-color: #e8f5e9;
  font-weight: bold;
}

.time-period-options {
  padding: 8px;
}

.time-period-inputs {
  padding: 8px;
}

.custom-range {
  margin: 8px 0;
}

.custom-input {
  width: 48%;
  padding: 6px;
  margin: 4px 1%;
  border: 1px solid #006d48;
  border-radius: 4px;
  font-size: 14px;
}

.custom-dropdown {
  width: 100%;
  padding: 6px;
  margin: 4px 0;
  border: 1px solid #006d48;
  border-radius: 4px;
  font-size: 14px;
}

.submit-query {
  margin-top: 20px;
}

.submit-button {
  background-color: #ffffff;
  color: #006d48;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
}

.submit-button:hover {
  background-color: #e8f5e9;
}
.file-info{
  display: flex; 
  flex-direction: column;
  align-items: center;
}
.file-name{
  display: block;
  margin-bottom: 2px;
  font-weight: bold;
  margin-top: 5x;
}
.button-group{
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
}
.import-button{
  margin-left: 0px;
  margin-top: 10px;
  margin-bottom: 3px;
  background-color: rgb(50, 55, 52);
  padding: 10px;
  border-radius: 4px;
  width: 90%;
  height: 90%;
  font-weight: bold;
  display: block;
  text-align: center;
  color: white;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.import-query {
  margin-bottom: 20px;
}

.import-button {
  background-color: #ffffff;
  color: #006d48;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.import-button:hover {
  background-color: #e8f5e9;
}

.success-message{
  margin-top: 10px;   
  font-weight: bold; 
  text-align: center;
}

</style>