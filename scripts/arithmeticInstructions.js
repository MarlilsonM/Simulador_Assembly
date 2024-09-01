class ArithmeticInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        switch (instruction) {
            case 'ADD':
                this.add(args);
                break;
            case 'SUB':
                this.sub(args);
                break;
            case 'MUL':
                this.mul(args);
                break;
            case 'DIV':
                this.div(args);
                break;
            case 'AND':
                this.and(args);
                break;
            case 'OR':
                this.or(args);
                break;
            case 'XOR':
                this.xor(args);
                break;
            case 'NOT':
                this.not(args);
                break;
            case 'CMP':
                this.cmp(args);
                break;
            default:
                console.error(`Instrução aritmética desconhecida: ${instruction}`);
        }
    }

    add(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] += this.interpreter.registers[src];
    }

    sub(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] -= this.interpreter.registers[src];
    }
    
    mul(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] *= this.interpreter.registers[src];
    }

    div(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] /= this.interpreter.registers[src];
    }

    and(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] &= this.interpreter.registers[src];
    }

    or(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] |= this.interpreter.registers[src];
    }

    xor(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] ^= this.interpreter.registers[src];
    }

    not(args) {
        const [dest] = args;
        this.interpreter.registers[dest] = ~this.interpreter.registers[dest];
    }

    cmp(args) {
        const [reg1, reg2] = args;
        this.interpreter.registers['CMP'] = this.interpreter.registers[reg1] - this.interpreter.registers[reg2];
    }
}

export default ArithmeticInstructions;