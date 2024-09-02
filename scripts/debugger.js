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
        const memoryElement = document.getElementById('memory-content');
        const breakpointsElement = document.getElementById('breakpoints-list');

        if (!memoryElement || !breakpointsElement) {
            console.error('Elementos do painel de debug não encontrados.');
            return;
        }

        // Atualiza os valores dos registradores
        let registersHtml = '';
        for (const [key, value] of Object.entries(this.interpreter.registers)) {
            registersHtml += `${key}: ${value}\n`;
        }

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
            li.className = 'breakpoint-item'; // Aplica a classe de estilo
    
            li.textContent = `Linha ${lineNumber}`;
            
            // Cria o ícone de remoção
            const removeIcon = document.createElement('span');
            removeIcon.className = 'remove-icon';
            removeIcon.textContent = '❌'; // Ícone de remoção
            
            // Adiciona evento de clique ao ícone de remoção
            removeIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Previne que o clique no ícone remova o item da lista
                this.removeBreakpoint(lineNumber);
            });
    
            // Adiciona o ícone ao item de lista
            li.appendChild(removeIcon);
            
            // Adiciona o item de lista ao contêiner de breakpoints
            breakpointsList.appendChild(li);
    
            // Adiciona evento de clique ao item de lista para remover o breakpoint ao clicar no texto
            li.addEventListener('click', () => this.removeBreakpoint(lineNumber));
        });
    }
}

export default Debugger;