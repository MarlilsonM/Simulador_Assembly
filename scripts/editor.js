document.addEventListener('DOMContentLoaded', () => {
    if (window.editor) {
        console.log("Editor antigo encontrado, destruindo...");
        window.editor.toTextArea(); // Destroi o editor antigo
    }
    
    console.log("Inicializando o novo editor...");
    window.editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'gas', // Definir como modo assembly
        lineNumbers: true, // Mostrar números das linhas
        matchBrackets: true, // Destacar colchetes correspondentes
        autoCloseBrackets: true, // Fechar colchetes automaticamente
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }
    });

    console.log("Editor inicializado", window.editor);
});