import { WbI2cBus, WbI2cDeviceCfg } from './WbI2cBus';
export declare class WbI2cDevice {
    private i2cBus;
    private cfg;
    name: string;
    constructor(i2cBus: WbI2cBus, cfg: WbI2cDeviceCfg);
    init(): void;
    writeByteSync(subaddr: number, data: number): void;
    readByteSync(subaddr: number): number;
}
