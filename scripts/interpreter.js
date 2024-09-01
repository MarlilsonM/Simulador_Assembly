import ArithmeticInstructions from './arithmeticInstructions.js';
import LogicalInstructions from './logicalInstructions.js';
import DataMovementInstructions from './dataMovementInstructions.js';
import BitManipulationInstructions from './bitManipulationInstructions.js';
import StackInstructions from './stackInstructions.js';

class Interpreter {
    constructor() {
        this.memory = [];
        this.registers = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            SP: 0, // Stack Pointer (ponteiro da pilha)
            PC: 0, // Program Counter (contador de programa)
            FLAGS: 0 // Registrador de flags para armazenar resultados de comparações e condições
        };
        this.currentInstruction = 0;
        this.running = false;
        this.bitWidth = 8; // Padrão para 8 bits

        // Instâncias dos módulos de instruções
        this.arithmetic = new ArithmeticInstructions(this);
        this.logical = new LogicalInstructions(this);
        this.dataMovement = new DataMovementInstructions(this);
        this.bitManipulation = new BitManipulationInstructions(this);
        this.stack = new StackInstructions(this);
    }

    setBitWidth(bitWidth) {
        this.bitWidth = bitWidth;
        this.maxValue = (1 << bitWidth) - 1; // Calcula o valor máximo para a largura de bits
    }

    loadProgram(program) {
        // Carrega e tokeniza o programa Assembly
        this.memory = program.split('\n').map(line => line.trim()).filter(line => line !== '');
    
        // Adiciona um marcador de fim de programa
        this.memory.push('END_OF_PROGRAM'); 
    
        this.currentInstruction = 0;
        if (this.memory.length === 0) {
            console.warn('Nenhum código carregado. Por favor, carregue um programa antes de executar.');
        } else {
            console.log('Programa carregado:', this.memory);
        }
    }

    executeStep() {
        if (!this.memory || this.memory.length === 0) {
            console.warn('Nenhum código carregado. Por favor, carregue um programa antes de executar.');
            return;
        }
    
        if (this.currentInstruction >= this.memory.length) {
            console.warn('Tentativa de acessar uma linha fora dos limites da memória.');
            this.running = false;
            return;
        }
    
        let line = this.memory[this.currentInstruction];
    
        // Verifica se atingiu o marcador de fim de programa
        if (line === 'END_OF_PROGRAM') {
            console.log("Execução finalizada: Fim do programa alcançado.");
            this.running = false;
            return;
        }
    
        // Verifica se a linha é válida antes de aplicar trim
        if (typeof line !== 'string' || line === '') {
            console.error(`Erro ao acessar linha ${this.currentInstruction + 1}: valor inválido ou indefinido.`);
            this.running = false; // Finaliza a execução para evitar loops infinitos
            return;
        }
    
        // Remove espaços em branco desnecessários
        line = line.trim();
        const [instructionPart] = line.split(';');  // Ignora tudo após ';' como comentário
        const instructionParts = instructionPart.match(/^(\w+)\s*(.*)$/);
    
        if (!instructionParts) {
            console.error(`Erro na linha ${this.currentInstruction + 1}: "${line}"`);
            this.running = false;
            return;
        }
    
        const instruction = instructionParts[1].toUpperCase();
        const args = instructionParts[2].split(',').map(arg => arg.trim());
    
        console.log(`Executando instrução: ${instruction} com argumentos: ${args} na linha ${this.currentInstruction + 1}`);
    
        switch (instruction) {
            case 'MOV':
            case 'LOAD':
            case 'STORE':
                this.dataMovement.execute(instruction, args);
                break;
            case 'ADD':
            case 'SUB':
            case 'MUL':
            case 'DIV':
            case 'AND':
            case 'OR':
            case 'XOR':
            case 'NOT':
            case 'CMP':
                this.arithmetic.execute(instruction, args);
                break;
            case 'JMP':
            case 'JE':
            case 'JNE':
            case 'JG':
            case 'JL':
            case 'CALL':
            case 'RET':
                this.logical.execute(instruction, args);
                break;
            case 'SHL':
            case 'SHR':
            case 'ROL':
            case 'ROR':
                this.bitManipulation.execute(instruction, args);
                break;
            case 'PUSH':
            case 'POP':
                this.stack.execute(instruction, args);
                break;
            case 'NOP':
                console.log("NOP: Nenhuma operação realizada");
                break;
            default:
                console.error(`Instrução desconhecida: ${instruction}`);
        }
    
        // Incrementa a linha apenas se a instrução não for de controle de fluxo (JMP, JE, etc.)
        if (!['JMP', 'JE', 'JNE', 'JG', 'JL', 'CALL', 'RET'].includes(instruction)) {
            this.currentInstruction++;
        }
    
        // Verifica se a execução atingiu o final do código e para a execução
        if (this.currentInstruction >= this.memory.length) {
            this.running = false;  // Finaliza a execução se a última instrução foi processada
            console.log("Execução finalizada, última linha alcançada.");
        }
    
        // Adicionando log para verificar o estado da memória e dos registradores após a execução
        console.log("Estado da memória após execução:", this.memory);
        console.log("Estado dos registradores após execução:", this.registers);
    
        // Atualiza painel de debug
        if (this.debugger) {
            this.debugger.updatePanel();
        }
    
        // Atualiza visualização
        if (window.visualization) {
            window.visualization.updateVisualization();
        }
    }
    
    run(speed) {
        if (!this.memory || this.memory.length === 0) {
            console.warn('Nenhum código carregado. Por favor, carregue um programa antes de executar.');
            return;
        }

        this.running = true;
        const interval = speed === 'fast' ? 100 : speed === 'medium' ? 500 : 1000;
        const intervalId = setInterval(() => {
            if (!this.running) {
                clearInterval(intervalId);
                return;
            }
            this.executeStep();
        }, interval);
    }

    stop() {
        this.running = false;
    }

    reset() {
        this.memory = [];
        this.registers = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            SP: 0, // Stack Pointer
            PC: 0, // Program Counter
            FLAGS: 0 // Flags
        };
        this.currentInstruction = 0;
        this.running = false;
    }
}

export default Interpreter;