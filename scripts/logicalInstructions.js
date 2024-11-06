class LogicalInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {        
        // Converte para maiúsculo e remove espaços
        const cleanInstruction = instruction.toUpperCase().trim();

        switch (instruction.toUpperCase()) {
            case 'JMP': return this.jmp(args);
            case 'JE': return this.je(args);
            case 'JNE': return this.jne(args);
            case 'JG': return this.jg(args);
            case 'JL': return this.jl(args);
            case 'JLE': return this.jle(args);
            case 'CALL': return this.call(args);
            case 'RET': return this.ret();
            default:
                console.error('DEBUG - Instrução não encontrada:', cleanInstruction); // Debug log
                throw new Error(`Instrução lógica desconhecida: ${instruction}`);
        }
    }

    jmp(args) {
        if (args.length !== 1) {
            throw new Error('JMP requer um argumento (label)');
        }
        const [label] = args;
        
        if (!this.interpreter.labels.hasOwnProperty(label)) {
            throw new Error(`Label não encontrada: ${label}`);
        }
    
        this.interpreter.currentInstruction = this.interpreter.labels[label];
        return { instruction: 'JMP', args: [label], result: `Salto para ${label}` };
    }

    je(args) {
        if (args.length !== 1) {
            throw new Error('JE requer um argumento (label)');
        }
        if (this.interpreter.registers.FLAGS === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JE', args, result: 'Condição não atendida, continuando' };
    }

    jne(args) {
        if (args.length !== 1) {
            throw new Error('JNE requer um argumento (label)');
        }
        const [label] = args;
        
        // JNE deve pular quando FLAGS é 0 (valores diferentes)
        if (this.interpreter.registers.FLAGS === 0) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }
            
            const jumpToIndex = this.interpreter.labels[label];
            return { 
                instruction: 'JNE', 
                args: [label], 
                result: `Saltando para ${label}`,
                nextInstruction: jumpToIndex
            };
        }
        
        this.interpreter.currentInstruction++;
        return { instruction: 'JNE', args, result: 'Condição não atendida, continuando' };
    }

    jg(args) {
        if (args.length !== 1) {
            throw new Error('JG requer um argumento (label)');
        }
        
        const [label] = args;
        const shouldJump = this.interpreter.registers.FLAGS === 0 && !this.interpreter.registers.FLAG;
        
        console.log('DEBUG JG:', {
            FLAGS: this.interpreter.registers.FLAGS,
            FLAG: this.interpreter.registers.FLAG,
            shouldJump: shouldJump
        });
        
        if (shouldJump) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }
            
            const jumpToIndex = this.interpreter.labels[label];
            return { 
                instruction: 'JG', 
                args: [label], 
                result: `Salto para ${label} (condição atendida)`,
                nextInstruction: jumpToIndex
            };
        } else {
            return { 
                instruction: 'JG', 
                args: [label], 
                result: 'Condição não atendida, continuando'
            };
        }
    }

    jl(args) {
        if (args.length !== 1) {
            throw new Error('JL requer um argumento (label)');
        }
        if (this.interpreter.registers.FLAG === true) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JL', args, result: 'Condição não atendida, continuando' };
    }

    jle(args) {
        if (args.length !== 1) {
            throw new Error('JLE requer um argumento (label)');
        }
        
        const [label] = args;
        // JLE salta se for menor (FLAG = true) OU igual (FLAGS = 1)
        const shouldJump = this.interpreter.registers.FLAG === true || 
                         this.interpreter.registers.FLAGS === 1;
        
        console.log('DEBUG JLE:', {
            FLAGS: this.interpreter.registers.FLAGS,
            FLAG: this.interpreter.registers.FLAG,
            shouldJump: shouldJump
        });
    
        if (shouldJump) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }
            
            const jumpToIndex = this.interpreter.labels[label];
            return { 
                instruction: 'JLE', 
                args: [label], 
                result: `Salto para ${label} (condição atendida)`,
                nextInstruction: jumpToIndex
            };
        } else {
            return { 
                instruction: 'JLE', 
                args: [label], 
                result: 'Condição não atendida, continuando'
            };
        }
    }

    call(args) {
        if (args.length !== 1) {
            throw new Error('CALL requer um argumento (label)');
        }
        const [label] = args;
        const returnAddress = this.interpreter.currentInstruction + 1;
    
        if (this.interpreter.registers['SP'] <= 0) {
            throw new Error('Stack overflow');
        }

        this.interpreter.registers['SP']--;
        this.interpreter.memory[this.interpreter.registers['SP']] = returnAddress;
        const jmpResult = this.jmp([label]);
        return { 
            instruction: 'CALL', 
            args: [label], 
            result: `Chamada para ${label}, retorno salvo em SP=${this.interpreter.registers['SP']}`
        };
    }

    ret() {
        if (this.interpreter.registers['SP'] >= this.interpreter.memory.length) {
            throw new Error('Stack underflow');
        }

        const returnAddress = this.interpreter.memory[this.interpreter.registers['SP']];
        this.interpreter.registers['SP']++;

        if (typeof returnAddress !== 'number' || isNaN(returnAddress)) {
            throw new Error('Endereço de retorno inválido');
        }

        this.interpreter.currentInstruction = returnAddress;
        return { instruction: 'RET', args: [], result: `Retorno para instrução ${returnAddress}` };
    }
}

export default LogicalInstructions;