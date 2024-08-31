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
            D: 0 
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
            this.running = false;
            console.warn('Tentativa de acessar uma linha fora dos limites da memória.');
            return;
        }

        // Verifica se há um breakpoint na linha atual
        if (this.debugger && this.debugger.shouldPause()) {
            this.running = false;
            console.log(`Breakpoint na linha: ${this.currentInstruction + 1}`);
            return; // Pausa a execução no breakpoint
        }
    
        const line = this.memory[this.currentInstruction].trim();

        // Verificar se a linha é uma etiqueta e ignorá-la
        if (line.endsWith(':')) {
            this.currentInstruction++;
            return; // Não tenta executar uma etiqueta
        }
        
        // Separar a instrução dos argumentos
        const instructionParts = line.match(/^(\w+)\s*(.*)$/);
        if (!instructionParts) {
            console.error(`Erro na linha ${this.currentInstruction + 1}: ${line}`);
            this.currentInstruction++;
            return;
        }
        
        const instruction = instructionParts[1].toUpperCase();
        const args = instructionParts[2].split(',').map(arg => arg.trim());

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
            default:
                console.error(`Instrução desconhecida: ${instruction}`);
        }

        if (!instruction.startsWith('J')) {
            this.currentInstruction++;
        }

        console.log('Executando linha', this.currentInstruction + 1);

        if (this.debugger) {
            this.debugger.updatePanel();  // Chamar updatePanel apenas se o Debugger estiver definido
        }

        
        if (window.visualization) {
            window.visualization.updateVisualization();  // Chamar updateVisualization apenas se visualization estiver definido
        }

        this.currentInstruction++;
        console.log(`Executando linha ${this.currentInstruction + 1}`);
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
            D: 0
        };
        this.currentInstruction = 0;
        this.running = false;
        console.log('Sistema resetado.');
    }
}

export default Interpreter;