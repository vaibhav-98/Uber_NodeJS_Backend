const bookingRepository = require('../repositories/bookingRepository')
const { haversineDistance } = require('../utils/distance');
const locationService = require('./locationService');

const BASIC_FSRE = 50;
const RATE_PER_KM = 12;

const createBooking = async({passengerId, source, destination}) => {

    const distance = haversineDistance(source.latitude, source.longitude, destination.latitude, destination.longitude);
     const fare = BASIC_FSRE + (distance * RATE_PER_KM)

    const bookingData = {
        passenger: passengerId,
        source,
        destination,
        fare,
        status: 'pending'
    };
    const booking = bookingRepository.createBooking(bookingData);
    return booking
}




const findNearByDrivers = async (location, radius = 5) => {
  const longitude = parseFloat(location.latitude);
  const latitude = parseFloat(location.longitude);
   console.log("location ", location);
   
  // Ensure the radius is a number
  const radiusKm = parseFloat(radius);

  if (isNaN(longitude) || isNaN(latitude) || isNaN(radiusKm)) {
    throw new Error('Invalid coordinates or radius');
  }

  const nearbyDrivers = await locationService.findNearByDrivers(longitude, latitude, radiusKm);

  return nearbyDrivers;
};


const assingDriver = async (bookingId, driverId) => {
    const booking = await bookingRepository.updateBookingStatus(bookingId, driverId, "confirmed")
    if(!booking) throw new Error('booking already confirmed or does not exist');
    return booking
}




module.exports = {createBooking, findNearByDrivers, assingDriver}