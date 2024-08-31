document.addEventListener('DOMContentLoaded', function() {
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: "assembly",
        theme: "default",
        autoCloseBrackets: true,
        matchBrackets: true,
    });
    
    window.editor = editor;
});
