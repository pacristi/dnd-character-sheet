/**
 * Módulo de Imagen del Personaje
 * Maneja la carga y guardado de la imagen del personaje
 */

// Inicializar el manejo de la imagen al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    initializePortraitUpload();
});

// Configurar el input de archivo para subir imágenes
function initializePortraitUpload() {
    const uploadInput = document.getElementById('upload-portrait');

    if (uploadInput) {
        uploadInput.addEventListener('change', function (event) {
            const file = event.target.files[0];

            if (file && file.type.match('image.*')) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    // Actualizar la imagen con la seleccionada
                    document.getElementById('character-image').src = e.target.result;

                    // Guardar la imagen en localStorage para recuperarla después
                    savePortraitToStorage(e.target.result);
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Cargar la imagen guardada si existe
    loadPortraitFromStorage();
}

// Guardar la imagen en localStorage
function savePortraitToStorage(dataUrl) {
    // Obtener el nombre del personaje para usar como clave
    const characterName = document.getElementById('character-name').value || 'default-character';
    localStorage.setItem(`portrait_${characterName}`, dataUrl);
}

// Cargar la imagen desde localStorage
function loadPortraitFromStorage() {
    const characterName = document.getElementById('character-name').value || 'default-character';
    const savedPortrait = localStorage.getItem(`portrait_${characterName}`);

    if (savedPortrait) {
        document.getElementById('character-image').src = savedPortrait;
    }
}

// Función para exportar la imagen como parte de los datos del personaje
function getPortraitData() {
    const img = document.getElementById('character-image');
    return img.src.startsWith('data:') ? img.src : null;
}

// Función para aplicar la imagen al cargar los datos del personaje
function applyPortraitData(portraitData) {
    if (portraitData) {
        document.getElementById('character-image').src = portraitData;
    }
}