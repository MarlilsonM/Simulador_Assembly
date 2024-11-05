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
            default:
                console.error(`Instrução de pilha desconhecida: ${instruction}`);
        }
    }

    push(args) {
        const [src] = args;
        if (!this.interpreter.registers.hasOwnProperty(src)) {
            console.error(`Erro: Registrador ${src} não existe`);
            return;
        }
        const sp = this.interpreter.registers['SP'];
        if (sp < 0) {
            console.error('Stack Overflow: Pilha está cheia');
            return;
        }
        this.interpreter.memory[sp] = this.interpreter.registers[src];
        this.interpreter.registers['SP']--;
        console.log(`PUSH ${src}: ${this.interpreter.memory[sp]}`);
    }

    pop(args) {
        const [dest] = args;
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
            console.error(`Erro: Registrador ${dest} não existe`);
            return;
        }
        if (this.interpreter.registers['SP'] >= this.interpreter.memory.length - 1) {
            console.error('Stack Underflow: Pilha está vazia');
            return;
        }
        this.interpreter.registers['SP']++;
        const sp = this.interpreter.registers['SP'];
        this.interpreter.registers[dest] = this.interpreter.memory[sp];
        console.log(`POP ${dest}: ${this.interpreter.registers[dest]}`);
    }
}

export default StackInstructions;