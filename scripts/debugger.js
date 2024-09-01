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
        }
    }

    addBreakpoint(lineNumber) {
        this.breakpoints.add(lineNumber);
        this.updateBreakpointsList();
        console.log(`Breakpoint adicionado na linha ${lineNumber}`);
    }

    removeBreakpoint(lineNumber) {
        this.breakpoints.delete(lineNumber);
        this.updateBreakpointsList();
        console.log(`Breakpoint removido na linha ${lineNumber}`);
    }

    updatePanel() {
        const registersElement = document.getElementById('registers-content');
        const memoryElement = document.getElementById('memory-content');
        const breakpointsElement = document.getElementById('breakpoints-list');

        if (!registersElement || !memoryElement || !breakpointsElement) {
            console.error('Elementos do painel de debug não encontrados.');
            return;
        }

        // Atualiza os valores dos registradores
        let registersHtml = '';
        for (const [key, value] of Object.entries(this.interpreter.registers)) {
            registersHtml += `${key}: ${value}\n`;
        }
        registersElement.textContent = registersHtml;

        // Atualiza a visualização da memória
        let memoryHtml = '';
        this.interpreter.memory.forEach((value, index) => {
            memoryHtml += `${index}: ${value}\n`;
        });
        memoryElement.textContent = memoryHtml;

        // Atualiza a lista de breakpoints
        let breakpointsHtml = '';
        this.breakpoints.forEach(line => {
            breakpointsHtml += `Linha ${line}\n`;
        });
        breakpointsElement.innerHTML = breakpointsHtml;
    }

    shouldPause() {
        return this.breakpoints.has(this.interpreter.currentInstruction + 1);
    }

    updateBreakpointsList() {
        const breakpointsList = document.getElementById('breakpoints-list');
        breakpointsList.innerHTML = '';

        this.breakpoints.forEach(lineNumber => {
            const li = document.createElement('li');
            li.textContent = `Linha ${lineNumber}`;
            li.addEventListener('click', () => this.removeBreakpoint(lineNumber));
            breakpointsList.appendChild(li);
        });
    }
}

export default Debugger;