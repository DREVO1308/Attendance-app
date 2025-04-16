let scanner;

function startScan() {
  // Get student details from the form
  const name = document.getElementById('name').value;
  const matric = document.getElementById('matric').value;
  const session = document.getElementById('session').value;

  // Check if the required fields are filled
  if (!name || !matric || !session) {
    alert('Please fill all fields before scanning.');
    return;
  }

  // Initialize the QR scanner
  scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

  // Start the scanner and handle the QR code
  scanner.addListener('scan', function (content) {
    alert('QR Code scanned: ' + content);
    // Now send the data to Google Sheets
    sendDataToSheet(name, matric, session, content);
  });

  // Start the video feed from the webcam
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

// Send data to Google Sheets (via Apps Script)
function sendDataToSheet(name, matric, session, qrContent) {
  const url = 'https://script.google.com/macros/s/AKfycbwHdk0M_xC3Q3zymC1s9rVJs-b6SKj5b7Ym71h25-v3qcHQJZrR72lB-yFOc44UnOY/exec';
  const data = {
    name: name,
    matric: matric,
    session: session,
    qrCode: qrContent,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  fetch(url + '?name=' + encodeURIComponent(data.name) + '&matric=' + encodeURIComponent(data.matric) + 
    '&session=' + encodeURIComponent(data.session) + '&qrCode=' + encodeURIComponent(data.qrCode) + 
    '&date=' + encodeURIComponent(data.date) + '&time=' + encodeURIComponent(data.time), {
    method: 'GET'
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    alert('Attendance recorded!');
  }).catch(function(error) {
    console.error('Error:', error);
  });
}

  