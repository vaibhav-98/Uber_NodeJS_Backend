// services/locationService.js
const { redisClient } = require('../utils/redisClient');

class LocationService {
  // store both mappings for easy lookup and cleanup
  async setDriverSocket(driverId, socketId) {
    console.log({"diver and socket ID":driverId, socketId});
    
    await redisClient.set(`driver:${driverId}`, socketId);
    await redisClient.set(`socket:${socketId}`, driverId);
  }

  async getDriverSocket(driverId) {
    const getDriverSocket = await redisClient.get(`driver:${driverId}`);
    console.log("getDriverSocket > ", getDriverSocket);
    return getDriverSocket;
  }

  async delDriverSocket(driverId) {
    const socketId = await this.getDriverSocket(driverId);
    if (socketId) {
      await redisClient.del(`socket:${socketId}`);
    }
    await redisClient.del(`driver:${driverId}`);
  }

  async addDriverLocation(driverId, longitude, latitude) {
    console.log({driverId, longitude, latitude});
    
    // Redis GEOADD syntax: GEOADD key longitude latitude member
    try {
      return await redisClient.sendCommand([
        'GEOADD',
        'drivers',                  // key
        longitude.toString(),
        latitude.toString(),
        driverId.toString()
      ]);
    } catch (error) {
      console.error('cannot add to redis', error);
    }
  }

  async findNearByDrivers(longitude, latitude, radiusKm) {
    // GEORADIUS key longitude latitude radius km WITHCOORD
    try {
      const nearbyDrivers = await redisClient.sendCommand([
        'GEORADIUS',
        'drivers',
        longitude.toString(),
        latitude.toString(),
        radiusKm.toString(),
        'km',
        'WITHCOORD' 
      ]);
      // nearbyDrivers is an array like: [[member, [lon, lat]], ...] (depending on client)
      return nearbyDrivers;
    } catch (err) {
      console.error('GEORADIUS error', err);
      return [];
    }
  }

  async storeNotifiedDrivers(bookingId, driverIds) {
    if (!Array.isArray(driverIds) || driverIds.length === 0) return;
    for (const driverId of driverIds) {
      await redisClient.sAdd(`notifiedDrivers:${bookingId}`, driverId);
    }
  }

  async getNotifiedDrivers(bookingId) {
    return await redisClient.sMembers(`notifiedDrivers:${bookingId}`);
  }

  // convenience to get driverId by socket
  async getDriverBySocket(socketId) {
    return await redisClient.get(`socket:${socketId}`);
  }
}

module.exports = new LocationService();
