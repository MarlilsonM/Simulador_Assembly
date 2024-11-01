class ThemeToggle {
    constructor() {
        this.toggleButton = document.getElementById('toggle-theme');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(this.currentTheme);
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateSvgAttributes(theme);
    }

    toggleTheme() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' 
            ? 'dark' 
            : 'light';
        this.setTheme(newTheme);
    }

    updateSvgAttributes(theme) {
        const moonCircle = document.querySelector('.sun-and-moon > .moon > circle');
        if (moonCircle) {
            if (theme === 'dark') {
                moonCircle.setAttribute('cx', '16'); // Ajuste o valor conforme necessário
            } else {
                moonCircle.setAttribute('cx', '30 '); // Ajuste o valor conforme necessário
            }
        }
    }
}

new ThemeToggle();