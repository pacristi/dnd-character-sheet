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
    // const initialCharacterData = {
    //     "basicInfo": {
    //         "name": "El Artista en búsqueda de la Muerte",
    //         "level": "1",
    //         "race": "Hobgoblin",
    //         "class": "Bardo",
    //         "background": "Noble",
    //         "alignment": "Caótico Neutral"
    //     },
    //     "abilities": {
    //         "str": 6,
    //         "dex": 16,
    //         "con": 14,
    //         "int": 14,
    //         "wis": 12,
    //         "cha": 18
    //     },
    //     "combat": {
    //         "armorClass": "12",
    //         "initiative": "2",
    //         "speed": "9m",
    //         "hp": {
    //             "current": "10",
    //             "max": "10"
    //         }
    //     },
    //     "savingThrows": {
    //         "str-save": false,
    //         "dex-save": true,
    //         "con-save": false,
    //         "int-save": false,
    //         "wis-save": false,
    //         "cha-save": true
    //     },
    //     "skills": {
    //         "acrobacias": false,
    //         "manejo-de-animales": false,
    //         "arcanos": true,
    //         "atletismo": false,
    //         "engaño": false,
    //         "historia": true,
    //         "perspicacia": false,
    //         "intimidación": false,
    //         "investigación": false,
    //         "medicina": false,
    //         "naturaleza": false,
    //         "percepción": false,
    //         "interpretación": true,
    //         "persuasión": true,
    //         "religión": true,
    //         "juego-de-manos": false,
    //         "sigilo": false,
    //         "supervivencia": false
    //     },
    //     "attacks": [
    //         {
    //             "name": "Estoque",
    //             "bonus": "+5",
    //             "damage": "1d8+3",
    //             "type": "perforante",
    //             "range": "Cuerpo a cuerpo",
    //             "properties": "Sutil"
    //         },
    //         {
    //             "name": "Espada Larga",
    //             "bonus": "+2",
    //             "damage": "1d8+0",
    //             "type": "cortante",
    //             "range": "Cuerpo a cuerpo",
    //             "properties": "Versátil (1d10)"
    //         },
    //         {
    //             "name": "Vicious Mockery",
    //             "bonus": "+7",
    //             "damage": "1d4",
    //             "type": "psíquico",
    //             "range": "18 metros",
    //             "properties": "Truco, VS, Desventaja en la siguiente tirada de ataque"
    //         }
    //     ],
    //     "languages": [
    //         "Común",
    //         "Goblin",
    //         "Infernal"
    //     ],
    //     "proficiencies": [
    //         "Armaduras ligeras",
    //         "Armas simples",
    //         "Estoque",
    //         "Espada larga",
    //         "Herramientas de artista (pintura)",
    //         "Instrumentos musicales"
    //     ],
    //     "features": [
    //         {
    //             "name": "Visión en la Oscuridad",
    //             "description": "Puedes ver en la oscuridad hasta 18 metros (60 pies).",
    //             "limitedUse": false
    //         },
    //         {
    //             "name": "Entrenamiento Marcial",
    //             "description": "Competencia con dos armas marciales a tu elección y armadura ligera.",
    //             "limitedUse": false
    //         },
    //         {
    //             "name": "Salvar el Orgullo",
    //             "description": "Cuando fallas una tirada, añade un bonificador igual al número de aliados visibles (máx. +5). Una vez por descanso.",
    //             "limitedUse": true,
    //             "uses": {
    //                 "current": 1,
    //                 "max": 1
    //             }
    //         },
    //         {
    //             "name": "Inspiración Bárdica (d6)",
    //             "description": "Como acción adicional, concede un dado d6 a una criatura (no a ti mismo). Puede añadirlo a una tirada.",
    //             "limitedUse": true,
    //             "uses": {
    //                 "current": 3,
    //                 "max": 3
    //             }
    //         }
    //     ],
    //     "spells": {
    //         "cantrip": {
    //             "spells": [
    //                 {
    //                     "name": "Minor Illusion",
    //                     "prepared": true
    //                 },
    //                 {
    //                     "name": "Vicious Mockery",
    //                     "prepared": true
    //                 }
    //             ],
    //             "slots": null
    //         },
    //         "1": {
    //             "spells": [
    //                 {
    //                     "name": "Dissonant Whispers",
    //                     "prepared": true
    //                 },
    //                 {
    //                     "name": "Heroism",
    //                     "prepared": true
    //                 },
    //                 {
    //                     "name": "Healing Word",
    //                     "prepared": true
    //                 },
    //                 {
    //                     "name": "Sleep",
    //                     "prepared": true
    //                 }
    //             ],
    //             "slots": {
    //                 "total": 2,
    //                 "used": 0
    //             }
    //         }
    //     },
    //     "equipment": [
    //         {
    //             "name": "Estoque (1d8 perforante)",
    //             "equipped": true
    //         },
    //         {
    //             "name": "Espada Larga (1d8 cortante)",
    //             "equipped": false
    //         },
    //         {
    //             "name": "Paquete de diplomático",
    //             "equipped": false
    //         },
    //         {
    //             "name": "Laúd",
    //             "equipped": true
    //         },
    //         {
    //             "name": "Flauta",
    //             "equipped": false
    //         },
    //         {
    //             "name": "Tambor",
    //             "equipped": false
    //         },
    //         {
    //             "name": "Ropa fina",
    //             "equipped": true
    //         },
    //         {
    //             "name": "Anillo de sello",
    //             "equipped": true
    //         },
    //         {
    //             "name": "Carta de presentación",
    //             "equipped": false
    //         }
    //     ],
    //     "money": {
    //         "gold": "25",
    //         "silver": "0",
    //         "copper": "0"
    //     },
    //     "personality": {
    //         "traits": "Veo presagios en cada evento y acción. El mundo trata de hablarme.",
    //         "ideals": "Arte. La única expresión verdadera viene de experimentar lo que otros solamente observan.",
    //         "bonds": "Debo capturar la esencia de la muerte en mi arte, aunque signifique arriesgarlo todo.",
    //         "flaws": "Mi obsesión con la muerte me ciega ante los peligros de perseguirla."
    //     },
    //     "notes": "• Artista obsesionado con experimentar la muerte para crear una obra maestra\n• Viajó a Chult siguiendo una misteriosa invitación\n• De familia adinerada, padre era un político respetado\n• Supersticioso, ve señales y presagios en todas partes\n\nRecibí una carta sellada con un sigilo desconocido que me invitaba a buscar la muerte en la jungla, donde el arte y la muerte se entrelazan, donde el velo es más delgado. No hay remitente, solo instrucciones para buscar un contacto que puede llevarme a Chult.\n\nMe acompaña Javi, un cazador de tesoros que se autodenomina el mejor del mundo. Syndra Silvane nos está proporcionando el pasaje, pero parece tener sus propios motivos relacionados con algo llamado la 'Maldición de la Muerte'."
    // };

    loadInitialCharacterData(initialCharacterData);
});