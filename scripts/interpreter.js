import ArithmeticInstructions from './instructions/arithmeticInstructions.js';
import LogicalInstructions from './instructions/logicalInstructions.js';
import DataMovementInstructions from './instructions/dataMovementInstructions.js';
import StackInstructions from './instructions/stackInstructions.js';
import SIMDInstructions from './instructions/simdInstructions.js';

/**
 * Classe que representa um interpretador de assembly.
 * Gerencia a execução de um programa assembly, incluindo a manipulação de memória,
 * registradores e instruções aritméticas, lógicas, de movimentação de dados, de pilha e SIMD.
 */
class Interpreter {
    /**
     * Construtor da classe.
     * Inicializa a memória, registradores, e as instâncias das instruções.
     */
    constructor() {
        this.config = {
            matrixSize: 4,  // Tamanho padrão 2x2
            maxVectorSize: 4  // Tamanho máximo do vetor SIMD
        };

        this.memory = new Array(1000).fill(0); // Inicializa a memória com 1000 posições
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
            FLAG: false // Flag adicional
        };

        // Inicializa os registradores vetoriais
        this.vectorRegisters = {
            v0: new Float32Array(this.config.maxVectorSize),
            v1: new Float32Array(this.config.maxVectorSize),
            v2: new Float32Array(this.config.maxVectorSize),
            v3: new Float32Array(this.config.maxVectorSize)
        };

        this.vectorRegistersInitialized = false;
        this.updateRegistersUI();

        this.STACK_LIMIT = 100; // Limite para a pilha
        this.currentInstruction = 0; // Instrução atual a ser executada
        this.running = false; // Flag para verificar se o interpretador está em execução
        this.bitWidth = 8; // Padrão para 8 bits
        this.setBitWidth(this.bitWidth);  // Chama setBitWidth para atualizar maxValue

        // Instâncias dos módulos de instruções
        this.arithmetic = new ArithmeticInstructions(this);
        this.logical = new LogicalInstructions(this);
        this.dataMovement = new DataMovementInstructions(this);
        this.stack = new StackInstructions(this);
        this.simd = new SIMDInstructions(this);
    }

    /**
     * Atualiza a interface do usuário para exibir os valores dos registradores.
     */
    updateRegistersUI() {
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
            return; // Se algum elemento não existir, não faz nada
        }

        // Garante que os valores dos registradores sejam números antes de converter
        regr0Element.textContent = (this.registers.r0 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr1Element.textContent = (this.registers.r1 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr2Element.textContent = (this.registers.r2 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr3Element.textContent = (this.registers.r3 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr4Element.textContent = (this.registers.r4 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr5Element.textContent = (this.registers.r5 || 0).toString(16).padStart(2, '0').toUpperCase();
        regr6Element.textContent = (this.registers.r6 || 0).toString(16).padStart(2, '0').toUpperCase();
        regSPElement.textContent = '0x' + this.registers.SP.toString(16).padStart(3, '0').toUpperCase();

        // Atualiza as flags
        flagZElement.textContent = this.registers.FLAGS === 0 ? 'TRUE' : 'FALSE';
        flagFElement.textContent = this.registers.FLAG ? 'TRUE' : 'FALSE';

        // Atualiza os registradores vetoriais
        for (let i = 0; i < 4; i++) {
            const vregElement = document.getElementById(`vreg-v${i}`);
            if (vregElement) {
                const values = this.vectorRegisters[`v${i}`];

                if (this.vectorRegistersInitialized) {
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
                } else {
                    // Exibe '--' se os registradores não foram inicializados
                    vregElement.innerHTML = '<table class="vector-register"><tr><td>--</td><td>--</td></tr><tr><td>--</td><td>--</td></tr></table>';
                }
            }
        }
    }

    /**
     * Define o tamanho da matriz para operações SIMD.
     * @param {number} size - O novo tamanho da matriz.
     * @throws {Error} Se o tamanho exceder o máximo permitido.
     */
    setMatrixSize(size) {
        if (size > this.config.maxVectorSize) {
            throw new Error(`Tamanho de matriz ${size} excede o máximo permitido de ${this.config.maxVectorSize}`);
        }
        this.config.matrixSize = size;
    }

    /**
     * Atualiza a interface do usuário para exibir o conteúdo da memória.
     */
    updateMemoryUI() {
        const dataContent = document.getElementById('data-content');

        if (dataContent) {
            // Seção de Dados
            let dataHtml = '';
            let hasData = false;
            for (let i = this.totalLines; i < this.memory.length; i++) {
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

    /**
     * Define a largura de bits para operações.
     * @param {number} bitWidth * A nova largura de bits a ser definida.
     */
    setBitWidth(bitWidth) {
        this.bitWidth = bitWidth;
        
        // Verifica a largura de bits e define o valor máximo corretamente
        if (bitWidth === 32) {
            this.maxValue = 4294967295; // Para 32 bits, o valor máximo é 0xFFFFFFFF (4294967295)
        } else {
            this.maxValue = (1 << bitWidth) - 1; // Para outras larguras de bits, calcula normalmente
        }
    }
    


    applyBitMask(value) {
        // Verifica se o valor é maior que o valor máximo permitido para 8 bits (255)
        if (value > this.maxValue) {
            let maskedValue = value & this.maxValue;  // Aplica a máscara de bits para 8 bits
            return maskedValue;
        } else {
            return value; // Retorna o valor sem alteração se já estiver dentro do limite
        }
    }
    
    
    

    /**
     * Converte um valor de string para um número, se aplicável.
     * Esta função verifica se o valor fornecido é uma string que representa um número em
     * diferentes bases (hexadecimal, binário ou decimal) e o converte para um número.
     * Se o valor não for uma string ou não representar um número, a função retorna o valor original.
     * @param {string|any} value - O valor a ser convertido. Pode ser uma string representando um número
     *                             ou qualquer outro tipo de valor.
     * @returns {number|any} - Retorna o valor convertido para um número se for uma string representando
     *                         um número; caso contrário, retorna o valor original.
     */
    parseValue(value) {
        // Verifica se o valor é uma string
        if (typeof value === 'string') {
    
            // Verifica se a string representa um número em hexadecimal
            if (value.startsWith('0x')) {
                const result = parseInt(value, 16);
                return this.applyBitMask(result); // Aplica a máscara após a conversão
            } 
    
            // Verifica se a string representa um número em binário
            else if (value.startsWith('0b')) {
                const result = parseInt(value.substring(2), 2); // Remove '0b' e converte para decimal
                return this.applyBitMask(result); // Aplica a máscara após a conversão
            }
    
            // Verifica se a string representa um número decimal
            else if (!isNaN(value)) {
                const result = parseInt(value, 10);
                return this.applyBitMask(result); // Aplica a máscara após a conversão
            }
        } else {
            console.log(`Valor não é uma string, retornando: ${value}`); // Log se o valor não for string
        }
    
        // Se não for uma string representando um número, retorna o valor original
        return value;
    }    
       

    /**
     * Carrega um programa assembly na memória do interpretador.
     * @param {string} program - O código do programa a ser carregado.
     */
    loadProgram(program) {
        if (!program || program.trim() === '') {
            return; // Se o programa estiver vazio, não faz nada
        }
        
        // Reset inicial
        this.reset();
        
        // Carrega o novo programa, removendo comentários, mas mantendo as linhas vazias
        let lines = program.split('\n').map(line => line.trim());
        
        // Armazena as linhas do programa na memória, garantindo que sejam strings
        this.memory.fill(0); // Limpa a memória antes de carregar
        lines.forEach((line, index) => {
            if (index < this.memory.length) {
                this.memory[index] = line; // Carrega as linhas na memória
            }
        });
        
        // Processa as labels
        this.labels = this.parseLabels(); // Chama parseLabels sem passar o comprimento, pois usaremos this.memory
        
        // Inicializa os registradores vetoriais como um Float32Array com zeros
        this.vectorRegisters = {
            v0: new Float32Array(this.config.maxVectorSize),
            v1: new Float32Array(this.config.maxVectorSize),
            v2: new Float32Array(this.config.maxVectorSize),
            v3: new Float32Array(this.config.maxVectorSize)
        };
    
        // Define que os registradores vetoriais foram inicializados
        this.vectorRegistersInitialized = true;
    
        // Calcula o comprimento real do programa
        let lastValidIndex = -1;
        let maxLabelIndex = -1;
    
        // Encontra o maior índice usado por uma label
        for (let label in this.labels) {
            maxLabelIndex = Math.max(maxLabelIndex, this.labels[label]);
        }
    
        // Procura a última instrução válida, incluindo instruções após as labels
        for (let i = 0; i <= Math.max(this.memory.length - 1, maxLabelIndex + 1); i++) {
            const line = this.memory[i];
            if (line && (typeof line === 'string' || (typeof line === 'object' && line.type === 'label'))) {
                lastValidIndex = i;
            }
        }
    
        // Define o tamanho do programa como o número total de linhas
        this.programLength = this.memory.length; // Define o comprimento com base nas linhas válidas

        // Armazena o total de linhas carregadas
        this.totalLines = lines.length; // Total de linhas, incluindo comentários e vazias
    
        this.updateUI(); // Atualiza a interface do usuário
    }

    /**
     * Atualiza a saída do programa na interface do usuário.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo da mensagem (info, warning, error, etc.).
     * @param {number} lineNumber - O número da linha onde o comando foi executado.
     */
    updateOutput(message, type = 'info', lineNumber = null) {
        const outputContent = document.querySelector('.output-content');
        const outputElement = document.getElementById('program-output');
        if (!outputContent || !outputElement) return;
    
        const timestamp = new Date().toLocaleTimeString();
        const formattedMessage = lineNumber !== null 
            ? `[${timestamp}] ${type.toUpperCase()} (Linha ${lineNumber}): ${message}`
            : `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        
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

    /**
     * Analisa e processa as labels no programa.
     * @param {number} programLength - O comprimento do programa.
     * @returns {Object} Um objeto contendo as labels e seus índices.
     */
    parseLabels() {
        const labels = {};
        this.memory.forEach((line, index) => {
            if (typeof line === 'string') {
                const labelMatch = line.match(/^(\w+):/);
                if (labelMatch) {
                    const label = labelMatch[1];
                    labels[label] = index; // Armazena o índice da linha da label
                }
            }
        });
        return labels;
    }

    /**
     * Atualiza a interface do usuário para exibir o conteúdo da pilha.
     */
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

    /**
     * Atualiza a interface do usuário com base nas opções fornecidas.
     * @param {Object} options - Opções para atualizar a UI (registradores, memória, pilha).
     */
    updateUI(options = { registers: true, memory: true, stack: true }) {
        if (options.registers) this.updateRegistersUI();
        if (options.memory) this.updateMemoryUI();
        if (options.stack) this.updateStackUI();
        
        if (window.visualizationInstance) {
            window.visualizationInstance.updateVisualization();
        } else {
            console.log('Instância de visualização não encontrada em updateUI');
        }
    }

    /**
     * Executa um passo da execução do programa.
     * @returns {boolean} Verdadeiro se a execução foi bem-sucedida, falso caso contrário.
     */
    executeStep() {
        // Verifica se há um programa carregado
        if (!this.memory || this.memory.length === 0) {
            this.updateOutput("Nenhum programa carregado.", "warning");
            return false;
        }
    
        // Verifica se há um breakpoint na linha atual
        if (this.debugger && this.debugger.shouldPause()) {
            this.stop();
            this.updateOutput("Breakpoint encontrado na linha " + (this.currentInstruction + 1), "info");
            return false;
        }
    
        // Verifica se chegou ao fim do programa após a execução
        if (this.currentInstruction >= this.memory.length) {
            this.stop();
            this.updateOutput('Programa finalizado com sucesso.', 'success');
            return false;
        }
    
        // Obtém a linha atual da memória
        let currentLine = this.memory[this.currentInstruction];
    
        // Ignora linhas vazias e comentários, mas conta como linhas
        while (this.currentInstruction < this.memory.length) {
            currentLine = this.memory[this.currentInstruction];
            // Remove comentários e espaços em branco da linha
            let line = currentLine.split(';')[0].trim();
    
            // Verifica se a linha é válida
            if (line !== '') {
                break; // Linha válida encontrada
            }
    
            // Se a linha for vazia, apenas incrementa
            this.currentInstruction++;
        }
    
        // Verifica se atingiu o final do programa
        if (this.currentInstruction >= this.memory.length) {
            this.stop();
            this.updateOutput('Programa finalizado');
            return false;
        }
    
        // Remove comentários e espaços em branco da linha
        let line = currentLine.split(';')[0].trim();
    
        // Verifica se a linha é o fim do programa
        if (this.isEndOfProgram(line)) {
            this.stop();
            this.updateOutput('Programa finalizado');
            return false;
        }
    
        // Verifica se a linha é uma label
        if (line.endsWith(':')) {
            this.currentInstruction++; // Avança para a próxima linha
            return true; // Indica que a execução foi bem-sucedida
        }
    
        // Regex para capturar a instrução e os argumentos
        const instructionRegex = /^(\w+)\s*(.*?)$/;
        const match = line.match(instructionRegex);
    
        // Se não houver correspondência, pula para a próxima linha
        if (!match) {
            this.currentInstruction++;
            return true;
        }
    
        const instruction = match[1].toUpperCase(); // Obtém a instrução
        const argsString = match[2].trim(); // Obtém a string de argumentos
        const args = argsString.split(',').map(arg => arg.trim()).filter(arg => arg !== ''); // Processa os argumentos
    
        try {
            // Valida os argumentos para a instrução
            this.validateArgs(instruction, args);
            
            // Executa a instrução e obtém o resultado
            const result = this.executeInstruction(instruction, args);
            
            // Se for uma instrução de salto e tiver nextInstruction, use-o
            if (result && result.nextInstruction !== undefined) {
                this.currentInstruction = result.nextInstruction;
            } else {
                // Caso contrário, vá para a próxima instrução
                this.currentInstruction++;
            }
    
            // Atualiza a interface do usuário e a memória
            this.updateUI();
    
            return true; // Indica que a execução foi bem-sucedida
        } catch (error) {
            console.error('DEBUG - Error in executeStep:', error);
            this.updateOutput(`Erro: ${error.message}`, 'error'); // Atualiza a saída com a mensagem de erro
            this.stop(); // Para a execução em caso de erro
            return false; // Indica que houve um erro
        }
    }

    /**
     * Verifica se a linha atual é o fim do programa.
     * @param {string} line - A linha a ser verificada.
     * @returns {boolean} Verdadeiro se a linha indica o fim do programa, falso caso contrário.
     */
    isEndOfProgram(line) {
        // Verifica se line é undefined, null, ou não é uma string
        if (line == null || typeof line !== 'string') {
            return true; // Considera como fim do programa se a linha não for válida
        }
    
        const trimmedLine = line.trim().toUpperCase();
        
        // Expande a lista de possíveis marcadores de fim de programa
        return ['END:', 'END', 'END_OF_PROGRAM', 'HALT', '.END'].includes(trimmedLine) || 
               trimmedLine.startsWith('END ') || 
               trimmedLine === '';
    }

    /**
     * Valida os argumentos fornecidos para uma instrução.
     * @param {string} instruction - A instrução a ser validada.
     * @param {Array} args - Os argumentos a serem validados.
     * @throws {Error} Se o número de argumentos estiver incorreto.
     */
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
            INC: 1,
            DEC: 1,
            NOT: 1,
            CMP: 2,
            JMP: 1,
            JE: 1,
            JNE: 1,
            JG: 1,
            JGE: 1,
            JL: 1,
            JLE: 1,
            JZ: 1, 
            JNZ: 1,
            JC: 1, 
            JNC: 1,
            JO: 1, 
            JNO: 1,
            JB: 1, 
            JBE: 1,
            JA: 1, 
            JAE: 1,
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
    
    /**
     * Executa a instrução fornecida com os argumentos dados.
     * @param {string} instruction - A instrução a ser executada.
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} O resultado da execução da instrução.
     * @throws {Error} Se ocorrer um erro durante a execução da instrução.
     */
    executeInstruction(instruction, args) {
        try {
            // Converte os argumentos para valores numéricos
            const parsedArgs = args.map(arg => this.parseValue(arg));

            let result;
            switch (instruction.toUpperCase()) {
                case 'NOP':
                    result = { instruction: 'NOP', args: [], result: 'No operation' };
                    break;
                case 'ADD':
                case 'SUB':
                case 'MUL':
                case 'DIV':
                case 'AND':
                case 'OR':
                case 'XOR':
                case 'INC':
                case 'DEC':
                case 'NOT':
                case 'CMP':
                    result = this.arithmetic.execute(instruction, parsedArgs);
                    break;
                case 'MOV':
                case 'LOAD':
                case 'STORE':
                    result = this.dataMovement.execute(instruction, parsedArgs);
                    break;
                case 'JMP':
                case 'JE':
                case 'JNE':
                case 'JG':
                case 'JGE':
                case 'JZ':
                case 'JNZ':
                case 'JC':
                case 'JNC':
                case 'JO':
                case 'JNO':
                case 'JL':
                case 'JLE':
                case 'JBE':
                case 'JA':
                case 'JAE':
                case 'JB':
                case 'CALL':
                case 'RET':
                    result = this.logical.execute(instruction, parsedArgs);
                    break;
                case 'PUSH':
                case 'POP':
                case 'DUP':
                case 'SWAP':
                case 'ROT':
                    result = this.stack.execute(instruction, parsedArgs);
                    break;
                case 'VADD':
                case 'VMUL':
                case 'VDIV':
                case 'VLOAD':
                case 'VSTORE':
                    result = this.simd.execute(instruction, parsedArgs);
                    break;
                case 'SETMATSIZE':
                    const size = parseInt(args[0]);
                    if (isNaN(size) || size < 1 || size > this.config.maxVectorSize) {
                        throw new Error(`Tamanho de matriz inválido: ${args[0]}`);
                    }
                    this.setMatrixSize(size);
                    result = { 
                        instruction: 'SETMATSIZE', 
                        args: [size], 
                        result: `Tamanho da matriz definido para ${size}x${size}` 
                    };
                    break;
                default:
                    throw new Error(`Instrução desconhecida: ${instruction}`);
            }
    
            if (result) {
                // Se result for um objeto, extraia o valor desejado
                const resultValue = typeof result === 'object' && result !== null && 'result' in result 
                ? result.result 
                : result; // Se não for um objeto ou não tiver a propriedade 'result', use o próprio result

                // Atualiza a saída com a linha atual, combinando a instrução e o resultado
                this.updateOutput(`Executada instrução: ${instruction} ${parsedArgs.join(', ')} = ${resultValue}`, 'info', this.currentInstruction + 1);
            }
    
            return result; // Retorna o resultado em vez de true
        } catch (error) {
            this.updateOutput(`Erro na execução de ${instruction}: ${error.message}`, 'error', this.currentInstruction + 1);
            throw error; // Propaga o erro em vez de retornar false
        }
    }

    /**
     * Verifica se a linha atual é válida para execução.
     * @param {string} line - A linha a ser verificada.
     * @returns {boolean} Verdadeiro se a linha for válida, falso caso contrário.
     */
    isValidLine(line) {
        if (typeof line !== 'string' || line.trim() === '') {
            this.running = false;
            return false; // Linha inválida
        }
        return true; // Linha válida
    }
    
    /**
     * Inicia a execução do programa em um loop.
     * @param {string} speed - A velocidade da execução ('fast', 'medium', 'slow').
     */
    run(speed) {
        if (!this.memory || this.programLength === 0) {
            return false; // Nenhum programa carregado
        }
    
        this.running = true;
        const interval = speed === 'fast' ? 100 : speed === 'medium' ? 500 : 1000;
        
        const runStep = () => {
            if (!this.running) {
                return; // Se não estiver em execução, sai
            }
            
            if (this.debugger && this.debugger.shouldPause()) {
                this.stop(); // Pausa se o depurador solicitar
                return;
            }
            
            const shouldContinue = this.executeStep(); // Executa um passo
            
            if (shouldContinue && this.running) {
                setTimeout(runStep, interval); // Continua a execução
            } else {
                this.stop(); // Para a execução
            }
        };
    
        runStep(); // Inicia a execução
    }

    /**
     * Para a execução do programa.
     */
    stop() {
        this.running = false; // Define a execução como parada
    }

    clearStackUI() {
        const stackList = document.getElementById('stack-list');
        if (stackList) {
            stackList.innerHTML = ''; // Limpa o conteúdo da lista da pilha
        }
    }

    /**
     * Reseta o estado do interpretador, limpando memória e registradores.
     */
    reset() {
        this.memory = new Array(1000).fill(0); // Limpa a memória
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
            FLAG: false // Flag adicional
        };
        this.currentInstruction = 0; // Reseta a instrução atual
        this.running = false; // Para a execução
        this.programLength = 0; // Reseta o comprimento do programa
    
        for (let key in this.vectorRegisters) {
            this.vectorRegisters[key].fill(0); // Limpa os registradores vetoriais
        }
        
        // Recriar as instâncias das classes de instruções
        this.arithmetic = new ArithmeticInstructions(this);
        this.logical = new LogicalInstructions(this);
        this.dataMovement = new DataMovementInstructions(this);
        this.stack = new StackInstructions(this);
        this.simd = new SIMDInstructions(this);
        
        // Atualizar a UI
        this.updateUI();
        this.clearOutput();
        this.clearStackUI();
    }

    /**
     * Limpa a saída do programa na interface do usuário.
     */
    clearOutput() {
        const outputElement = document.getElementById('program-output');
        if (outputElement) {
            outputElement.textContent = ''; // Limpa a saída do programa na UI
        }
    }
}

export default Interpreter;