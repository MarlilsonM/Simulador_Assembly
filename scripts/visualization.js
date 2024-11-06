class Visualization {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.canvasRegisters = document.getElementById('execution-canvas-registers');
        this.canvasSP = document.getElementById('execution-canvas-sp');
        
        if (!this.canvasRegisters || !this.canvasSP) {
            throw new Error('Canvas elements not found.');
        }

        this.ctxRegisters = this.canvasRegisters.getContext('2d');
        this.ctxSP = this.canvasSP.getContext('2d');
        
        this.chartRegisters = null;
        this.chartSP = null;
        this.history = [];
        this.maxHistoryPoints = 50;
        this.initialSP = this.interpreter.registers.SP;
        
        this.setupInteractiveEvents();
    }

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

        this.updateRegistersChart(regularLabels, regularData);
        this.updateSPChart();

        this.updateLegend();
    }

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