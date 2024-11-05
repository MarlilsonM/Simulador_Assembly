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
        const memoryElement = document.getElementById('memory-content');
        const breakpointsElement = document.getElementById('breakpoints-list');
    
        if (!memoryElement || !breakpointsElement) {
                        return;
        }
    
        // Atualiza a visualização da memória
        let memoryHtml = 'Instruções:\n';
        
        // Mostra instruções até END
        for (let i = 0; i < this.interpreter.programLength; i++) {
            if (this.interpreter.memory[i] === 'END' || 
                this.interpreter.memory[i] === 'END:' || 
                this.interpreter.memory[i] === '.END' || 
                this.interpreter.memory[i] === 'HALT') {
                memoryHtml += `${i}: ${this.interpreter.memory[i]}\n`;
                break;
            }
            memoryHtml += `${i}: ${this.interpreter.memory[i]}\n`;
        }
    
        // Adiciona seção de dados não-zero
        memoryHtml += '\nDados:\n';
        let hasData = false;
        for (let i = this.interpreter.programLength; i < this.interpreter.memory.length; i++) {
            if (this.interpreter.memory[i] !== 0 && this.interpreter.memory[i] !== '0') {
                memoryHtml += `${i}: ${this.interpreter.memory[i]}\n`;
                hasData = true;
            }
        }
    
        if (!hasData) {
            memoryHtml += '(Sem dados)\n';
        }
    
        memoryElement.textContent = memoryHtml;
    
        // Atualiza a lista de breakpoints
        let breakpointsHtml = '';
        this.breakpoints.forEach(line => {
            breakpointsHtml += `Linha ${line}\n`;
        });
        breakpointsElement.innerHTML = breakpointsHtml || '(Sem breakpoints)';
        this.updateDetailedStack();
    }

    updateDetailedStack() {
        const stackElement = document.getElementById('detailed-stack');
        if (!stackElement) return;

        let stackContent = '<h3>Pilha Detalhada</h3>';
        stackContent += '<table><tr><th>Endereço</th><th>Valor</th><th>Tipo</th></tr>';

        const sp = this.interpreter.registers.SP;
        for (let i = 999; i >= sp; i--) {
            const value = this.interpreter.memory[i];
            const type = this.getValueType(value);
            const isSP = i === sp ? ' (SP)' : '';
            stackContent += `<tr>
                <td>${i}${isSP}</td>
                <td>${value}</td>
                <td>${type}</td>
            </tr>`;
        }

        stackContent += '</table>';
        stackElement.innerHTML = stackContent;

        // Adicionar visualização dos registradores vetoriais
        let vectorContent = '<h3>Registradores Vetoriais</h3>';
        vectorContent += '<table><tr><th>Registrador</th><th>Valores</th></tr>';

        for (let i = 0; i < 4; i++) {
            const values = this.interpreter.vectorRegisters[`v${i}`];
            vectorContent += `<tr>
                <td>v${i}</td>
                <td>[${values.join(', ')}]</td>
            </tr>`;
        }

        vectorContent += '</table>';

        // Adicione este conteúdo ao elemento HTML apropriado
        const vectorElement = document.getElementById('vector-registers');
        if (vectorElement) {
            vectorElement.innerHTML = vectorContent;
        }
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