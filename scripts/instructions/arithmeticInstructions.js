/**
 * Classe que implementa instruções aritméticas para um interpretador de assembly.
 * As instruções suportadas incluem adição, subtração, multiplicação, divisão,
 * operações lógicas e comparação.
 */
class ArithmeticInstructions {
    /**
     * Construtor da classe.
     * @param {Interpreter} interpreter - Instância do interpretador que contém os registradores e a lógica de execução.
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.maxValue = Math.pow(2, interpreter.bitWidth) - 1; // Define o valor máximo com base na largura de bits.
    }

    /**
     * Executa uma instrução aritmética com os argumentos fornecidos.
     * @param {string} instruction - A instrução a ser executada (ex: 'ADD', 'SUB', etc.).
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} Resultado da execução da instrução.
     * @throws {Error} Se a instrução ou os argumentos forem inválidos.
     */
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
            case 'INC': return this.inc(args);
            case 'DEC': return this.dec(args);
            case 'NOT': return this.not(args);
            case 'CMP': return this.cmp(args);
            default:
                throw new Error(`Instrução aritmética desconhecida: ${instruction}`);
        }
    }

    /**
     * Valida se o registrador fornecido existe nos registradores do interpretador.
     * @param {string} reg - O nome do registrador a ser validado.
     * @throws {Error} Se o registrador for inválido.
     */
    validateRegister(reg) {
        if (!this.interpreter.registers.hasOwnProperty(reg)) {
            throw new Error(`Registrador inválido: ${reg}`);
        }
    }

    /**
     * Obtém o valor de um registrador ou converte um argumento para um número.
     * @param {string} arg - O argumento que pode ser um registrador ou um valor numérico.
     * @returns {number} O valor do registrador ou o valor numérico.
     * @throws {Error} Se o argumento não for um registrador válido ou um número.
     */
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

    /**
     * Obtém o valor de um registrador específico.
     * @param {string} register - O nome do registrador.
     * @returns {number} O valor do registrador.
     * @throws {Error} Se o valor do registrador for inválido.
     */
    getRegisterValue(register) {
        const value = parseFloat(this.interpreter.registers[register]);
        
        if (isNaN(value)) {
            throw new Error(`Valor inválido no registrador ${register}`);
        }
        return value;
    }

    /**
     * Atualiza as flags do interpretador com base no resultado de uma operação.
     * @param {number} result - O resultado da operação aritmética.
     */
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

    /**
     * Executa a instrução de adição.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação de adição.
     */
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

    /**
     * Executa a instrução de subtração.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação de subtração.
     */
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

    /**
     * Executa a instrução de multiplicação.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação de multiplicação.
     */
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

    /**
     * Executa a instrução de divisão.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação de divisão.
     * @throws {Error} Se houver tentativa de divisão por zero.
     */
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

    /**
     * Executa a instrução AND.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação AND.
     */
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

    /**
     * Executa a instrução OR.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação OR.
     */
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

    /**
     * Executa a instrução XOR.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação XOR.
     */
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

    /**
     * Executa a instrução de incremento.
     * @param {Array} args - Argumentos da instrução (registrador a ser incrementado).
     * @returns {Object} Resultado da operação de incremento.
     */
    inc(args) {
        const [reg] = args;
        this.validateRegister(reg);
        const value = this.getRegisterValue(reg);
        
        const result = value + 1; // Incrementa o valor
        this.interpreter.registers[reg] = result;
        this.updateFlags(result);
        return { instruction: 'INC', args, result };
    }

    /**
     * Executa a instrução de decremento.
     * @param {Array} args - Argumentos da instrução (registrador a ser decrementado).
     * @returns {Object} Resultado da operação de decremento.
     */
    dec(args) {
        const [reg] = args;
        this.validateRegister(reg);
        const value = this.getRegisterValue(reg);
        
        const result = value - 1; // Decrementa o valor
        this.interpreter.registers[reg] = result;
        this.updateFlags(result);
        return { instruction: 'DEC', args, result };
    }

    /**
     * Executa a instrução NOT.
     * @param {Array} args - Argumentos da instrução (destino).
     * @returns {Object} Resultado da operação NOT.
     */
    not(args) {
        const [dest] = args;
        this.validateRegister(dest);
        const result = ~this.getRegisterValue(dest);
        
        this.interpreter.registers[dest] = result;
        this.updateFlags(result);
        return { instruction: 'NOT', args, result };
    }

    /**
     * Executa a instrução de comparação.
     * @param {Array} args - Argumentos da instrução (dois registradores a serem comparados).
     * @returns {Object} Resultado da operação de comparação.
     */
    cmp(args) {
        const [reg1, reg2] = args;
        this.validateRegister(reg1);
        const value1 = this.getRegisterValue(reg1);
        const value2 = this.getRegisterOrValue(reg2);
        
        // FLAGS = 1 se for igual, 0 se não for igual
        this.interpreter.registers.FLAGS = value1 === value2 ? 1 : 0;
        // FLAG = true se value1 < value2 (invertemos a lógica aqui)
        this.interpreter.registers.FLAG = value1 < value2;
        
        return { 
            instruction: 'CMP', 
            args, 
            result: value1 === value2 ? 'Equal' : 
                    value1 < value2 ? 'Less' : 'Greater'
        };
    }
}

export default ArithmeticInstructions;