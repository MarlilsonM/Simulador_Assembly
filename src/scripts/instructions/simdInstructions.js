/**
 * Classe que implementa instruções SIMD (Single Instruction, Multiple Data) para um interpretador de assembly.
 * As instruções suportadas incluem operações vetoriais como adição, multiplicação, divisão, carregamento e armazenamento.
 */
class SIMDInstructions {
    /**
     * Construtor da classe.
     * @param {Interpreter} interpreter - Instância do interpretador que contém os registradores e a lógica de execução.
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    /**
     * Executa uma instrução SIMD com os argumentos fornecidos.
     * @param {string} instruction - A instrução a ser executada (ex: 'VADD', 'VMUL', etc.).
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} Resultado da execução da instrução.
     * @throws {Error} Se a instrução for desconhecida.
     */
    execute(instruction, args) {
        this.validateInstruction(instruction, args);

        switch (instruction.toUpperCase()) {
            case 'VADD': return this.vadd(args);
            case 'VMUL': return this.vmul(args);
            case 'VDIV': return this.vdiv(args);
            case 'VLOAD': return this.vload(args);
            case 'VSTORE': return this.vstore(args);
            default:
                throw new Error(`Instrução SIMD desconhecida: ${instruction}`);
        }
    }

    /**
     * Valida a instrução e seus argumentos.
     * @param {string} instruction - A instrução a ser validada.
     * @param {Array} args - Os argumentos a serem validados.
     * @throws {Error} Se os argumentos não forem válidos.
     */
    validateInstruction(instruction, args) {
        if (!args || args.length < 2) {
            throw new Error(`Argumentos insuficientes para instrução ${instruction}`);
        }
    
        const validateVReg = (reg) => {
            if (!reg.match(/^v[0-3]$/)) {
                throw new Error(`Registrador vetorial inválido: ${reg}`);
            }
        };
    
        if (['VADD', 'VMUL', 'VDIV'].includes(instruction)) {
            if (args.length !== 3) {
                throw new Error(`${instruction} requer 3 argumentos`);
            }
            args.forEach(validateVReg);
        } else if (instruction === 'VLOAD') {
            if (args.length !== 2) {
                throw new Error(`${instruction} requer 2 argumentos`);
            }
            validateVReg(args[0]);
        } else if (instruction === 'VSTORE') {
            if (args.length !== 2) {
                throw new Error(`${instruction} requer 2 argumentos`);
            }
            validateVReg(args[0]); // Validamos o primeiro argumento como registrador vetorial
        }
    }

    /**
     * Garante que um valor seja um número.
     * @param {string|number} value - O valor a ser verificado.
     * @returns {number} O valor como número.
     * @throws {Error} Se o valor não for um número válido.
     */
    ensureNumber(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            throw new Error(`Valor inválido: ${value}`);
        }
        return num;
    }

    /**
     * Realiza uma operação vetorial com os argumentos fornecidos.
     * @param {Function} operation - A operação a ser realizada (ex: adição, multiplicação).
     * @param {Array} args - Os argumentos para a operação.
     * @param {string} operationName - Nome da operação para fins de retorno.
     * @returns {Object} Resultado da operação vetorial.
     */
    performVectorOperation(operation, args, operationName) {
        const [vdest, vsrc1, vsrc2] = args;
        const size = this.interpreter.config.matrixSize; // Use o tamanho configurado

        for (let i = 0; i < size; i++) {
            const val1 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc1][i]);
            const val2 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc2][i]);
            this.interpreter.vectorRegisters[vdest][i] = operation(val1, val2, i);
        }

        return {
            instruction: operationName,
            args: args,
            result: Array.from(this.interpreter.vectorRegisters[vdest].slice(0, size))
                .map(x => x.toFixed(2)) // Formata os resultados para duas casas decimais
        };
    }

    /**
     * Executa a instrução VADD (adição vetorial) para somar os elementos de dois registradores vetoriais.
     * @param {Array} args - Argumentos da instrução (registradores vetoriais).
     * @returns {Object} Resultado da operação VADD.
     */
    vadd(args) {
        return this.performVectorOperation((a, b) => a + b, args, 'VADD');
    }

    /**
     * Executa a instrução VMUL (multiplicação vetorial) para multiplicar os elementos de dois registradores vetoriais.
     * @param {Array} args - Argumentos da instrução (registradores vetoriais).
     * @returns {Object} Resultado da operação VMUL.
     */
    vmul(args) {
        return this.performVectorOperation((a, b) => a * b, args, 'VMUL');
    }

    /**
     * Executa a instrução VDIV (divisão vetorial) para dividir os elementos de dois registradores vetoriais.
     * @param {Array} args - Argumentos da instrução (registradores vetoriais).
     * @returns {Object} Resultado da operação VDIV.
     * @throws {Error} Se ocorrer uma divisão por zero.
     */
    vdiv(args) {
        return this.performVectorOperation((a, b, i) => {
            if (b === 0) throw new Error(`Divisão por zero no índice ${i}`);
            return a / b;
        }, args, 'VDIV');
    }

    /**
     * Executa a instrução VLOAD (carregar vetor) para carregar valores da memória em um registrador vetorial.
     * @param {Array} args - Argumentos da instrução (registrador de destino e endereço de memória).
     * @returns {Object} Resultado da operação VLOAD.
     */
    vload(args) {
        const [vdest, memAddr] = args;
        const addr = this.parseMemoryAddress(memAddr);
        const size = this.interpreter.config.matrixSize;

        for (let i = 0; i < size; i++) {
            const value = this.ensureNumber(this.interpreter.memory[addr + i]);
            this.interpreter.vectorRegisters[vdest][i] = value;
        }
        
        this.interpreter.updateMemoryUI();
        return {
            instruction: 'VLOAD',
            args: args,
            result: Array.from(this.interpreter.vectorRegisters[vdest].slice(0, size))
                .map(x => x.toFixed(2))
        };
    }

    /**
     * Executa a instrução VSTORE (armazenar vetor) para armazenar valores de um registrador vetorial na memória.
     * @param {Array} args - Argumentos da instrução (registrador de origem e endereço de memória).
     * @returns {Object} Resultado da operação VSTORE.
     * @throws {Error} Se o endereço de memória for inválido.
     */
    vstore(args) {
        const [vsrc, memAddr] = args;
        const addr = this.parseMemoryAddress(memAddr);
        const size = this.interpreter.config.matrixSize;

        if (addr < 0 || addr >= this.interpreter.memory.length - (size - 1)) {
            throw new Error(`Endereço de memória inválido: ${memAddr}`);
        }

        for (let i = 0; i < size; i++) {
            const value = this.interpreter.vectorRegisters[vsrc][i];
            this.interpreter.memory[addr + i] = value;
        }
        
        this.interpreter.updateMemoryUI();
        return {
            instruction: 'VSTORE',
            args: args,
            result: `Armazenado em memória a partir do endereço ${addr}`
        };
    }

    /**
     * Analisa um endereço de memória fornecido como string e o converte em um número inteiro.
     * @param {string} memAddr - O endereço de memória a ser analisado.
     * @returns {number} O endereço de memória como número inteiro.
     * @throws {Error} Se o endereço de memória não for válido.
     */
    parseMemoryAddress(memAddr) {
        const addr = parseInt(memAddr.replace(/[\[\]]/g, ''));
        if (isNaN(addr)) {
            throw new Error(`Endereço de memória inválido: ${memAddr}`);
        }
        return addr;
    }
}

export default SIMDInstructions;