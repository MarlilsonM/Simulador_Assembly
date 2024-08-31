document.addEventListener('DOMContentLoaded', () => {
    // Primeiro, instancie o interpretador
    window.interpreter = new Interpreter();

    // Agora, instancie o debugger, passando o interpretador como parâmetro
    window.debugger = new Debugger(window.interpreter);

    console.log("Debugger inicializado:", window.debugger);

    document.getElementById('run-btn').addEventListener('click', () => {
        const code = window.editor.getValue();
        window.interpreter.loadProgram(code);
        const speed = document.getElementById('speed-select').value;
        window.interpreter.run(speed);
    });

    document.getElementById('step-btn').addEventListener('click', () => {
        console.log("Executando passo...");
        window.interpreter.executeStep();
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        console.log("Resetando...");
        window.interpreter.reset();
    });

    document.getElementById('speed-select').addEventListener('change', (event) => {
        console.log('Speed changed to:', event.target.value);
    });

    document.getElementById('bit-width-select').addEventListener('change', (event) => {
        console.log('Bit width changed to:', event.target.value);
    });
});