document.addEventListener('DOMContentLoaded', function() {
    const optionsButton = document.getElementById('options-btn');
    const optionsBox = document.querySelector('.options-box');
    const chevronIcon = optionsButton.querySelector('.icon-chevron');
    let isOptionsVisible = false;

    optionsButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o clique se propague para o documento
        isOptionsVisible = !isOptionsVisible;
        optionsBox.classList.toggle('visible', isOptionsVisible);
        chevronIcon.src = isOptionsVisible ? 'icons/chevron-down.svg' : 'icons/chevron-up.svg';
    });

    // Fechar as opções quando clicar fora delas
    document.addEventListener('click', function(event) {
        if (isOptionsVisible && !optionsBox.contains(event.target) && event.target !== optionsButton) {
            isOptionsVisible = false;
            optionsBox.classList.remove('visible');
            chevronIcon.src = 'icons/chevron-up.svg';
        }
    });

    // Impedir que cliques dentro da caixa de opções a fechem
    optionsBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});