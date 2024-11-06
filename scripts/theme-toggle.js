document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
        
        // Adicionar o disparo do evento
        const event = new Event('themeChanged');
        document.dispatchEvent(event);
    }

    function updateIcon(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    setTimeout(() => {
        const event = new Event('themeChanged');
        document.dispatchEvent(event);
    }, 0);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' 
            ? 'dark' 
            : 'light';
        setTheme(newTheme);
    });
});