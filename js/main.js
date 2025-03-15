// Inicializar la página
document.addEventListener("DOMContentLoaded", function () {
    // Generar la lista de habilidades
    generateSkillsList();

    // Configurar el evento para importar JSON
    document
        .getElementById("import-json")
        .addEventListener("change", importCharacterFromJson);

    // Cargar los datos iniciales si hay un JSON predefinido

    const initialCharacterData = JSON.parse(fs.readFileSync('/Users/piero/Documents/DND/dnd-character-sheet/data/characters/Thaddeus Harrov-Bardo.json', 'utf8'));

    loadInitialCharacterData(initialCharacterData);
});