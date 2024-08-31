class Visualization {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.canvas = document.getElementById('execution-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;  // Variável para armazenar a instância do gráfico
    }

    updateVisualization() {
        // Obtenha os registradores e seus valores
        const registers = this.interpreter.registers;
        const labels = Object.keys(registers);
        const data = Object.values(registers);

        // Se já existir um gráfico, destrua-o antes de criar um novo
        if (this.chart) {
            this.chart.destroy();
        }

        // Crie o gráfico usando Chart.js
        this.chart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valores dos Registradores',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',  // Azul mais forte
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // Manter o passo do eixo Y
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top' // Mover a legenda para o topo
                    }
                }
            }
        });
    }

    drawMemory() {
        const memory = this.interpreter.memory;
        const cellSize = 20;
        const cols = Math.floor(this.canvas.width / cellSize);
        const rows = Math.ceil(memory.length / cols);
        
        // Limpa o canvas antes de desenhar a memória
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        memory.forEach((value, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * cellSize;
            const y = this.canvas.height / 2 + row * cellSize;

            // Desenhar a célula de memória
            this.ctx.fillStyle = value !== 0 ? 'green' : 'gray';
            this.ctx.fillRect(x, y, cellSize, cellSize);

            // Desenhar o valor da memória
            this.ctx.fillStyle = 'black';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(value, x + 4, y + 15);
        });
    }
}