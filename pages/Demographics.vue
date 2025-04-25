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
    </div>
  
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div> 
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

export default defineComponent({
  data() {
    return {
      filters: [
        { name: "Course", options: ["2200", "3200"], selectedOptions: [] },
        { name: "Demographics", options: ["Ethnicity", "Gender"], selectedOptions: [] }, // New Demographics filter
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
      isLoading: false
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
  }

  // Ensure that for Chart and Metric Type filters, only one option is selected at a time
  if (filterName === "Chart" || filterName === "Metric Type") {
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

    console.log('Is total view:', isOnlyTotalView);

    // When the "Total View" is selected, calculate percentage for each course.
    if (isOnlyTotalView) {
        const xValues = this.chartData.map(item => item.Name);
        const totalValues = this.chartData.map(item => item.Total);

        // Calculate grand total for percentage calculations
        const grandTotal = totalValues.reduce((sum, val) => sum + val, 0);

        // Separate data by course
        const courses = selectedCourses; // We'll just use the selected courses directly
        let combinedData = {}; // Object to store combined data for each semester

      // Loop through selected courses (2200, 3200, etc.)
      selectedCourses.forEach(course => {
          const courseData = this.chartData.filter(item => item.Course === course);
          const semesters = [...new Set(courseData.map(item => item.Sem))];

          semesters.forEach(semester => {
              // Initialize combined data for the semester if not already created
              if (!combinedData[semester]) {
                  combinedData[semester] = {
                      total: 0,
                      ethnicityData: {},
                      genderData: {}
                  };
              }

              let currentSemesterData = combinedData[semester];

              // Aggregate data for each semester and course
              courseData.filter(item => item.Sem === semester).forEach(item => {
                  currentSemesterData.total += item.Total;

                  // Aggregate ethnicity data
                  selectedEthnicities.forEach(e => {
                      currentSemesterData.ethnicityData[e] = (currentSemesterData.ethnicityData[e] || 0) + item[e];
                  });

                  // Aggregate gender data
                  selectedGenders.forEach(g => {
                      currentSemesterData.genderData[g] = (currentSemesterData.genderData[g] || 0) + item[g];
                  });
              });
          });
      });

// Now push the combined data into xValues and datasets
      Object.keys(combinedData).forEach(semester => {
          xValues.push(semester);

          // For Ethnicities
          selectedEthnicities.forEach(e => {
              datasets.push({
                  label: `${e} Ethnicity`, // Label for ethnicity
                  data: [(combinedData[semester].ethnicityData[e] / combinedData[semester].total) * 100], // Percentage
                  backgroundColor: this.getColorForEthnicity(e), // Use a function to get unique color
                  stack: semester // Stack by semester
              });
          });

          // For Genders
          selectedGenders.forEach(g => {
              datasets.push({
                  label: `${g} Gender`, // Label for gender
                  data: [(combinedData[semester].genderData[g] / combinedData[semester].total) * 100], // Percentage
                  backgroundColor: this.getColorForGender(g), // Use a function to get unique color
                  stack: semester // Stack by semester
              });
          });
      });

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
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0); // Grand total for current dataset

                                const percentage = (this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages")
                                    ? `${((value / total) * 100).toFixed(1)}%` // Correct percentage calculation
                                    : `${((value / total) * 100).toFixed(1)}%`; // Always show percentage for consistency

                                const rawValue = this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages"
                                    ? context.raw * total / 100
                                    : context.raw; // Convert back to raw number for correct tooltip

                                // Display both raw count and calculated percentage
                                return `${context.dataset.label}: ${rawValue} students (${percentage})`;
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

        console.log('Creating chart with config:', chartConfig);
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, chartConfig);
    } else {
        // Ethnicity or Gender Visualization logic
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
                            const value = context.raw;  // The value for the current bar (either percentage or raw count)
                            const dataIndex = context.dataIndex;
                            const dataPoint = this.chartData[dataIndex];  // Getting the data point for this specific bar
                            const total = dataPoint.Total;  // Total number of students for the current data point

                            let percentage = '';
                            let rawValue = '';

                            if (this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages") {
                                // When "Percentages" is selected
                                percentage = `${(value).toFixed(1)}%`;  // Use context.raw for percentage, rounded to 1 decimal place
                                rawValue = Math.round(value * total / 100);  // Convert percentage to raw value, rounded to nearest whole number
                            } else {
                                // When "Number" is selected
                                percentage = `${((value / total) * 100).toFixed(1)}%`;  // Calculate percentage and round to 1 decimal place
                                rawValue = Math.round(value);  // Raw value (student count), rounded to nearest whole number
                            }

                            // Return both the raw count of students and the percentage in the tooltip
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

        chartConfig.data.datasets = selectedCategories.map((category, index) => ({
            label: category,
            data: this.chartData.map((item, i) => {
                // If "Percentages" is selected, convert to percentage
                return this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages"
                    ? (item[category] / item.Total) * 100
                    : item[category]; // Return raw number if "Number" is selected
            }),
            backgroundColor: colors[index],
            borderColor: colors[index],
            fill: false,
            tension: chartType === "Line" ? 0.4 : undefined
        }));

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

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>