class Debugger {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    setBreakpoint(line) {
        console.log('Breakpoint set at line:', line);
    }

    inspect() {
        console.log('Registers:', this.interpreter.registers);
        console.log('Memory:', this.interpreter.memory);
    }
}

window.debugger = new Debugger(window.interpreter);
