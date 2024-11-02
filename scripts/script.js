document.addEventListener('DOMContentLoaded', function() {
    const optionsButton = document.getElementById('options-btn');
    const optionsBox = document.querySelector('.options-box');
    const chevronIcon = optionsButton.querySelector('.icon-chevron');

    optionsButton.addEventListener('click', () => {
        optionsBox.classList.toggle('visible');
        const isVisible = optionsBox.classList.contains('visible');
        chevronIcon.src = isVisible ? 'icons/chevron-down.svg' : 'icons/chevron-up.svg';
    });
});