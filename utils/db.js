const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/clinics.json');

// Save new data to JSON file as an array of objects
async function saveData(newData) {
  let data = [];

  // Check if the file exists and has data, read the existing array
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    if (fileData) {
      data = JSON.parse(fileData); // Parse existing JSON data
    }
  }

  // Add new data to the array
  data.push(newData);

  // Write the updated array of objects back to the file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("Data saved successfully!");
}

module.exports = { saveData };
