class ThemeToggle {
    constructor() {
        this.toggleButton = document.getElementById('toggle-theme');
        this.toggleIcon = document.getElementById('theme-toggle-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.loadSVG();
        
        this.setTheme(this.currentTheme);
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }

    async loadSVG() {
        try {
            const response = await fetch('icons/sun-and-moon.svg');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const svgText = await response.text();
            this.toggleIcon.innerHTML = svgText;
        } catch (error) {
            console.error('Erro ao carregar o SVG:', error);
            this.toggleIcon.innerHTML = '🌓';
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' 
            ? 'dark' 
            : 'light';
        this.setTheme(newTheme);
    }
}

new ThemeToggle();