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
    }

    shr(args) {
        const [dest, amount] = args;
        this.interpreter.registers[dest] >>= parseInt(amount);
    }

    rol(args) {
        const [dest, amount] = args;
        const value = this.interpreter.registers[dest];
        this.interpreter.registers[dest] = (value << amount) | (value >> (32 - amount));
    }

    ror(args) {
        const [dest, amount] = args;
        const value = this.interpreter.registers[dest];
        this.interpreter.registers[dest] = (value >> amount) | (value << (32 - amount));
    }
}

export default BitManipulationInstructions