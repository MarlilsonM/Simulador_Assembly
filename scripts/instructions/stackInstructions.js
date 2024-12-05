/**
 * Classe que implementa instruções de pilha para um interpretador de assembly.
 * As instruções suportadas incluem PUSH, POP, DUP, SWAP e ROT.
 */
class StackInstructions {
    /**
     * Construtor da classe.
     * @param {Interpreter} interpreter - Instância do interpretador que contém os registradores e a lógica de execução.
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    /**
     * Executa uma instrução de pilha com os argumentos fornecidos.
     * @param {string} instruction - A instrução a ser executada (ex: 'PUSH', 'POP', etc.).
     * @param {Array} args - Os argumentos para a instrução.
     * @returns {Object} Resultado da execução da instrução.
     * @throws {Error} Se a instrução for desconhecida.
     */
    execute(instruction, args) {
        switch (instruction.toUpperCase()) {
            case 'PUSH':
                return this.push(args);
            case 'POP':
                return this.pop(args);
            case 'DUP':
                return this.dup();
            case 'SWAP':
                return this.swap();
            case 'ROT':
                return this.rot();
            default:
                throw new Error(`Instrução de pilha desconhecida: ${instruction}`);
        }
    }

    /**
     * Executa a instrução PUSH para empilhar um valor do registrador ou um valor literal na pilha.
     * @param {Array} args - Argumentos da instrução (registrador de origem ou valor literal).
     * @returns {Object} Resultado da operação PUSH.
     * @throws {Error} Se o registrador for inválido ou se ocorrer um overflow na pilha.
     */
    push(args) {
        if (args.length !== 1) {
            throw new Error('PUSH requer um argumento');
        }
        const [src] = args;

        let value;

        // Verifica se o argumento é um registrador
        if (this.interpreter.registers.hasOwnProperty(src)) {
            value = this.interpreter.registers[src]; // Obtém o valor do registrador
        } else {
            // Tenta converter o argumento em um número
            const parsedValue = parseInt(src, 10);
            if (isNaN(parsedValue)) {
                throw new Error(`Argumento inválido: ${src}. Deve ser um registrador ou um valor numérico.`);
            }
            value = parsedValue; // Usa o valor literal
        }

        if (this.interpreter.registers['SP'] <= 0) {
            throw new Error('Stack overflow');
        }

        this.interpreter.registers['SP']--;
        const sp = this.interpreter.registers['SP'];
        this.interpreter.memory[sp] = value; // Empilha o valor
        this.interpreter.updateMemoryUI();
        this.animatePush(value); // Animação de PUSH

        return { 
            instruction: 'PUSH', 
            args: [src], 
            result: `${value} empilhado em SP=${sp}` 
        };
    }

    /**
     * Executa a instrução POP para desempilhar um valor da pilha para um registrador.
     * @param {Array} args - Argumentos da instrução (registrador de destino).
     * @returns {Object} Resultado da operação POP.
     * @throws {Error} Se o registrador for inválido ou se ocorrer um underflow na pilha.
     */
    pop(args) {
        if (args.length !== 1) {
            throw new Error('POP requer um argumento');
        }
        const [dest] = args;
        if (!this.interpreter.registers.hasOwnProperty(dest)) {
            throw new Error(`Registrador inválido: ${dest}`);
        }

        if (this.interpreter.registers['SP'] >= this.interpreter.memory.length) {
            throw new Error('Stack underflow');
        }

        const sp = this.interpreter.registers['SP'];
        const value = this.interpreter.memory[sp]; // Pega o valor do topo da pilha
        this.interpreter.registers[dest] = value; // Armazena no registrador de destino
        this.interpreter.registers['SP']++;  // Incrementa o ponteiro da pilha
        this.interpreter.updateRegistersUI();
        this.animatePop(); // Animação de POP
        
        return { 
            instruction: 'POP', 
            args: [dest], 
            result: `${value} desempilhado para ${dest} de SP=${sp}` 
        };
    }

    /**
     * Executa a instrução DUP para duplicar o valor no topo da pilha.
     * @returns {Object} Resultado da operação DUP.
     * @throws {Error} Se ocorrer um overflow na pilha ou se a pilha estiver vazia.
     */
    dup() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp <= 0) {
            throw new Error('Stack overflow na operação DUP');
        }
        
        if (sp >= this.interpreter.memory.length) {
            throw new Error('Stack vazia, não é possível duplicar');
        }

        const value = this.interpreter.memory[sp];
        this.interpreter.registers['SP']--;
        this.interpreter.memory[this.interpreter.registers['SP']] = value;
        
        this.interpreter.updateMemoryUI();
        this.animateDup(value);
        
        return { 
            instruction: 'DUP', 
            args: [], 
            result: `${value} duplicado no topo da pilha` 
        };
    }

    /**
     * Executa a instrução SWAP para trocar os dois valores no topo da pilha.
     * @returns {Object} Resultado da operação SWAP.
     * @throws {Error} Se não houver elementos suficientes na pilha para realizar a troca.
     */
    swap() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= this.interpreter.memory.length - 1) {
            throw new Error('Elementos insuficientes para SWAP');
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = temp;
        
        this.interpreter.updateMemoryUI();
        this.animateSwap(sp, sp + 1);
        
        return { 
            instruction: 'SWAP', 
            args: [], 
            result: `Trocados elementos em SP=${sp} e SP=${sp + 1}` 
        };
    }

    /**
     * Executa a instrução ROT para rotacionar os três valores no topo da pilha.
     * @returns {Object} Resultado da operação ROT.
     * @throws {Error} Se não houver elementos suficientes na pilha para realizar a rotação.
     */
    rot() {
        const sp = this.interpreter.registers['SP'];
        
        if (sp >= this.interpreter.memory.length - 2) {
            throw new Error('Elementos insuficientes para ROT');
        }

        const temp = this.interpreter.memory[sp];
        this.interpreter.memory[sp] = this.interpreter.memory[sp + 1];
        this.interpreter.memory[sp + 1] = this.interpreter.memory[sp + 2];
        this.interpreter.memory[sp + 2] = temp;
        
        this.interpreter.updateMemoryUI();
        this.animateRot(sp, sp + 1, sp + 2);
        
        return { 
            instruction: 'ROT', 
            args: [], 
            result: `Rotacionados elementos em SP=${sp}, SP=${sp + 1}, e SP=${sp + 2}` 
        };
    }

    animateDup(value) {
        const stackList = document.getElementById('stack-list');
        const newItem = document.createElement('li');
        newItem.textContent = value;
        newItem.classList.add('animate-dup'); // Classe para animação
        stackList.insertBefore(newItem, stackList.firstChild); // Insere o novo item no topo
        // Remover a animação após um tempo
        setTimeout(() => {
            newItem.classList.remove('animate-dup');
        }, 400); // Tempo da animação
    }
    
    animateSwap(index1, index2) {
        const stackList = document.getElementById('stack-list');
        const item1 = stackList.children[index1];
        const item2 = stackList.children[index2];
    
        if (item1 && item2) {
            item1.classList.add('animate-swap'); // Classe para animação
            item2.classList.add('animate-swap'); // Classe para animação
            setTimeout(() => {
                const tempText = item1.textContent;
                item1.textContent = item2.textContent;
                item2.textContent = tempText;
                item1.classList.remove('animate-swap');
                item2.classList.remove('animate-swap');
            }, 400); // Tempo da animação
        }
    }
    
    animateRot(index1, index2, index3) {
        const stackList = document.getElementById('stack-list');
        const item1 = stackList.children[index1];
        const item2 = stackList.children[index2];
        const item3 = stackList.children[index3];
    
        if (item1 && item2 && item3) {
            item1.classList.add('animate-rot'); // Classe para animação
            item2.classList.add('animate-rot'); // Classe para animação
            item3.classList.add('animate-rot'); // Classe para animação
            setTimeout(() => {
                const tempText = item1.textContent;
                item1.textContent = item2.textContent;
                item2.textContent = item3.textContent;
                item3.textContent = tempText;
                item1.classList.remove('animate-rot');
                item2.classList.remove('animate-rot');
                item3.classList.remove('animate-rot');
            }, 400); // Tempo da animação
        }
    }

    animatePush(value) {
        const stackList = document.getElementById('stack-list');
        const newItem = document.createElement('li');
        newItem.textContent = value;
        newItem.classList.add('animate-push'); // Classe para animação
        stackList.insertBefore(newItem, stackList.firstChild); // Insere o novo item no topo
        // Remover a animação após um tempo
        setTimeout(() => {
            newItem.classList.remove('animate-push');
        }, 400); // Tempo da animação
    }

    animatePop() {
        const stackList = document.getElementById('stack-list'); // Obtém a lista da pilha
        if (stackList.firstChild) {
            const poppedItem = stackList.firstChild; // O item que será removido
            poppedItem.classList.add('animate-pop'); // Adiciona a classe de animação

            // Obtém a duração da animação com base na velocidade escolhida
            const duration = window.animationDurations[window.selectedSpeed];

            // Remover o item após o tempo da animação
            setTimeout(() => {
                if (stackList.contains(poppedItem)) { // Verifica se o item ainda é um filho
                    stackList.removeChild(poppedItem); // Remove o item após a animação
                }
            }, duration); // Usa a duração da animação baseada na escolha do usuário
        }
    }
}

export default StackInstructions;