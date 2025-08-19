const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function recognizePlate(imagePath) {
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath)); // Read car.jpg

  try {
    const response = await axios.post('http://localhost:5000/recognize', form, {
      headers: form.getHeaders()
    });

    console.log('Detected Plate Number:', response.data.plate_number);
    return response.data.plate_number;
  } catch (error) {
    console.error('Recognition failed:', error.response?.data || error.message);
    return null;
  }
}

module.exports = recognizePlate;
