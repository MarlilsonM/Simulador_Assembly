class Debugger {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.breakpoints = new Set();

        const addBreakpointBtn = document.getElementById('add-breakpoint-btn');
        const breakpointInput = document.getElementById('breakpoint-input');

        // Verificar se os elementos existem antes de adicionar event listeners
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
        console.log(`Breakpoint adicionado na linha ${lineNumber}`);
    }

    removeBreakpoint(lineNumber) {
        this.breakpoints.delete(lineNumber);
        console.log(`Breakpoint removido na linha ${lineNumber}`);
        this.updateBreakpointsList();
    }

    shouldPause() {
        return this.breakpoints.has(this.interpreter.currentInstruction + 1);
    }

    updatePanel() {
        const registersContent = document.getElementById('registers-content');
        registersContent.textContent = `A: ${this.interpreter.registers.A}\nB: ${this.interpreter.registers.B}\nC: ${this.interpreter.registers.C}\nD: ${this.interpreter.registers.D}\nCMP: ${this.interpreter.registers.CMP || 0}`;

        const memoryContent = document.getElementById('memory-content');
        memoryContent.textContent = this.interpreter.memory.map((value, index) => `Endereço ${index}: ${value}`).join('\n');
    }

    updateBreakpointsList() {
        const breakpointsList = document.getElementById('breakpoints-list');
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