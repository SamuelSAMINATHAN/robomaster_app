document.addEventListener("DOMContentLoaded", () => {
    const blocklyDiv = document.getElementById('blocklyDiv');
    const toolbox = document.getElementById('toolbox');
    const workspace = Blockly.inject(blocklyDiv, {
        toolbox: toolbox
    });

    // Désactiver les événements automatiques de génération de code
    workspace.addChangeListener(() => {
        // Ne rien faire automatiquement ici
    });

    // Exemple : Exporter le code généré uniquement sur demande
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e' && event.ctrlKey) {
            const code = Blockly.JavaScript.workspaceToCode(workspace);
            console.log("Code généré :", code);
        }
    });

    // Afficher la liste des blocs disponibles
    const blockListContent = document.getElementById('blockListContent');
    const blocks = toolbox.getElementsByTagName('block');
    for (const block of blocks) {
        const blockType = block.getAttribute('type');
        const listItem = document.createElement('li');
        listItem.textContent = blockType;
        blockListContent.appendChild(listItem);
    }
});
