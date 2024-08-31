class Visualization {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.canvas = document.getElementById('execution-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;
    }

    updateVisualization() {
        const registers = this.interpreter.registers;
        const labels = Object.keys(registers);
        const data = Object.values(registers);

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valores dos Registradores',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
}

export default Visualization;