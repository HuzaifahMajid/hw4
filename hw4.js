const ical = require('node-ical');
const readlineSync = require('readline-sync');
const fs = require('fs');

const calendarFilename = './sample.ics';
const holidayDates = [
  '2025-02-20', // Example holiday date
  // Add more holiday dates as needed
];

let reservations = [];

loadInitialReservations();
mainMenu();

function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
function loadInitialReservations() {
  try {
    const events = ical.sync.parseFile(calendarFilename);
  
    for (const event of Object.values(events)) {
      if (event.type === 'VEVENT') {
        const reservation = {
          summary: event.summary || 'N/A',
          start: event.start ? new Date(event.start) : null,
          dtstamp: event.dtstamp ? new Date(event.dtstamp) : null,
          attendee: event.attendee || 'N/A',
          method: event.method || 'N/A',
          status: event.status || 'N/A'
        };
  
        // Add the reservation to the reservations array
        reservations.push(reservation);
  
        console.log(
          `\nSummary: ${reservation.summary}\n` +
          `Start Date and Time: ${formatDate(reservation.start)}\n` +
          `Appointment booked at: ${reservation.dtstamp}\n` +
          `Attendee name: ${reservation.attendee}\n` +
          `Method: ${reservation.method}\n` +
          `Status: ${reservation.status}`
        );
      }
    }
  } catch (error) {
    console.error('Error loading initial reservations:', error.message);
  }
}

function mainMenu() {
  console.log('\nWelcome to the Doctor\'s Office Scheduling System');
  console.log('1. Find Next Available Dates');
  console.log('2. Reserve a Date');
  console.log('3. Lookup Upcoming Reservations');
  console.log('4. Cancel Reservation');
  console.log('5. Exit');

  const choice = readlineSync.question('Enter your choice: ');

  switch (choice) {
    case '1':
      findNextAvailableDates();
      break;
    case '2':
      reserveDate();
      break;
    case '3':
      lookupUpcomingReservations();
      break;
    case '4':
      cancelReservation();
      break;
    case '5':
      saveReservationsToFile();
      break;
    default:
      console.log('Invalid choice. Please try again.');
  }

  mainMenu();
}

function findNextAvailableDates() {
  console.log("\nPlease enter the date you are looking for availability (YYYY-MM-DD): ");
  const userDateInput = readlineSync.question('Enter date (YYYY-MM-DD): ');

  // Convert user input to a JavaScript Date object
  const userDate = new Date(userDateInput);

  if (isNaN(userDate.getTime())) {
    console.log('Invalid date format. Please use the format YYYY-MM-DD.');
    return;
  }

  // Define the range of days to search for availability
  const numberOfDaysToCheck = 4; // Change this as needed

  // Create an array to store the dates within the range
  const availableDates = [];

  // Loop through the range of days
  for (let i = 0; i < numberOfDaysToCheck; i++) {
    const currentDate = new Date(userDate);
    currentDate.setDate(currentDate.getDate() + i);

    if (isDateAvailable(currentDate)) {
  availableDates.push(formatDate(currentDate));
}


  if (availableDates.length > 0) {
    console.log('Available Dates within 4 days of requested date:');
    availableDates.forEach(date => console.log(date));
  } else {
    console.log('No available dates in the specified range.');
  }
}
}

function isDateAvailable(date) {
    // Check if the requested date is already booked
    if (reservations.some(reservation => datesAreEqual(new Date(reservation.start), date))) {
      console.log(`Date ${formatDate(date)} is already booked.`);
      return false;
    }
  
    // Check if the requested date is a weekend (Saturday or Sunday)
    if (date.getDay() === 0 || date.getDay() === 6) {
      console.log(`Date ${formatDate(date)} is a weekend. Not available for reservations.`);
      return false;
    }
  
    // Check if the requested date is a holiday
    if (holidayDates.includes(formatDate(date))) {
      console.log(`Date ${formatDate(date)} is a holiday. Not available for reservations.`);
      return false;
    }
  
    console.log(`Date ${formatDate(date)} is available for reservations.`);
    return true;
  }
  

function reserveDate() {
  console.log("\nPlease provide reservation details:\n");
  const date = readlineSync.question('Enter the date you want to book (YYYY-MM-DD): ');

  // Check if the date is available
  if (isDateAvailable(new Date(date))) {
    const attendee = readlineSync.question('Enter attendee: ');
    const dtstart = readlineSync.question('Enter start date and time (YYYY-MM-DDTHH:mm:ss): ');
    const dtstamp = new Date().toISOString(); // Current timestamp
    const method = readlineSync.question('Enter method: ');
    const status = readlineSync.question('Enter status: ');

    const confirmationNumber = generateConfirmationNumber();
    const reservation = { date, attendee, dtstart, dtstamp, method, status, confirmationNumber };

    reservations.push(reservation);
    console.log(`Reservation successful! Confirmation number: ${confirmationNumber}`);
  } else {
    console.log('Date is not available. Please choose another date.');
  }
}

function lookupUpcomingReservations() {
  console.log("\nPlease enter your patient identifier number");
  const patientId = readlineSync.question('Enter patient identifier: ');
  
  // Search for reservations based on the patient identifier
  const patientReservations = reservations.filter(reservation => reservation.attendee === patientId);

  if (patientReservations.length > 0) {
    console.log('Upcoming Reservations:');
    patientReservations.forEach(reservation => {
      console.log(`Date: ${reservation.date}, Confirmation Number: ${reservation.confirmationNumber}`);
    });
  } else {
    console.log('No upcoming reservations for the provided patient identifier.');
  }
}

function cancelReservation() {
  console.log("\nPlease enter your confirmation number");
  const confirmationNumber = readlineSync.question('Enter confirmation number: ');

  const index = reservations.findIndex(reservation => reservation.confirmationNumber === confirmationNumber);

  if (index !== -1) {
    reservations.splice(index, 1);
    console.log('Reservation canceled successfully.');
  } else {
    console.log('Invalid confirmation number. No reservation found.');
  }
}



function datesAreEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

function generateConfirmationNumber() {
  return Math.random().toString(36).substring(7) + Date.now().toString(36);
  //generating with datenow to add uniqueness 
}

function generateICSData() {
    // Implement the logic to generate ICS data from the reservations array
    let icalData = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
  
    reservations.forEach(reservation => {
      icalData += `BEGIN:VEVENT\n`;
      icalData += `SUMMARY:Doctor's Appointment\n`;
      icalData += `DTSTART:${reservation.dtstart}\n`;
      icalData += `DTSTAMP:${reservation.dtstamp}\n`;
      icalData += `ATTENDEE:${reservation.attendee}\n`;
      icalData += `METHOD:${reservation.method}\n`;
      icalData += `STATUS:${reservation.status}\n`;
      icalData += `SEQUENCE:0\n`;
      icalData += `END:VEVENT\n`;
    });
  
    icalData += 'END:VCALENDAR\n';
  
    return icalData;
  }

function saveReservationsToFile() {
    try {
      const timestamp = Date.now();
      const newFilename = `reservations_${timestamp}.ics`;
      const icalData = generateICSData();
  
      fs.writeFileSync(newFilename, icalData, 'utf-8');
      
      console.log(`Reservations saved to ${newFilename}`);
    } catch (error) {
      console.error('Error saving reservations to file:', error.message);
    }
  }

module.exports = {
    loadInitialReservations,
    mainMenu,
    findNextAvailableDates,
    isDateAvailable,
    reserveDate,
    lookupUpcomingReservations,
    cancelReservation,
    formatDate,
    datesAreEqual,
    generateConfirmationNumber,
    saveReservationsToFile
  };