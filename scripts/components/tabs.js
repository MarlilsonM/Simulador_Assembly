function openTab(evt, tabName) {
    // Esconde todas as abas de registradores
    const tabs = document.querySelectorAll('#tab-registers, #tab-vector-registers');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove a classe ativa de todos os botões de registradores
    const buttons = document.querySelectorAll('#tab-buttons-registers .tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostra a aba selecionada
    document.getElementById('tab-' + tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function openMemoryTab(evt, memoryTabName) {
    // Esconde todas as abas de memória
    const memoryTabs = document.querySelectorAll('#data, #stack');
    memoryTabs.forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove a classe ativa de todos os botões de memória
    const memoryButtons = document.querySelectorAll('#tab-buttons-memory .tab-button');
    memoryButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostra a aba de memória selecionada
    document.getElementById(memoryTabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function openVisualizationTab(evt, visualizationTabName) {
    // Esconde todas as seções de visualização
    const visualizationSections = document.querySelectorAll('.visualization-section');
    visualizationSections.forEach(section => {
        section.style.display = 'none';
    });

    // Remove a classe ativa de todos os botões de visualização
    const visualizationButtons = document.querySelectorAll('#tab-buttons-visualization .tab-button');
    visualizationButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostra a aba de visualização selecionada
    document.getElementById(visualizationTabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
}