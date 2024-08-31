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
        const argStr = instructionParts[2];
        const args = argStr ? argStr.split(',').map(arg => arg.trim()) : [];
    
        switch (instruction) {
            case 'MOV':
                this.mov(args);
                break;
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
            case 'JMP':
                this.jmp(args);
                break;
            case 'CMP':
                this.cmp(args);
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
            default:
                console.error(`Instrução desconhecida: ${instruction}`);
        }
    
        if (!instruction.startsWith('J')) {
            this.currentInstruction++;
        }
    
        console.log('Executing:', instruction);
    }

    mov(args) {
        if (args.length < 2) {
            console.error('MOV falhou: argumentos insuficientes.');
            return;
        }
    
        const [dest, src] = args;
    
        // Verificação se src é número ou registrador
        if (isNaN(parseInt(src, 10))) {
            if (this.registers[src] !== undefined) {
                this.registers[dest] = this.registers[src];
            } else {
                console.error(`Erro: Registrador ${src} não encontrado`);
            }
        } else {
            this.registers[dest] = parseInt(src, 10);
        }
    
        console.log(`MOV ${dest}, ${src}: ${this.registers[dest]}`);
    }

    add(args) {
        const [dest, src] = args;
        this.registers[dest] += isNaN(parseInt(src, 10)) ? this.registers[src] : parseInt(src, 10);
        console.log(`ADD ${dest}, ${src}: ${this.registers[dest]}`);
    }

    sub(args) {
        const [dest, src] = args;
        this.registers[dest] -= isNaN(parseInt(src, 10)) ? this.registers[src] : parseInt(src, 10);
        console.log(`SUB ${dest}, ${src}: ${this.registers[dest]}`);
    }

    mul(args) {
        const [dest, src] = args;
        this.registers[dest] *= isNaN(parseInt(src, 10)) ? this.registers[src] : parseInt(src, 10);
        console.log(`MUL ${dest}, ${src}: ${this.registers[dest]}`);
    }

    div(args) {
        const [dest, src] = args;
        this.registers[dest] /= isNaN(parseInt(src, 10)) ? this.registers[src] : parseInt(src, 10);
        console.log(`DIV ${dest}, ${src}: ${this.registers[dest]}`);
    }

    and(args) {
        const [dest, src] = args;
        this.registers[dest] &= isNaN(parseInt(src, 10)) ? this.registers[src] : parseInt(src, 10);
        console.log(`AND ${dest}, ${src}: ${this.registers[dest]}`);
    }

    or(args) {
        const [dest, src] = args;
        this.registers[dest] |= isNaN(parseInt(src, 10)) ? this.registers[src] : parseInt(src, 10);
        console.log(`OR ${dest}, ${src}: ${this.registers[dest]}`);
    }

    not(args) {
        const [dest] = args;
        this.registers[dest] = ~this.registers[dest];
        console.log(`NOT ${dest}: ${this.registers[dest]}`);
    }

    cmp(args) {
        const [reg1, reg2] = args;
        this.registers['CMP'] = this.registers[reg1] - this.registers[reg2];
        console.log(`CMP ${reg1}, ${reg2}: ${this.registers['CMP']}`);
    }

    jmp(args) {
        const [label] = args;
    
        // Garantir que a etiqueta esteja corretamente formatada e buscada
        const index = this.memory.findIndex(line => {
            const trimmedLine = line.trim();
            return trimmedLine === `${label}:`;
        });
    
        if (index !== -1) {
            this.currentInstruction = index;
        } else {
            console.error(`Etiqueta ${label} não encontrada`);
        }
    }    

    je(args) {
        if (this.registers['CMP'] === 0) {
            this.jmp(args);
        } else {
            this.currentInstruction++;
        }
    }

    jne(args) {
        if (this.registers['CMP'] !== 0) {
            this.jmp(args);
        } else {
            this.currentInstruction++;
        }
    }

    jg(args) {
        if (this.registers['CMP'] > 0) {
            this.jmp(args);
        } else {
            this.currentInstruction++;
        }
    }

    jl(args) {
        if (this.registers['CMP'] < 0) {
            this.jmp(args);
        } else {
            this.currentInstruction++;
        }
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