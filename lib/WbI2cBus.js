"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2c = __importStar(require("i2c-bus"));
class WbI2cBus {
    constructor(parentlog, cfg) {
        this.cfg = cfg;
        this.log = parentlog;
        this.debug('Opening.');
        this.i2cBus = i2c.openSync(cfg.busId);
        this.info('Opened.');
        this.i2cDevices = [];
        this.parseCfg(cfg);
    }
    static AddDeviceType(desc) {
        WbI2cBus.I2cDeviceTypes.push(desc);
    }
    FindByName(name) {
        const dev = this.i2cDevices.find((idev) => (idev.name === name));
        if (dev === null) {
            return null;
        }
        else {
            return dev;
        }
    }
    parseCfg(cfg) {
        for (const c of cfg.devices) {
            this.info('%s %d', c.type, WbI2cBus.I2cDeviceTypes.length);
            const typeDesc = WbI2cBus.I2cDeviceTypes.find(td => td.match.test(c.type));
            if (typeDesc === undefined) {
                continue;
            }
            const newDev = new typeDesc.impl(this, c);
            this.i2cDevices.push(newDev);
        }
    }
    writeByteSync(addr, subaddr, data) {
        const wbuf = Buffer.from([subaddr, data]);
        this.trace('addr %s.%s wr > %s', addr.toString(16), subaddr.toString(16), data.toString(16));
        this.i2cBus.i2cWriteSync(addr, wbuf.length, wbuf);
    }
    readByteSync(addr, subaddr) {
        const wbuf = Buffer.from([subaddr]);
        const rbuf = Buffer.alloc(1);
        this.i2cBus.i2cWriteSync(addr, wbuf.length, wbuf);
        this.i2cBus.i2cReadSync(addr, rbuf.length, rbuf);
        this.trace('addr %s.%s rd < %s', addr.toString(16), subaddr.toString(16), rbuf[0].toString(16));
        return rbuf[0];
    }
    error(msg, ...args) {
        return this.log.error('i2c-%d: ' + msg, this.cfg.busId, ...args);
    }
    warn(msg, ...args) {
        return this.log.warn('i2c-%d: ' + msg, this.cfg.busId, ...args);
    }
    info(msg, ...args) {
        return this.log.info('i2c-%d: ' + msg, this.cfg.busId, ...args);
    }
    debug(msg, ...args) {
        return this.log.debug('i2c-%d: ' + msg, this.cfg.busId, ...args);
    }
    trace(msg, ...args) {
        return this.log.trace('i2c-%d: ' + msg, this.cfg.busId, ...args);
    }
}
exports.WbI2cBus = WbI2cBus;
WbI2cBus.I2cDeviceTypes = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2JJMmNCdXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvV2JJMmNCdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsNkNBQStCO0FBdUIvQixNQUFhLFFBQVE7SUFXbkIsWUFBWSxTQUFzQixFQUFVLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDMUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7UUFFckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBZEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUErQjtRQUNsRCxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBY00sVUFBVSxDQUFJLElBQVk7UUFDL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpFLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtZQUNoQixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxPQUFRLEdBQW9CLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRU8sUUFBUSxDQUFDLEdBQWdCO1FBQy9CLEtBQUssTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFD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