import { AdventOutput } from '../common/common';

let regex = /^(?:(\d+|\w+) (?:((?:AND)|(?:OR)|(?:LSHIFT)|(?:RSHIFT)) )|(NOT ))?(\d+|\w+) -> (\w+)$/

//Group 1 Operand 1
//Group 2 Action
//Group 3 Not
//Group 4 Operand 2
//Group 5 Dest

interface WireCore {
    getValue(): number;
}

class ConstWire {
    value: number;
    constructor(value: number) {
        this.value = value;
    }
    getValue(): number {
        return this.value;
    }
}

class CopyWire {
    operand: WireCore;
    constructor(operand: WireCore) {
        this.operand = operand;
    }

    getValue(): number {
        return this.operand.getValue();
    }
}

class NotWire {
    operand: WireCore;
    constructor(operand: WireCore) {
        this.operand = operand;
    }

    getValue(): number {
        return ~this.operand.getValue() & 0xffff;
    }
}

class LShiftWire {
    operand: WireCore;
    shiftCount: WireCore;
    constructor(operand: WireCore, shiftCount: WireCore) {
        this.operand = operand;
        this.shiftCount = shiftCount;
    }

    getValue(): number {
        return (this.operand.getValue() << this.shiftCount.getValue()) & 0xffff;
    }
}

class RShiftWire {
    operand: WireCore;
    shiftCount: WireCore;
    constructor(operand: WireCore, shiftCount: WireCore) {
        this.operand = operand;
        this.shiftCount = shiftCount;
    }

    getValue(): number {
        return (this.operand.getValue() >>> this.shiftCount.getValue());
    }
}

class AndWire {
    operandA: WireCore;
    operandB: WireCore;
    constructor(operandA: WireCore, operandB: WireCore) {
        this.operandA = operandA;
        this.operandB = operandB;
    }

    getValue(): number {
        return this.operandA.getValue() & this.operandB.getValue();
    }
}

class OrWire {
    operandA: WireCore;
    operandB: WireCore;
    constructor(operandA: WireCore, operandB: WireCore) {
        this.operandA = operandA;
        this.operandB = operandB;
    }

    getValue(): number {
        return this.operandA.getValue() | this.operandB.getValue();
    }
}

class BufferedWire {
    wire: WireCore = new ConstWire(0);
    value: number | null = null;

    getValue(): number {
        if (this.value) {
            return this.value;
        } else {
            this.value = this.wire.getValue()
            return this.value;
        }
    }
}

function getWire(wires: Map<string, BufferedWire>, id: string): WireCore {
    if (id[0] >= '0' && id[0] <= '9') {
        return new ConstWire(Number(id));
    }
    let wire = wires.get(id);
    if (!wire) {
        wire = new BufferedWire();
        wires.set(id, wire);
    }
    return wire;
}

function parseWires(input: readonly string[]): Map<string, BufferedWire> {
    let wires = new Map<string, BufferedWire>();
    for (let line of input) {
        let match = regex.exec(line)!;
        let operandB = getWire(wires, match[4]);
        let res;
        if (!match[2]) {
            if (match[3]) {
                res = new NotWire(operandB);
            } else {
                res = new CopyWire(operandB);
            }
        } else {
            let operandA = getWire(wires, match[1]);
            switch(match[2]) {
                case 'AND':
                    res = new AndWire(operandA, operandB);
                    break;
                case 'OR':
                    res = new OrWire(operandA, operandB);
                    break;
                case 'LSHIFT':
                    res = new LShiftWire(operandA, operandB);
                    break;
                case 'RSHIFT':
                    res = new RShiftWire(operandA, operandB);
                    break;
                default:
                    throw 'Regex error';
            }
        }
        let dest = wires.get(match[5]);
        if (!dest) {
            dest = new BufferedWire();
            wires.set(match[5], dest);
        }
        dest.wire = res;
    }
    return wires;
}

export default function (input: readonly string[]): AdventOutput {
    let wires = parseWires(input);
    let part1 = wires.get('a')!.getValue();
    wires = parseWires(input);
    wires.get('b')!.wire = new ConstWire(part1); 
    let part2 = wires.get('a')!.getValue();
    return {part1: String(part1), part2: String(part2)}
}
