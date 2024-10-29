import ArithmeticInstructions from './arithmeticInstructions.js';
import LogicalInstructions from './logicalInstructions.js';
import DataMovementInstructions from './dataMovementInstructions.js';
import StackInstructions from './stackInstructions.js';

class Interpreter {
    constructor() {
        this.memory = [];
        this.registers = {
            r0: 0,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0,
            r5: 0,
            r6: 0,
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
        this.stack = new StackInstructions(this);
    }

    updateRegistersUI(registers) {
        // Verifica se os elementos HTML existem antes de atualizar
        const regr0Element = document.getElementById('reg-r0');
        const regr1Element = document.getElementById('reg-r1');
        const regr2Element = document.getElementById('reg-r2');
        const regr3Element = document.getElementById('reg-r3');
        const regr4Element = document.getElementById('reg-r4');
        const regr5Element = document.getElementById('reg-r5');
        const regr6Element = document.getElementById('reg-r6');
        const regSPElement = document.getElementById('reg-SP');
        const flagZElement = document.getElementById('flag-Z');
        const flagFElement = document.getElementById('flag-F');

        if (!regr0Element || !regr1Element || !regr2Element || !regr3Element  || !regr4Element  || !regr5Element  || !regr6Element || !regSPElement || !flagZElement || !flagFElement) {
            console.error("Erro: Um ou mais elementos do DOM não foram encontrados.");
            return;
        }

        regr0Element.textContent = this.registers.r0.toString(16).padStart(2, '0').toUpperCase();
        regr1Element.textContent = this.registers.r1.toString(16).padStart(2, '0').toUpperCase();
        regr2Element.textContent = this.registers.r2.toString(16).padStart(2, '0').toUpperCase();
        regr3Element.textContent = this.registers.r3.toString(16).padStart(2, '0').toUpperCase();
        regr4Element.textContent = this.registers.r4.toString(16).padStart(2, '0').toUpperCase();
        regr5Element.textContent = this.registers.r5.toString(16).padStart(2, '0').toUpperCase();
        regr6Element.textContent = this.registers.r6.toString(16).padStart(2, '0').toUpperCase();
        regSPElement.textContent = this.registers.SP.toString(16).padStart(2, '0').toUpperCase();
        flagZElement.textContent = this.registers.FLAGS === 0 ? 'TRUE' : 'FALSE';
        flagFElement.textContent = this.registers.FLAG ? 'TRUE' : 'FALSE';
    }

    setBitWidth(bitWidth) {
        this.bitWidth = bitWidth;
        this.maxValue = (1 << bitWidth) - 1; // Calcula o valor máximo para a largura de bits
    }

    loadProgram(program) {
        this.memory = program.split('\n').map(line => line.trim()).filter(line => line !== '');
        this.currentInstruction = 0;
        this.labels = this.parseLabels();  // Processar labels no código
        if (this.memory.length === 0) {
            console.warn('Nenhum código carregado. Por favor, carregue um programa antes de executar.');
        } else {
            console.log('Programa carregado:', this.memory);
        }
    }

    updateOutput(message) {
        const outputElement = document.getElementById('program-output');
        outputElement.textContent += message + '\n'; // Adiciona a mensagem e pula para a próxima linha
    }

    parseLabels() {
        const labels = {};
        this.memory.forEach((line, index) => {
            const labelMatch = line.match(/^(\w+):\s*(.*)$/);
            if (labelMatch) {
                const label = labelMatch[1];
                labels[label] = index;  // Associa a label à linha correspondente
                // Substitui a linha com apenas a instrução, se houver
                if (labelMatch[2].trim()) {
                    this.memory[index] = labelMatch[2].trim();
                } else {
                    this.memory[index] = 'NOP'; // Define uma NOP se não houver instrução após a label
                }
            }
        });
        console.log("Labels detectadas e posições:", labels);
        return labels;
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

        // Verifica se a linha é válida
        if (typeof line !== 'string' || line.trim() === '') {
            console.error(`Erro ao acessar linha ${this.currentInstruction + 1}: valor inválido ou indefinido.`);
            this.running = false; // Finaliza a execução para evitar loops infinitos
            return;
        }

        // Verifica se a linha contém uma etiqueta de fim
        if (line.trim().toLowerCase() === 'end:') {
            console.log("Execução finalizada: Etiqueta 'end' encontrada.");
            this.running = false;
            return;
        }

        // Verifica se a linha é a instrução END
        if (line.trim().toUpperCase() === 'END') {
            console.log("Execução finalizada: Instrução 'END' encontrada.");
            this.running = false;
            return;
        }

        // Adicione esta verificação logo após pegar a linha da memória
        if (typeof line !== 'string' || line.trim() === '') {
            console.error(`Erro ao acessar linha ${this.currentInstruction + 1}: valor inválido ou indefinido.`);
            this.running = false; // Finaliza a execução para evitar loops infinitos
            return;
        }
    
        // Verifica se atingiu o marcador de fim de programa
        if (line === 'END_OF_PROGRAM') {
            console.log("Execução finalizada: Fim do programa alcançado.");
            this.running = false;
            return;
        }
    
        // Verifica se a linha é válida antes de aplicar trim
        if (typeof line !== 'string' || line.trim() === '' || line.trim().startsWith(';')) {
            console.warn(`Ignorando linha ${this.currentInstruction + 1}: "${line}" (linha de comentário ou vazia).`);
            this.currentInstruction++;
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
                this.updateOutput(`Instrução ${instruction} executada com argumentos: ${args.join(', ')}`);
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
                this.updateOutput(`Instrução ${instruction} executada com resultado no registrador ${args[0]}: ${this.registers[args[0]]}`);
                break;
            case 'JMP':
            case 'JE':
            case 'JNE':
            case 'JG':
            case 'JL':
            case 'CALL':
            case 'RET':
                if (this.labels.hasOwnProperty(args[0])) {
                    this.currentInstruction = this.labels[args[0]];
                    this.updateOutput(`Salto para a etiqueta ${args[0]}, nova linha: ${this.currentInstruction + 1}`);
                } else {
                    console.error(`Etiqueta ${args[0]} não encontrada.`);
                    this.updateOutput(`Erro: Etiqueta ${args[0]} não encontrada.`);
                    this.running = false;
                }
                break;
            case 'PUSH':
            case 'POP':
                this.stack.execute(instruction, args);
                this.updateOutput(`Instrução de pilha ${instruction} executada com argumentos: ${args.join(', ')}`);
                break;
            case 'NOP':
                console.log("NOP: Nenhuma operação realizada");
                this.updateOutput("NOP: Nenhuma operação realizada");
                this.currentInstruction++;
                break;
            default:
                console.error(`Instrução desconhecida: ${instruction}`);
                this.updateOutput(`Erro: Instrução desconhecida "${instruction}"`);
                this.currentInstruction++;
        }

        // Incrementa a linha apenas se a instrução não for de controle de fluxo (JMP, JE, etc.)
        if (!['JMP', 'JE', 'JNE', 'JG', 'JL', 'CALL', 'RET'].includes(instruction)) {
            this.currentInstruction++;
        }

        this.updateRegistersUI(); // Atualiza os registradores na UI
    
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
            r0: 0,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0,
            r5: 0,
            r6: 0,
            SP: 0, // Stack Pointer
            PC: 0, // Program Counter
            FLAGS: 0 // Flags
        };
        this.currentInstruction = 0;
        this.running = false;
        this.updateRegistersUI();
        this.clearMemoryUI();
        this.clearOutput();
    }


    clearMemoryUI() {
        const memoryElement = document.getElementById('memory-content');
        if (memoryElement) {
            memoryElement.innerHTML = ''; // Limpa o conteúdo da memória na UI
        }
    }

    clearOutput() {
        const outputElement = document.getElementById('program-output');
        if (outputElement) {
            outputElement.textContent = ''; // Limpa a saída do programa na UI
        }
    }
}

export default Interpreter;