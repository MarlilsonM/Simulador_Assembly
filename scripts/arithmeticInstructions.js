class ArithmeticInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    mov(args) {
        if (args.length < 2) {
            console.error('MOV falhou: argumentos insuficientes.');
            return;
        }
    
        const [dest, src] = args;
        let value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);

        if (value > this.interpreter.maxValue) {
            value = this.interpreter.maxValue;  // Limitar ao valor máximo permitido
        }

        this.interpreter.registers[dest] = value;
        console.log(`MOV ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    add(args) {
        const [dest, src] = args;
        const value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);
        this.interpreter.registers[dest] = (this.interpreter.registers[dest] + value) & this.interpreter.maxValue;  // Garantir que o valor não exceda o limite
        console.log(`ADD ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    sub(args) {
        const [dest, src] = args;
        const value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);
        this.interpreter.registers[dest] = (this.interpreter.registers[dest] - value) & this.interpreter.maxValue;  // Garantir que o valor não exceda o limite
        console.log(`SUB ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    mul(args) {
        const [dest, src] = args;
        const value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);
        this.interpreter.registers[dest] = (this.interpreter.registers[dest] * value) & this.interpreter.maxValue;  // Garantir que o valor não exceda o limite
        console.log(`MUL ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    div(args) {
        const [dest, src] = args;
        const value = isNaN(parseInt(src, 10)) ? this.interpreter.registers[src] : parseInt(src, 10);
        this.interpreter.registers[dest] = Math.floor(this.interpreter.registers[dest] / value);  // Divisão inteira
        console.log(`DIV ${dest}, ${src}: ${this.interpreter.registers[dest]}`);
    }

    jmp(args) {
        const [label] = args;
    
        const index = this.interpreter.memory.findIndex(line => {
            const trimmedLine = line.trim();
            return trimmedLine === `${label}:`;
        });
    
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
}

export default ArithmeticInstructions;