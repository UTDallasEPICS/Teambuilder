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
        <button 
          @click="toggleDropdown(filter.name)" 
          class="field-button"
        >
          {{ getFilterDisplayText(filter) }}
        </button>
  
        <div v-if="isDropdownOpen(filter.name)" class="dropdown-options">
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

      <!-- Import Button -->
      <div class="import-query">
      <input
        class="import-button"
        type = "file"
        @change="onFileChange($event)"
        accept=".xlsx, .xls, .csv"
        capture>
      </input>

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
        { name: "Ethnicity", options: ["African_American", "Asian", "Hispanic", "International", "Other", "White"], selectedOptions: [] },
        { name: "Gender", options: ["Female", "Male"], selectedOptions: [] },
        { name: "Chart", options: ["Bar", "Pie", "Line", "Combined bar and line"], selectedOptions: [] }
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
      fileName: "",
      uploaded: false,
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
      const optionIndex = filter.selectedOptions.indexOf(option);
      
      if (optionIndex === -1) {
        filter.selectedOptions.push(option);
      } else {
        filter.selectedOptions.splice(optionIndex, 1);
      }
    },
    getFilterDisplayText(filter) {
      if (filter.selectedOptions.length > 0) {
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
      function createSemestersFrom2DArray(arr, courseName){//expects a 2D array extracted from lines 34-45 of the Excel file
        //if the course is 3200, there is no "Other" row
        let otherIndexOffset = 0;
        if(courseName === "2200"){
          otherIndexOffset = 1;
        }
        let semesterArray = []
        arr.forEach(element => {
          let constructedYear = Number("20"+element[0].substring(0,2));
          let otherAmount = 0;
          //The "Other" amount is constructed from 3 rows for 2200 and 2 rows for 3200 (there's no "Other" row for 3200)
          if(courseName==="2200"){
            otherAmount = Number(element[5]) + Number(element[6]) + Number(element[7]);
          }
          else{
            otherAmount = Number(element[5]) + Number(element[6]);
          }
          let constructedSemester = "";
          if(element[0][2]==='S'){//third character of the semester
            constructedSemester = "Spring";
          }
          else if(element[0][2]==='F'){
            constructedSemester = "Fall";
          }
          else{//No winter semesters yet. This is a consequential assumption. Isaac Philo, April 3rd, 2025.
            constructedSemester = "Summer";
          }
          semesterArray.push({
            Name: element[0],
            Course: courseName,
            Year: constructedYear,
            Sem: constructedSemester,
            African_American: Number(element[1]),
            Asian: Number(element[2]),
            Hispanic: Number(element[3]),
            International: Number(element[4]),
            Other: otherAmount,
            //OtherIndexOffset gives us an index that is 1 higher if and only if we are processing EPCS 2200.
            //No incrementation for 2200.
            White: Number(element[7+otherIndexOffset]),
            Male: Number(element[8+otherIndexOffset]),
            Female: Number(element[9+otherIndexOffset]),
            Total: Number(element[10+otherIndexOffset])
          });
        });
        return semesterArray;
      }
      //Parsing logic will occur on the frontend
      try{
        const reader = new FileReader();
        const workbook = XLSX.read(await (event.target.files[0]).arrayBuffer()); //Assuming that the whole post body will be the file.
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        //const relevantRange = XLSX.utils.decode_range("J34:W57"); //This may need to be horizontally extended to accomodate future semesters. However, there's no option to have an unspecified right boundary.
        const rangeSemesterNames = XLSX.utils.decode_range("L34:V34");
        const rangeEthnicity = XLSX.utils.decode_range("K35:K44");
        const semesterNames = extractCells(worksheet, rangeSemesterNames);
        console.log(semesterNames);
        const ethnicities = extractColumnMajor(worksheet, rangeEthnicity);

        const range2200 = XLSX.utils.decode_range("L34:V45");
        const range3200 = XLSX.utils.decode_range("L47:V57");
        const dataFrom2200 = extractColumnMajor(worksheet, range2200);
        const dataFrom3200 = extractColumnMajor(worksheet, range3200);
        const JSONFor2200 = createSemestersFrom2DArray(dataFrom2200, "2200");
        const JSONFor3200 = createSemestersFrom2DArray(dataFrom3200, "3200");
        console.log(JSONFor2200);//Arrays of JSON objects
        console.log(JSONFor3200);


        console.log("Beginning data transfer...");
        let semestersObject = JSONFor2200.concat(JSONFor3200); //TODO: FILL THIS WITH DATA FROM THE EXCEL SHEET
        const res = await $fetch('/api/demographic', {
          method: 'POST',
          body: semestersObject
        })
        console.log("File sent!")
        console.log(res);
        }
      catch (error) {
        console.log(error);
      }
    },
    async getRequest() {
      if (this.isLoading) return;
      this.isLoading = true;

      const params = new URLSearchParams();

      if (this.timePeriodOption === "Continuous") {
        params.append("Year", `${this.customYearStart},${this.customYearEnd}`);
        if (this.customSemesterStart && this.customSemesterEnd) {
          params.append("Semester", `${this.customSemesterStart},${this.customSemesterEnd}`);
        }
      } else if (this.timePeriodOption === "Semester-based") {
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

      console.log('Is total view:', isOnlyTotalView);

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
      labels: [...new Set(xValues)],
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
    chartConfig.data = {
      labels: combinedLabels,
      datasets: [{
        data: totalValues,
        backgroundColor: this.chartData.map(item => 
          item.Course === "2200" ? 'rgba(0, 109, 72, 0.7)' : 'rgba(75, 192, 192, 0.7)'
        )
      }]
    };
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
} else {
        // Original ethnicity/gender visualization logic
        const isGenderMode = selectedGenders && selectedGenders.length > 0;
        const selectedCategories = isGenderMode ? selectedGenders : selectedEthnicities;
        const xValues = this.chartData.map(item => `${item.Name}-${item.Course}`);

        const colors = selectedCategories.map(() => 
          `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
        );

        let chartConfig = {
          type: chartType === "Bar" ? "bar" : chartType.toLowerCase(),
          data: {
            labels: xValues,
            datasets: []
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
                    const value = context.raw;
                    const dataIndex = context.dataIndex;
                    const dataPoint = this.chartData[dataIndex];
                    const percentage = ((value / dataPoint.Total) * 100).toFixed(1);
                    return `${context.dataset.label}: ${value} (${percentage}%)`;
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
                grace: '5%',
                title: {
                  display: true,
                  text: 'Count'
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

        if (chartType === "Pie") {
          const firstCategory = selectedCategories[0];
          const pieData = this.chartData.map(item => item[firstCategory]);
          const total = pieData.reduce((sum, value) => sum + value, 0);
          
          chartConfig.data.datasets = [{
            data: pieData,
            backgroundColor: colors,
            hoverOffset: 4
          }];

          chartConfig.options.plugins.tooltip = {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          };
        } else {
          chartConfig.data.datasets = selectedCategories.map((category, index) => ({
            label: category,
            data: this.chartData.map((item, i) => item[category]),
            backgroundColor: colors[index],
            borderColor: colors[index],
            fill: false,
            tension: chartType === "Line" ? 0.4 : undefined
          }));
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
  margin-bottom: 12px;
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
}

.submit-button:hover {
  background-color: #e8f5e9;
}
.import-button{
  margin-left: 10px;
  margin-top: 10px;
  background-color: rgb(88, 227, 148);
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

<<<<<<< HEAD
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

.import-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
/* ======= */
/* >>>>>>> feature-import-button */
</style>