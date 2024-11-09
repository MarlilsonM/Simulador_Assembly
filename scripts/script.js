/**
 * script.js
 * 
 * @description
 * Este script gerencia a funcionalidade do botão de opções e da caixa de opções
 * na interface do usuário do simulador Assembly.
 */

document.addEventListener('DOMContentLoaded', function() {
    const optionsButton = document.getElementById('options-btn');
    const optionsBox = document.querySelector('.options-box');
    const chevronIcon = optionsButton.querySelector('.icon-chevron');
    let isOptionsVisible = false;

    /**
     * Alterna a visibilidade da caixa de opções e atualiza o ícone do botão.
     * 
     * @param {Event} event - O evento de clique
     */
    optionsButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o clique se propague para o documento
        isOptionsVisible = !isOptionsVisible;
        optionsBox.classList.toggle('visible', isOptionsVisible);
        chevronIcon.src = isOptionsVisible ? 'icons/chevron-down.svg' : 'icons/chevron-up.svg';
    });

    /**
     * Fecha a caixa de opções quando o usuário clica fora dela.
     * 
     * @param {Event} event - O evento de clique
     */
    document.addEventListener('click', function(event) {
        if (isOptionsVisible && !optionsBox.contains(event.target) && event.target !== optionsButton) {
            isOptionsVisible = false;
            optionsBox.classList.remove('visible');
            chevronIcon.src = 'icons/chevron-up.svg';
        }
    });

    /**
     * Impede que cliques dentro da caixa de opções a fechem.
     * 
     * @param {Event} event - O evento de clique
     */
    optionsBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});