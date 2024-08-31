class BitManipulationInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        switch (instruction) {
            case 'SHL':
                this.shl(args);
                break;
            case 'SHR':
                this.shr(args);
                break;
            case 'ROL':
                this.rol(args);
                break;
            case 'ROR':
                this.ror(args);
                break;
            default:
                console.error(`Instrução de manipulação de bits desconhecida: ${instruction}`);
        }
    }

    shl(args) {
        const [dest, amount] = args;
        this.interpreter.registers[dest] <<= parseInt(amount);
        console.log(`SHL ${dest}, ${amount}: ${this.interpreter.registers[dest]}`);
    }

    shr(args) {
        const [dest, amount] = args;
        this.interpreter.registers[dest] >>= parseInt(amount);
        console.log(`SHR ${dest}, ${amount}: ${this.interpreter.registers[dest]}`);
    }

    rol(args) {
        const [dest, amount] = args;
        const value = this.interpreter.registers[dest];
        this.interpreter.registers[dest] = (value << amount) | (value >> (32 - amount));
        console.log(`ROL ${dest}, ${amount}: ${this.interpreter.registers[dest]}`);
    }

    ror(args) {
        const [dest, amount] = args;
        const value = this.interpreter.registers[dest];
        this.interpreter.registers[dest] = (value >> amount) | (value << (32 - amount));
        console.log(`ROR ${dest}, ${amount}: ${this.interpreter.registers[dest]}`);
    }
}

export default BitManipulationInstructions