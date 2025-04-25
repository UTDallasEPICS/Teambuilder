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

        // If the filter allows multiple selections (Course, Gender, Ethnicity)
        if (filterName === "Course" || filterName === "Gender" || filterName === "Ethnicity") {
            // If the option is not already selected, add it to the list of selected options
            const optionIndex = filter.selectedOptions.indexOf(option);
            if (optionIndex === -1) {
                filter.selectedOptions.push(option);
            } else {
                // If the option is already selected, remove it
                filter.selectedOptions.splice(optionIndex, 1);
            }
        }
        // If the filter is Demographics, Chart, or Metric Type, allow only one selection at a time
        else if (filterName === "Demographics" || filterName === "Chart" || filterName === "Metric Type") {
            // Set the selected option to the new option (only one allowed at a time)
            filter.selectedOptions = [option];
            
            // If Demographics is selected, ensure that only one of Ethnicity or Gender is chosen
            if (filterName === "Demographics") {
                if (option === "Ethnicity") {
                    this.filters.find(f => f.name === "Gender").selectedOptions = []; // Reset Gender
                } else if (option === "Gender") {
                    this.filters.find(f => f.name === "Ethnicity").selectedOptions = []; // Reset Ethnicity
                }
            }
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
    getColorForEthnicity(ethnicity) {
    const colors = {
      "African_American": "rgba(0, 109, 72, 0.7)",
      "Asian": "rgba(75, 192, 192, 0.7)",
      "Hispanic": "rgba(255, 99, 132, 0.7)",
      "International": "rgba(153, 102, 255, 0.7)",
      "Other": "rgba(255, 159, 64, 0.7)",
      "White": "rgba(54, 162, 235, 0.7)"
    };

    return colors[ethnicity] || "rgba(0, 0, 0, 0.7)"; // Default to black if not found
},

// Modify getColorForGender to accept course as a parameter
getColorForGender(gender) {
    const colors = {
      "Male": "rgba(0, 123, 255, 0.7)", // Blue for Male in 2200
      "Female": "rgba(255, 99, 132, 0.7)" // Red for Female in 2200
    };

    return colors[gender] || "rgba(0, 0, 0, 0.7)"; // Default to black if not found
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
                .map(item => (this.filters.find(f => f.name === "Metric Type").selectedOptions[0] === "Percentages"
                    ? (item.Total / grandTotal) * 100
                    : item.Total)),
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
    } else if (isBothCoursesSelected) {
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
            backgroundColor: isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category),
            borderColor: isGenderMode ? this.getColorForGender(category) : this.getColorForEthnicity(category),
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