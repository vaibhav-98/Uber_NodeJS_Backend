const express =  require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router()


module.exports = (io) => {
    router.get('/bookings', authMiddleware,  getPassengerBookings)
    router.post('/feedback', authMiddleware, provideFeedback);

    return router
}