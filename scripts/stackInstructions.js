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
                console.error(`Instrução de pilha desconhecida: ${instruction}`);
        }
    }

    push(args) {
        const [src] = args;
        if (!this.interpreter.registers.hasOwnProperty(src)) {
            console.error(`Erro: Registrador ${src} não existe`);
            return false;
        }

        if (this.interpreter.registers['SP'] <= 0) {
            console.error('Stack Overflow: Pilha está cheia');
            return false;
        }

        this.interpreter.registers['SP']--;
        const sp = this.interpreter.registers['SP'];
        this.interpreter.memory[sp] = this.interpreter.registers[src];
        console.log(`PUSH ${src}: valor=${this.interpreter.registers[src]}, SP=${sp}`);
        return true;
    }

    pop(args) {
        const [dest] = args;
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
            console.error(`Erro: Registrador ${dest} não existe`);
            return false;
        }

        if (this.interpreter.registers['SP'] >= 999) {
            console.error('Stack Underflow: Pilha está vazia');
            return false;
        }

        this.interpreter.registers[dest] = this.interpreter.memory[this.interpreter.registers['SP']];
        this.interpreter.registers['SP']++;
        console.log(`POP ${dest}: valor=${this.interpreter.registers[dest]}, SP=${this.interpreter.registers['SP']}`);
        return true;
    }

    dup() {
        const sp = this.interpreter.registers['SP'];
        
        // Verifica se há elementos para duplicar (SP < 999 significa que há elementos na pilha)
        if (sp <= 0) {
            console.error('Stack Overflow: Não há espaço para duplicar');
            return false;
        }
        
        // Verifica se há elementos na pilha
        if (sp >= 999) {
            console.error('Pilha vazia, não é possível duplicar');
            return false;
        }

        // Pega o valor do topo da pilha
        const value = this.interpreter.memory[sp];
        
        // Decrementa SP e coloca o valor duplicado
        this.interpreter.registers['SP']--;
        this.interpreter.memory[this.interpreter.registers['SP']] = value;
        
        console.log(`DUP: valor=${value}, SP anterior=${sp}, novo SP=${this.interpreter.registers['SP']}`);
        return true;
    }

    swap() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= 998) {
            console.error('Elementos insuficientes para SWAP');
            return false;
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = temp;
        console.log(`SWAP: trocados ${this.interpreter.memory[sp]} e ${this.interpreter.memory[sp + 1]}`);
        return true;
    }

    rot() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= 997) {
            console.error('Elementos insuficientes para ROT');
            return false;
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = this.interpreter.memory[sp + 2];
        this.interpreter.memory[sp + 2] = temp;
        console.log(`ROT: rotacionados ${this.interpreter.memory[sp]}, ${this.interpreter.memory[sp + 1]}, ${this.interpreter.memory[sp + 2]}`);
        return true;
    }

}

export default StackInstructions;