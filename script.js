// Get the navigation links
const navLinks = document.querySelectorAll('.side_navbar a');

// Get all the page sections
const pages = document.querySelectorAll('.page');

// Add event listener to each navigation link
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    // Prevent default link behavior
    e.preventDefault();

    // Remove the "active" class from all navigation links
    navLinks.forEach((navLink) => {
      navLink.classList.remove('active');
    });

    // Add the "active" class to the clicked navigation link
    link.classList.add('active');

    // Get the target page ID from the link's href attribute
    const targetPageId = link.getAttribute('href').substring(1);

    // Hide all pages
    pages.forEach((page) => {
      page.style.display = 'none';
    });

    // Show the target page
    document.getElementById(targetPageId).style.display = 'block';
  });
});

// Function to redirect to the corresponding grade page
function redirectToPage(grade) {
  window.location.href = 'grade' + grade + '.html';
}


function redirectToPage(url) {
  window.location.href = url;
}

var mqtt = require('mqtt');

// MQTT broker URL and credentials
var brokerUrl = 'mqtt://io.adafruit.com';
var username = 'aimisya';
var password = 'aio_SjJQ66JeAK9ST5MaWfSqQvNU6vxz';

// UIDs to match and update the drop-off time
var targetUids = ['43195619', '64063C24', '0AEB0B17', 'C2AD512E', 'D2B2E92E', 'B16AAE1D', '339A1EA2', 'C2E3087B', '128D034B', '826F077B', 'D27FA22E']; // Add all the UIDs you want to match here

// Connect to MQTT broker
var client = mqtt.connect(brokerUrl, {
  username: username,
  password: password
});

// MQTT connection event
client.on('connect', function () {
  console.log('Connected to MQTT broker');

  // Subscribe to the desired topic
  client.subscribe('/feeds/parent-drop-off-child');
});

// MQTT message event
client.on('message', function (topic, message) {
  // Convert the received message to a string
  var receivedMessage = message.toString();

  // Iterate over the target UIDs
  for (var i = 0; i < targetUids.length; i++) {
    var targetUid = targetUids[i];

    // Check if the received message contains the current target UID
    if (receivedMessage.includes(targetUid)) {
      // Extract the drop-off time from the received message (assuming the format is 'dropoff_time:yyyy-mm-dd hh:mm:ss')
      var dropoffTime = receivedMessage.split(':')[1].trim();

      // Update the drop-off time in the table on the interface
      updateDropoffTime(targetUid, dropoffTime);
      break; // Exit the loop after updating the time for the matching UID
    }
  }
});

// Function to update the drop-off time in the table on the interface
function updateDropoffTime(targetUid, dropoffTime) {
  // Get the table row element that matches the target UID
  var tableRow = document.querySelector('tr[data-uid="' + targetUid + '"]');

  // Find the cell for the drop-off time in the table row
  var dropoffCell = tableRow.querySelector('.dropoff-time');

  // Update the drop-off time in the table cell
  dropoffCell.textContent = dropoffTime;
}
