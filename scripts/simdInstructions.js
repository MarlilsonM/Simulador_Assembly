class SIMDInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    execute(instruction, args) {
        try {
            // Validação inicial dos argumentos
            if (!args || args.length < 2) {
                throw new Error(`Argumentos insuficientes para instrução ${instruction}`);
            }

            // Valida o formato dos registradores vetoriais
            const validateVReg = (reg) => {
                if (!reg.match(/^v[0-3]$/)) {
                    throw new Error(`Registrador vetorial inválido: ${reg}`);
                }
            };

            // Valida os registradores para instruções que usam 3 registradores
            if (['VADD', 'VMUL', 'VDIV'].includes(instruction)) {
                if (args.length !== 3) {
                    throw new Error(`${instruction} requer 3 argumentos`);
                }
                args.forEach(validateVReg);
            }

            // Valida os argumentos para VLOAD e VSTORE
            if (['VLOAD', 'VSTORE'].includes(instruction)) {
                if (args.length !== 2) {
                    throw new Error(`${instruction} requer 2 argumentos`);
                }
                validateVReg(args[0]);
            }

            switch (instruction) {
                case 'VADD':
                case 'VMUL':
                case 'VDIV':
                case 'VLOAD':
                case 'VSTORE':
                    this[instruction.toLowerCase()](args);
                    break;
                default:
                    throw new Error(`Instrução SIMD desconhecida: ${instruction}`);
            }
        } catch (error) {
                        this.interpreter.updateOutput(`Erro: ${error.message}`);
            throw error;
        }
    }

    ensureNumber(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            throw new Error(`Valor inválido: ${value}`);
        }
        return num;
    }

    vadd(args) {
        const [vdest, vsrc1, vsrc2] = args;
        try {
            for (let i = 0; i < 4; i++) {
                const val1 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc1][i]);
                const val2 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc2][i]);
                this.interpreter.vectorRegisters[vdest][i] = val1 + val2;
            }
            this.interpreter.updateOutput(`VADD ${vdest} = [${Array.from(this.interpreter.vectorRegisters[vdest]).map(x => x.toFixed(2))}]`);
        } catch (error) {
            throw new Error(`Erro em VADD: ${error.message}`);
        }
    }

    vmul(args) {
        const [vdest, vsrc1, vsrc2] = args;
        try {
            for (let i = 0; i < 4; i++) {
                const val1 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc1][i]);
                const val2 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc2][i]);
                this.interpreter.vectorRegisters[vdest][i] = val1 * val2;
            }
            this.interpreter.updateOutput(`VMUL ${vdest} = [${Array.from(this.interpreter.vectorRegisters[vdest]).map(x => x.toFixed(2))}]`);
        } catch (error) {
            throw new Error(`Erro em VMUL: ${error.message}`);
        }
    }

    vdiv(args) {
        const [vdest, vsrc1, vsrc2] = args;
        try {
            for (let i = 0; i < 4; i++) {
                const val1 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc1][i]);
                const val2 = this.ensureNumber(this.interpreter.vectorRegisters[vsrc2][i]);
                if (val2 === 0) {
                    throw new Error(`Divisão por zero no índice ${i}`);
                }
                this.interpreter.vectorRegisters[vdest][i] = val1 / val2;
            }
            this.interpreter.updateOutput(`VDIV ${vdest} = [${Array.from(this.interpreter.vectorRegisters[vdest]).map(x => x.toFixed(2))}]`);
        } catch (error) {
            throw new Error(`Erro em VDIV: ${error.message}`);
        }
    }

    

    vload(args) {
        const [vdest, memAddr] = args;
        try {
            const addr = parseInt(memAddr.replace(/[\[\]]/g, ''));
            if (isNaN(addr) || addr < 0 || addr > this.interpreter.memory.length - 4) {
                throw new Error(`Endereço de memória inválido: ${memAddr}`);
            }
    
            for (let i = 0; i < 4; i++) {
                const value = this.ensureNumber(this.interpreter.memory[addr + i]);
                this.interpreter.vectorRegisters[vdest][i] = value;
            }
            this.interpreter.updateOutput(`VLOAD ${vdest} = [${Array.from(this.interpreter.vectorRegisters[vdest]).map(x => x.toFixed(2))}]`);
        } catch (error) {
            throw new Error(`Erro em VLOAD: ${error.message}`);
        }
        this.interpreter.updateMemoryUI();
    }

    vstore(args) {
        const [vsrc, memAddr] = args;
        try {
            const addr = parseInt(memAddr.replace(/[\[\]]/g, ''));
            if (isNaN(addr) || addr < 0 || addr > this.interpreter.memory.length - 4) {
                throw new Error(`Endereço de memória inválido: ${memAddr}`);
            }

            for (let i = 0; i < 4; i++) {
                const value = this.ensureNumber(this.interpreter.vectorRegisters[vsrc][i]);
                this.interpreter.memory[addr + i] = value;
            }
                        this.interpreter.updateOutput(`VSTORE ${vsrc} para memória em ${addr}`);
        } catch (error) {
            throw new Error(`Erro em VSTORE: ${error.message}`);
        }
        this.interpreter.updateMemoryUI();
    }
}

export default SIMDInstructions;