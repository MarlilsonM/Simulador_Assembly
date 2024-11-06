# Documentação do Simulador de Assembly

## Visão Geral
O Simulador de Assembly é uma ferramenta educacional avançada que permite aos usuários escrever, executar e depurar programas em linguagem assembly. O simulador oferece uma interface interativa com representação gráfica em tempo real dos estados dos registradores e da memória, além de suporte a operações SIMD (Single Instruction, Multiple Data).

## Funcionalidades
- **Editor de Código Avançado**: Escreva e edite código assembly com realce de sintaxe e autocompletar.
- **Controles de Execução Flexíveis**: Execute, pause, avance passo a passo e reinicie a execução do seu programa.
- **Depuração Robusta**: Defina breakpoints para pausar a execução em linhas específicas e inspecione o estado do programa.
- **Visualização Gráfica Dinâmica**: Visualização em tempo real dos estados dos registradores, memória e pilha.
- **Suporte a SIMD**: Instruções vetoriais para operações em paralelo, aumentando a eficiência de cálculos.
- **Feedback Detalhado**: Mensagens informativas sobre cada operação executada e possíveis erros.

## Interface do Usuário
- **Barra de Controle**: Contém botões para executar, pausar, avançar passo a passo e reiniciar o programa.
- **Editor de Código**: Área principal para escrever e editar código assembly.
- **Painel de Depuração**: Exibe o estado atual dos registradores, flags e memória.
- **Visualização Gráfica**: Mostra gráficos dinâmicos dos valores dos registradores e uso da memória.
- **Console de Saída**: Exibe mensagens de execução, erros e saída do programa.

## Começando
1. **Escrevendo Código**: Use o editor integrado para escrever seu código em assembly.
2. **Executando Código**: 
   - Clique em "Executar" para rodar o programa completo.
   - Use "Passo a Passo" para executar uma instrução de cada vez.
   - Ajuste a velocidade de execução conforme necessário.
3. **Definindo Breakpoints**: Clique na margem esquerda do editor para adicionar/remover breakpoints.
4. **Reiniciando**: Use "Reiniciar" para limpar o programa e resetar registradores e memória.
5. **Analisando Resultados**: Observe as mudanças nos registradores, memória e pilha após cada execução.

## Registradores e Flags
### Registradores de Propósito Geral
- `r0` a `r6`: Registradores de 32 bits para uso geral.

### Registradores Especiais
- `SP` (Stack Pointer): Aponta para o topo da pilha.
- `PC` (Program Counter): Contém o endereço da próxima instrução a ser executada.

### Flags
- `FLAGS`: Registrador de flags.
  - Bit 0: Zero Flag (ZF) - Definido quando o resultado de uma operação é zero.
  - Bit 1: Greater Flag (GF) - Definido quando o resultado de uma comparação é maior.
  - Bit 2: Less Flag (LF) - Definido quando o resultado de uma comparação é menor.

### Registradores Vetoriais (SIMD)
- `v0` a `v3`: Registradores vetoriais de 128 bits, cada um contendo 4 valores de ponto flutuante.

## Memória
- Tamanho total: 1000 unidades (endereços de 0 a 999).
- Divisão:
  - Seção de Instruções: Armazena o código do programa.
  - Seção de Dados: Armazena variáveis e dados do programa.
- Acesso: Use colchetes para acessar endereços de memória, ex: `[100]`.

## Conjunto de Instruções

### Instruções de Movimentação de Dados
- `MOV destino, fonte`: Move dados entre registradores ou da memória para um registrador.
- `LOAD destino, [endereço]`: Carrega um valor da memória para um registrador.
- `STORE [endereço], fonte`: Armazena um valor de um registrador na memória.

### Instruções Aritméticas
- `ADD destino, fonte`: Adiciona o valor da fonte ao destino.
- `SUB destino, fonte`: Subtrai o valor da fonte do destino.
- `MUL destino, fonte`: Multiplica o destino pela fonte.
- `DIV destino, fonte`: Divide o destino pela fonte.

### Instruções Lógicas
- `AND destino, fonte`: Realiza operação AND bit a bit.
- `OR destino, fonte`: Realiza operação OR bit a bit.
- `XOR destino, fonte`: Realiza operação XOR bit a bit.
- `NOT destino`: Inverte os bits do destino.

### Instruções de Controle de Fluxo
- `JMP label`: Salta incondicionalmente para a label especificada.
- `JE label`: Salta se igual (Zero Flag = 1).
- `JNE label`: Salta se não igual (Zero Flag = 0).
- `JG label`: Salta se maior (Greater Flag = 1).
- `JL label`: Salta se menor (Less Flag = 1).
- `CMP op1, op2`: Compara op1 com op2 e define flags.
- `CALL label`: Chama uma subrotina.
- `RET`: Retorna de uma subrotina.

### Instruções de Pilha
- `PUSH valor`: Empilha um valor.
- `POP destino`: Desempilha um valor para o destino.
- `DUP`: Duplica o elemento no topo da pilha.
- `SWAP`: Troca os dois elementos no topo da pilha.
- `ROT`: Rotaciona os três elementos no topo da pilha.

### Instruções SIMD
- `VADD v_dest, v_src1, v_src2`: Soma vetorial.
- `VMUL v_dest, v_src1, v_src2`: Multiplicação vetorial.
- `VDIV v_dest, v_src1, v_src2`: Divisão vetorial.
- `VLOAD v_dest, [endereço]`: Carrega um vetor da memória.
- `VSTORE [endereço], v_src`: Armazena um vetor na memória.

### Finalizar o programa
- `END`: Informa ao simulador que chegou ao fim.

## Modos de Execução
1. **Execução Contínua**: O programa é executado do início ao fim sem interrupções.
2. **Execução Passo a Passo**: O usuário controla a execução de cada instrução individualmente.
3. **Execução até Breakpoint**: O programa é executado até encontrar um breakpoint definido pelo usuário.

### Ajuste de Velocidade
Use o seletor de velocidade para ajustar a rapidez da execução contínua:
- Lento: 1 instrução por segundo
- Médio: 5 instruções por segundo
- Rápido: 20 instruções por segundo

## Depuração
- **Definindo Breakpoints**: Clique na margem esquerda do editor ao lado do número da linha.
- **Inspecionando Estado**: Use o painel de depuração para ver o estado atual dos registradores e memória.
- **Avançando**: Use o botão "Passo a Passo" para avançar uma instrução por vez durante a depuração.

## Visualização
- **Gráfico de Registradores**: Mostra os valores atuais dos regist adores em tempo real.
- **Gráfico de Memória**: Exibe a utilização da memória e os valores armazenados em endereços específicos.
- **Histórico de Execução**: Registra as instruções executadas e seus resultados.

## Exemplos de Programas

### Exemplo 1: Soma Simples
MOV r0, 5    ; Carrega 5 em r0
MOV r1, 3    ; Carrega 3 em r1
ADD r0, r1   ; Soma r1 a r0
END

### Exemplo 2: Loop com Contador
MOV r0, 0    ; Inicializa contador
MOV r1, 10   ; Limite
loop:
ADD r0, 1    ; Incrementa o contador
CMP r0, r1   ; Compara o contador com o limite
JNE loop     ; Se não igual, volta para o loop
END

### Exemplo 3: Cálculo de Fatorial
MOV r0, 5    ; Número para calcular o fatorial
MOV r1, 1    ; Resultado inicial

factorial:
MUL r1, r0   ; Multiplica o resultado pelo número atual
SUB r0, 1    ; Decrementa o número
CMP r0, 1    ; Compara com 1
JNE factorial ; Se não igual a 1, continua o loop
; Resultado final em r1
END

### Exemplo 4: Uso de Pilha
MOV r0, 10
MOV r1, 20
MOV r2, 30
PUSH r0      ; Empilha 10
PUSH r1      ; Empilha 20
PUSH r2      ; Empilha 30
DUP          ; Duplica o topo (30)
SWAP         ; Troca os dois elementos do topo
ROT          ; Rotaciona os três elementos do topo
POP r3       ; Desempilha para r3
POP r4       ; Desempilha para r4
POP r5       ; Desempilha para r5
END

### Exemplo 5: Operações SIMD
; Inicializa os dados na memória
MOV [100], 1
MOV [101], 2
MOV [102], 3
MOV [103], 4

MOV [104], 2
MOV [105], 3
MOV [106], 4
MOV [107], 5

; Carrega dois vetores de 4 elementos da memória
VLOAD v0, [100]   ; Carrega primeiro vetor
VLOAD v1, [104]   ; Carrega segundo vetor

; Realiza operações vetoriais
VADD v2, v0, v1   ; Soma os vetores elemento a elemento
VMUL v3, v0, v1   ; Multiplica os vetores elemento a elemento

; Armazena os resultados na memória (corrigindo a ordem dos argumentos)
VSTORE v2, [108]  ; Armazena resultado da soma
VSTORE v3, [112]  ; Armazena resultado da multiplicação
END

### Exemplo 6: Soma de Array
; Soma elementos de um array
MOV r0, 0      ; Inicializa soma
MOV r1, 100    ; Endereço base do array
MOV r2, 5      ; Tamanho do array
MOV r3, 0      ; Contador

loop_soma:
LOAD r4, [r1]  ; Carrega elemento do array
ADD r0, r4     ; Adiciona à soma
ADD r1, 1      ; Próximo endereço
ADD r3, 1      ; Incrementa contador
CMP r3, r2     ; Compara com tamanho
JNE loop_soma  ; Continua se não terminou
; Resultado em r0
END

### Exemplo 7: Busca do Maior Valor
; Inicialização do array
MOV [100], 30
MOV [101], 50
MOV [102], 20
MOV [103], 90
MOV [104], 10

; Código para encontrar o maior valor
MOV r0, [100]  ; Primeiro elemento como maior
MOV r1, 100    ; Endereço base
MOV r2, 5      ; Tamanho
MOV r3, 1      ; Contador

loop_maior:
MOV r5, r1     ; Começa com o endereço base
ADD r5, r3     ; Adiciona o offset do contador
MOV r4, [r5]   ; r4 = conteúdo do endereço em r5
CMP r4, r0     ; Compara com maior atual
JLE nao_maior  ; Pula se não for maior
MOV r0, r4     ; Atualiza maior valor

nao_maior:
ADD r3, 1      ; Incrementa contador
CMP r3, r2     ; Compara com tamanho
JNE loop_maior ; Continua se não terminou
END

### Exemplo 8: Fibonacci
; Calcula n números da sequência de Fibonacci
MOV r0, 0      ; Primeiro número
MOV r1, 1      ; Segundo número
MOV r2, 10     ; Quantidade de números
MOV r3, 2      ; Contador
MOV r4, 200    ; Endereço inicial para armazenar

STORE [r4], r0 ; Armazena primeiro número
ADD r4, 1
STORE [r4], r1 ; Armazena segundo número
ADD r4, 1

fib_loop:
MOV r5, r1     ; Guarda n-1
ADD r1, r0     ; Novo número
MOV r0, r5     ; Atualiza n-2
STORE [r4], r1 ; Armazena novo número
ADD r4, 1
ADD r3, 1      ; Incrementa contador
CMP r3, r2     ; Compara com limite
JNE fib_loop   ; Continua se não terminou
END

### Exemplo 9: Ordenação Bubble Sort
; Bubble Sort de um array
MOV r0, 100    ; Endereço base
MOV r1, 5      ; Tamanho do array
SUB r1, 1      ; Tamanho - 1 para comparações

outer_loop:
MOV r2, 0      ; Índice interno
MOV r3, 0      ; Flag de troca

inner_loop:
LOAD r4, [r0+r2]     ; Elemento atual
LOAD r5, [r0+r2+1]   ; Próximo elemento
CMP r4, r5
JLE no_swap          ; Pula se já estiver ordenado

; Troca elementos
STORE [r0+r2], r5
STORE [r0+r2+1], r4
MOV r3, 1            ; Marca que houve troca

no_swap:
ADD r2, 1            ; Próximo índice
CMP r2, r1           ; Compara com limite
JNE inner_loop       ; Continua loop interno

CMP r3, 0            ; Verifica se houve trocas
JNE outer_loop       ; Continua se houve trocas
END

### Exemplo 10: Multiplicação de Matrizes usando SIMD
; Multiplicação de matrizes 2x2 usando SIMD
; Matriz 1 em [300-303], Matriz 2 em [304-307]
; Resultado em [308-311]

; Carrega primeira linha da matriz 1
VLOAD v0, [300]

; Carrega primeira coluna da matriz 2
MOV r0, 304
MOV r1, 306
LOAD r2, [r0]
LOAD r3, [r1]
STORE [400], r2
STORE [401], r3
VLOAD v1, [400]

; Multiplica e soma
VMUL v2, v0, v1
; Resultado parcial em v2

; Carrega segunda coluna da matriz 2
ADD r0, 1
ADD r1, 1
LOAD r2, [r0]
LOAD r3, [r1]
STORE [400], r2
STORE [401], r3
VLOAD v1, [400]

; Multiplica e soma
VMUL v3, v0, v1
; Resultado final da primeira linha em v2, v3

; Repete para segunda linha
VLOAD v0, [302]
; ... (processo similar)
END

### Exemplo 11: Cálculo de Média Móvel
; Calcula média móvel de 3 elementos
MOV r0, 100    ; Endereço fonte
MOV r1, 200    ; Endereço destino
MOV r2, 10     ; Tamanho do array
MOV r3, 2      ; Contador (começa em 2 para ter 3 elementos)

media_loop:
LOAD r4, [r0+r3]   ; Elemento atual
LOAD r5, [r0+r3-1] ; Elemento anterior
LOAD r6, [r0+r3-2] ; Dois elementos atrás

ADD r4, r5         ; Soma os três
ADD r4, r6
DIV r4, 3          ; Divide por 3 para média

STORE [r1+r3-2], r4 ; Armazena resultado
ADD r3, 1           ; Próximo índice
CMP r3, r2          ; Compara com tamanho
JNE media_loop      ; Continua se não terminou
END

### Exemplo 12: Manipulação de Pilha Avançada
; Exemplo de uso avançado da pilha
MOV r0, 10
MOV r1, 20
MOV r2, 30

; Salva contexto
PUSH r0
PUSH r1
PUSH r2

; Manipula valores
DUP        ; Duplica topo (30)
ROT        ; Rotaciona três elementos
SWAP       ; Troca dois elementos do topo
DUP        ; Duplica novo topo

; Operações com valores na pilha
POP r3
POP r4
ADD r3, r4
PUSH r3

; Restaura contexto original
POP r5     ; Remove resultado temporário
POP r2
POP r1
POP r0
END

### Exemplo 13: Processamento Condicional com SIMD
; Processa array com condicionais usando SIMD
VLOAD v0, [100]    ; Carrega 4 elementos
VLOAD v1, [104]    ; Carrega próximos 4

; Compara e processa
VADD v2, v0, v1    ; Soma vetores
VMUL v3, v2, v0    ; Multiplica resultado

; Armazena resultados
VSTORE [108], v2
VSTORE [112], v3
END

### Dicas de Uso
- Use comentários (;) para documentar seu código.
- Utilize labels para organizar seu código e facilitar saltos.
- Aproveite as visualizações gráficas para entender o fluxo de execução.
- Experimente diferentes velocidades de execução para analisar o comportamento do programa.

### Resolução de Problemas
- Utilize os breakpoints estrategicamente para isolar seções problemáticas do código.
- Analise cuidadosamente as mensagens de erro para identificar problemas específicos de sintaxe ou lógica.
- Verifique o estado dos registradores e flags após operações de comparação para garantir que os saltos condicionais estão funcionando como esperado.
- Para operações SIMD, certifique-se de que os endereços de memória estão alinhados corretamente.
- Se encontrar comportamentos inesperados em operações de pilha, verifique se o ponteiro da pilha (SP) está sendo gerenciado corretamente.

### Limitações e Considerações
- Tamanho máximo do programa: 1000 instruções.
- O desempenho pode ser afetado por programas muito grandes ou complexos.