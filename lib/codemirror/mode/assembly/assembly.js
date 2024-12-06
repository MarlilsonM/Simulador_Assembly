// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("gas", function() {
  return {
    startState: function() {
      return {};
    },

    token: function(stream, state) {
      if (stream.eatSpace()) {
        return null; // Ignora espaços em branco
      }

      var ch = stream.next();

      // Identifica comentários
      if (ch === ";") {
        stream.skipToEnd(); // Salta até o final do comentário
        return "comment"; // Aplica o estilo de comentário
      }

      // Identifica palavras-chave
      if (/[A-Za-z]/.test(ch)) {
        stream.eatWhile(/[A-Za-z0-9_]/); // Consome até que o próximo caractere não seja uma letra ou número
        var word = stream.current();
        if ([
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
          "SETMATSIZE", "END",
      ].includes(word.toUpperCase())) {
          return "keyword"; // Marca palavras-chave
        }
        return "variable"; // Marca outras palavras como variável
      }

      // Identifica números hexadecimais (0x)
      if (ch === '0' && stream.eat("x") || stream.eat("b")) {
        stream.eatWhile(/[0-9a-fA-F]/);
        return "number"; // Marca números hexadecimais
      }

      // Identifica números decimais
      if (/\d/.test(ch)) {
        stream.eatWhile(/\d/);
        return "number"; // Marca números decimais
      }

      // Identifica registradores como r0, r1, r2, etc.
      if (ch === 'r') {
        stream.eatWhile(/[0-6]/);
        return "variable"; // Marca os registradores
      }

      return null; // Se não for reconhecido, não aplica nenhum estilo
    }
  };
});


});
