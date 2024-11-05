import Interpreter from './interpreter.js';
import Debugger from './debugger.js';
import Visualization from './visualization.js';

document.addEventListener('DOMContentLoaded', () => {
    // Primeiro, instancie o interpretador
    window.interpreter = new Interpreter();
    
    // Agora, instancie o debugger, passando o interpretador como parâmetro
    window.debugger = new Debugger(window.interpreter);
    window.interpreter.debugger = window.debugger;

    // Instanciar a visualização e passar o interpretador como parâmetro
    window.visualization = new Visualization(window.interpreter);

    let isRunning = false;  // Flag para verificar se o código já está em execução

    // Controle de execução do código
    document.getElementById('play-btn').addEventListener('click', () => {
        if (isRunning) { 
            window.interpreter.stop();
            isRunning = false;
        }
        
        // Reset completo antes de uma nova execução
        window.interpreter.reset();
        
        const code = window.editor.getValue();
        window.interpreter.loadProgram(code);
        const speed = document.getElementById('speed-select').value;
        isRunning = true;
        window.interpreter.run(speed);
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        window.interpreter.stop();
        isRunning = false;  // Permite nova execução após pausar
    });

document.getElementById('step-btn').addEventListener('click', () => {
    const code = window.editor.getValue();
    
    // Só carrega o programa se ainda não estiver carregado ou se for a primeira execução
    if (!window.interpreter.running || window.interpreter.currentInstruction === 0) {
                window.interpreter.loadProgram(code);
        window.interpreter.running = true;
    }

    if (window.interpreter.programLength > 0) {
        try {
            const result = window.interpreter.executeStep();
                        
            // Se chegou ao fim do programa
            if (!result) {
                window.interpreter.running = false;
                            }
        } catch (error) {
                        window.interpreter.running = false;
        }
    } else {
            }
});

    document.getElementById('reset-btn').addEventListener('click', () => {
        window.interpreter.reset();
        isRunning = false;  // Permite nova execução após resetar
        window.visualization.updateVisualization();  // Atualizar a visualização
    });

    // Controle de mudanças de velocidade e largura de bits
    document.getElementById('speed-select').addEventListener('change', (event) => {
    });

    document.getElementById('bit-width-select').addEventListener('change', (event) => {
        const bitWidth = parseInt(event.target.value, 10);
        window.interpreter.setBitWidth(bitWidth);
    });
});