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
            }

    removeBreakpoint(lineNumber) {
        this.breakpoints.delete(lineNumber);
        this.updateBreakpointsList();
            }

    updatePanel() {
        const instructionsContent = document.getElementById('instructions-content');
        const dataContent = document.getElementById('data-content');
        
        if (!instructionsContent || !dataContent) {
            return;
        }
        
        // Atualiza instruções
        let instructionsHtml = '';
        for (let i = 0; i < this.interpreter.programLength; i++) {
            const instruction = this.interpreter.memory[i];
            if (instruction === 'END' || instruction === 'END:' || 
                instruction === '.END' || instruction === 'HALT') {
                instructionsHtml += `<div><span class="address">${i}:</span><span class="instruction">${instruction}</span></div>`;
                break;
            }
            instructionsHtml += `<div><span class="address">${i}:</span><span class="instruction">${instruction}</span></div>`;
        }
        instructionsContent.innerHTML = instructionsHtml;
        
        // Atualiza dados
        let dataHtml = '';
        let hasData = false;
        for (let i = this.interpreter.programLength; i < this.interpreter.memory.length; i++) {
            if (this.interpreter.memory[i] !== 0 && this.interpreter.memory[i] !== '0') {
                dataHtml += `<div><span class="address">${i}:</span><span class="data">${this.interpreter.memory[i]}</span></div>`;
                hasData = true;
            }
        }
        
        if (!hasData) {
            dataHtml = '<div>(Sem dados)</div>';
        }
        dataContent.innerHTML = dataHtml;
    }

    updatePanel() {
        const instructionsContent = document.getElementById('instructions-content');
        const dataContent = document.getElementById('data-content');
        
        if (!instructionsContent || !dataContent) {
            return;
        }
        
        // Atualiza instruções
        let instructionsHtml = '';
        for (let i = 0; i < this.interpreter.programLength; i++) {
            const instruction = this.interpreter.memory[i];
            if (instruction === 'END' || instruction === 'END:' || 
                instruction === '.END' || instruction === 'HALT') {
                instructionsHtml += `<div><span class="address">${i}:</span><span class="instruction">${instruction}</span></div>`;
                break;
            }
            instructionsHtml += `<div><span class="address">${i}:</span><span class="instruction">${instruction}</span></div>`;
        }
        instructionsContent.innerHTML = instructionsHtml;
        
        // Atualiza dados
        let dataHtml = '';
        let hasData = false;
        for (let i = this.interpreter.programLength; i < this.interpreter.memory.length; i++) {
            if (this.interpreter.memory[i] !== 0 && this.interpreter.memory[i] !== '0') {
                dataHtml += `<div><span class="address">${i}:</span><span class="data">${this.interpreter.memory[i]}</span></div>`;
                hasData = true;
            }
        }
        
        if (!hasData) {
            dataHtml = '<div>(Sem dados)</div>';
        }
        dataContent.innerHTML = dataHtml;
    }

    getValueType(value) {
        if (typeof value === 'number') {
            return Number.isInteger(value) ? 'Inteiro' : 'Ponto Flutuante';
        } else if (typeof value === 'string') {
            return 'String';
        } else if (value === undefined || value === null) {
            return 'Indefinido';
        } else {
            return 'Outro';
        }
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