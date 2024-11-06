class ArithmeticInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.maxValue = Math.pow(2, interpreter.bitWidth) - 1;
    }

    execute(instruction, args) {
        if (!instruction || !args) {
            throw new Error('Instrução ou argumentos inválidos');
        }

        switch (instruction.toUpperCase()) {
            case 'ADD': return this.add(args);
            case 'SUB': return this.sub(args);
            case 'MUL': return this.mul(args);
            case 'DIV': return this.div(args);
            case 'AND': return this.and(args);
            case 'OR': return this.or(args);
            case 'XOR': return this.xor(args);
            case 'NOT': return this.not(args);
            case 'CMP': return this.cmp(args);
            default:
                throw new Error(`Instrução aritmética desconhecida: ${instruction}`);
        }
    }

    validateRegister(reg) {
        if (!this.interpreter.registers.hasOwnProperty(reg)) {
            throw new Error(`Registrador inválido: ${reg}`);
        }
    }

    getRegisterOrValue(arg) {
        if (this.interpreter.registers.hasOwnProperty(arg)) {
            return this.getRegisterValue(arg);
        } else {
            const value = parseInt(arg, 10);
            if (isNaN(value)) {
                throw new Error(`Valor inválido: ${arg}`);
            }
            return value;
        }
    }

    getRegisterValue(register) {
        const value = parseFloat(this.interpreter.registers[register]);
        if (isNaN(value)) {
            throw new Error(`Valor inválido no registrador ${register}`);
        }
        return value;
    }

    updateFlags(result) {
        // Flag Zero (Z)
        this.interpreter.registers.FLAGS = result === 0 ? 1 : 0;
        
        // Flag Negativo (N)
        this.interpreter.registers.FLAG = result < 0;
        
        // Flag de Overflow (V)
        if (result > this.maxValue || result < -this.maxValue) {
            this.interpreter.registers.OVERFLOW = 1;
        } else {
            this.interpreter.registers.OVERFLOW = 0;
        }
    }

    add(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        const result = destValue + srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'ADD', args, result };
    }

    sub(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        const result = destValue - srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'SUB', args, result };
    }

    mul(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        const result = destValue * srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'MUL', args, result };
    }

    div(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        if (srcValue === 0) {
            throw new Error('Divisão por zero');
        }
        const result = destValue / srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'DIV', args, result };
    }

    and(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        const result = destValue & srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'AND', args, result };
    }

    or(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        const result = destValue | srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'OR', args, result };
    }

    xor(args) {
        const [dest, src] = args;
        this.validateRegister(dest);
        const destValue = this.getRegisterValue(dest);
        const srcValue = this.getRegisterOrValue(src);
        const result = destValue ^ srcValue;
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'XOR', args, result };
    }

    not(args) {
        const [dest] = args;
        this.validateRegister(dest);
        const result = ~this.getRegisterValue(dest);
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'NOT', args, result };
    }

    cmp(args) {
        const [reg1, reg2] = args;
        this.validateRegister(reg1);
        const value1 = this.getRegisterValue(reg1);
        const value2 = this.getRegisterOrValue(reg2);
        
        // FLAGS = 1 se for igual, 0 se não for igual
        this.interpreter.registers.FLAGS = value1 === value2 ? 1 : 0;
        // FLAG = true se value1 < value2 (invertemos a lógica aqui)
        this.interpreter.registers.FLAG = value1 < value2;
    
        console.log('DEBUG CMP:', {
            value1,
            value2,
            FLAGS: this.interpreter.registers.FLAGS,
            FLAG: this.interpreter.registers.FLAG
        });
        
        return { 
            instruction: 'CMP', 
            args, 
            result: value1 === value2 ? 'Equal' : 
                    value1 < value2 ? 'Less' : 'Greater'
        };
    }
}

export default ArithmeticInstructions;