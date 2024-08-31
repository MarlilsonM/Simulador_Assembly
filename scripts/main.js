document.getElementById('run-btn').addEventListener('click', () => {
    const code = window.editor.getValue();
    window.interpreter.loadProgram(code);
    const speed = document.getElementById('speed-select').value;
    window.interpreter.run(speed);
});

document.getElementById('step-btn').addEventListener('click', () => {
    window.interpreter.executeStep();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    window.interpreter.reset();
});

document.getElementById('speed-select').addEventListener('change', (event) => {
    console.log('Speed changed to:', event.target.value);
});

document.getElementById('bit-width-select').addEventListener('change', (event) => {
    console.log('Bit width changed to:', event.target.value);
});
