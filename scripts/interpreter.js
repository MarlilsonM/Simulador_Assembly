import ArithmeticInstructions from './arithmeticInstructions.js';
import LogicalInstructions from './logicalInstructions.js';

class Interpreter {
    constructor(bitWidth = 8) {
        this.setBitWidth(bitWidth);
        this.memory = [];
        this.currentInstruction = 0;
        this.running = false;

        // Carregar os módulos de instruções
        this.instructions = {
            arithmetic: new ArithmeticInstructions(this),
            logical: new LogicalInstructions(this),
            // Outros conjuntos de instruções podem ser adicionados aqui no futuro
        };
    }

    setBitWidth(bitWidth) {
        this.bitWidth = bitWidth;
        this.maxValue = (1 << bitWidth) - 1;  // Valor máximo permitido pela largura de bits

        // Reconfigurar os registradores com base na nova largura de bits
        this.registers = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            CMP: 0  // Usado para comparações
        };
    }

    loadProgram(program) {
        // Carrega e tokeniza o programa Assembly
        this.memory = program.split('\n');
        this.currentInstruction = 0;
    }

    executeStep() {
        if (this.currentInstruction >= this.memory.length) {
            this.running = false;
            return;
        }

        if (window.debugger.shouldPause()) {
            this.running = false;
            console.log(`Breakpoint at line ${this.currentInstruction + 1}`);
            return;
        }
    
        const line = this.memory[this.currentInstruction].trim();

        if (line.endsWith(':')) {
            this.currentInstruction++;
            return;
        }
        
        const instructionParts = line.match(/^(\w+)\s*(.*)$/);
        if (!instructionParts) {
            console.error(`Erro na linha ${this.currentInstruction + 1}: ${line}`);
            this.currentInstruction++;
            return;
        }
        
        const instruction = instructionParts[1].toUpperCase();
        const args = instructionParts[2] ? instructionParts[2].split(',').map(arg => arg.trim()) : [];

        // Delegar a execução para o módulo apropriado
        for (let key in this.instructions) {
            if (this.instructions[key][instruction.toLowerCase()]) {
                this.instructions[key][instruction.toLowerCase()](args);
                break;
            }
        }
    
        if (!instruction.startsWith('J')) {
            this.currentInstruction++;
        }
    
        console.log('Executing:', instruction);
        window.debugger.updatePanel();
        window.visualization.updateVisualization();
    }

    run(speed) {
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
        this.setBitWidth(this.bitWidth);  // Reconfigurar os registradores ao resetar
        this.currentInstruction = 0;
        this.running = false;
    }
}

window.interpreter = new Interpreter();  // Inicializa com a largura de bits padrão (8 bits)

export default Interpreter;