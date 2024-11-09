/**
 * Classe que implementa instruções de pilha para um interpretador de assembly.
 * As instruções suportadas incluem PUSH, POP, DUP, SWAP e ROT.
 */
class StackInstructions {
    /**
     * Construtor da classe.
     * @param {Interpreter} interpreter - Instância do interpretador que contém os registradores e a lógica de execução.
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    /**
     * Executa uma instrução de pilha com os argumentos fornecidos.
     * @param {string} instruction - A instrução a ser executada (ex: 'PUSH', 'POP', etc.).
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} Resultado da execução da instrução.
     * @throws {Error} Se a instrução for desconhecida.
     */
    execute(instruction, args) {
        switch (instruction.toUpperCase()) {
            case 'PUSH':
                return this.push(args);
            case 'POP':
                return this.pop(args);
            case 'DUP':
                return this.dup();
            case 'SWAP':
                return this.swap();
            case 'ROT':
                return this.rot();
            default:
                throw new Error(`Instrução de pilha desconhecida: ${instruction}`);
        }
    }

    /**
     * Executa a instrução PUSH para empilhar um valor do registrador na pilha.
     * @param {Array} args - Argumentos da instrução (registrador de origem).
     * @returns {Object} Resultado da operação PUSH.
     * @throws {Error} Se o registrador for inválido ou se ocorrer um overflow na pilha.
     */
    push(args) {
        if (args.length !== 1) {
            throw new Error('PUSH requer um argumento');
        }
        const [src] = args;
        if (!this.interpreter.registers.hasOwnProperty(src)) {
            throw new Error(`Registrador inválido: ${src}`);
        }

        if (this.interpreter.registers['SP'] <= 0) {
            throw new Error('Stack overflow');
        }

        this.interpreter.registers['SP']--;
        const sp = this.interpreter.registers['SP'];
        this.interpreter.memory[sp] = this.interpreter.registers[src];
        this.interpreter.updateMemoryUI();
        return { 
            instruction: 'PUSH', 
            args: [src], 
            result: `${this.interpreter.registers[src]} empilhado em SP=${sp}` 
        };
    }

    /**
     * Executa a instrução POP para desempilhar um valor da pilha para um registrador.
     * @param {Array} args - Argumentos da instrução (registrador de destino).
     * @returns {Object} Resultado da operação POP.
     * @throws {Error} Se o registrador for inválido ou se ocorrer um underflow na pilha.
     */
    pop(args) {
        if (args.length !== 1) {
            throw new Error('POP requer um argumento');
        }
        const [dest] = args;
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
            throw new Error(`Registrador inválido: ${dest}`);
        }

        if (this.interpreter.registers['SP'] >= this.interpreter.memory.length) {
            throw new Error('Stack underflow');
        }

        const sp = this.interpreter.registers['SP'];
        const value = this.interpreter.memory[sp];
        this.interpreter.registers[dest] = value;
        this.interpreter.registers['SP']++;
        this.interpreter.updateRegistersUI();
        return { 
            instruction: 'POP', 
            args: [dest], 
            result: `${value} desempilhado para ${dest} de SP=${sp}` 
        };
    }

    /**
     * Executa a instrução DUP para duplicar o valor no topo da pilha.
     * @returns {Object} Resultado da operação DUP.
     * @throws {Error} Se ocorrer um overflow na pilha ou se a pilha estiver vazia.
     */
    dup() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp <= 0) {
            throw new Error('Stack overflow na operação DUP');
        }
        
        if (sp >= this.interpreter.memory.length) {
            throw new Error('Stack vazia, não é possível duplicar');
        }

        const value = this.interpreter.memory[sp];
        this.interpreter.registers['SP']--;
        this.interpreter.memory[this.interpreter.registers['SP']] = value;
        
        this.interpreter.updateMemoryUI();
        return { 
            instruction: 'DUP', 
            args: [], 
            result: `${value} duplicado no topo da pilha` 
        };
    }

    /**
     * Executa a instrução SWAP para trocar os dois valores no topo da pilha.
     * @returns {Object} Resultado da operação SWAP.
     * @throws {Error} Se não houver elementos suficientes na pilha para realizar a troca.
     */
    swap() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= this.interpreter.memory.length - 1) {
            throw new Error('Elementos insuficientes para SWAP');
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = temp;
        
        this.interpreter.updateMemoryUI();
        return { 
            instruction: 'SWAP', 
            args: [], 
            result: `Trocados elementos em SP=${sp} e SP=${sp + 1}` 
        };
    }

    /**
     * Executa a instrução ROT para rotacionar os três valores no topo da pilha.
     * @returns {Object} Resultado da operação ROT.
     * @throws {Error} Se não houver elementos suficientes na pilha para realizar a rotação.
     */
    rot() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= this.interpreter.memory.length - 2) {
            throw new Error('Elementos insuficientes para ROT');
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = this.interpreter.memory[sp + 2];
        this.interpreter.memory[sp + 2] = temp;
        
        this.interpreter.updateMemoryUI();
        return { 
            instruction: 'ROT', 
            args: [], 
            result: `Rotacionados elementos em SP=${sp}, SP=${sp + 1}, e SP=${sp + 2}` 
        };
    }
}

export default StackInstructions;