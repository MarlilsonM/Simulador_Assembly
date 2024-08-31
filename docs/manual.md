# Documentação do Simulador de Assembly

## Visão Geral
O Simulador de Assembly permite que os usuários escrevam, executem e depurem programas em linguagem assembly. O simulador fornece uma representação gráfica em tempo real dos estados dos registradores e da memória.

### Funcionalidades
- **Editor de Código**: Escreva e edite código assembly com realce de sintaxe.
- **Controles de Execução**: Execute, pause, passe passo a passo e reinicie a execução do seu programa.
- **Depuração**: Defina breakpoints para pausar a execução em linhas específicas.
- **Visualização Gráfica**: Visualização em tempo real dos estados dos registradores e da memória.

### Começando
1. **Escrevendo Código**: Use o editor para escrever seu código em assembly.
2. **Executando Código**: Clique em "Executar" para executar o código ou em "Passo" para executar uma instrução de cada vez.
3. **Definindo Breakpoints**: Insira um número de linha e clique em "Adicionar Breakpoint" para pausar a execução nessa linha.
4. **Reiniciando**: Clique em "Reiniciar" para limpar o programa e reiniciar os registradores e a memória.

### Funcionalidades Avançadas
- **Acesso à Memória**: Use endereços de memória (por exemplo, `[10]`) em suas instruções para ler ou escrever em locais específicos da memória.
- **Manipulação de Registradores**: Modifique diretamente os registradores A, B, C, D através do seu código assembly.

### Exemplo de Programa
```assembly
MOV A, 5
MOV B, 3
ADD A, B
MOV [10], A
