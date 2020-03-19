"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const lodash_1 = __importDefault(require("lodash"));
const WbI2cBus_1 = require("./WbI2cBus");
const WbI2cDevice_1 = require("./WbI2cDevice");
const onoff_1 = require("onoff");
var MCP23017PortId;
(function (MCP23017PortId) {
    MCP23017PortId["A"] = "A";
    MCP23017PortId["B"] = "B";
})(MCP23017PortId = exports.MCP23017PortId || (exports.MCP23017PortId = {}));
;
var MCP23017Reg;
(function (MCP23017Reg) {
    MCP23017Reg[MCP23017Reg["DEFVAL"] = 6] = "DEFVAL";
    MCP23017Reg[MCP23017Reg["GPINTEN"] = 4] = "GPINTEN";
    MCP23017Reg[MCP23017Reg["GPIO"] = 18] = "GPIO";
    MCP23017Reg[MCP23017Reg["GPPU"] = 12] = "GPPU";
    MCP23017Reg[MCP23017Reg["INTCAP"] = 16] = "INTCAP";
    MCP23017Reg[MCP23017Reg["INTCON"] = 8] = "INTCON";
    MCP23017Reg[MCP23017Reg["INTF"] = 14] = "INTF";
    MCP23017Reg[MCP23017Reg["IOCON"] = 10] = "IOCON";
    MCP23017Reg[MCP23017Reg["IODIR"] = 0] = "IODIR";
    MCP23017Reg[MCP23017Reg["IPOL"] = 2] = "IPOL";
    MCP23017Reg[MCP23017Reg["OLAT"] = 20] = "OLAT";
})(MCP23017Reg || (MCP23017Reg = {}));
;
class MCP23017Port extends events_1.EventEmitter {
    constructor(mcp, port, details) {
        super();
        this.mcp = mcp;
        this.port = port;
        this.details = details;
        this.offset = (port === MCP23017PortId.A) ? 0 : 1;
        this.curRdValue = details.default & details.read_bits;
        this.curWrValue = details.default & details.write_bits;
        this.intGpio = (details.int_gpio !== null) ?
            new onoff_1.Gpio(details.int_gpio, 'in', 'falling') : null;
        this.interval = null;
        if (details.poll_period) {
            this.interval = setInterval(() => this._update(MCP23017Reg.GPIO), details.poll_period);
        }
    }
    initSetup() {
        this.writeRegSync(MCP23017Reg.IODIR, 0xFF ^ this.details.write_bits);
        this.writeRegSync(MCP23017Reg.GPPU, 0xff);
        this.writeRegSync(MCP23017Reg.OLAT, 0x00);
        this.writeRegSync(MCP23017Reg.GPINTEN, 0x00);
        this.writeRegSync(MCP23017Reg.DEFVAL, 0x00);
        this.writeRegSync(MCP23017Reg.IPOL, 0x00);
        this.writeRegSync(MCP23017Reg.INTCON, 0x00);
        this.readRegSync(MCP23017Reg.INTCAP);
        this.readRegSync(MCP23017Reg.GPIO);
        if (this.intGpio !== null) {
            this.intGpio.watch((level) => {
                this._isr();
            });
            if (this.details.int_on_change) {
                this.writeRegSync(MCP23017Reg.INTCON, 0xff ^ this.details.read_bits);
            }
            else {
                this.writeRegSync(MCP23017Reg.DEFVAL, this.details.default);
                this.writeRegSync(MCP23017Reg.INTCON, this.details.read_bits);
            }
            this.writeRegSync(MCP23017Reg.GPINTEN, this.details.read_bits);
        }
    }
    set(val) {
        val = val & this.details.write_bits;
        this.writeRegSync(MCP23017Reg.OLAT, val);
        this.curWrValue = val;
    }
    setBit(bit, val) {
        const bval = (1 << bit);
        const newVal = ((this.curWrValue & (0xff ^ bval)) |
            ((val) ? bval : 0));
        this.set(newVal);
    }
    writeRegSync(reg, data) {
        this.mcp.writeByteSync(reg + this.offset, data);
    }
    readRegSync(reg) {
        return this.mcp.readByteSync(reg + this.offset);
    }
    _isr() {
        this._update(MCP23017Reg.INTCAP);
        this._update(MCP23017Reg.GPIO);
    }
    _update(from) {
        const val = this.mcp.readByteSync(from + this.offset);
        const diff = (val ^ this.curRdValue) & this.details.read_bits;
        this.curRdValue = this.curRdValue ^ diff;
        if (diff) {
            this.emit('change', diff, this.curRdValue);
        }
    }
}
exports.MCP23017Port = MCP23017Port;
MCP23017Port.DefaultDetails = {
    int_gpio: null,
    int_on_change: true,
    default: 0x00,
    read_bits: 0xff,
    write_bits: 0x00,
    poll_period: 0
};
class MCP23017 extends WbI2cDevice_1.WbI2cDevice {
    constructor(bus, cfg) {
        super(bus, cfg);
        cfg.details = cfg.details || {};
        lodash_1.default.defaultsDeep(cfg.details, {
            A: Object.assign({}, MCP23017Port.DefaultDetails),
            B: Object.assign({}, MCP23017Port.DefaultDetails)
        });
        this.ports = new Map();
        this.ports.set(MCP23017PortId.A, new MCP23017Port(this, MCP23017PortId.A, cfg.details.A));
        this.ports.set(MCP23017PortId.B, new MCP23017Port(this, MCP23017PortId.B, cfg.details.B));
        this.initSetup();
        MCP23017.Registry.set(cfg.name, this);
    }
    static Init() {
        WbI2cBus_1.WbI2cBus.AddDeviceType({
            name: 'MCP23017',
            match: /^mcp(?:23017)?$/i,
            impl: MCP23017,
        });
    }
    static FindByName(name) {
        return MCP23017.Registry.get(name);
    }
    static PortByName(name) {
        const [mcpName, portId] = name.split('.');
        const mcp = MCP23017.Registry.get(mcpName);
        if (mcp !== undefined) {
            return mcp.getPort(portId);
        }
        else {
            return undefined;
        }
    }
    getPort(port) {
        return this.ports.get(port);
    }
    initSetup() {
        this.writeByteSync(MCP23017Reg.IOCON, 0x00);
        this.getPort(MCP23017PortId.A).initSetup();
        this.getPort(MCP23017PortId.B).initSetup();
    }
}
exports.MCP23017 = MCP23017;
MCP23017.Registry = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTUNQMjMwMTcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTUNQMjMwMTcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBc0M7QUFFdEMsb0RBQXVCO0FBRXZCLHlDQUFzRDtBQUN0RCwrQ0FBNEM7QUFFNUMsaUNBQTZCO0FBRTdCLElBQVksY0FHWDtBQUhELFdBQVksY0FBYztJQUN4Qix5QkFBTyxDQUFBO0lBQ1AseUJBQU8sQ0FBQTtBQUNULENBQUMsRUFIVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUd6QjtBQUFBLENBQUM7QUFFRixJQUFLLFdBWUo7QUFaRCxXQUFLLFdBQVc7SUFDZCxpREFBYSxDQUFBO0lBQ2IsbURBQWMsQ0FBQTtJQUNkLDhDQUFXLENBQUE7SUFDWCw4Q0FBVyxDQUFBO0lBQ1gsa0RBQWEsQ0FBQTtJQUNiLGlEQUFhLENBQUE7SUFDYiw4Q0FBVyxDQUFBO0lBQ1gsZ0RBQVksQ0FBQTtJQUNaLCtDQUFZLENBQUE7SUFDWiw2Q0FBVyxDQUFBO0lBQ1gsOENBQVcsQ0FBQTtBQUNiLENBQUMsRUFaSSxXQUFXLEtBQVgsV0FBVyxRQVlmO0FBQUEsQ0FBQztBQWVGLE1BQWEsWUFBYSxTQUFRLHFCQUFZO0lBZ0I1QyxZQUFvQixHQUFhLEVBQVUsSUFBb0IsRUFBVSxPQUErQjtRQUN0RyxLQUFLLEVBQUUsQ0FBQztRQURVLFFBQUcsR0FBSCxHQUFHLENBQVU7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBR3RHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUN0RCxJQUFJLENBQUMs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