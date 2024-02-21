// Import required modules
const ical = require('node-ical');
const readlineSync = require('readline-sync');
const fs = require('fs');

// Define constants
const calendarFilename = './sample.ics';
let reservations = [];

// Load initial reservations from the calendar file
loadInitialReservations();

// Display menu and handle user input
while (true) {
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
      process.exit(0);
    default:
      console.log('Invalid choice. Please try again.');
  }
}

function findNextAvailableDates() {
    console.log("\nPlease enter the date you are looking for availability (YYYY-MM-DD):\n ");
  // read user input of date in strict format of yyyy-mm-dd
  // look through reservations and see if there is already an apointment on the day off or upto 4 days from the day user entered
  // show user which days are available to be booked 
  // prompt user to reserve a date? if yes then  proceed to reserveDate function, else loop back to this function
  // if no days available then prompt user to  enter another date if they wish to continue serching or go back to main menue
}

function reserveDate() {
    console.log("\nPlease provide reservation details:\n");
    //prompt user for date that they want to book in strict format  of yyyy-mm-dd
    // check if the date is in reservations array
    // if date is in reservations array then prompt user for another date while throwing an error for "date unavailable"
    // if date is not in reservation array then proceed to asking for details of reservation
    // ask for attendee,dtstart,dtstamp,method, and status while type checking  each one
    // proceed to function confirmaitonNumber to generate number
    // using the confirmation number and all the detials of the reseravtion add the resravtion to the orignal calender file (sample.ics) 
    // update reservations array
    // show user that the reservation has been booked and show them the confirmation number
}

function confirmationNumber() {
    console.log("confirmation number")
    // when invoked, this function should generate a unique random confimration number which will be used to identify appointments
    // to this unique random number, add salting technique using the time of day 
    // use this number for the reservaiton being created
}

function lookupUpcomingReservations() {
    console.log("/n please enter your patient identifier number")
  // prompt user to enter patient identifier number
  // search through reservations array and print any reservations with the same pid

}

function cancelReservation() {
    console.log("/n please enter your confirmation number")
// prompt user to enter confrimation number
  // search through reservations array to find reservation with the confirmation number
  // delete that reservation from the array
  // print a message saying "your reservation has been canceled"
}

function loadInitialReservations() {
  // Load initial reservations from the calendar ics file
  // read the .ics file and save each event  as an object in the `reservations` array
  

}

function saveReservationsToFile() {
  // save all reservations to the orignal calendar file
}



