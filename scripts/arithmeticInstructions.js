class ArithmeticInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        switch (instruction) {
            case 'ADD':
                this.add(args);
                break;
            case 'SUB':
                this.sub(args);
                break;
            case 'MUL':
                this.mul(args);
                break;
            case 'DIV':
                this.div(args);
                break;
            case 'AND':
                this.and(args);
                break;
            case 'OR':
                this.or(args);
                break;
            case 'XOR':
                this.xor(args);
                break;
            case 'NOT':
                this.not(args);
                break;
            case 'CMP':
                this.cmp(args);
                break;
            default:
                console.error(`Instrução aritmética desconhecida: ${instruction}`);
        }
    }

    add(args) {
        const [destination, source] = args;
    
        // Verifica se os valores nos registradores são números válidos
        const destValue = parseFloat(this.interpreter.registers[destination]);
        const sourceValue = parseFloat(this.interpreter.registers[source]);
    
        if (isNaN(destValue) || isNaN(sourceValue)) {
            console.error(`Erro: Valor não numérico encontrado. ${destination}=${destValue}, ${source}=${sourceValue}`);
            return;
        }
    
        const result = destValue + sourceValue;
    
        // Atualiza o registrador de destino com o resultado da soma
        this.interpreter.registers[destination] = result;
        console.log(`ADD ${destination}, ${source}: ${result}`);
    }
    

    sub(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] -= this.interpreter.registers[src];
    }
    
    mul(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] *= this.interpreter.registers[src];
    }

    div(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] /= this.interpreter.registers[src];
    }

    and(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] &= this.interpreter.registers[src];
    }

    or(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] |= this.interpreter.registers[src];
    }

    xor(args) {
        const [dest, src] = args;
        this.interpreter.registers[dest] ^= this.interpreter.registers[src];
    }

    not(args) {
        const [dest] = args;
        this.interpreter.registers[dest] = ~this.interpreter.registers[dest];
    }

    cmp(args) {
        const reg1 = args[0];
        const reg2 = args[1];
        const value1 = this.interpreter.registers[reg1];
        const value2 = this.interpreter.registers[reg2];
    
        if (value1 === value2) {
            this.interpreter.registers.FLAGS = 0;  // Seta a flag de zero
        } else {
            this.interpreter.registers.FLAGS = 1;
        }
    }
}

export default ArithmeticInstructions;