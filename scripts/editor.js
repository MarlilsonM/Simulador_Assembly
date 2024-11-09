/**
 * editor.js
 * 
 * @description
 * Este script configura o editor de código CodeMirror para o simulador Assembly.
 * Ele inicializa o editor com configurações específicas para assembly e adiciona
 * suporte para breakpoints.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Remove qualquer instância existente do editor
    if (window.editor) {
        window.editor.toTextArea();
    }
    
    /**
     * Inicializa o editor CodeMirror com configurações específicas.
     */
    window.editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'gas', // Define o modo como assembly
        lineNumbers: true, // Mostra números das linhas
        matchBrackets: true, // Destaca colchetes correspondentes
        autoCloseBrackets: true, // Fecha colchetes automaticamente
        gutters: ["CodeMirror-linenumbers", "breakpoints"],  // Adiciona suporte a breakpoints
        extraKeys: {
            "Ctrl-Space": "autocomplete" // Ativa autocompletar com Ctrl+Space
        }
    });

    /**
     * Adiciona estilos CSS para a gutter de breakpoints.
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
     */
    setTimeout(() => {
        window.dispatchEvent(new Event('editorReady'));
    }, 100);
});