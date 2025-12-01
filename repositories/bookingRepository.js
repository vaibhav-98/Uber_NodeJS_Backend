const Booking = require('../models/booking')

const findBooking = async(criteria) => {
    return await Booking.findOne(criteria)
};

const createBooking = async(bookingData) => {
    const booking = new Booking(bookingData);
    await booking.save() 
    return booking
}


module.exports = { findBooking , createBooking}