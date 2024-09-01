class LogicalInstructions {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    jmp(args) {
        const [label] = args;
        console.log(`Tentando pular para a etiqueta: "${label}"`);
    
        if (!this.interpreter.memory) {
            console.error('Memória não foi inicializada.');
            return;
        }
    
        // Log detalhado do conteúdo da memória
        console.log('Memória completa:', JSON.stringify(this.interpreter.memory, null, 2));
    
        // Busca pela etiqueta ignorando tudo após o nome da etiqueta
        const index = this.interpreter.memory.findIndex((line, idx) => {
            const originalLine = line;  // Linha original da memória
            const normalizedLine = line.split(':')[0].trim(); // Mantém apenas a etiqueta antes dos ':'
            const comparisonResult = normalizedLine === label;
    
            // Log detalhado para cada linha comparada
            console.log(`Linha ${idx + 1}:`);
            console.log(`Original: "${originalLine}"`);
            console.log(`Normalizada: "${normalizedLine}"`);
            console.log(`Comparando com: "${label}"`);
            console.log(`Resultado da comparação: ${comparisonResult ? 'MATCH' : 'NO MATCH'}`);
    
            return comparisonResult;
        });
    
        if (index !== -1) {
            this.interpreter.currentInstruction = index;
            console.log(`Salto para a etiqueta: "${label}" na linha ${index + 1}`);
        } else {
            console.error(`Etiqueta "${label}" não encontrada. Verifique se o label está correto e existe no código.`);
        }
    }          

    je(args) {
        console.log('Executando JE, CMP:', this.interpreter.registers['CMP']);
        if (this.interpreter.registers['CMP'] === 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
            console.log('JE falhou, indo para a próxima instrução:', this.interpreter.currentInstruction + 1);
        }
    }

    jne(args) {
        console.log('Executando JNE, CMP:', this.interpreter.registers['CMP']);
        if (this.interpreter.registers['CMP'] !== 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
            console.log('JNE falhou, indo para a próxima instrução:', this.interpreter.currentInstruction + 1);
        }
    }

    jg(args) {
        console.log('Executando JG, CMP:', this.interpreter.registers['CMP']);
        if (this.interpreter.registers['CMP'] > 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
            console.log('JG falhou, indo para a próxima instrução:', this.interpreter.currentInstruction + 1);
        }
    }

    jl(args) {
        console.log('Executando JL, CMP:', this.interpreter.registers['CMP']);
        if (this.interpreter.registers['CMP'] < 0) {
            this.jmp(args);
        } else {
            this.interpreter.currentInstruction++;
            console.log('JL falhou, indo para a próxima instrução:', this.interpreter.currentInstruction + 1);
        }
    }

    call(args) {
        const [label] = args;
        const returnAddress = this.interpreter.currentInstruction + 1;
    
        console.log(`Registradores antes de CALL: SP=${this.interpreter.registers['SP']}`);
        if (this.interpreter.registers['SP'] > 0) {
            this.interpreter.registers['SP']--;  // Decrementa o ponteiro de pilha corretamente
            this.interpreter.memory[this.interpreter.registers['SP']] = returnAddress;  // Salva o endereço de retorno na pilha
            console.log(`CALL para ${label}, retornará para a linha ${returnAddress}, memória após CALL:`, this.interpreter.memory);
            this.jmp([label]);  // Salta para a sub-rotina
        } else {
            console.error('Stack Overflow: Não é possível fazer o CALL, SP já está no início da memória.');
        }
    }

    ret() {
        console.log(`Registradores antes de RET: SP=${this.interpreter.registers['SP']}`);
    
        if (this.interpreter.registers['SP'] < 1000) {  // Limita a recuperação dentro do tamanho da pilha
            const returnAddress = this.interpreter.memory[this.interpreter.registers['SP']];  // Recupera o endereço de retorno da pilha
            this.interpreter.registers['SP']++;  // Incrementa o ponteiro de pilha
            console.log(`RET, retornando para a linha ${returnAddress}, memória após RET:`, this.interpreter.memory);
            if (typeof returnAddress === 'number' && !isNaN(returnAddress)) {
                this.interpreter.currentInstruction = returnAddress;  // Define a próxima instrução a ser executada
            } else {
                console.error('Endereço de retorno inválido ou não numérico:', returnAddress);
            }
        } else {
            console.error('Stack Underflow: Não é possível fazer o RET, SP está fora dos limites.');
        }
    }

    execute(instruction, args) {
        console.log(`Executando instrução: ${instruction} com argumentos: ${args}`);
        switch (instruction.toUpperCase()) {
            case 'JMP':
                this.jmp(args);
                break;
            case 'JE':
                this.je(args);
                break;
            case 'JNE':
                this.jne(args);
                break;
            case 'JG':
                this.jg(args);
                break;
            case 'JL':
                this.jl(args);
                break;
            case 'CALL':
                this.call(args);
                break;
            case 'RET':
                this.ret();
                break;
            default:
                console.error(`Instrução lógica desconhecida: ${instruction}`);
        }
    }
}

export default LogicalInstructions;