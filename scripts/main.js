/**
 * main.js
 * 
 * Este arquivo é o ponto de entrada principal para o simulador de Assembly.
 * Ele inicializa os componentes principais (Interpretador, Debugger, Visualização)
 * e configura os event listeners para a interface do usuário.
 */

import Interpreter from './interpreter.js';
import Debugger from './components/debugger.js';
import Visualization from './components/visualization.js';

document.addEventListener('DOMContentLoaded', () => {
    let isRunning = false;
    let initialized = false;

    /**
     * Inicializa os componentes principais do simulador.
     */
    try {
        // Inicializa o interpretador
        window.interpreter = new Interpreter();
        
        // Inicializa o debugger e o associa ao interpretador
        window.debugger = new Debugger(window.interpreter);
        window.interpreter.debugger = window.debugger;

        // Inicializa a visualização
        if (window.interpreter) {
            window.visualizationInstance = new Visualization(window.interpreter);
        } else {
            console.error('Interpretador não encontrado ao criar Visualization');
        }
        
        window.debugger.initialize();
        
        initialized = true;
    } catch (error) {
        console.error('Erro durante a inicialização:', error);
    }

    // Event listener para quando o editor estiver pronto
    window.addEventListener('editorReady', () => {
        // Código a ser executado quando o editor estiver pronto
    });

    /**
     * Atualiza a visualização quando o tema é alterado.
     */
    document.addEventListener('themeChanged', () => {
        if (window.visualizationInstance && typeof window.visualizationInstance.updateVisualization === 'function') {
            window.visualizationInstance.updateVisualization();
        } else {
            console.log('Visualization não encontrada ou método updateVisualization não existe');
            console.log('window.visualizationInstance:', window.visualizationInstance);
        }
    });
    
    /**
     * Configura o event listener para o botão de execução.
     */
    document.getElementById('play-btn').addEventListener('click', () => {
        if (!window.interpreter) return;

        if (isRunning) { 
            window.interpreter.stop();
            isRunning = false;
        }
        
        window.interpreter.reset();
        
        const code = window.editor.getValue();
        window.interpreter.loadProgram(code);
        const speed = document.getElementById('speed-select').value;
        isRunning = true;
        window.interpreter.run(speed);
    });

    /**
     * Configura o event listener para o botão de pausa.
     */
    document.getElementById('pause-btn').addEventListener('click', () => {
        if (!window.interpreter) return;
        window.interpreter.stop();
        isRunning = false;
    });

    /**
     * Configura o event listener para o botão de execução passo a passo.
     */
    document.getElementById('step-btn').addEventListener('click', () => {
        if (!window.interpreter) return;
        
        const code = window.editor.getValue();
        
        if (!window.interpreter.running || window.interpreter.currentInstruction === 0) {
            window.interpreter.loadProgram(code);
            window.interpreter.running = true;
        }

        if (window.interpreter.programLength > 0) {
            try {
                const result = window.interpreter.executeStep();
                            
                if (!result) {
                    window.interpreter.running = false;
                }
            } catch (error) {
                window.interpreter.running = false;
            }
        }
    });

    /**
     * Configura o event listener para o botão de reset.
     */
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (!window.interpreter || !window.visualizationInstance) return;
        window.interpreter.reset();
        isRunning = false;
        window.visualizationInstance.updateVisualization();
    });

    // Definindo os tempos de animação
    window.animationDurations = {
        fast: 100,   // Tempo para animação rápida em milissegundos
        medium: 500, // Tempo para animação média em milissegundos
        slow: 1000   // Tempo para animação lenta em milissegundos
    };

    // Variável para armazenar a velocidade selecionada pelo usuário
    window.selectedSpeed = 'fast'; // Valor padrão


    /**
     * Configura o event listener para a mudança de velocidade.
     */
    document.getElementById('speed-select').addEventListener('change', (event) => {
        window.selectedSpeed = event.target.value; // Atualiza a velocidade com base na seleção do usuário
    });

    /**
     * Configura o event listener para a mudança de largura de bits.
     */
    document.getElementById('bit-width-select').addEventListener('change', (event) => {
        if (!window.interpreter) return;
        const bitWidth = parseInt(event.target.value, 10);
        window.interpreter.setBitWidth(bitWidth);
    });
});