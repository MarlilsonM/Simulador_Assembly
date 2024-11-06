class StackInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

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