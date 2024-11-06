class Debugger {
    constructor(interpreter) {
        console.log('Debugger sendo construído');
        this.interpreter = interpreter;
        this.breakpoints = new Set();
    }    
        
    initialize() {
        console.log('Inicializando Debugger');
    
        if (!window.editor) {
            console.error('Editor não está disponível');
            return;
        }
        
        // Adiciona evento de clique na gutter do CodeMirror
        console.log('Adicionando evento gutterClick');
        window.editor.on("gutterClick", (cm, line, gutter) => {
            console.log('Gutter clicado:', line, gutter);
            // Permite cliques em qualquer gutter para adicionar breakpoints
            this.toggleBreakpoint(line + 1);
        });
    }

    toggleBreakpoint(lineNumber) {
        console.log('Tentando alternar breakpoint na linha:', lineNumber);
        const line = lineNumber - 1; // Ajusta para 0-based index
        const info = window.editor.lineInfo(line);
        
        if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
            // Remove o breakpoint
            window.editor.setGutterMarker(line, "breakpoints", null);
            this.breakpoints.delete(lineNumber);
            console.log('Breakpoint removido da linha:', lineNumber);
        } else {
            // Adiciona o breakpoint
            const marker = document.createElement("div");
            marker.style.color = "#822";
            marker.innerHTML = "●";
            marker.className = "breakpoint";
            marker.title = "Breakpoint: linha " + lineNumber;
            window.editor.setGutterMarker(line, "breakpoints", marker);
            this.breakpoints.add(lineNumber);
            console.log('Breakpoint adicionado na linha:', lineNumber);
        }
    }


    hasBreakpoint(line) {
        return this.breakpoints.has(line + 1);
    }

    shouldPause() {
        return this.breakpoints.has(this.interpreter.currentInstruction + 1);
    }
}

export default Debugger;