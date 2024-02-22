const jasmine = require('jasmine');
const hw4 = require('./hw4');

describe('Doctor\'s Office Scheduling System', () => {
  // Mock data for testing
  const testReservation = {
    summary: 'Test Appointment',
    start: new Date('2025-02-22T10:00:00'),
    dtstamp: new Date('2025-02-21T09:00:00'),
    attendee: 'test_patient',
    method: 'REQUEST',
    status: 'CONFIRMED',
    confirmationNumber: 'test_confirmation_number'
  };

  const testPatientId = 'test_patient';
  const testConfirmationNumber = 'test_confirmation_number';

  beforeEach(() => {
    // Reset reservations array before each test
    hw4.reservations = [];
  });

  it('should load initial reservations', () => {
    // Mock data for testing
    const mockEvents = {
      '1': { type: 'VEVENT', ...testReservation }
    };
    spyOn(hw4.ical.sync, 'parseFile').and.returnValue(mockEvents);
    
    hw4.loadInitialReservations();

    expect(hw4.reservations.length).toBe(1);
    expect(hw4.reservations[0]).toEqual(testReservation);
  });

  it('should find next available dates', () => {
    const mockUserInput = '2025-02-19\n';
    spyOn(hw4.readlineSync, 'question').and.returnValue(mockUserInput);
    spyOn(hw4.readlineSync, 'question').and.returnValues('1', 'test_patient', '2025-02-22T10:00:00', 'REQUEST', 'CONFIRMED');

    hw4.loadInitialReservations(); // Mock initial reservations
    hw4.findNextAvailableDates();

    // Add more expectations based on your test cases
  });

  it('should reserve a date', () => {
    const mockUserInput = '2025-02-22\n';
    spyOn(hw4.readlineSync, 'question').and.returnValue(mockUserInput);
    spyOn(hw4.readlineSync, 'question').and.returnValues('test_patient', '2025-02-22T10:00:00', 'REQUEST', 'CONFIRMED');

    hw4.reserveDate();

    expect(hw4.reservations.length).toBe(1);
    expect(hw4.reservations[0]).toEqual(jasmine.objectContaining({
      attendee: 'test_patient',
      dtstart: '2025-02-22T10:00:00',
      method: 'REQUEST',
      status: 'CONFIRMED'
    }));
  });

  // Add more test cases for other functions

});
