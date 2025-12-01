const bookingService = require('../services/bookingService')
const {io} = require('../index')
const locationService = require('../services/locationService')

const createBooking = (io) => async (req,res) => {
    try {
         const {source, destination} = req.body;
         const booking = await bookingService.createBooking({passengerId: req.user._id, source, destination});

         const nearByDrivers = await bookingService.findNearByDrivers(source)
          const driverIds = [];
         for(const driver of nearByDrivers) {
             const driverSocketId = await locationService.getDriverSocket(driver[0]);
             if(driverSocketId) {
                driverIds.push(driver[0]);
             }
         }
    } catch (error) {
        res.status(400).send(error.message)
    }
}



module.exports = {createBooking}
