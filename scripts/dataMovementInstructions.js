class DataMovementInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    mov(args) {
        const [dest, src] = args;

        if (this.interpreter.registers[dest] === undefined) {
            console.error(`Registrador ${dest} não encontrado`);
            return;
        }

        if (this.interpreter.registers[src] !== undefined) {
            this.interpreter.registers[dest] = this.interpreter.registers[src];
        } else if (!isNaN(parseInt(src, 10))) {
            this.interpreter.registers[dest] = parseInt(src, 10);
        } else {
            console.error(`Erro no MOV: ${src} não é um registrador válido ou um número`);
        }
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

    load(args) {
        const [dest, address] = args;
        this.interpreter.registers[dest] = this.interpreter.memory[parseInt(address)];
    }

    store(args) {
        const [src, address] = args;
        this.interpreter.memory[parseInt(address)] = this.interpreter.registers[src];
    }
}

export default DataMovementInstructions