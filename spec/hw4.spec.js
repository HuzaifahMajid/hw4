const app = require('../hw4');

describe('Scheduling App', () => {
  beforeEach(() => {
    // Reset reservations before each test
    app.loadInitialReservations();
  });

  it('should find next available dates', () => {
    const startDate = new Date('2024-02-21');
    const endDate = new Date('2024-02-28');
    const availableDates = app.findNextAvailableDates(startDate, endDate, 4);
    expect(availableDates.length).toBe(4);
  });

  it('should reserve a date and cancel the reservation', () => {
    const properties = {
      ATTENDEE: 'john.doe@example.com',
      DTSTART: '2024-02-21T10:00:00Z',
      DTSTAMP: new Date().toISOString(),
      METHOD: 'REQUEST',
      STATUS: 'CONFIRMED',
    };
    const confirmationCode = app.reserveDate('patient123', properties);

    // Check if the reservation was successful
    expect(confirmationCode).toBeDefined();

    // Lookup the reservation
    const upcomingReservations = app.lookupUpcomingReservations('patient123');
    expect(upcomingReservations.length).toBe(1);
    expect(upcomingReservations[0].confirmationCode).toBe(confirmationCode);

    // Cancel the reservation
    const cancellationResult = app.cancelReservation(confirmationCode);
    expect(cancellationResult).toBe(true);

    // Verify the reservation is canceled
    const canceledReservations = app.lookupUpcomingReservations('patient123');
    expect(canceledReservations.length).toBe(0);
  });
});
