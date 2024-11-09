document.addEventListener('DOMContentLoaded', () => {
    // Obtém os elementos necessários do DOM
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    /**
     * Define o tema da aplicação e atualiza o armazenamento local e os ícones.
     * @param {string} theme - O tema a ser definido ('light' ou 'dark').
     */
    function setTheme(theme) {
        // Define o atributo 'data-theme' no elemento raiz do documento
        document.documentElement.setAttribute('data-theme', theme);
        // Armazena o tema no localStorage para persistência
        localStorage.setItem('theme', theme);
        // Atualiza os ícones de tema
        updateIcon(theme);
        
        // Dispara um evento customizado para notificar que o tema foi alterado
        const event = new Event('themeChanged');
        document.dispatchEvent(event);
    }

    /**
     * Atualiza os ícones de tema com base no tema atual.
     * @param {string} theme - O tema atual ('light' ou 'dark').
     */
    function updateIcon(theme) {
        if (theme === 'dark') {
            // Esconde o ícone do sol e mostra o ícone da lua
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            // Mostra o ícone do sol e esconde o ícone da lua
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Obtém o tema atual do localStorage ou usa 'light' como padrão
    const currentTheme = localStorage.getItem('theme') || 'light';
    // Define o tema inicial
    setTheme(currentTheme);

    // Dispara o evento de tema alterado imediatamente após a configuração do tema
    setTimeout(() => {
        const event = new Event('themeChanged');
        document.dispatchEvent(event);
    }, 0);

    // Adiciona um listener para o botão de alternância de tema
    themeToggle.addEventListener('click', () => {
        // Alterna entre os temas 'light' e 'dark'
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' 
            ? 'dark' 
            : 'light';
        setTheme(newTheme);
    });
});