const http = require("http"); // Use 'https' if the API is served over HTTPS
const fs = require("fs");
const path = require("path");
const url = require("url");

module.exports = {
  /**
   * Fetches data from TeamBuilder and stores it locally.
   * @param {string} apiUrl - The API endpoint to fetch data from.
   */
  fetchAndStoreData: async (apiUrl) => {
    try {
      // Parse the API URL
      const parsedUrl = url.parse(apiUrl);

      // Define the request options
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: "GET",
      };

      // Make the HTTP request, send the HTTP options & a callback func to catch server response
      const request = http.request(options, (response) => {
        let data = "";

        // Event listener, catches node.js data cunks & concatenates them into the data variable
        response.on("data", (chunk) => {
          data += chunk;
        });

        // Event listener, notifies end of data streaming/end of server response
        response.on("end", () => {
          try {
            // Parse the received data as JSON
            const jsonData = JSON.parse(data);

            // Define the path to store the data locally
            const filePath = path.join(
              __dirname,
              "..",
              "..",
              "..",
              "data.json"
            );

            // Check if the file exists and delete it before writing new data
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Delete the existing file
            }

            // Write the new data to the file
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

            console.log("Data successfully received and stored locally.");
          } catch (error) {
            console.error("Error parsing or writing data:", error);
          }
        });
      });

      // Handle request errors
      request.on("error", (error) => {
        console.error("Error fetching data from TeamBuilder:", error);
      });

      // End the request
      request.end();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  },
};
