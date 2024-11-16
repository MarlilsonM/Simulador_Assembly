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
- `MOV destino, fonte`: Move dados entre registradores ou entre registrador e memória.
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
- `CMP op1, op2`: Compara op1 com op2 e define flags.

### Instruções de Salto Condicional
- `JMP label`: Salto incondicional.
- `JE label`: Salta se igual (Zero Flag = 1).
- `JNE label`: Salta se não igual (Zero Flag = 0).
- `JG label`: Salta se maior.
- `JGE label`: Salta se maior ou igual.
- `JL label`: Salta se menor.
- `JLE label`: Salta se menor ou igual.
- `JZ label`: Salta se zero.
- `JNZ label`: Salta se não zero.
- `JC label`: Salta se carry.
- `JNC label`: Salta se não carry.
- `JO label`: Salta se overflow.
- `JNO label`: Salta se não overflow.
- `JB label`: Salta se abaixo (Below).
- `JBE label`: Salta se abaixo ou igual.
- `JA label`: Salta se acima (Above).
- `JAE label`: Salta se acima ou igual.

### Instruções de Subrotina
- `CALL label`: Chama uma subrotina.
- `RET`: Retorna de uma subrotina.

### Instruções de Pilha
- `PUSH valor`: Empilha um valor.
- `POP destino`: Desempilha um valor para o destino.
- `DUP`: Duplica o elemento no topo da pilha.
- `SWAP`: Troca os dois elementos no topo da pilha.
- `ROT`: Rotaciona os três elementos no topo da pilha.

### Instruções SIMD (Single Instruction, Multiple Data)
- `SETMATSIZE tamanho`: Define o tamanho da matriz/vetor para operações SIMD.
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
```assembly
MOV r0, 5    ; Carrega 5 em r0
MOV r1, 3    ; Carrega 3 em r1
ADD r0, r1   ; Soma r1 a r0
END
```

### Exemplo 2: Loop com Contador
```assembly
MOV r0, 0    ; Inicializa contador
MOV r1, 10   ; Limite
loop:
ADD r0, 1    ; Incrementa o contador
CMP r0, r1   ; Compara o contador com o limite
JNE loop     ; Se não igual, volta para o loop
END
```

### Exemplo 3: Cálculo de Fatorial
```assembly
MOV r0, 5    ; Número para calcular o fatorial
MOV r1, 1    ; Resultado inicial

factorial:
MUL r1, r0   ; Multiplica o resultado pelo número atual
SUB r0, 1    ; Decrementa o número
CMP r0, 1    ; Compara com 1
JNE factorial ; Se não igual a 1, continua o loop
; Resultado final em r1
END
```

### Exemplo 4: Uso de Pilha
```assembly
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
```

### Exemplo 5: Operações SIMD
```assembly
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
```

### Exemplo 6: Soma de Array
```assembly
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
```

### Exemplo 7: Busca do Maior Valor
```assembly
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
```

### Exemplo 8: Fibonacci
```assembly
; Calcula n números da sequência de Fibonacci
MOV r0, 0      ; Primeiro número
MOV r1, 1      ; Segundo número
MOV r2, 10     ; Quantidade de números
MOV r3, 2      ; Contador
MOV r4, 100    ; Endereço inicial para armazenar (mudado para 100)

; Tente diferentes formas de armazenar na memória
MOV [r4], r0   ; Tenta armazenar usando MOV
ADD r4, 1
MOV [r4], r1
ADD r4, 1

fib_loop:
MOV r5, r1     ; Guarda n-1
ADD r1, r0     ; Novo número
MOV r0, r5     ; Atualiza n-2
MOV [r4], r1   ; Tenta armazenar usando MOV
ADD r4, 1
ADD r3, 1      ; Incrementa contador
CMP r3, r2     ; Compara com limite
JNE fib_loop   ; Continua se não terminou
END
```

### Exemplo 9: Ordenação Bubble Sort
```assembly
; Inicialização do array
MOV [100], 5
MOV [101], 3
MOV [102], 8
MOV [103], 1
MOV [104], 4

; Bubble Sort
MOV r0, 100    ; Endereço base do array
MOV r1, 5      ; Tamanho do array
SUB r1, 1      ; r1 = tamanho - 1 (número de comparações)

outer_loop:
MOV r2, 0      ; Índice para o loop interno
MOV r3, 0      ; Flag de troca

inner_loop:
MOV r4, [r0]   ; Carrega o elemento atual
ADD r0, 1      ; Avança para o próximo elemento
MOV r5, [r0]   ; Carrega o próximo elemento
SUB r0, 1      ; Volta para o elemento atual
CMP r4, r5
JLE no_swap    ; Se r4 <= r5, não precisa trocar

; Troca os elementos
MOV [r0], r5
ADD r0, 1
MOV [r0], r4
SUB r0, 1
MOV r3, 1      ; Marca que houve troca

no_swap:
ADD r2, 1      ; Incrementa o índice interno
ADD r0, 1      ; Avança para o próximo par de elementos
CMP r2, r1
JNE inner_loop ; Continua o loop interno se r2 != r1

SUB r0, r1     ; Reseta r0 para o início do array
CMP r3, 0      ; Verifica se houve alguma troca
JNE outer_loop ; Se houve troca, repete o loop externo
END
```

### Exemplo 10: Multiplicação de Matrizes usando SIMD
```assembly
; Versão corrigida com operações vetoriais
SETMATSIZE 4  ; Define o tamanho da matriz para 4x4

; Matriz 1 (2x2):
MOV [300], 1
MOV [301], 2
MOV [302], 3
MOV [303], 4

; Matriz 2 (2x2):
MOV [304], 5
MOV [305], 6
MOV [306], 7
MOV [307], 8

; Carregar as matrizes em registradores vetoriais
VLOAD v0, [300]  ; v0 = [1, 2, 3, 4]
VLOAD v1, [304]  ; v1 = [5, 6, 7, 8]

; Calcular a primeira linha da matriz resultante
VMUL v2, v0, v1  ; v2 = [1*5, 2*6, 3*7, 4*8]

; Reorganizar v1 para multiplicar com a segunda coluna da matriz 2
MOV [400], 7
MOV [401], 8
MOV [402], 5
MOV [403], 6
VLOAD v3, [400]  ; v3 = [7, 8, 5, 6]

; Calcular a segunda linha da matriz resultante
VMUL v3, v0, v3  ; v3 = [1*7, 2*8, 3*5, 4*6]

; Somar os resultados parciais para obter a matriz final
VADD v0, v2, v3  ; v0 = [1*5+1*7, 2*6+2*8, 3*7+3*5, 4*8+4*6]

; Armazenar o resultado final na memória (ordem correta dos argumentos)
VSTORE v0, [500]
END
```

### Exemplo 11: Cálculo de Média Móvel
```assembly
; Calcula média móvel de 3 elementos
; Primeiro, vamos inicializar alguns valores no array fonte para teste
MOV [100], 10   ; Primeiro elemento
MOV [101], 20   ; Segundo elemento
MOV [102], 30   ; Terceiro elemento
MOV [103], 40   ; Quarto elemento
MOV [104], 50   ; Quinto elemento
MOV [105], 60   ; Sexto elemento
MOV [106], 70   ; Sétimo elemento
MOV [107], 80   ; Oitavo elemento
MOV [108], 90   ; Nono elemento
MOV [109], 100  ; Décimo elemento

; Agora o código principal
MOV r0, 100    ; Endereço fonte
MOV r1, 200    ; Endereço destino
MOV r2, 10     ; Tamanho do array
MOV r3, 2      ; Contador (começa em 2 para ter 3 elementos)

media_loop:
; Calcula endereço do elemento atual
MOV r4, r0     ; Copia endereço base
ADD r4, r3     ; Adiciona offset
LOAD r5, [r4]  ; Carrega elemento atual

; Calcula endereço do elemento anterior
MOV r4, r0     ; Reset endereço base
ADD r4, r3     ; Adiciona offset
SUB r4, 1      ; Subtrai 1 para elemento anterior
LOAD r6, [r4]  ; Carrega elemento anterior

; Calcula endereço do elemento dois atrás
MOV r4, r0     ; Reset endereço base
ADD r4, r3     ; Adiciona offset
SUB r4, 2      ; Subtrai 2 para dois elementos atrás
LOAD r4, [r4]  ; Carrega elemento dois atrás

; Calcula a média
ADD r5, r6     ; Soma primeiro com segundo
ADD r5, r4     ; Soma com terceiro
DIV r5, 3      ; Divide por 3 para média

; Calcula endereço de destino e armazena
MOV r4, r1     ; Endereço destino base
ADD r4, r3     ; Adiciona offset
SUB r4, 2      ; Ajusta para posição correta
MOV [r4], r5   ; Armazena resultado (usando MOV em vez de STORE)

ADD r3, 1      ; Próximo índice
CMP r3, r2     ; Compara com tamanho
JNE media_loop ; Continua se não terminou
END
```

### Exemplo 12: Manipulação de Pilha Avançada
```assembly
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
```

### Exemplo 13: Processamento Condicional com SIMD
```assembly
; Define o tamanho da matriz/vetor
SETMATSIZE 4    ; Define para operar com 4 elementos

; Inicializa dados na memória
MOV [100], 1    ; Primeiro vetor
MOV [101], 2
MOV [102], 3
MOV [103], 4

MOV [104], 5    ; Segundo vetor
MOV [105], 6
MOV [106], 7
MOV [107], 8

; Processa array com condicionais usando SIMD
VLOAD v0, [100]    ; Carrega 4 elementos (1,2,3,4)
VLOAD v1, [104]    ; Carrega próximos 4 elementos (5,6,7,8)

; Compara e processa
VADD v2, v0, v1    ; Soma vetores (1+5, 2+6, 3+7, 4+8) = (6,8,10,12)
VMUL v3, v2, v0    ; Multiplica resultado (6*1, 8*2, 10*3, 12*4) = (6,16,30,48)

; Armazena resultados
VSTORE v2, [108]   ; Armazena resultados da soma
VSTORE v3, [112]   ; Armazena resultados da multiplicação
END
```

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