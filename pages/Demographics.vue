<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <!-- Close Button -->
      <button class="close-button" @click="toggleSidebar">&#x2715;</button>
  
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
  
          <!-- Custom Year Range for "Year" Filter -->
          <div v-if="filter.name === 'Year'" class="custom-range">
            <label>Enter Year Range:</label>
            <input type="text" v-model="customFilterYearStart" placeholder="Start Year" class="custom-input"/>
            <input type="text" v-model="customFilterYearEnd" placeholder="End Year" class="custom-input"/>
          </div>
        </div>
      </div>
  
      <!-- Custom Year and Semester Range -->
      <div class="field">
        <button 
          @click="toggleDropdown('Custom')" 
          class="field-button"
        >
          {{ getCustomFilterDisplayText() }}
        </button>
        
        <div v-if="isDropdownOpen('Custom')" class="dropdown-options">
          <!-- Custom Year Range -->
          <div class="custom-range">
            <label>Custom Year Range:</label>
            <input type="text" v-model="customYearStart" placeholder="Start Year" class="custom-input"/>
            <input type="text" v-model="customYearEnd" placeholder="End Year" class="custom-input"/>
          </div>
          
          <!-- Custom Semester Range -->
          <div class="custom-range">
            <label>Custom Semester Range:</label>
            <select v-model="customSemesterStart" class="custom-dropdown">
              <option disabled value="">Start Semester</option>
              <option>Fall</option>
              <option>Spring</option>
              <option>Summer</option>
            </select>
            <select v-model="customSemesterEnd" class="custom-dropdown">
              <option disabled value="">End Semester</option>
              <option>Fall</option>
              <option>Spring</option>
              <option>Summer</option>
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
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      filters: [
        { name: "Course", options: ["2200", "3200"], selectedOptions: [] },
        { name: "Ethnicity", options: ["African_American", "Asian", "Hispanic", "International", "Other", "White"], selectedOptions: [] },
        { name: "Gender", options: ["Female", "Male"], selectedOptions: [] },
        { name: "Year", options: [], selectedOptions: [] },
        { name: "Semester", options: ["Fall", "Spring", "Summer"], selectedOptions: [] },
        { name: "Chart", options: ["Bar", "Pie", "Line", "Combined bar and line"], selectedOptions: [] },
      ],
      openDropdown: null,
      customYearStart: "",
      customYearEnd: "",
      customSemesterStart: "",
      customSemesterEnd: "",
      customFilterYearStart: "",
      customFilterYearEnd: "",
      chartData: [],
    };
  },
  methods: {
    toggleDropdown(filterName) {
      this.openDropdown = this.openDropdown === filterName ? null : filterName;
    },
    isDropdownOpen(filterName) {
      return this.openDropdown === filterName;
    },
    toggleOption(filterName, option) {
      const filter = this.filters.find((f) => f.name === filterName);
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
        return `${filter.name}: ${filter.selectedOptions.join(", ")}`;
      }
      return filter.name;
    },
    getCustomFilterDisplayText() {
      let yearRange = this.customYearStart && this.customYearEnd ? `${this.customYearStart} - ${this.customYearEnd}` : "Year Range";
      let semesterRange = this.customSemesterStart && this.customSemesterEnd ? `${this.customSemesterStart} - ${this.customSemesterEnd}` : "Semester Range";

      return `Custom: ${yearRange}, ${semesterRange}`;
    },
    async getRequest() {
      const yearFilter = this.filters.find((filter) => filter.name === "Year");
      if (this.customFilterYearStart && this.customFilterYearEnd) {
        yearFilter.selectedOptions = [this.customFilterYearStart, this.customFilterYearEnd];
      } else {
        yearFilter.selectedOptions = [];
      }
      const params = new URLSearchParams();

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

        this.chartData = data.data;
        this.plotChart();
      } catch (error) {
        console.error(error);
      }
    },
    async plotChart() {
      if (!this.chartData.length) {
        return;
      }

      const Plotly = (await import("plotly.js-basic-dist")).default;

      const chartType = this.filters.find((f) => f.name === "Chart")?.selectedOptions[0];
      if (!chartType) {
        return;
      }

      const selectedEthnicities = this.filters.find((f) => f.name === "Ethnicity")?.selectedOptions || [];
      const selectedGenders = this.filters.find((f) => f.name === "Gender")?.selectedOptions || [];

      const xValues = this.chartData.map((item) => item.Name);

      const traces = [];

      // Generate traces for Ethnicities
      selectedEthnicities.forEach((ethnicity) => {
        const yValues = this.chartData.map((item) => item[ethnicity]);

        if (chartType === "Bar") {
          traces.push({
            x: xValues,
            y: yValues,
            type: "bar",
            name: ethnicity,
          });
        } else if (chartType === "Line") {
          traces.push({
            x: xValues,
            y: yValues,
            type: "scatter",
            mode: "lines+markers",
            name: ethnicity,
          });
        } else if (chartType === "Pie") {
          traces.push({
            labels: xValues,
            values: yValues,
            type: "pie",
            name: ethnicity,
          });
        }
      });

      // Generate traces for Genders
      selectedGenders.forEach((gender) => {
        const yValues = this.chartData.map((item) => item[gender]);

        if (chartType === "Bar") {
          traces.push({
            x: xValues,
            y: yValues,
            type: "bar",
            name: gender,
          });
        } else if (chartType === "Line") {
          traces.push({
            x: xValues,
            y: yValues,
            type: "scatter",
            mode: "lines+markers",
            name: gender,
          });
        } else if (chartType === "Pie") {
          traces.push({
            labels: xValues,
            values: yValues,
            type: "pie",
            name: gender,
          });
        }
      });

      const layout = {
        title: `Demographic Data for ${[...selectedEthnicities, ...selectedGenders].join(", ")}`,
        xaxis: { title: "Semester (Name)" },
        yaxis: { title: "Count" },
        barmode: "group",
      };

      Plotly.newPlot("chartContainer", traces, layout);
    },
  },
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
