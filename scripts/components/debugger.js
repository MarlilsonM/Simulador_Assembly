/**
 * debugger.js
 * 
 * @description
 * Implementa funcionalidades de depuração para o simulador Assembly.
 * Gerencia breakpoints e controla a execução passo a passo do programa.
 * 
 * @class Debugger
 */
class Debugger {
    /**
     * @constructor
     * @param {Interpreter} interpreter - Instância do interpretador
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.breakpoints = new Set();
    }

    /**
     * @method initialize
     * @description Inicializa o debugger e configura os eventos do editor
     */
    initialize() {
        if (!window.editor) {
            console.error('Editor não está disponível');
            return;
        }
        
        window.editor.on("gutterClick", (cm, line, gutter) => {
            this.toggleBreakpoint(line + 1);
        });
    }

    /**
     * @method toggleBreakpoint
     * @description Adiciona ou remove um breakpoint em uma linha específica
     * @param {number} lineNumber - Número da linha para alternar o breakpoint
     */
    toggleBreakpoint(lineNumber) {
        const line = lineNumber - 1; // Ajusta para o índice correto
        const lineContent = window.editor.getLine(line); // Obtém o conteúdo da linha
    
        // Verifica se a linha não é vazia e não é um comentário
        if (lineContent && lineContent.trim() !== '' && !lineContent.trim().startsWith(';')) {
            const info = window.editor.lineInfo(line);
    
            // Se já existe um breakpoint, remove-o
            if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
                window.editor.setGutterMarker(line, "breakpoints", null);
                this.breakpoints.delete(lineNumber);
            } else {
                // Adiciona um novo breakpoint
                const marker = document.createElement("div");
                marker.style.color = "#822";
                marker.innerHTML = "●";
                marker.className = "breakpoint";
                marker.title = "Breakpoint: linha " + lineNumber;
                window.editor.setGutterMarker(line, "breakpoints", marker);
                this.breakpoints.add(lineNumber);
            }
        } else {
            this.interpreter.updateOutput(`Não é possível adicionar um breakpoint na linha ${lineNumber}: linha vazia ou inválida.`, "warning");
        }
    }

    /**
     * @method hasBreakpoint
     * @description Verifica se existe um breakpoint em uma linha específica
     * @param {number} line - Número da linha a ser verificada
     * @returns {boolean} - Verdadeiro se existe um breakpoint na linha
     */
    hasBreakpoint(line) {
        return this.breakpoints.has(line + 1);
    }

    /**
     * @method shouldPause
     * @description Verifica se a execução deve pausar na linha atual
     * @returns {boolean} - Verdadeiro se deve pausar na instrução atual
     */
    shouldPause() {
        const currentInstruction = this.interpreter.currentInstruction; // +1 porque o contador é zero-indexado
        const currentLine = this.interpreter.memory[currentInstruction];
    
        // Se a linha atual estiver vazia, procure a última linha não vazia
        if (!currentLine || currentLine.trim() === '') {
            // Procura a última linha não vazia
            for (let i = currentInstruction - 1; i >= 0; i--) {
                const line = this.interpreter.memory[i];
                if (line && line.trim() !== '') {
                    return this.breakpoints.has(i + 1); // Verifica se há breakpoint na última linha não vazia
                }
            }
            return false; // Nenhuma linha não vazia encontrada
        }
        return this.breakpoints.has(currentInstruction);
    }
}

export default Debugger;