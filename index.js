const express = require('express')
const dotenv = require('dotenv')
const http = require('http')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const driverRoutes = require('./routes/driverRoute')
const passengerRoutes = require('./routes/passengerRoutes')
const {redisClient} = require('./utils/redisClienr')
const cors = require('cors')



dotenv.config();

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// app.use('/api/auth', authRoutes)
// app.use('/api/bookings', bookingRoutes(io))
// app.use('/api/drivers/', driverRoutes )
// app.use('/api/passengers', passengerRoutes(io))

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    
})


redisClient.on('connect', () => {
    console.log('Connected to Redis');
    
})