class DataMovementInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

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

    mov(args) {
        if (args.length !== 2) {
            throw new Error('MOV requer dois argumentos');
        }

        const [dest, src] = args;

        // Movimentação para memória
        if (dest.includes('[')) {
            return this.movToMemory(dest, src);
        }
        
        // Movimentação para registrador
        return this.movToRegister(dest, src);
    }

    movToMemory(dest, src) {
        const address = this.parseMemoryAddress(dest);
        const value = this.parseValue(src);

        if (address < 0 || address >= this.interpreter.memory.length) {
            throw new Error(`Endereço de memória inválido: ${address}`);
        }

        this.interpreter.memory[address] = value;
        this.interpreter.updateMemoryUI();
        return { instruction: 'MOV', args: [`[${address}]`, value], result: value };
    }

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

    getRegisterOrValue(arg) {
        // Se for um registrador, retorna seu valor
        if (this.interpreter.registers.hasOwnProperty(arg)) {
            return this.interpreter.registers[arg];
        }

        // Tenta converter para número
        const value = parseInt(arg, 10);
        if (isNaN(value)) {
            throw new Error(`Valor inválido: ${arg}`);
        }
        return value;
    }

    parseMemoryAddress(address) {
        if (typeof address !== 'string') {
            throw new Error(`Formato de endereço inválido: ${address}`);
        }
    
        // Remove espaços em branco e colchetes
        const cleanAddress = address.replace(/[\[\]\s]/g, '');
    
        // Verifica se é uma expressão com soma (ex: r0+r2)
        if (cleanAddress.includes('+')) {
            const [base, offset] = cleanAddress.split('+');
            let baseValue = this.getRegisterOrValue(base);
            let offsetValue = this.getRegisterOrValue(offset);
            return baseValue + offsetValue;
        }
    
        // Se não for uma expressão, pode ser um registrador ou um valor direto
        return this.getRegisterOrValue(cleanAddress);
    }
}

export default DataMovementInstructions;