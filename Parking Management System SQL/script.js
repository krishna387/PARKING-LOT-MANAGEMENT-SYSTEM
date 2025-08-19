let vehicles = []; 

class Entry {
    constructor(name, vehicleType, licensePlate, entryDate, exitDate) {
        this.name = name;
        this.vehicleType = vehicleType; 
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
    }
}

class Main {
    static displayEntries() {
        const tableBody = document.querySelector('#datagohere');
        tableBody.innerHTML = ''; // Clear the table body before adding new entries
        vehicles.forEach((entry) => Main.addEntryToTable(entry));
    }

    static addEntryToTable(entry) {
        const tableBody = document.querySelector('#datagohere');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.vehicleType}</td> <!-- Ensure this is vehicleType -->
            <td>${entry.licensePlate}</td>
            <td>${entry.entryDate}</td>
            <td>${entry.exitDate}</td>
        `;
        tableBody.appendChild(row);
    }

    static showAlert(message) {
        alert(message);
    }

    static validateInputs() {
        const name = document.querySelector('#input-name').value;
        const vehicleType = document.querySelector('#input-vehicleType').value; // Corrected variable name
        const licensePlate = document.querySelector('#input-licensePlate').value;
        const entryDate = document.querySelector('#input-entry').value;
        const exitDate = document.querySelector('#input-exit').value;
        var licensePlateRegex = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
        if (name === '' || vehicleType === '' || licensePlate === '' || entryDate === '' || exitDate === '') {
            Main.showAlert('All fields must be filled!');
            return false;
        }
        if (exitDate < entryDate) {
            Main.showAlert('Exit Date cannot be lower than Entry Date');
            return false;
        }
        if (!licensePlateRegex.test(licensePlate)) {
            Main.showAlert('License Plate must be like CC NN CC NNNN eg, HP 31 A 6452');
            return false;
        }
        return true;
    }

    static deleteEntry(licensePlate) {
        vehicles = vehicles.filter(entry => entry.licensePlate !== licensePlate);
        Main.displayEntries();
        Main.showAlert('Car successfully removed from the parking lot');
    }

    static predictStayDuration(entryTime) {
        // Simple prediction logic: Assume stay duration is 1.5 times the entry time
        const predictedStayDuration = entryTime * 1.5; 
        return Promise.resolve([predictedStayDuration]); // Return as a resolved promise
    }
}
// Fetch vehicle details from data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        vehicles = data.map(vehicle => new Entry(vehicle.name, vehicle.vehicleType, vehicle.licensePlate, vehicle.entryDate, vehicle.exitDate));
        Main.displayEntries();
    })
    .catch(error => console.error('Error fetching data:', error));

document.addEventListener('DOMContentLoaded', Main.displayEntries);

document.querySelector('#cf').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!Main.validateInputs()) {
        return;
    }

    const name = document.querySelector('#input-name').value;
    const vehicleType = document.querySelector('#input-vehicleType').value; // Corrected variable name
    const licensePlate = document.querySelector('#input-licensePlate').value;
    const entryDate = document.querySelector('#input-entry').value;
    const exitDate = document.querySelector('#input-exit').value;
    const entry = new Entry(name, vehicleType, licensePlate, entryDate, exitDate);
    vehicles.push(entry); // Add to the in-memory array
    Main.addEntryToTable(entry);
    Main.showAlert('Car successfully added to the parking lot');
});
document.querySelector('#searchInput').addEventListener('keyup', function searchTable() {
    const searchValue = document.querySelector('#searchInput').value.toUpperCase();
    const tableLine = (document.querySelector('#datagohere')).querySelectorAll('tr');
    for (let i = 0; i < tableLine.length; i++) {
        const lineValues = tableLine[i].querySelectorAll('td');
        let found = false;
        lineValues.forEach(td => {
            if (td.innerHTML.toUpperCase().includes(searchValue)) {
                found = true;
            }
        });
        tableLine[i].style.display = found ? '' : 'none';
    }
});
document.querySelector('#delete-btn').addEventListener('click', () => {
    const licensePlate = document.querySelector('#delete-input').value;
    if (licensePlate === '') {
        Main.showAlert('Please enter the license plate number to delete');
        return;
    }
    Main.deleteEntry(licensePlate);
    document.querySelector('#delete-input').value = ''; // Clear the input field after deletion
});
// Prediction functionality
document.getElementById('predict-btn').addEventListener('click', async () => {
    const entryTime = parseFloat(document.getElementById('entry-time').value);
    const exitTime = parseFloat(document.getElementById('exit-time').value);
    
    if (isNaN(entryTime) || isNaN(exitTime)) {
        document.getElementById('prediction-result').innerText = 'Please enter valid numbers for entry and exit times.';
        return;
    }
    // Calculate stay duration
    const stayDuration = exitTime - entryTime;
    // Call the prediction function
    const prediction = await Main.predictStayDuration(entryTime);
    const predictedStayDuration = prediction[0]; 
    document.getElementById('prediction-result').innerText = `Predicted Stay Duration: ${predictedStayDuration.toFixed(2)} hours (based on entry time: ${entryTime} hours)`;
});