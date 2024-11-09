/**
 * Classe que implementa instruções lógicas para um interpretador de assembly.
 * As instruções suportadas incluem saltos condicionais e chamadas de função.
 */
class LogicalInstructions {
    /**
     * Construtor da classe.
     * @param {Interpreter} interpreter - Instância do interpretador que contém os registradores e a lógica de execução.
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    /**
     * Executa uma instrução lógica com os argumentos fornecidos.
     * @param {string} instruction - A instrução a ser executada (ex: 'JMP', 'JE', etc.).
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} Resultado da execução da instrução.
     * @throws {Error} Se a instrução for desconhecida.
     */
    execute(instruction, args) {        
        // Converte para maiúsculo e remove espaços
        const cleanInstruction = instruction.toUpperCase().trim();

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

    /**
     * Executa a instrução JMP para saltar incondicionalmente para uma label.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JMP.
     * @throws {Error} Se a label não for encontrada.
     */
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

    /**
     * Executa a instrução JE (Jump if Equal) para saltar se a flag de zero estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JE.
     */
    je(args) {
        if (args.length !== 1) {
            throw new Error('JE requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.FLAGS === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JE', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JNE (Jump if Not Equal) para saltar se a flag de zero não estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JNE.
     */
    jne(args) {
        if (args.length !== 1) {
            throw new Error('JNE requer um argumento (label)');
        }
        const [label] = args;
        
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
        
        return { instruction: 'JNE', 
            args: [label], 
            result: 'Condição não atendida, continuando'
        };
    }

    /**
     * Executa a instrução JG (Jump if Greater) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JG.
     */
    jg(args) {
        if (args.length !== 1) {
            throw new Error('JG requer um argumento (label)');
        }
        
        const [label] = args;
        const shouldJump = this.interpreter.registers.FLAGS === 0 && !this.interpreter.registers.FLAG;
        
        if (shouldJump) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }
            
            const jumpToIndex = this.interpreter.labels[label];
            this.interpreter.currentInstruction = jumpToIndex; // Salta para a label
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

    /**
     * Executa a instrução JGE (Jump if Greater or Equal) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JGE.
     */
    jge(args) {
        if (args.length !== 1) {
            throw new Error('JGE requer um argumento (label)');
        }

        const [label] = args;
        const shouldJump = this.interpreter.registers.FLAGS === 1 || !this.interpreter.registers.FLAG;

        if (shouldJump) {
            if (!this.interpreter.labels.hasOwnProperty(label)) {
                throw new Error(`Label não encontrada: ${label}`);
            }

            const jumpToIndex = this.interpreter.labels[label];
            this.interpreter.currentInstruction = jumpToIndex; // Salta para a label
            return { 
                instruction: 'JGE', 
                args: [label], 
                result: `Salto para ${label} (condição atendida)`,
                nextInstruction: jumpToIndex
            };
        } else {
            this.interpreter.currentInstruction++; // Continua para a próxima instrução
            return { 
                instruction: 'JGE', 
                args: [label], 
                result: 'Condição não atendida, continuando'
            };
        }
    }

    /**
     * Executa a instrução JL (Jump if Less) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JL.
     */
    jl(args) {
        if (args.length !== 1) {
            throw new Error('JL requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.FLAG === true) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JL', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JLE (Jump if Less or Equal) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JLE.
     */
    jle(args) {
        if (args.length !== 1) {
            throw new Error('JLE requer um argumento (label)');
        }
        
        const [label] = args;
        const shouldJump = this.interpreter.registers.FLAG || 
                      this.interpreter.registers.FLAGS === 1;

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

    /**
     * Executa a instrução JZ (Jump if Zero) para saltar se a flag de zero estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JZ.
     */
    jz(args) {
        if (args.length !== 1) {
            throw new Error('JZ requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.FLAGS === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JZ', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JNZ (Jump if Not Zero) para saltar se a flag de zero não estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JNZ.
     */
    jnz(args) {
        if (args.length !== 1) {
            throw new Error('JNZ requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.FLAGS !== 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JNZ', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JC (Jump if Carry) para saltar se a flag de carry estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JC.
     */
    jc(args) {
        if (args.length !==  1) {
            throw new Error('JC requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.CARRY === 1) { // Supondo que você tenha uma flag de carry
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JC', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JNC (Jump if Not Carry) para saltar se a flag de carry não estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JNC.
     */
    jnc(args) {
        if (args.length !== 1) {
            throw new Error('JNC requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.CARRY === 0) { // Supondo que você tenha uma flag de carry
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JNC', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JO (Jump if Overflow) para saltar se a flag de overflow estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JO.
     */
    jo(args) {
        if (args.length !== 1) {
            throw new Error('JO requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.OVERFLOW === 1) { // Supondo que você tenha uma flag de overflow
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JO', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JNO (Jump if Not Overflow) para saltar se a flag de overflow não estiver ativada.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JNO.
     */
    jno(args) {
        if (args.length !== 1) {
            throw new Error('JNO requer um argumento (label)');
        }
        const [label] = args;
        
        if (this.interpreter.registers.OVERFLOW === 0) { // Supondo que você tenha uma flag de overflow
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JNO', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JBE (Jump if Below or Equal) para saltar se a condição for verdadeira.
     * @param { Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JBE.
     */
    jbe(args) {
        if (args.length !== 1) {
            throw new Error('JBE requer um argumento (label)');
        }
        const [label] = args;

        // JBE salta se FLAGS == 0 (zero) ou CARRY == 1 (menor ou igual)
        if (this.interpreter.registers.FLAGS === 0 || this.interpreter.registers.CARRY === 1) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JBE', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JA (Jump if Above) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JA.
     */
    ja(args) {
        if (args.length !== 1) {
            throw new Error('JA requer um argumento (label)');
        }
        const [label] = args;

        // JA salta se FLAGS > 0 e CARRY == 0 (maior)
        if (this.interpreter.registers.FLAGS > 0 && this.interpreter.registers.CARRY === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JA', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JAE (Jump if Above or Equal) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JAE.
     */
    jae(args) {
        if (args.length !== 1) {
            throw new Error('JAE requer um argumento (label)');
        }
        const [label] = args;

        // JAE salta se FLAGS >= 0 ou CARRY == 0 (maior ou igual)
        if (this.interpreter.registers.FLAGS >= 0 || this.interpreter.registers.CARRY === 0) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JAE', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução JB (Jump if Below) para saltar se a condição for verdadeira.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação JB.
     */
    jb(args) {
        if (args.length !== 1) {
            throw new Error('JB requer um argumento (label)');
        }
        const [label] = args;

        // JB salta se CARRY == 1 (menor)
        if (this.interpreter.registers.CARRY === 1) {
            return this.jmp(args);
        }
        this.interpreter.currentInstruction++;
        return { instruction: 'JB', args, result: 'Condição não atendida, continuando' };
    }

    /**
     * Executa a instrução CALL para chamar uma função e salvar o endereço de retorno.
     * @param {Array} args - Argumentos da instrução (label).
     * @returns {Object} Resultado da operação CALL.
     * @throws {Error} Se ocorrer um overflow na pilha.
     */
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

    /**
     * Executa a instrução RET para retornar da função chamada.
     * @returns {Object} Resultado da operação RET.
     * @throws {Error} Se ocorrer um underflow na pilha ou se o endereço de retorno for inválido.
     */
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