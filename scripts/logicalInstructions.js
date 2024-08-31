class LogicalInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    and(args) {
        const [dest, src] = args;
        const value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);
        this.interpreter.registers[dest] = this.interpreter.registers[dest] & value;
        console.log(`AND ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    or(args) {
        const [dest, src] = args;
        const value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);
        this.interpreter.registers[dest] = this.interpreter.registers[dest] | value;
        console.log(`OR ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    not(args) {
        const [dest] = args;
        this.interpreter.registers[dest] = ~this.interpreter.registers[dest] & this.interpreter.maxValue;
        console.log(`NOT ${dest}: ${this.interpreter.registers[dest]}`);
    }

    cmp(args) {
        const [reg1, reg2] = args;
        this.interpreter.registers['CMP'] = this.interpreter.registers[reg1] - this.interpreter.registers[reg2];
        console.log(`CMP ${reg1}, ${reg2}: ${this.interpreter.registers['CMP']}`);
    }

    // Adicione outras operações lógicas conforme necessário
}

export default LogicalInstructions;