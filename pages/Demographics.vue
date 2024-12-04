<template>  
  <div class="dashboard-container">
    <div class="sidebar">
      <!-- Close Button -->
      <button class="close-button" @click="toggleSidebar">&#x2715;</button>

      <!-- Import File Button -->
      <div class="field">
        <button @click="triggerFileImport" class="import-button">Import Excel File</button>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref="fileInput"
          @change="handleFileUpload"
          style="display: none;"
        />
      </div>
  
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
              <div v-if="filter.name === 'year'">
              <label>Start Year:</label>
              <input type="text" v-model="customYearStart" placeholder="Start Year" class="custom-input" />
  
              <label>End Year:</label>
              <input type="text" v-model="customYearEnd" placeholder="End Year" class="custom-input" />
            </div>
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
      <!-- Filter Buttons with Dropdown Options -->
      <div v-for="filter in filters" :key="filter.name" class="field">
        <button 
          @click="toggleDropdown(filter.name)" 
          class="field-button"
        >
          {{ getFilterDisplayText(filter) }}
        </button>
  
        <!-- Dropdown Options with Multi-Selection -->
        <div v-if="isDropdownOpen(filter.name)" class="dropdown-options">
          <div 
            v-for="option in filter.options" 
            :key="option" 
            :class="{'dropdown-item': true, 'selected': filter.selectedOptions.includes(option)}"
            @click="toggleOption(filter.name, option)"
          >
            {{ option }}
          </div>
  
          <!-- Additional Selections for Combined Chart -->
          <div v-if="filter.name === 'Type of chart' && filter.selectedOptions.includes('Combined bar and line')" class="combined-chart-options">
            <label>Select data for Bar Chart:</label>
            <select v-model="barChartData" class="custom-dropdown">
              <option disabled value="">Select Option</option>
              <option>Gender</option>
              <option>Ethnicity</option>
            </select>
            
            <label>Select data for Line Chart:</label>
            <select v-model="lineChartData" class="custom-dropdown">
              <option disabled value="">Select Option</option>
              <option>Gender</option>
              <option>Ethnicity</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Submit Button -->
      <div class="submit-query">
        <button class="submit-button" @click="getRequest">
          Submit
        </button>
      </div>
    </div>
  
    <div id="chartContainer" class="chart-container">
    </div> 
  </div>
  </template>
  <script>
  import { defineComponent } from 'vue';
  
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
        timePeriodOption: "", // Continuous or Semester-based
        customYearStart: "",
        customYearEnd: "",
        customSemesterStart: "",
        customSemesterEnd: "",
        selectedSemesters: [], // For Semester-based option
        chartData: [], 
      };
    },
    watch: {
      // uses watch to delete start and end semester if semester-based is selected and deletes selected semesters if semester-based is selected
      timePeriodOption(newVal) {
        if (newVal === "Continuous") {
          this.selectedSemesters = []; // Clear semester-based data
        } else if (newVal === "Semester-based") {
          this.customSemesterStart = "";
          this.customSemesterEnd = ""; // Clear continuous semester fields
        }
      }
    },
    methods: {
      triggerFileImport() {
        this.$refs.fileInput.click();
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          
          // Store the file locally or send it to a server
          this.storeFileLocally(file);
        }
      },
      async storeFileLocally(file) {
        try {
          const filePath = `/path/to/local/storage/${file.name}`; // Adjust path as needed.
          // This would require additional server-side code or file system interaction.
          console.log(`File stored at: ${filePath}`);
        } catch (error) {
          console.error('Error storing the file:', error);
        }
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
        if (filter.name === "Year" && this.customFilterYearStart && this.customFilterYearEnd) {
          return `Year: ${this.customFilterYearStart} - ${this.customFilterYearEnd}`;
        }
        if (filter.selectedOptions.length > 0) {
          return `${filter.name}: ${filter.selectedOptions.join(', ')}`;
        }
        return filter.name;
      },
      getTimePeriodDisplayText() {
        if (this.timePeriodOption === "Continuous") {
          return `Continuous: ${this.customYearStart}-${this.customYearEnd}, ${this.customSemesterStart} to ${this.customSemesterEnd}`;
        }
        if (this.timePeriodOption === "Semester-based") {
          const semesters = this.selectedSemesters.length ? `(${this.selectedSemesters.join(", ")})` : "";
          return `Semester-based: ${this.customYearStart}-${this.customYearEnd} ${semesters}`;
        }
        return "Time Period";
      },
      async getRequest () {
        console.log(this.customYearEnd)
        console.log(this.customYearStart)
      const yearFilter = [this.customYearStart, this.customYearEnd]
      const params = new URLSearchParams();
  
      this.filters.forEach((filter) => {
        if (filter.selectedOptions.length > 0 && filter.name != "Chart") {
          params.append(filter.name, filter.selectedOptions.join(","));
        } else if(filter.selectedOptions.length == 0 && filter.name != "Chart") {
          params.append(filter.name, "Empty");
        }
      });
  
      const queryString = params.toString()
      const apiUrl = `/api/demographic?${queryString}`
      try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Response was not ok")
      }
      const data = await response.json()
      
      this.chartData = data.data
      this.plotChart()
      }catch(error) {
        console.error(error)
      }
    },
    async plotChart() {
      if (!this.chartData.length) {
        return;
      }
      const Plotly = (await import('plotly.js-basic-dist')).default;
  
      const chartType = this.filters.find(f => f.name === "Chart")?.selectedOptions[0];
      if (!chartType) {
        return;
      }
      const selectedEthnicities = this.filters.find(f => f.name === "Ethnicity")?.selectedOptions;
  
  
      const xValues = this.chartData.map(item => `${item.Name}-${item.Course}`); 
  
      const traces = [];
  
      selectedEthnicities.forEach(ethnicity => {
      const yValues = this.chartData.map(item => item[ethnicity]);
  
      // Create trace based on chart type
      if (chartType === "Bar") {
        traces.push({
          x: xValues,
          y: yValues,
          type: 'bar',
          name: ethnicity // Use the ethnicity as the name of the trace
        });
      } else if (chartType === "Line") {
        traces.push({
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines+markers',
          name: ethnicity
        });
      } else if (chartType === "Pie") {
        // Note: Pie charts typically represent one set of data. If multiple ethnicities are selected, Pie might not make sense.
        traces.push({
          labels: xValues,
          values: yValues,
          type: 'pie',
          name: ethnicity
        });
      }
    });
  
    const layout = {
      title: `Demographic Data for ${selectedEthnicities.join(', ')}`,
      xaxis: { title: 'Year-Semester-Course' },
      yaxis: { title: 'Count' },
      barmode: 'group'
    };
  
  
    Plotly.newPlot('chartContainer', traces, layout);
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
  }
  
  .chart-container {
    flex: 1;
    padding: 20px;
    overflow: auto;
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
  </style>