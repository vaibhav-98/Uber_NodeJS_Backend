const express = require('express')
const dotenv = require('dotenv')
const http = require('http')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const driverRoutes = require('./routes/driverRoute')
const passengerRoutes = require('./routes/passengerRoutes')
const {redisClient} = require('./utils/redisClient')
const cors = require('cors')
const socketIo = require('socket.io')
const locationService = require('./services/locationService')



dotenv.config();

const app = express()
const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5005",
        methods: ["GET", "POST"]
    }
});

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

 app.use('/api/auth', authRoutes)
 app.use('/api/bookings', bookingRoutes(io))
 app.use('/api/drivers/', driverRoutes)
 //app.use('/api/passengers', passengerRoutes)

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    
})


redisClient.on('connect', () => {
    console.log('Connected to Redis');
    
})


io.on('connected', (socket) => {
    console.log("A user connected");
    

    socket.on('registerDriver', async(driverId) => {
        await locationService.setDriverSocket(driverId,socket.id)
    });

    socket.on('disconnect', async() => {
        const driverId = await locationService.getDriverSocket(`driver:${driverId}`)
        if(driverId) {
            await locationService.delDriverSocket(`driver:${driverId}`)
        }
    })
})