const Booking = require('../models/booking')

const findBooking = async(criteria) => {
    return await Booking.findOne(criteria)
}


module.exports = { findBooking }