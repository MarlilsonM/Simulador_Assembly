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
        const line = lineNumber - 1;
        const info = window.editor.lineInfo(line);
        
        if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
            window.editor.setGutterMarker(line, "breakpoints", null);
            this.breakpoints.delete(lineNumber);
        } else {
            const marker = document.createElement("div");
            marker.style.color = "#822";
            marker.innerHTML = "●";
            marker.className = "breakpoint";
            marker.title = "Breakpoint: linha " + lineNumber;
            window.editor.setGutterMarker(line, "breakpoints", marker);
            this.breakpoints.add(lineNumber);
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
        return this.breakpoints.has(this.interpreter.currentInstruction + 1);
    }
}

export default Debugger;