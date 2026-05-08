const bookingService = require('../services/bookingService')
const {io} = require('../index')
const locationService = require('../services/locationService')


const createBooking = (io) => async (req, res) => {
  try {
    const { source, destination } = req.body;
    const booking = await bookingService.createBooking({ passengerId: req.user._id, source, destination });

    // search for nearby drivers (pass source lat/lng)
    const nearByDrivers = await bookingService.findNearByDrivers(source);
    console.log('nearByDrivers:', nearByDrivers);

    const driverIds = nearByDrivers.map(driver => driver[0]);
    console.log("driverIds......", driverIds);
    

    // nearbyDrivers items are typically [ member, [lon, lat] ] depending on Redis response
    // for (const driverEntry of nearByDrivers) {
    //   // when WITHCOORD is used, driverEntry is [ member, [lon, lat] ] OR nested arrays
    //   // normalize extraction:
    //   const driverId = Array.isArray(driverEntry) ? driverEntry[0] : driverEntry;
    //   const driverSocketId = await locationService.getDriverSocket(driverId);
    //   console.log('driverId', driverId, 'socketId', driverSocketId);
    //   if (driverSocketId) {
    //     driverIds.push(driverId);
    //     io.to(driverSocketId).emit('newBooking', { bookingId: booking._id, source, destination, fare: booking.fare });
    //   }
    // }

    // inside createBooking controller, after finding nearByDrivers:


  console.log('*** DEBUG nearByDrivers raw:', JSON.stringify(nearByDrivers, null, 2));

 for (const driverEntry of nearByDrivers) {
  const driverId = Array.isArray(driverEntry) ? driverEntry[0] : driverEntry;
  console.log("driver id ----", driverId);
  
  const driverSocketId = await locationService.getDriverSocket(driverId);
  
  if (driverSocketId) {
    driverIds.push(driverId); // Save for later so we can ping them when ride is confirmed
    io.to(driverSocketId).emit('newBooking', { bookingId: booking._id, source, destination, fare: booking.fare });
  } 
}


    await locationService.storeNotifiedDrivers(booking._id, driverIds);

    return res.status(201).send({ data: booking, success: true, error: null, message: 'booking created successfully' });
  } catch (error) {
    console.error('createBooking error', error);
    return res.status(400).send({ data: null, success: false, error: error.message, message: 'Failed to create booking' });
  }
};



const confirmBooking = (io) => async (req,res) => {
    try {
        const {bookingId} = req.body;

        const booking = await bookingService.assingDriver(bookingId, req.user._id);
        const notifiedDriverIds = await locationService.getNotifiedDrivers(bookingId);

        for(const driverId of notifiedDriverIds) {
            const driverSocketId = await locationService.getDriverSocket(driverId);
            if(driverSocketId) {
                 
                if(driverId == req.user._id) {
                    io.to(driverSocketId).emit('rideConfirmed', {bookingId,driverId: req.user._id});
                } else {
                    io.to(driverSocketId).emit('removeBooking', { bookingId })
                }
            }
        }

         res.status(201).send({data:booking, success: true, error: null, message: "successfully confirmed booking"});

    } catch (error) {
        res.status(400).send(error.message)
    }
}


module.exports = {createBooking, confirmBooking}
