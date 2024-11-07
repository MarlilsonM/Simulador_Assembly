class SIMDInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

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

    ensureNumber(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            throw new Error(`Valor inválido: ${value}`);
        }
        return num;
    }

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
                .map(x => x.toFixed(2))
        };
    }

    vadd(args) {
        return this.performVectorOperation((a, b) => a + b, args, 'VADD');
    }

    vmul(args) {
        return this.performVectorOperation((a, b) => a * b, args, 'VMUL');
    }

    vdiv(args) {
        return this.performVectorOperation((a, b, i) => {
            if (b === 0) throw new Error(`Divisão por zero no índice ${i}`);
            return a / b;
        }, args, 'VDIV');
    }

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

    parseMemoryAddress(memAddr) {
        const addr = parseInt(memAddr.replace(/[\[\]]/g, ''));
        if (isNaN(addr)) {
            throw new Error(`Endereço de memória inválido: ${memAddr}`);
        }
        return addr;
    }
}

export default SIMDInstructions;