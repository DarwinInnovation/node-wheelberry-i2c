/// <reference types="node" />
import { EventEmitter } from 'events';
import { WbI2cBus, WbI2cDeviceCfg } from './WbI2cBus';
import { WbI2cDevice } from './WbI2cDevice';
export declare enum MCP23017PortId {
    A = "A",
    B = "B"
}
declare enum MCP23017Reg {
    DEFVAL = 6,
    GPINTEN = 4,
    GPIO = 18,
    GPPU = 12,
    INTCAP = 16,
    INTCON = 8,
    INTF = 14,
    IOCON = 10,
    IODIR = 0,
    IPOL = 2,
    OLAT = 20
}
export interface MCP23017Cfg {
    i2cAddress: number;
}
export interface MCP23017PortCfgDetails {
    int_gpio: number | null;
    int_on_change: boolean;
    default: number;
    read_bits: number;
    write_bits: number;
    poll_period: number;
}
export declare class MCP23017Port extends EventEmitter {
    private mcp;
    private port;
    private details;
    private offset;
    private intGpio;
    private curRdValue;
    private curWrValue;
    private interval;
    static DefaultDetails: MCP23017PortCfgDetails;
    constructor(mcp: MCP23017, port: MCP23017PortId, details: MCP23017PortCfgDetails);
    initSetup(): void;
    set(val: number): void;
    setBit(bit: number, val: boolean): void;
    writeRegSync(reg: MCP23017Reg, data: number): void;
    readRegSync(reg: MCP23017Reg): number;
    private _isr;
    private _update;
}
export declare class MCP23017 extends WbI2cDevice {
    private ports;
    static Registry: Map<string, MCP23017>;
    static Init(): void;
    static FindByName(name: string): MCP23017 | undefined;
    static PortByName(name: string): MCP23017Port | undefined;
    constructor(bus: WbI2cBus, cfg: WbI2cDeviceCfg);
    getPort(port: MCP23017PortId): MCP23017Port;
    private initSetup;
}
export {};
