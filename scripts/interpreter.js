import ArithmeticInstructions from './arithmeticInstructions.js';
import LogicalInstructions from './logicalInstructions.js';
import DataMovementInstructions from './dataMovementInstructions.js';
import StackInstructions from './stackInstructions.js';
import SIMDInstructions from './simdInstructions.js';

class Interpreter {
    constructor() {
        this.memory = new Array(1000).fill(0);
        this.registers = {
            r0: 0,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0,
            r5: 0,
            r6: 0,
            SP: 999, // Stack Pointer (ponteiro da pilha)
            PC: 0, // Program Counter (contador de programa)
            FLAGS: 0, // Registrador de flags para armazenar resultados de comparações e condições
            FLAG: false
        };

        this.vectorRegisters = {
            v0: new Float32Array(4),
            v1: new Float32Array(4),
            v2: new Float32Array(4),
            v3: new Float32Array(4)
        };


        this.STACK_LIMIT = 100;
        this.currentInstruction = 0;
        this.running = false;
        this.bitWidth = 8; // Padrão para 8 bits

        // Instâncias dos módulos de instruções
        this.arithmetic = new ArithmeticInstructions(this);
        this.logical = new LogicalInstructions(this);
        this.dataMovement = new DataMovementInstructions(this);
        this.stack = new StackInstructions(this);
        this.simd = new SIMDInstructions(this);
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

        if (!regr0Element || !regr1Element || !regr2Element || !regr3Element || 
            !regr4Element || !regr5Element || !regr6Element || !regSPElement || 
            !flagZElement || !flagFElement) {
                        return;
        }

        // Garante que os valores dos registradores sejam números antes de converter
        regr0Element.textContent = (this.registers.r0 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr1Element.textContent = (this.registers.r1 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr2Element.textContent = (this.registers.r2 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr3Element.textContent = (this.registers.r3 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr4Element.textContent = (this.registers.r4 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr5Element.textContent = (this.registers.r5 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr6Element.textContent = (this.registers.r6 || 0).toString(16).padStart(2, '0').toUpperCase();
        regSPElement.textContent = (this.registers.SP || 0).toString(16).padStart(2, '0').toUpperCase();
        
        // Atualiza as flags
        flagZElement.textContent = this.registers.FLAGS === 0 ? 'TRUE' : 'FALSE';
        flagFElement.textContent = this.registers.FLAG ? 'TRUE' : 'FALSE';

        for (let i = 0; i < 4; i++) {
            const vregElement = document.getElementById(`vreg-v${i}`);
            if (vregElement) {
                const values = this.vectorRegisters[`v${i}`];
                vregElement.innerHTML = `
                    <table class="vector-register">
                        <tr>
                            <td>${values[0].toFixed(2)}</td>
                            <td>${values[1].toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>${values[2].toFixed(2)}</td>
                            <td>${values[3].toFixed(2)}</td>
                        </tr>
                    </table>
                `;
            }
        }

    }

    updateMemoryUI() {
        const instructionsContent = document.getElementById('instructions-content');
        const dataContent = document.getElementById('data-content');
    
        if (instructionsContent && dataContent) {
            // Seção de Instruções
            let instructionsHtml = '';
            for (let i = 0; i < this.programLength; i++) {
                const instruction = this.memory[i];
                if (instruction === 'END' || instruction === 'END:' || 
                    instruction === '.END' || instruction === 'HALT') {
                    instructionsHtml += `<div class="instruction-line"><span class="line-number">[${i}]</span> <span class="instruction end">${instruction}</span></div>`;
                    break;
                }
                const parts = instruction.split(' ');
                const opcode = parts[0];
                const args = parts.slice(1).join(' ');
                instructionsHtml += `<div class="instruction-line"><span class="line-number">[${i}]</span> <span class="instruction"><span class="opcode">${opcode}</span> <span class="args">${args}</span></span></div>`;
            }
            instructionsContent.innerHTML = instructionsHtml;
    
            // Seção de Dados
            let dataHtml = '';
            let hasData = false;
            for (let i = this.programLength; i < this.memory.length; i++) {
                if (this.memory[i] !== 0 && this.memory[i] !== '0') {
                    dataHtml += `<div class="data-line"><span class="line-number">[${i}]</span> <span class="data-value">${this.memory[i]}</span></div>`;
                    hasData = true;
                }
            }
            if (!hasData) {
                dataHtml = '<div class="data-line">(Sem dados)</div>';
            }
            dataContent.innerHTML = dataHtml;
        }
    }

    setBitWidth(bitWidth) {
        this.bitWidth = bitWidth;
        this.maxValue = (1 << bitWidth) - 1; // Calcula o valor máximo para a largura de bits
    }

    loadProgram(program) {
        if (!program || program.trim() === '') {
                        return;
        }
        
        // Reset inicial
        this.reset();
        
        // Carrega o novo programa, removendo comentários e linhas vazias
        const lines = program.split('\n')
            .map(line => line.split(';')[0].trim())
            .filter(line => line !== '' && line !== '0');
        
        this.programLength = lines.length;
        
        // Armazena as linhas do programa no início da memória
        lines.forEach((line, index) => {
            this.memory[index] = line;
        });
        
        this.labels = this.parseLabels(this.programLength);
        this.updateMemoryUI();
    }

    updateOutput(message, type = 'info') {
        const outputContent = document.querySelector('.output-content');
        const outputElement = document.getElementById('program-output');
        if (!outputContent || !outputElement) return;
    
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        
        const messageElement = document.createElement('div');
        messageElement.className = `output-message ${type}`;
        messageElement.textContent = formattedMessage;
        
        outputElement.appendChild(messageElement);
    
        // Scroll para o final do conteúdo
        setTimeout(() => {
            outputContent.scrollTo({
                top: outputContent.scrollHeight,
                behavior: 'smooth'
            });
        }, 0);
    }

    parseLabels(programLength) {
        const labels = {};
        for (let index = 0; index < programLength; index++) {
            const line = this.memory[index];
            if (typeof line === 'string') {
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
            } else {
                            }
        }
        return labels;
    }

    updateStackUI() {
        const stackElement = document.getElementById('memory-content');
        if (stackElement) {
            let stackContent = 'Stack:\n';
            for (let i = this.registers.SP + 1; i < 1000; i++) {
                if (this.memory[i] !== undefined) {
                    stackContent += `[${i}]: ${this.memory[i]}\n`;
                }
            }
            stackElement.textContent = stackContent;
        }
    }

    highlightCurrentLine() {
        if (!window.editor) {
                        return;
        }
    
        // Remove o destaque da linha anterior
        if (this.lastHighlightedLine !== undefined) {
            try {
                window.editor.removeLineClass(this.lastHighlightedLine, 'background', 'highlighted-line');
            } catch (error) {
                            }
        }
    
        // Adiciona destaque à linha atual
        if (this.currentInstruction < this.memory.length) {
            try {
                window.editor.addLineClass(this.currentInstruction, 'background', 'highlighted-line');
                this.lastHighlightedLine = this.currentInstruction;
            } catch (error) {
                            }
        }
    }

    clearHighlight() {
        if (this.lastHighlightedLine !== undefined && window.editor) {
            try {
                window.editor.removeLineClass(this.lastHighlightedLine, 'background', 'highlighted-line');
                this.lastHighlightedLine = undefined;
            } catch (error) {
                            }
        }
    }

    updateUI(options = { registers: true, memory: true, stack: true }) {
        if (options.registers) this.updateRegistersUI();
        if (options.memory) this.updateMemoryUI();
        if (options.stack) this.updateStackUI();
        
        if (window.visualization) window.visualization.updateVisualization();
    }

    executeStep() {
        if (!this.memory || this.programLength === 0) {
            this.updateOutput("Nenhum programa carregado.", "warning");
            return false;
        }

        if (this.debugger && this.debugger.hasBreakpoint(this.currentInstruction)) {
            this.stop();
            this.updateOutput("Breakpoint encontrado na linha " + (this.currentInstruction + 1), "info");
            return false;
        }

        if (!this.memory || this.programLength === 0) {
                        return false;
        }
    
        const currentLine = this.memory[this.currentInstruction];
    
        if (this.currentInstruction >= this.programLength) {
                        this.stop();
            this.clearHighlight();
            this.updateOutput('Programa finalizado');
            return false;
        }
    
        if (!currentLine || typeof currentLine !== 'string') {
                        this.currentInstruction++;
            return true;
        }
    
        let line = currentLine.split(';')[0].trim();
    
        if (line === '' || this.isEndOfProgram(line)) {
                        this.stop();
            this.clearHighlight();
            this.updateOutput('Programa finalizado');
            return false;
        }
    
        this.highlightCurrentLine();
        this.updateUI();
    
        const instructionRegex = /^(\w+)\s*(.*?)$/;
        const match = line.match(instructionRegex);
        
        if (!match) {
                        this.currentInstruction++;
            return true;
        }
    
        const instruction = match[1].toUpperCase();
        const argsString = match[2].trim();
        const args = argsString
            .split(',')
            .map(arg => arg.trim())
            .filter(arg => arg !== '');
    
        try {
            this.validateArgs(instruction, args);
            this.executeInstruction(instruction, args);
        } catch (error) {
                        this.updateOutput(`Erro: ${error.message}`);
            this.stop();
            return false;
        }
    
        if (!['JMP', 'JE', 'JNE', 'JG', 'JL', 'CALL', 'RET'].includes(instruction)) {
            this.currentInstruction++;
        }

        if (this.currentInstruction >= this.programLength) {
            this.stop();
            this.clearHighlight();
            this.updateOutput('Programa finalizado com sucesso.', 'success');
            return false;
        }

        try {
            this.validateArgs(instruction, args);
            this.executeInstruction(instruction, args);
            this.updateOutput(`Executada instrução: ${instruction} ${args.join(', ')}`, 'info');
        } catch (error) {
            this.updateOutput(`Erro: ${error.message}`, 'error');
            this.stop();
            return false;
        }
    
        this.updateUI();
        this.updateMemoryUI();
        return true;
    }
    
    isEndOfProgram(line) {
        const trimmedLine = line.trim().toUpperCase();
        // Expande a lista de possíveis marcadores de fim de programa
        return ['END:', 'END', 'END_OF_PROGRAM', 'HALT', '.END'].includes(trimmedLine) || 
               trimmedLine.startsWith('END ') || 
               line === '';
    }

    validateArgs(instruction, args) {
        const argCounts = {
            MOV: 2,
            ADD: 2,
            SUB: 2,
            MUL: 2,
            DIV: 2,
            AND: 2,
            OR: 2,
            XOR: 2,
            NOT: 1,
            CMP: 2,
            JMP: 1,
            JE: 1,
            JNE: 1,
            JG: 1,
            JL: 1,
            PUSH: 1,
            POP: 1,
            CALL: 1,
            VADD: 3,
            VMUL: 3,
            VDIV: 3,
            VLOAD: 2,
            VSTORE: 2
        };
        
        if (argCounts[instruction] && args.length !== argCounts[instruction]) {
            const expectedArgs = {
                MOV: "destino, fonte",
                ADD: "destino, fonte",
                SUB: "destino, fonte",
                MUL: "destino, fonte",
                DIV: "destino, fonte",
            };
    
            const expectedFormat = expectedArgs[instruction] || `${argCounts[instruction]} argumentos`;
            throw new Error(
                `Número incorreto de argumentos para ${instruction}.\n` +
                `Esperado: ${argCounts[instruction]} (${expectedFormat})\n` +
                `Recebido: ${args.length} (${args.join(', ')})`
            );
        }
    }
    
    executeInstruction(instruction, args) {
        const instructionMap = {
            MOV: () => this.dataMovement.execute('MOV', args),
            LOAD: () => this.dataMovement.execute('LOAD', args),
            STORE: () => this.dataMovement.execute('STORE', args),
            ADD: () => this.arithmetic.execute('ADD', args),
            SUB: () => this.arithmetic.execute('SUB', args),
            MUL: () => this.arithmetic.execute('MUL', args),
            DIV: () => this.arithmetic.execute('DIV', args),
            AND: () => this.arithmetic.execute('AND', args),
            OR: () => this.arithmetic.execute('OR', args),
            XOR: () => this.arithmetic.execute('XOR', args),
            NOT: () => this.arithmetic.execute('NOT', args),
            CMP: () => this.arithmetic.execute('CMP', args),
            JMP: () => this.logical.execute('JMP', args),
            JE: () => this.logical.execute('JE', args),
            JNE: () => this.logical.execute('JNE', args),
            JG: () => this.logical.execute('JG', args),
            JL: () => this.logical.execute('JL', args),
            CALL: () => this.logical.execute('CALL', args),
            RET: () => this.logical.execute('RET', args),
            PUSH: () => this.stack.execute('PUSH', args),
            POP: () => this.stack.execute('POP', args),
            DUP: () => this.stack.execute('DUP', args),
            SWAP: () => this.stack.execute('SWAP', args),
            ROT: () => this.stack.execute('ROT', args),
            NOP: () => console.log("NOP: Nenhuma operação realizada"),
            VADD: () => this.simd.execute('VADD', args),
            VMUL: () => this.simd.execute('VMUL', args),
            VDIV: () => this.simd.execute('VDIV', args),
            VLOAD: () => this.simd.execute('VLOAD', args),
            VSTORE: () => this.simd.execute('VSTORE', args),
        };
    
        try {
            this.validateArgs(instruction, args);
            const execute = instructionMap[instruction.toUpperCase()];
            if (execute) {
                execute();
                this.updateOutput(`Instrução ${instruction} executada com argumentos: ${args.join(', ')}`);
            } else {
                throw new Error(`Instrução desconhecida: ${instruction}`);
            }
        } catch (error) {
                        this.updateOutput(`Erro: ${error.message}`);
            this.running = false;
        }
    }

    isValidLine(line) {
        if (typeof line !== 'string' || line.trim() === '') {
                        this.running = false;
            return false;
        }
        return true;
    }
    
    run(speed) {
        if (!this.memory || this.programLength === 0) {
                        return false;
        }
    
        this.running = true;
        const interval = speed === 'fast' ? 100 : speed === 'medium' ? 500 : 1000;
        
        const intervalId = setInterval(() => {
            if (!this.running) {
                clearInterval(intervalId);
                return;
            }
            
            if (this.debugger && this.debugger.shouldPause()) {
                this.stop();
                clearInterval(intervalId);
                return;
            }
            
            const shouldContinue = this.executeStep();
            
            if (!shouldContinue || !this.running) {
                clearInterval(intervalId);
            }
        }, interval);
    }

    stop() {
        this.running = false;
        if (this.currentInstruction >= this.programLength) {
            this.clearHighlight();
        }
            }

    reset() {
        this.memory = new Array(1000).fill(0);
        this.registers = {
            r0: 0,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0,
            r5: 0,
            r6: 0,
            SP: 999, // Stack Pointer volta para o topo
            PC: 0,   // Program Counter
            FLAGS: 0, // Flags
            FLAG: false
        };
        this.currentInstruction = 0;
        this.running = false;
        this.programLength = 0;
    
        for (let key in this.vectorRegisters) {
            this.vectorRegisters[key].fill(0);
        }
        
        // Recriar as instâncias das classes de instruções
        this.arithmetic = new ArithmeticInstructions(this);
        this.logical = new LogicalInstructions(this);
        this.dataMovement = new DataMovementInstructions(this);
        this.stack = new StackInstructions(this);
        this.simd = new SIMDInstructions(this);
        
        // Atualizar a UI
        this.updateRegistersUI();
        this.updateMemoryUI();
        this.clearOutput();
        this.clearHighlight();
        
            }

    clearOutput() {
        const outputElement = document.getElementById('program-output');
        if (outputElement) {
            outputElement.textContent = ''; // Limpa a saída do programa na UI
        }
    }
}

export default Interpreter;