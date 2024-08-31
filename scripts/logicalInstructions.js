class LogicalInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        switch (instruction) {
            case 'JMP':
                this.jmp(args);
                break;
            case 'JE':
                this.je(args);
                break;
            case 'JNE':
                this.jne(args);
                break;
            case 'JG':
                this.jg(args);
                break;
            case 'JL':
                this.jl(args);
                break;
            case 'CALL':
                this.call(args);
                break;
            case 'RET':
                this.ret(args);
                break;
            default:
                console.error(`Instrução lógica desconhecida: ${instruction}`);
        }
    }

    jmp(args) {
        const [label] = args;
        const index = this.interpreter.memory.findIndex(line => line.trim() === `${label}:`);
        if (index !== -1) {
            this.interpreter.currentInstruction = index;
        } else {
            console.error(`Etiqueta ${label} não encontrada`);
        }
    }

    je(args) {
        if (this.interpreter.registers['CMP'] === 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
        }
    }

    jne(args) {
        if (this.interpreter.registers['CMP'] !== 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
        }
    }

    jg(args) {
        if (this.interpreter.registers['CMP'] > 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
        }
    }

    jl(args) {
        if (this.interpreter.registers['CMP'] < 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
        }
    }

    call(args) {
        const [label] = args;
        const returnAddress = this.interpreter.currentInstruction + 1;  // Próxima instrução a ser executada
        this.interpreter.memory[this.interpreter.registers['SP']] = returnAddress;  // Salva o endereço de retorno na pilha
        this.interpreter.registers['SP']--;  // Decrementa o ponteiro de pilha
        this.logical.jmp([label]);  // Salta para a sub-rotina
        console.log(`CALL ${label}: Endereço de retorno ${returnAddress} salvo na pilha`);
    }

    ret() {
        this.interpreter.registers['SP']++;  // Incrementa o ponteiro de pilha
        const returnAddress = this.interpreter.memory[this.interpreter.registers['SP']];  // Recupera o endereço de retorno da pilha
        this.interpreter.currentInstruction = returnAddress;  // Define a próxima instrução a ser executada
        console.log(`RET: Retornando para o endereço ${returnAddress}`);
    }
}

export default LogicalInstructions;