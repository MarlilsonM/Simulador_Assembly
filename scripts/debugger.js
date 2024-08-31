class Debugger {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.breakpoints = new Set();

        const addButton = document.getElementById('add-breakpoint-btn');
        const breakpointInput = document.getElementById('breakpoint-input');

        if (addButton && breakpointInput) {
            addButton.addEventListener('click', () => {
                const lineNumber = parseInt(breakpointInput.value, 10);
                if (!isNaN(lineNumber)) {
                    this.addBreakpoint(lineNumber);
                }
            });
        } else {
            console.error('Elementos de breakpoint não encontrados no DOM.');
        }
    }

    addBreakpoint(lineNumber) {
        this.breakpoints.add(lineNumber);
        this.updateBreakpointsList();
    }

    removeBreakpoint(lineNumber) {
        this.breakpoints.delete(lineNumber);
        this.updateBreakpointsList();  // Atualiza a lista após remover
    }

    updateBreakpointsList() {
        const breakpointsList = document.getElementById('breakpoints-list');
        breakpointsList.innerHTML = '';
        this.breakpoints.forEach(bp => {
            const listItem = document.createElement('li');
            listItem.className = 'breakpoint-item';
    
            const textSpan = document.createElement('span');
            textSpan.textContent = `Breakpoint at line: ${bp}`;
    
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => this.removeBreakpoint(bp));
    
            listItem.appendChild(textSpan);
            listItem.appendChild(removeButton);
            breakpointsList.appendChild(listItem);
        });
    }

    shouldPause() {
        return this.breakpoints.has(this.interpreter.currentInstruction + 1);
    }

    updatePanel() {
        const registersContent = Object.entries(this.interpreter.registers)
            .map(([reg, value]) => `${reg}: ${value}`)
            .join('\n');

        document.getElementById('registers-content').textContent = registersContent;
    }
}
