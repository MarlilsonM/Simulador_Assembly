class LogicalInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {        
        // Converte para maiúsculo e remove espaços
        const cleanInstruction = instruction.toUpperCase().trim();
        console.log(`DEBUG - Executando instrução: ${cleanInstruction} com argumentos: ${args}`);

        switch (cleanInstruction) {
            case 'JMP': return this.jmp(args);
            case 'JE': return this.je(args);
            case 'JNE': return this.jne(args);
            case 'JG': return this.jg(args);
            case 'JGE': return this.jge(args);
            case 'JZ': return this.jz(args);
            case 'JNZ': return this.jnz(args);
            case 'JC': return this.jc(args);
            case 'JNC': return this.jnc(args);
            case 'JO': return this.jo(args);
            case 'JNO': return this.jno(args);
            case 'JL': return this.jl(args);
            case 'JLE': return this.jle(args);
            case 'JBE': return this.jbe(args);
            case 'JA': return this.ja(args);
            case 'JAE': return this.jae(args);
            case 'JB': return this.jb(args);
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
        console.log(`DEBUG - JMP para ${label}, nova posição: ${this.interpreter.currentInstruction}`);
        return { instruction: 'JMP', args: [label], result: `Salto para ${label}` };
    }

    je(args) {
        if (args.length !== 1) {
            throw new Error('JE requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JE: FLAGS=${this.interpreter.registers.FLAGS}, label=${label}`);
        
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
        console.log(`DEBUG - JNE: FLAGS=${this.interpreter.registers.FLAGS}, label=${label}`);
        
        if (this.interpreter.registers.FLAGS !== 1) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }
            return { 
                instruction: 'JNE', 
                args: [label], 
                result: `Saltando para ${label}`,
                nextInstruction: this.interpreter.labels[label]
            };
        }
        
        return { 
            instruction: 'JNE', 
            args: [label], 
            result: 'Condição não atendida, continuando'
        };
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
            this.interpreter.currentInstruction = jumpToIndex; // Salta para a label
            console.log(`DEBUG - JG: Salto para ${label}, nova posição: ${this.interpreter.currentInstruction}`);
            return { 
                instruction: 'JG', 
                args: [label], 
                result: `Salto para ${label} (condição atendida)`,
                nextInstruction: jumpToIndex
            };
        } else {
            console.log(`DEBUG - JG: Condição não atendida, continuando`);
            return { 
                instruction: 'JG', 
                args: [label], 
                result: 'Condição não atendida, continuando'
            };
        }
    }

    jge(args) {
        if (args.length !== 1) {
            throw new Error('JGE requer um argumento (label)');
        }

        const [label] = args;
        const shouldJump = this.interpreter.registers.FLAGS === 1 || !this.interpreter.registers.FLAG;

        console.log('DEBUG JGE:', {
            FLAGS: this.interpreter.registers.FLAGS,
            FLAG: this.interpreter.registers.FLAG,
            shouldJump: shouldJump
        });

        if (shouldJump) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }

            const jumpToIndex = this.interpreter.labels[label];
            this.interpreter.currentInstruction = jumpToIndex; // Salta para a label
            console.log(`DEBUG - JGE: Salto para ${label}, nova posição: ${this.interpreter.currentInstruction}`);
            return { 
                instruction: 'JGE', 
                args: [label], 
                result: `Salto para ${label} (condição atendida)`,
                nextInstruction: jumpToIndex
            };
        } else {
            this.interpreter.currentInstruction++; // Continua para a próxima instrução
            console.log(`DEBUG - JGE: Condição não atendida, continuando`);
            return { 
                instruction: 'JGE', 
                args: [label], 
                result: 'Condição não atendida, continuando'
            };
        }
    }

    jl(args) {
        if (args.length !== 1) {
            throw new Error('JL requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JL: FLAG=${this.interpreter.registers.FLAG}, label=${label}`);
        
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
        const shouldJump = this.interpreter.registers.FLAG || 
                      this.interpreter.registers.FLAGS === 1;

        console.log('DEBUG - JLE:', {
            FLAG: this.interpreter.registers.FLAG,
            FLAGS: this.interpreter.registers.FLAGS,
            shouldJump: shouldJump
        });

        if (shouldJump) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }
            
            return { 
                instruction: 'JLE', 
                args: [label], 
                result: `Saltando para ${label}`,
                nextInstruction: this.interpreter.labels[label]
            };
        }
        
        return { 
            instruction: 'JLE', 
            args: [label], 
            result: 'Condição não atendida, continuando'
        };
    }

    jz(args) {
        if (args.length !== 1) {
            throw new Error('JZ requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JZ: FLAGS=${this.interpreter.registers.FLAGS}, label=${label}`);
        
        if (this.interpreter.registers.FLAGS === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JZ', args, result: 'Condição não atendida, continuando' };
    }

    jnz(args) {
        if (args.length !== 1) {
            throw new Error('JNZ requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JNZ: FLAGS=${this.interpreter.registers.FLAGS}, label=${label}`);
        
        if (this.interpreter.registers.FLAGS !== 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JNZ', args, result: 'Condição não atendida, continuando' };
    }

    jc(args) {
        if (args.length !==  1) {
            throw new Error('JC requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JC: CARRY=${this.interpreter.registers.CARRY}, label=${label}`);
        
        if (this.interpreter.registers.CARRY === 1) { // Supondo que você tenha uma flag de carry
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JC', args, result: 'Condição não atendida, continuando' };
    }

    jnc(args) {
        if (args.length !== 1) {
            throw new Error('JNC requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JNC: CARRY=${this.interpreter.registers.CARRY}, label=${label}`);
        
        if (this.interpreter.registers.CARRY === 0) { // Supondo que você tenha uma flag de carry
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JNC', args, result: 'Condição não atendida, continuando' };
    }

    jo(args) {
        if (args.length !== 1) {
            throw new Error('JO requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JO: OVERFLOW=${this.interpreter.registers.OVERFLOW}, label=${label}`);
        
        if (this.interpreter.registers.OVERFLOW === 1) { // Supondo que você tenha uma flag de overflow
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JO', args, result: 'Condição não atendida, continuando' };
    }

    jno(args) {
        if (args.length !== 1) {
            throw new Error('JNO requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JNO: OVERFLOW=${this.interpreter.registers.OVERFLOW}, label=${label}`);
        
        if (this.interpreter.registers.OVERFLOW === 0) { // Supondo que você tenha uma flag de overflow
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JNO', args, result: 'Condição não atendida, continuando' };
    }

    jbe(args) {
        if (args.length !== 1) {
            throw new Error('JBE requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JBE: FLAGS=${this.interpreter.registers.FLAGS}, CARRY=${this.interpreter.registers.CARRY}, label=${label}`);

        // JBE salta se FLAGS == 0 (zero) ou CARRY == 1 (menor ou igual)
        if (this.interpreter.registers.FLAGS === 0 || this.interpreter.registers.CARRY === 1) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JBE', args, result: 'Condição não atendida, continuando' };
    }

    ja(args) {
        if (args.length !== 1) {
            throw new Error('JA requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JA: FLAGS=${this.interpreter.registers.FLAGS}, CARRY=${this.interpreter.registers.CARRY}, label=${label}`);

        // JA salta se FLAGS > 0 e CARRY == 0 (maior)
        if (this.interpreter.registers.FLAGS > 0 && this.interpreter.registers.CARRY === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JA', args, result: 'Condição não atendida, continuando' };
    }

    jae(args) {
        if (args.length !== 1) {
            throw new Error('JAE requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JAE: FLAGS=${this.interpreter.registers.FLAGS}, CARRY=${this.interpreter.registers.CARRY}, label=${label}`);

        // JAE salta se FLAGS >= 0 ou CARRY == 0 (maior ou igual)
        if (this.interpreter.registers.FLAGS >= 0 || this.interpreter.registers.CARRY === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JAE', args, result: 'Condição não atendida, continuando' };
    }

    jb(args) {
        if (args.length !== 1) {
            throw new Error('JB requer um argumento (label)');
        }
        const [label] = args;
        console.log(`DEBUG - JB: CARRY=${this.interpreter.registers.CARRY}, label=${label}`);

        // JB salta se CARRY == 1 (menor)
        if (this.interpreter.registers.CARRY === 1) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JB', args, result: 'Condição não atendida, continuando' };
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
        console.log(`DEBUG - CALL: Chamada para ${label}, retorno salvo em SP=${this.interpreter.registers['SP']}`);
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
        console.log(`DEBUG - RET: Retorno para instrução ${returnAddress}`);
        return { instruction: 'RET', args: [], result: `Retorno para instrução ${returnAddress}` };
    }
}

export default LogicalInstructions;