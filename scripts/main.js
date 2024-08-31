import Interpreter from './interpreter.js';

document.addEventListener('DOMContentLoaded', () => {
    // Primeiro, instancie o interpretador
    window.interpreter = new Interpreter();

    // Agora, instancie o debugger, passando o interpretador como parâmetro
    window.debugger = new Debugger(window.interpreter);

    // Instanciar a visualização e passar o interpretador como parâmetro
    window.visualization = new Visualization(window.interpreter);

    console.log("Debugger inicializado:", window.debugger);
    console.log("Visualização inicializada:", window.visualization);

    let isRunning = false;  // Flag para verificar se o código já está em execução

    // Controle de execução do código
    document.getElementById('play-btn').addEventListener('click', () => {
        if (!isRunning) {  // Apenas iniciar se não estiver em execução
            const code = window.editor.getValue();
            window.interpreter.loadProgram(code);
            const speed = document.getElementById('speed-select').value;
            isRunning = true;
            window.interpreter.run(speed);
        }
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        window.interpreter.stop();
        isRunning = false;  // Permite nova execução após pausar
    });

    document.getElementById('step-btn').addEventListener('click', () => {
        console.log("Executando passo...");
        window.interpreter.executeStep();
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        console.log("Resetando...");
        window.interpreter.reset();
        isRunning = false;  // Permite nova execução após resetar
        window.visualization.updateVisualization();  // Atualizar a visualização
    });

    // Controle de mudanças de velocidade e largura de bits
    document.getElementById('speed-select').addEventListener('change', (event) => {
        console.log('Velocidade alterada para:', event.target.value);
    });

    document.getElementById('bit-width-select').addEventListener('change', (event) => {
        const bitWidth = parseInt(event.target.value, 10);
        window.interpreter.setBitWidth(bitWidth);
        console.log('Largura de bits alterada para:', bitWidth);
    });
});
