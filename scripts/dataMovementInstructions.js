class DataMovementInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        switch (instruction) {
            case 'MOV':
                this.mov(args);
                break;
            case 'LOAD':
                this.load(args);
                break;
            case 'STORE':
                this.store(args);
                break;
            default:
                console.error(`Instrução de movimentação de dados desconhecida: ${instruction}`);
        }
    }

    mov(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] = this.interpreter.registers[src] || parseInt(src);
        console.log(`MOV ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    load(args) {
        const [dest, address] = args;
        this.interpreter.registers[dest] = this.interpreter.memory[parseInt(address)];
        console.log(`LOAD ${dest}, ${address}: ${this.interpreter.registers[dest]}`);
    }

    store(args) {
        const [src, address] = args;
        this.interpreter.memory[parseInt(address)] = this.interpreter.registers[src];
        console.log(`STORE ${src}, ${address}: ${this.interpreter.memory[parseInt(address)]}`);
    }
}

export default DataMovementInstructions