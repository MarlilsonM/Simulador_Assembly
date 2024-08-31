class Interpreter {
    constructor() {
        this.memory = [];
        this.registers = {
            A: 0, // Registrador A
            B: 0, // Registrador B
            C: 0, // Registrador C
            D: 0  // Registrador D
        };
        this.currentInstruction = 0;
        this.running = false;
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

        const line = this.memory[this.currentInstruction].trim();
        const [instruction, ...args] = line.split(' ');

        switch (instruction.toUpperCase()) {
            case 'ADD':
                this.add(args);
                break;
            case 'SUB':
                this.sub(args);
                break;
            case 'MUL':
                this.mul(args);
                break;
            case 'DIV':
                this.div(args);
                break;
            case 'AND':
                this.and(args);
                break;
            case 'OR':
                this.or(args);
                break;
            case 'NOT':
                this.not(args);
                break;
            // Adicione outras intruções conforme necessário.
            default:
                console.error(`Instrução desconhecida: ${instruction}`);
        }
        // Implementar lógica de execução da instrução
        console.log('Executing:', instruction);
        this.currentInstruction++;
    }

    add(args) {
        const [dest, src] = args;
        this.registers[dest] += this.registers[src];
        console.log(`ADD ${dest}, ${src}: ${this.registers[dest]}`);
    }

    sub(args) {
        const [dest, src] = args;
        this.registers[dest] -= this.registers[src];
        console.log(`SUB ${dest}, ${src}: ${this.registers[dest]}`);
    }

    mul(args) {
        const [dest, src] = args;
        this.registers[dest] *= this.registers[src];
        console.log(`MUL ${dest}, ${src}: ${this.registers[dest]}`);
    }

    div(args) {
        const [dest, src] = args;
        this.registers[dest] /= this.registers[src];
        console.log(`DIV ${dest}, ${src}: ${this.registers[dest]}`);
    }

    and(args) {
        const [dest, src] = args;
        this.registers[dest] &= this.registers[src];
        console.log(`AND ${dest}, ${src}: ${this.registers[dest]}`);
    }

    or(args) {
        const [dest, src] = args;
        this.registers[dest] |= this.registers[src];
        console.log(`OR ${dest}, ${src}: ${this.registers[dest]}`);
    }

    not(args) {
        const [dest] = args;
        this.registers[dest] = ~this.registers[dest];
        console.log(`NOT ${dest}: ${this.registers[dest]}`);
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
        this.registers = {
            A: 0,
            B: 0,
            C: 0,
            D: 0
        };
        this.currentInstruction = 0;
        this.running = false;
    }
}

window.interpreter = new Interpreter();
