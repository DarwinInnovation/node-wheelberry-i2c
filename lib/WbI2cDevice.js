"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WbI2cDevice {
    constructor(i2cBus, cfg) {
        this.i2cBus = i2cBus;
        this.cfg = cfg;
        i2cBus.info('Created i2c device type %s on address %d', cfg.type, cfg.address);
        this.name = cfg.name;
    }
    init() { }
    writeByteSync(subaddr, data) {
        return this.i2cBus.writeByteSync(this.cfg.address, subaddr, data);
    }
    readByteSync(subaddr) {
        return this.i2cBus.readByteSync(this.cfg.address, subaddr);
    }
}
exports.WbI2cDevice = WbI2cDevice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2JJMmNEZXZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvV2JJMmNEZXZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFhLFdBQVc7SUFHdEIsWUFBb0IsTUFBZ0IsRUFBVSxHQUFtQjtRQUE3QyxXQUFNLEdBQU4sTUFBTSxDQUFVO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBZ0I7UUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVNLElBQUksS0FBVyxDQUFDO0lBRWhCLGFBQWEsQ0FBQyxPQUFlLEVBQUUsSUFBWTtRQUNoRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU0sWUFBWSxDQUFDLE9BQWU7UUFDakMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0Y7QUFqQkQsa0NBaUJDIn0=