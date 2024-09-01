class Debugger {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.breakpoints = new Set();

        const addBreakpointBtn = document.getElementById('add-breakpoint-btn');
        const breakpointInput = document.getElementById('breakpoint-input');

        if (addBreakpointBtn && breakpointInput) {
            addBreakpointBtn.addEventListener('click', () => {
                const lineNumber = parseInt(breakpointInput.value);
                if (!isNaN(lineNumber)) {
                    this.addBreakpoint(lineNumber);
                }
            });
        } else {
        }
    }

    addBreakpoint(lineNumber) {
        this.breakpoints.add(lineNumber);
        console.log(`Breakpoint adicionado na linha ${lineNumber}`);
        this.updateBreakpointsList();
    }

    removeBreakpoint(lineNumber) {
        this.breakpoints.delete(lineNumber);
        console.log(`Breakpoint removido na linha ${lineNumber}`);
        this.updateBreakpointsList();
    }

    updatePanel() {
        const registersElement = document.getElementById('registers-content');
        const memoryElement = document.getElementById('memory-content');
        const breakpointsElement = document.getElementById('breakpoints-list');

        if (!registersElement || !memoryElement || !breakpointsElement) {
            console.error('Elementos do painel de debug não encontrados.');
            return;
        }

        let registersHtml = '<h3>Registradores</h3>';
        for (const [key, value] of Object.entries(this.interpreter.registers)) {
            registersHtml += `<p>${key}: ${value}</p>`;
        }
        registersElement.innerHTML = registersHtml;

        let memoryHtml = '<h3>Memória</h3>';
        this.interpreter.memory.forEach((value, index) => {
            memoryHtml += `<p>${index}: ${value}</p>`;
        });
        memoryElement.innerHTML = memoryHtml;

        this.updateBreakpointsList();
    }
   
    
    shouldPause() {
        const shouldPause = this.breakpoints.has(this.interpreter.currentInstruction + 1);
        console.log(`Verificando breakpoint na linha ${this.interpreter.currentInstruction + 1}: ${shouldPause}`);
        return shouldPause;
    }

    updateBreakpointsList() {
        const breakpointsList = document.getElementById('breakpoints-list');
        if (!breakpointsList) {
            console.error('Elemento "breakpoints-list" não encontrado.');
            return;
        }

        breakpointsList.innerHTML = ''; // Limpa a lista atual
        this.breakpoints.forEach(lineNumber => {
            const li = document.createElement('li');
            li.textContent = `Linha ${lineNumber}`;
            li.addEventListener('click', () => this.removeBreakpoint(lineNumber));
            breakpointsList.appendChild(li);
        });
    }
}

export default Debugger;