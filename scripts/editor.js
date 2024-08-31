document.addEventListener('DOMContentLoaded', function() {
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: "gas",  // Usar o modo 'gas' para Assembly
        theme: "default",
        autoCloseBrackets: true,
        matchBrackets: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
    });
    
    window.editor = editor;
});
