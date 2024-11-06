document.addEventListener('DOMContentLoaded', () => {
    if (window.editor) {
        window.editor.toTextArea();
    }
    
    window.editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'gas', // Definir como modo assembly
        lineNumbers: true, // Mostrar números das linhas
        matchBrackets: true, // Destacar colchetes correspondentes
        autoCloseBrackets: true, // Fechar colchetes automaticamente
        gutters: ["CodeMirror-linenumbers", "breakpoints"],  // Adiciona suporte a breakpoints
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }
    });

    // Adicione CSS para a gutter de breakpoints
    const style = document.createElement('style');
    style.textContent = `
        .CodeMirror-gutters { cursor: pointer; }
        .breakpoint { color: #822; }
        .CodeMirror-gutter-wrapper:hover { background: rgba(0,0,0,0.1); }
        .breakpoint-gutter { width: 1.5em; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        window.dispatchEvent(new Event('editorReady'));
    }, 100);

});