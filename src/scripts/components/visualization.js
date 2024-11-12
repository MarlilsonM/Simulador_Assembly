/**
 * visualization.js
 * 
 * @description
 * Esta classe gerencia a visualização gráfica dos registradores, registradores vetoriais
 * e do Stack Pointer no simulador Assembly. Utiliza a biblioteca Chart.js para criar
 * gráficos interativos que representam o estado atual da máquina simulada.
 */
class Visualization {
    /**
     * @constructor
     * @param {Interpreter} interpreter - Instância do interpretador
     */
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.canvasRegisters = document.getElementById('execution-canvas-registers');
        this.canvasSP = document.getElementById('execution-canvas-sp');
        
        if (!this.canvasRegisters || !this.canvasSP) {
            throw new Error('Canvas elements not found.');
        }

        this.canvasVectorRegisters = document.getElementById('execution-canvas-vector-registers');
        if (!this.canvasVectorRegisters) {
            throw new Error('Canvas element for vector registers not found.');
        }

        this.ctxVectorRegisters = this.canvasVectorRegisters.getContext('2d');
        this.chartVectorRegisters = null;

        this.ctxRegisters = this.canvasRegisters.getContext('2d');
        this.ctxSP = this.canvasSP.getContext('2d');
        
        this.chartRegisters = null;
        this.chartSP = null;
        this.history = [];
        this.maxHistoryPoints = 50;
        this.initialSP = this.interpreter.registers.SP;
        
        this.setupInteractiveEvents();
    }

    /**
     * Configura eventos interativos para os elementos da visualização.
     * Adiciona tooltips aos registradores e cria legendas para os gráficos.
     */
    setupInteractiveEvents() {
        // Adiciona tooltips nos registradores
        const registers = document.querySelectorAll('[id^="reg-"]');
        registers.forEach(reg => {
            reg.title = 'Clique para ver o histórico';
            reg.style.cursor = 'pointer';
        });

        // Adiciona legenda aos gráficos
        const legendRegisters = document.createElement('div');
        legendRegisters.className = 'visualization-legend';
        this.canvasRegisters.parentNode.appendChild(legendRegisters);

        const legendSP = document.createElement('div');
        legendSP.className = 'visualization-legend';
        this.canvasSP.parentNode.appendChild(legendSP);
    }

    /**
     * Atualiza todos os gráficos de visualização.
     * Coleta dados dos registradores, atualiza o histórico e renderiza os gráficos.
     */
    updateVisualization() {
        const registers = this.interpreter.registers;
        const regularLabels = Object.keys(registers).filter(reg => reg.match(/^r[0-6]$/));
        const regularData = regularLabels.map(label => registers[label]);
        
        // Adiciona dados ao histórico
        this.history.push({
            timestamp: new Date(),
            values: {...registers}
        });

        if (this.history.length > this.maxHistoryPoints) {
            this.history.shift();
        }

        this.updateVectorRegistersChart();
        this.updateRegistersChart(regularLabels, regularData);
        this.updateSPChart();

        this.updateLegend();
    }

    /**
     * Atualiza o gráfico dos registradores vetoriais.
     * Cria um gráfico de barras mostrando os valores dos registradores v0-v3.
     * Suporta modo claro/escuro e fornece tooltips informativos.
     */
    updateVectorRegistersChart() {
        if (this.chartVectorRegisters) {
            this.chartVectorRegisters.destroy();
        }

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#FFFFFF' : '#000000';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const backgroundColor = isDarkMode ? '#1e1e1e' : '#FFF';

        const labels = ['v0', 'v1', 'v2', 'v3'];
        const datasets = [];

        for (let i = 0; i < 4; i++) {
            const values = Array.from(this.interpreter.vectorRegisters[`v${i}`]);
            datasets.push({
                label: `v${i}`,
                data: values,
                backgroundColor: `rgba(${50 + i * 50}, ${100 + i * 40}, ${150 + i * 30}, 0.7)`,
                borderColor: `rgba(${50 + i * 50}, ${100 + i * 40}, ${150 + i * 30}, 1)`,
                borderWidth: 1
            });
        }

        this.chartVectorRegisters = new Chart(this.ctxVectorRegisters, {
            type: 'bar',
            data: {
                labels: ['0', '1', '2', '3'],
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor',
                            color: textColor,
                            font: { weight: 'bold' }
                        },
                        ticks: {
                            color: textColor,
                            font: { weight: 'bold' }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Índice do Vetor',
                            color: textColor,
                            font: { weight: 'bold' }
                        },
                        ticks: {
                            color: textColor,
                            font: { weight: 'bold' }
                        },
                        grid: { color: gridColor }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            font: { weight: 'bold' }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        titleColor: textColor,
                        bodyColor: textColor,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}[${context.dataIndex}] = ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });

        this.ctxVectorRegisters.canvas.style.backgroundColor = backgroundColor;
    }

    /**
     * Atualiza o gráfico dos registradores regulares.
     * Cria um gráfico de barras mostrando os valores dos registradores r0-r6.
     * @param {string[]} labels - Array com os nomes dos registradores
     * @param {number[]} data - Array com os valores dos registradores
     */
    updateRegistersChart(labels, data) {
        if (this.chartRegisters) {
            this.chartRegisters.destroy();
        }
    
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
        const colors = [
            'rgba(255, 99, 132, 0.7)',   // Rosa
            'rgba(54, 162, 235, 0.7)',   // Azul
            'rgba(255, 206, 86, 0.7)',   // Amarelo
            'rgba(75, 192, 192, 0.7)',   // Verde água
            'rgba(153, 102, 255, 0.7)',  // Roxo
            'rgba(255, 159, 64, 0.7)',   // Laranja
            'rgba(199, 199, 199, 0.7)'    // Cinza
        ];
    
        const textColor = isDarkMode ? '#FFFFFF' : '#000000';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const backgroundColor = isDarkMode ? '#1e1e1e' : '#FFF'; // Fundo escuro no modo escuro
    
        this.chartRegisters = new Chart(this.ctxRegisters, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Registradores',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (Hexadecimal)',
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return '0x' + value.toString(16).toUpperCase();
                            },
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        ticks: {
                            callback: function(value, index) {
                                return [`${this.getLabelForValue(value)}`, `(${data[index]})`];
                            },
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return [
                                    `Hex: 0x${value.toString(16).toUpperCase()}`,
                                    `Dec: ${value}`
                                ];
                            }
                        },
                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        titleColor: textColor,
                        bodyColor: textColor
                    }
                }
            }
        });
    
        // Ajusta a cor de fundo do canvas
        this.ctxRegisters.canvas.style.backgroundColor = backgroundColor;
    }
    
    /**
     * Atualiza o gráfico do Stack Pointer.
     * Cria um gráfico de linha mostrando as mudanças no SP ao longo do tempo.
     * Exibe valores em formato hexadecimal e indica aumentos/diminuições.
     */
    updateSPChart() {
        const spData = this.history.map(h => this.initialSP - h.values.SP);
        const labels = this.history.map((_, index) => index);
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
        const textColor = isDarkMode ? '#FFFFFF' : '#000000';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const backgroundColor = isDarkMode ? '#1e1e1e' : '#FFF'; // Fundo escuro no modo escuro
    
        if (this.chartSP) {
            this.chartSP.destroy();
        }
    
        this.chartSP = new Chart(this.ctxSP, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stack Pointer (mudança)',
                    data: spData,
                    borderColor: isDarkMode ? 'rgba(255, 159, 64, 1)' : 'rgba(255 , 159, 64, 0.8)',
                    backgroundColor: isDarkMode ? 'rgba(255, 159, 64, 0.3)' : 'rgba(255, 159, 64, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Mudança no SP',
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return value > 0 ? `-0x${value.toString(16).toUpperCase()}` : `+0x${(-value).toString(16).toUpperCase()}`;
                            },
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tempo',
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return value > 0 
                                    ? `SP diminuiu: 0x${value.toString(16).toUpperCase()}` 
                                    : `SP aumentou: 0x${(-value).toString(16).toUpperCase()}`;
                            }
                        },
                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        titleColor: textColor,
                        bodyColor: textColor,
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1
                    }
                }
            }
        });
    
        // Ajusta a cor de fundo do canvas
        this.ctxSP.canvas.style.backgroundColor = backgroundColor;
    }
    
    /**
     * Atualiza as legendas dos gráficos.
     * Cria e atualiza legendas para os gráficos de registradores e SP.
     * Suporta modo claro/escuro e mantém consistência visual.
     */
    updateLegend() {
        const legendRegisters = this.canvasRegisters.parentNode.querySelector('.visualization-legend');
        const legendSP = this.canvasSP.parentNode.querySelector('.visualization-legend');
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
        const legendStyle = `
            color: ${isDarkMode ? '#FFFFFF' : '#000000'};
            background-color: ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
        `;
    
        if (legendRegisters) {
            legendRegisters.innerHTML = `
                <div class="legend-item" style="${legendStyle}">
                    <span class="legend-color" style="background: rgba(0, 123, 255, 0.7)"></span>
                    <span>Valores dos Registradores</span>
                </div>
            `;
        }

        const legendVectorRegisters = this.canvasVectorRegisters.parentNode.querySelector('.visualization-legend');
        if (legendVectorRegisters) {
            legendVectorRegisters.innerHTML = `
                <div class="legend-item" style="${legendStyle}">
                    <span class="legend-color" style="background: rgba(100, 150, 200, 0.7)"></span>
                    <span>Valores dos Registradores Vetoriais</span>
                </div>
            `;
        }
    
        if (legendSP) {
            legendSP.innerHTML = `
                <div class="legend-item" style="${legendStyle}">
                    <span class="legend-color" style="background: rgba(255, 159, 64, 0.7)"></span>
                    <span>Mudança no Stack Pointer (SP)</span>
                </div>
            `;
        }
    }
}

export default Visualization;