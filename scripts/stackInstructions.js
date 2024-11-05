class StackInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        switch (instruction) {
            case 'PUSH':
                this.push(args);
                break;
            case 'POP':
                this.pop(args);
                break;
            case 'DUP':
                this.dup();
                break;
            case 'SWAP':
                this.swap();
                break;
            case 'ROT':
                this.rot();
                break;
            default:
                        }
    }

    push(args) {
        const [src] = args;
        if (!this.interpreter.registers.hasOwnProperty(src)) {
                        return false;
        }

        if (this.interpreter.registers['SP'] <= 0) {
                        return false;
        }

        this.interpreter.registers['SP']--;
        const sp = this.interpreter.registers['SP'];
        this.interpreter.memory[sp] = this.interpreter.registers[src];
                return true;
    }

    pop(args) {
        const [dest] = args;
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
                        return false;
        }

        if (this.interpreter.registers['SP'] >= 999) {
                        return false;
        }

        this.interpreter.registers[dest] = this.interpreter.memory[this.interpreter.registers['SP']];
        this.interpreter.registers['SP']++;
                return true;
    }

    dup() {
        const sp = this.interpreter.registers['SP'];
        
        // Verifica se há elementos para duplicar (SP < 999 significa que há elementos na pilha)
        if (sp <= 0) {
                        return false;
        }
        
        // Verifica se há elementos na pilha
        if (sp >= 999) {
                        return false;
        }

        // Pega o valor do topo da pilha
        const value = this.interpreter.memory[sp];
        
        // Decrementa SP e coloca o valor duplicado
        this.interpreter.registers['SP']--;
        this.interpreter.memory[this.interpreter.registers['SP']] = value;
        
                return true;
    }

    swap() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= 998) {
                        return false;
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = temp;
                return true;
    }

    rot() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= 997) {
                        return false;
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = this.interpreter.memory[sp + 2];
        this.interpreter.memory[sp + 2] = temp;
                return true;
    }

}

export default StackInstructions;