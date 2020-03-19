import pino from 'pino';
import { WbI2cDevice } from './WbI2cDevice';
export interface WbI2cDeviceCfg {
    address: number;
    type: string;
    name: string;
    details?: any;
}
export interface WbI2cBusCfg {
    busId: number;
    devices: WbI2cDeviceCfg[];
}
declare type WbI2cDeviceTypeClass = new (bus: WbI2cBus, cfg: WbI2cDeviceCfg) => WbI2cDevice;
export interface WbI2cDeviceTypeDescriptor {
    match: RegExp;
    name: string;
    impl: WbI2cDeviceTypeClass;
}
export declare class WbI2cBus {
    private cfg;
    private i2cBus;
    private i2cDevices;
    private log;
    static I2cDeviceTypes: WbI2cDeviceTypeDescriptor[];
    static AddDeviceType(desc: WbI2cDeviceTypeDescriptor): void;
    constructor(parentlog: pino.Logger, cfg: WbI2cBusCfg);
    FindByName<T>(name: string): T | null;
    private parseCfg;
    writeByteSync(addr: number, subaddr: number, data: number): void;
    readByteSync(addr: number, subaddr: number): number;
    error(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    info(msg: string, ...args: any[]): void;
    debug(msg: string, ...args: any[]): void;
    trace(msg: string, ...args: any[]): void;
}
export {};
