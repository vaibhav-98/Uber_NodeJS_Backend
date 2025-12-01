const redisClient = require('../utils/redisClient');


class LocationService {

    async setDriverSocket(driverId, socketId) {
       await redisClient.set(`driver:${driverId}`, socketId)
    };

    async getDriverSocket(driverId) {
        return await redisClient.get(`driver${driverId}`)
    };

    async delDriverSocket(driverId) {
        await redisClient.del(`driver${driverId}`)
    }

    async addDriverLocation(driverId, latitude,longitude) {
        try {
            await redisClient.sendCommand([ 
                 'GEOADD',
                 'divers',
                 latitude.toString(),
                 longitude.toString(),
                 driverId.toString()
            ]);
        } catch (error) {
            console.error("cannot add to redis", error)
        }
    }

    async findNearbyDriver(longitude, latitude, radiusKm) {
        const nearByDrives = await redisClient.sendCommand([
            'GEORADIUS',
            'driver',
            longitude.toString(),
            latitude.toString(),
            'km',
            'WITHCOORD'
        ]);

        return nearByDrives;
    }
}



module.exports = new LocationService()
