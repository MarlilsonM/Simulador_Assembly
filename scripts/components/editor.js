/**
 * editor.js
 * 
 * @description
 * Este script configura o editor de código CodeMirror para o simulador Assembly.
 * Ele inicializa o editor com configurações específicas para assembly e adiciona
 * suporte para autocompletar e breakpoints.
 * 
 * @module Editor
 */

document.addEventListener('DOMContentLoaded', () => {
    // Remove qualquer instância existente do editor
    if (window.editor) {
        window.editor.toTextArea();
    }
    
    /**
     * Inicializa o editor CodeMirror com configurações específicas.
     * 
     * @function
     * @returns {CodeMirror} O editor CodeMirror inicializado.
     */
    window.editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'gas', // Define o modo como assembly
        lineNumbers: true, // Mostra números das linhas
        matchBrackets: true, // Destaca colchetes correspondentes
        autoCloseBrackets: true, // Fecha colchetes automaticamente
        gutters: ["CodeMirror-linenumbers", "breakpoints"],  // Adiciona suporte a breakpoints
    });

    window.editor.setValue(`; Este é um exemplo de código Assembly
MOV r0, 5          ; Move 5 para o registrador r0
MOV r1, 10         ; Move 10 para o registrador r1
ADD r0, r1         ; Adiciona r0 e r1
SUB r1, r0         ; Subtrai r0 de r1
; Fim do programa
END`);

    let autocompleteTimeout;

    // Adiciona um evento de input para acionar o autocompletar
    window.editor.on('inputRead', (cm, change) => {
        clearTimeout(autocompleteTimeout); // Limpa o timeout anterior
        autocompleteTimeout = setTimeout(() => {
            CodeMirror.commands.autocomplete(cm); // Aciona a função de autocompletar
        }, 300); // Ajuste o tempo conforme necessário
    });

    // Adiciona um evento de toque para acionar o autocompletar
    window.editor.on('touchstart', (cm) => {
        CodeMirror.commands.autocomplete(cm); // Aciona a função de autocompletar
    });

    /**
     * Registra um helper de autocompletar para o modo "gas".
     * 
     * @function
     * @param {CodeMirror} cm - Instância do editor CodeMirror.
     * @returns {Object} Objeto contendo a lista de sugestões de autocompletar.
     */
    CodeMirror.registerHelper("hint", "gas", function(cm) {
        var wordList = [
            "NOP", "ADD", "SUB", "MUL", "DIV",
            "AND", "OR", "XOR", "NOT", "CMP",
            "MOV", "LOAD", "STORE", "INC", "DEC",
            "JMP", "JE", "JNE", "JG", "JGE",
            "JZ", "JNZ", "JC", "JNC", "JO",
            "JNO", "JL", "JLE", "JBE", "JA",
            "JAE", "JB",
            "CALL", "RET",
            "PUSH", "POP", "DUP", "SWAP", "ROT", 
            "VADD", "VMUL", "VDIV", "VLOAD", "VSTORE",
            "SETMATSIZE"
        ];
        var cursor = cm.getCursor();
        var token = cm.getTokenAt(cursor);
        var start = token.start;
        var end = cursor.ch;

        return {
            list: wordList.filter(function(word) {
                return word.toUpperCase().startsWith(token.string.toUpperCase()); // Filtra palavras que começam com o texto atual
            }),
            from: CodeMirror.Pos(cursor.line, start), // Posição inicial da sugestão
            to: CodeMirror.Pos(cursor.line, end) // Posição final da sugestão
        };
    });
    
    /**
     * Adiciona estilos CSS para a gutter de breakpoints.
     * 
     * @function
     */
    const style = document.createElement('style');
    style.textContent = `
        .CodeMirror-gutters { cursor: pointer; }
        .breakpoint { color: #822; }
        .CodeMirror-gutter-wrapper:hover { background: rgba(0,0,0,0.1); }
        .breakpoint-gutter { width: 1.5em; }
    `;
    document.head.appendChild(style);

    /**
     * Dispara um evento personalizado 'editorReady' quando o editor está pronto.
     * 
     * @function
     */
    setTimeout(() => {
        window.dispatchEvent(new Event('editorReady'));
    }, 100);
});