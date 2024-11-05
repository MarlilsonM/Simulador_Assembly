class LogicalInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    jmp(args) {
        const [label] = args;
        
        if (!this.interpreter.memory) {
                        return;
        }

        const index = this.interpreter.memory.findIndex((line, idx) => {
            const originalLine = line;
            const normalizedLine = line.split(':')[0].trim();
            const comparisonResult = normalizedLine === label;

            return comparisonResult;
        });

        if (index !== -1) {
            this.interpreter.currentInstruction = index;
                    } else {
                    }
    }         

    je(args) {
        if (this.interpreter.registers.FLAGS === 0) {
            const label = args[0];
            if (this.interpreter.labels.hasOwnProperty(label)) {
                this.interpreter.currentInstruction = this.interpreter.labels[label];
                            } else {
                                this.interpreter.currentInstruction++;
            }
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
        const returnAddress = this.interpreter.currentInstruction + 1;
    
                if (this.interpreter.registers['SP'] > 0) {
            this.interpreter.registers['SP']--;  // Decrementa o ponteiro de pilha corretamente
            this.interpreter.memory[this.interpreter.registers['SP']] = returnAddress;  // Salva o endereço de retorno na pilha
                        this.jmp([label]);  // Salta para a sub-rotina
        } else {
                    }
    }

    ret() {
            
        if (this.interpreter.registers['SP'] < 1000) {  // Limita a recuperação dentro do tamanho da pilha
            const returnAddress = this.interpreter.memory[this.interpreter.registers['SP']];  // Recupera o endereço de retorno da pilha
            this.interpreter.registers['SP']++;  // Incrementa o ponteiro de pilha
                        if (typeof returnAddress === 'number' && !isNaN(returnAddress)) {
                this.interpreter.currentInstruction = returnAddress;  // Define a próxima instrução a ser executada
            } else {
                            }
        } else {
                    }
    }

    execute(instruction, args) {
                switch (instruction.toUpperCase()) {
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
                this.ret();
                break;
            default:
                        }
    }
}

export default LogicalInstructions;