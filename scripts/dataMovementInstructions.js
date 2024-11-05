class DataMovementInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    mov(args) {
        const [dest, src] = args;
    
        // Se for um endereço de memória
        if (dest.includes('[')) {
            const address = parseInt(dest.replace('[', '').replace(']', ''));
            if (!isNaN(address)) {
                // Converte o valor fonte para número de ponto flutuante
                const value = parseFloat(src);
                if (!isNaN(value)) {
                    this.interpreter.memory[address] = value;
                } else {
                                    }
                this.interpreter.updateMemoryUI();
                return;
            }
        }    
        
        if (this.interpreter.registers[src] !== undefined) {
            this.interpreter.registers[dest] = this.interpreter.registers[src];
        } else if (!isNaN(parseFloat(src))) {
            this.interpreter.registers[dest] = parseFloat(src);
        } else {
                    }
        this.interpreter.updateRegistersUI();
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