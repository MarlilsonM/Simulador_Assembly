document.addEventListener('DOMContentLoaded', function() {
    const optionsButton = document.getElementById('options-btn');
    const optionsBox = document.querySelector('.options-box');
    const chevronIcon = optionsButton.querySelector('.icon-chevron');

    optionsButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão feche a caixa imediatamente
        optionsBox.classList.toggle('visible');
        const isVisible = optionsBox.classList.contains('visible');
        chevronIcon.src = isVisible ? 'icons/chevron-down.svg' : 'icons/chevron-up.svg';

        // Adiciona uma animação suave
        optionsBox.style.transition = 'max-height 0.3s ease-in-out';
        optionsBox.style.maxHeight = isVisible ? '200px' : '0'; // Ajuste o valor conforme necessário
    });

    // Fecha a caixa de opções se o usuário clicar fora dela
    document.addEventListener('click', () => {
        if (optionsBox.classList.contains('visible')) {
            optionsBox.classList.remove('visible');
            chevronIcon.src = 'icons/chevron-up.svg'; // Reseta o ícone
            optionsBox.style.maxHeight = '0'; // Reseta a altura
        }
    });
})