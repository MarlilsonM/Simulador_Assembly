/**
 * Classe que implementa instruções de movimentação de dados para um interpretador de assembly.
 * As instruções suportadas incluem MOV, LOAD e STORE.
 */
class DataMovementInstructions {
    /**
     * Construtor da classe.
     * @param {Interpreter} interpreter - Instância do interpretador que contém os registradores e a lógica de execução.
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    /**
     * Executa uma instrução de movimentação de dados com os argumentos fornecidos.
     * @param {string} instruction - A instrução a ser executada (ex: 'MOV', 'LOAD', 'STORE').
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} Resultado da execução da instrução.
     * @throws {Error} Se a instrução for desconhecida.
     */
    execute(instruction, args) {
        switch (instruction.toUpperCase()) {
            case 'MOV':
                return this.mov(args);
            case 'LOAD':
                return this.load(args);
            case 'STORE':
                return this.store(args);
            default:
                throw new Error(`Instrução de movimentação de dados desconhecida: ${instruction}`);
        }
    }

    /**
     * Executa a instrução MOV para mover dados entre registradores ou para a memória.
     * @param {Array} args - Argumentos da instrução (destino e fonte).
     * @returns {Object} Resultado da operação MOV.
     * @throws {Error} Se o número de argumentos for inválido.
     */
    mov(args) {
        if (args.length !== 2) {
            throw new Error('MOV requer dois argumentos');
        }

        const [dest, src] = args;

        // Log para verificar os argumentos recebidos
        console.log(`MOV - Destino: ${dest}, Fonte: ${src}`);

        // Movimentação para memória
        if (dest.includes('[')) {
            return this.movToMemory(dest, src);
        }
        
        // Movimentação para registrador
        return this.movToRegister(dest, src);
    }

    /**
     * Analisa um endereço de memória e o converte para um índice numérico.
     * @param {string} address - O endereço de memória a ser analisado.
     * @returns {number} O índice numérico correspondente ao endereço de memória.
     * @throws {Error} Se o formato do endereço for inválido.
     */
    parseMemoryAddress(address) {
        if (typeof address !== 'string') {
            throw new Error(`Formato de endereço inválido: ${address}`);
        }
    
        // Remove espaços em branco e colchetes
        const cleanAddress = address.replace(/[\[\]\s]/g, '');
        console.log(`Endereço limpo: ${cleanAddress}`); // Log de depuração

    
        // Verifica se é uma expressão com soma (ex: r0+r2)
        if (cleanAddress.includes('+')) {
            const [base, offset] = cleanAddress.split('+');
            let baseValue = this.getRegisterOrValue(base);
            let offsetValue = this.getRegisterOrValue(offset);
            return baseValue + offsetValue;
        }

        console.log(`Endereço analisado: ${cleanAddress}`);
    
        // Se não for uma expressão, pode ser um registrador ou um valor direto
        return this.getRegisterOrValue(cleanAddress);
    }

    /**
     * Movimenta um valor para um endereço de memória.
     * @param {string} dest - O endereço de memória de destino.
     * @param {string} src - O valor ou registrador de origem.
     * @returns {Object} Resultado da operação MOV para memória.
     * @throws {Error} Se o endereço de memória for inválido.
     */
    movToMemory(dest, src) {
        const address = this.parseMemoryAddress(dest);
        const value = this.parseValue(src);

        console.log(`Tentando mover ${value} para o endereço de memória: ${address}`);

        // Verifique o estado da memória antes da operação
        console.log("Estado atual da memória:", this.interpreter.memory);

        // Adicione o log aqui para verificar o tamanho da memória
        console.log(`Tamanho da memória: ${this.interpreter.memory.length}`); // Log do tamanho da memória
        console.log(`Verificando endereço: ${address}`); // Log do endereço a ser verificado

        // Verifique o estado da memória antes da operação
        console.log("Estado atual da memória antes da operação:", this.interpreter.memory);

        if (address < 0 || address >= this.interpreter.memory.length) {
            throw new Error(`Endereço de memória inválido: ${address}`);
        }

        this.interpreter.memory[address] = value;
        this.interpreter.updateMemoryUI();
        return { instruction: 'MOV', args: [`[${address}]`, value], result: value };
    }

    /**
     * Movimenta um valor para um registrador.
     * @param {string} dest - O registrador de destino.
     * @param {string} src - O valor ou registrador de origem.
     * @returns {Object} Resultado da operação MOV para registrador.
     * @throws {Error} Se o registrador de destino for inválido.
     */
    movToRegister(dest, src) {
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
            throw new Error(`Registrador de destino inválido: ${dest}`);
        }
    
        let value;
        // Verifica se é uma referência de memória
        if (typeof src === 'string' && src.includes('[')) {
            const address = this.parseMemoryAddress(src);
            value = this.interpreter.memory[address];
        }
        // Verifica se é um registrador
        else if (this.interpreter.registers.hasOwnProperty(src)) {
            value = this.interpreter.registers[src];
        }
        // Trata como valor direto
        else {
            value = this.parseValue(src);
        }
    
        this.interpreter.registers[dest] = value;
        this.interpreter.updateRegistersUI();
        return { instruction: 'MOV', args: [dest, src], result: value };
    }

    /**
     * Executa a instrução LOAD para carregar um valor da memória para um registrador.
     * @param {Array} args - Argumentos da instrução (registrador de destino e endereço de memória).
     * @returns {Object} Resultado da operação LOAD.
     * @throws {Error} Se o número de argumentos for inválido ou se o endereço de memória for inválido.
     */
    load(args) {
        if (args.length !== 2) {
            throw new Error('LOAD requer dois argumentos');
        }
    
        const [dest, address] = args;
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
            throw new Error(`Registrador de destino inválido: ${dest}`);
        }
    
        const memoryAddress = this.parseMemoryAddress(address);
        if (memoryAddress < 0 || memoryAddress >= this.interpreter.memory.length) {
            throw new Error(`Endereço de memória inválido: ${memoryAddress}`);
        }
    
        const value = this.interpreter.memory[memoryAddress];
        if (value === undefined || typeof value !== 'number') {
            throw new Error(`Valor inválido na memória: ${memoryAddress} (Valor: ${value})`);
        }
    
        this.interpreter.registers[dest] = value;
        this.interpreter.updateRegistersUI();
        return { instruction: 'LOAD', args: [dest, `[${memoryAddress}]`], result: value };
    }

    /**
     * Executa a instrução STORE para armazenar um valor de um registrador na memória.
     * @param {Array} args - Argumentos da instrução (registrador de origem e endereço de memória).
     * @returns {Object} Resultado da operação STORE.
     * @throws {Error} Se o número de argumentos for inválido ou se o endereço de memória for inválido.
     */
    store(args) {
        if (args.length !== 2) {
            throw new Error('STORE requer dois argumentos');
        }
    
        const [src, address] = args;
    
        // Verifica se o endereço de memória é válido
        const memoryAddress = this.parseMemoryAddress(address);
        if (memoryAddress < 0 || memoryAddress >= this.interpreter.memory.length) {
            throw new Error(`Endereço de memória inválido: ${memoryAddress}`);
        }
    
        // Se src é um registrador, obtém seu valor
        let value;
        if (this.interpreter.registers.hasOwnProperty(src)) {
            value = this.interpreter.registers[src];
        } else {
            // Se não for um registrador, trata como valor direto
            value = this.parseValue(src);
        }
    
        this.interpreter.memory[memoryAddress] = value;
        this.interpreter.updateMemoryUI();
        return { instruction: 'STORE', args: [`[${memoryAddress}]`, src], result: value };
    }

    /**
     * Analisa um valor e o converte para um número, se necessário.
     * @param {string|number} value - O valor a ser analisado.
     * @returns {number} O valor convertido.
     * @throws {Error} Se o valor for inválido.
     */
    parseValue(value) {
        // Se for um registrador, retorna o valor do registrador
        if (typeof value === 'string' && this.interpreter.registers.hasOwnProperty(value)) {
            return this.interpreter.registers[value];
        }

        // Tenta converter para número
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            throw new Error(`Valor inválido: ${value}`);
        }
        return parsed;
    }

    /**
     * Obtém o valor de um registrador ou converte um argumento para um número.
     * @param {string} arg - O argumento que pode ser um registrador ou um valor numérico.
     * @returns {number} O valor do registrador ou o valor numérico.
     * @throws {Error} Se o argumento não for um registrador válido ou um número.
     */
    getRegisterOrValue(arg) {
        // Se for um registrador, retorna seu valor
        if (this.interpreter.registers.hasOwnProperty(arg)) {
            return this.interpreter.registers[arg];
        }

        // Tenta converter para número
        const value = parseInt(arg, 10);
        console.log(`Valor convertido: ${value}`);
        if (isNaN(value)) {
            throw new Error(`Valor inválido: ${arg}`);
        }
        return value;
    }
}

export default DataMovementInstructions;