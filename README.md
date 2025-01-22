# Simulador Assembly

## Site

Link do site: https://marlilsonm.github.io/Simulador_Assembly/

## Visão Geral

O Simulador Assembly é uma ferramenta educacional avançada que permite aos usuários escrever, executar e depurar programas em linguagem assembly. Este simulador oferece uma interface interativa com representação gráfica em tempo real dos estados dos registradores e da memória, além de suporte a operações SIMD (Single Instruction, Multiple Data).

## Funcionalidades
- Editor de Código Avançado: Escreva e edite código assembly com realce de sintaxe e autocompletar.
- Controles de Execução Flexíveis: Execute, pause, avance passo a passo e reinicie a execução do seu programa.
- Depuração Robusta: Defina breakpoints para pausar a execução em linhas específicas e inspecione o estado do programa.
- Visualização Gráfica Dinâmica: Visualização em tempo real dos estados dos registradores, memória e pilha.
- Suporte a SIMD: Instruções vetoriais para operações em paralelo, aumentando a eficiência de cálculos.
- Feedback Detalhado: Mensagens informativas sobre cada operação executada e possíveis erros.

## Começando

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari ou Edge)
- Servidor web local (como Live Server para VS Code) ou hospedagem web

### Instalação

1. Clone o repositório:
   git clone https://github.com/MarlilsonM/Simulador_Assembly.git

2. Navegue até o diretório do projeto:
   cd Simulador_Assembly

3. Abra o arquivo `index.html` em seu navegador ou use um servidor web local para servir os arquivos.

### Uso

1. Escreva seu código assembly no editor de texto.
2. Use os botões de controle para executar, pausar ou avançar passo a passo no seu programa.
3. Defina breakpoints clicando na margem esquerda do editor.
4. Observe as mudanças nos registradores, memória e pilha na visualização gráfica.
5. Para mais exemplos acesse o manual: https://github.com/MarlilsonM/Simulador_Assembly/blob/main/docs/manual.md

### Conjunto de Instruções

O simulador suporta um amplo conjunto de instruções, incluindo:

**Instruções de Movimentação de Dados**
- *MOV* destino, fonte
- *LOAD* destino, [endereço]
- *STORE* [endereço], fonte

**Instruções Aritméticas**
- *ADD* destino, fonte
- *SUB* destino, fonte
- *MUL* destino, fonte
- *DIV* destino, fonte
- *INC* destino
- *DEC* destino

**Instruções Lógicas**
- *AND* destino, fonte
- *OR* destino, fonte
- *XOR* destino, fonte
- *NOT* destino
- *CMP* op1, op2

**Instruções de Salto Condicional**
- *JMP* label
- *JE* label
- *JNE* label
- *JG* label
- *JGE* label
- *JL* label
- *JLE* label
- *JZ* label
- *JNZ* label
- *JC* label
- *JNC* label
- *JO* label
- *JNO* label
- *JB* label
- *JBE* label
- *JA* label
- *JAE* label

**Instruções de Pilha**
- *PUSH* valor
- *POP* destino
- *DUP*
- *SWAP*
- *ROT*

*Instruções SIMD*
- *SETMATSIZE* tamanho
- *VADD* v_dest, v_src1, v_src2
- *VMUL* v_dest, v_src1, v_src2
- *VDIV* v_dest, v_src1, v_src2
- *VLOAD* v_dest, [endereço]
- *VSTORE* [endereço], v_src

## Contribuindo
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorar o simulador.

## Contato

E-mail - antoniomarlilson@gmail.com

LinkedIn - [Antonio Marlilson](https://www.linkedin.com/in/antonio-marlilson-9aab2a219/)

Link do Projeto: https://github.com/MarlilsonM/Simulador_Assembly

Agradecimentos

- **CodeMirror** (https://codemirror.net/): Uma biblioteca de editor de código que fornece uma interface rica e interativa para edição de código em diversas linguagens.

- **Chart.js** (https://www.chartjs.org/): Uma biblioteca de visualização de dados que permite criar gráficos interativos e responsivos de maneira fácil e rápida.

- **Split.js** (https://split.js.org/): Uma biblioteca leve para dividir a tela em painéis ajustáveis.
- Todos os contribuidores que ajudaram a melhorar este projeto