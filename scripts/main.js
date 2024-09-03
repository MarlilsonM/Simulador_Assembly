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
            window.interpreter.reset();
            isRunning = false;
        }

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
    
        // Verifica se o código está carregado
        if (!window.interpreter.memory || window.interpreter.memory.length === 0) {
            window.interpreter.loadProgram(code);
        }
        window.interpreter.executeStep();
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