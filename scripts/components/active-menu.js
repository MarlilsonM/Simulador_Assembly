document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('docs-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const chevronIcon = document.getElementById('docs-chevron-icon');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('visible'); // Alterna a classe 'visible'
        
        // Alterna o src do chevron
        if (sidebar.classList.contains('visible')) {
            chevronIcon.src = '../assets/chevron-left.svg'; // Seta para a esquerda
        } else {
            chevronIcon.src = '../assets/chevron-right.svg'; // Seta para a direita
        }
    });

    // Fecha o sidebar ao clicar fora dele
    document.addEventListener('click', (event) => {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        // Se o sidebar estiver aberto e o clique não for dentro do sidebar nem no botão de toggle
        if (sidebar.classList.contains('visible') && !isClickInsideSidebar && !isClickOnToggle) {
            sidebar.classList.remove('visible'); // Fecha o sidebar
            chevronIcon.src = '../assets/chevron-right.svg'; // Muda o ícone para a seta para a direita
        }
    });
});