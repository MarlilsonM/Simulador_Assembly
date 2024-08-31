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
        console.log(`ADD ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    sub(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] -= this.interpreter.registers[src];
        console.log(`SUB ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    mul(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] *= this.interpreter.registers[src];
        console.log(`MUL ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    div(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] /= this.interpreter.registers[src];
        console.log(`DIV ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    and(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] &= this.interpreter.registers[src];
        console.log(`AND ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    or(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] |= this.interpreter.registers[src];
        console.log(`OR ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    xor(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] ^= this.interpreter.registers[src];
        console.log(`XOR ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    not(args) {
        const [dest] = args;
        this.interpreter.registers[dest] = ~this.interpreter.registers[dest];
        console.log(`NOT ${dest}: ${this.interpreter.registers[dest]}`);
    }

    cmp(args) {
        const [reg1, reg2] = args;
        this.interpreter.registers['CMP'] = this.interpreter.registers[reg1] - this.interpreter.registers[reg2];
        console.log(`CMP ${reg1}, ${reg2}: ${this.interpreter.registers['CMP']}`);
    }
}

export default ArithmeticInstructions;