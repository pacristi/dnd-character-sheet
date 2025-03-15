// Añadir nuevo equipo
function addEquipment() {
    const equipmentText = document
        .getElementById("new-equipment")
        .value.trim();

    if (!equipmentText) return;

    const equipmentList = document.getElementById("equipment-list");
    const equipmentItem = document.createElement("div");
    equipmentItem.className = "equipment-item";
    equipmentItem.innerHTML = `
      <input type="checkbox" class="equipment-checkbox">
      <span>${equipmentText}</span>
      <button onclick="this.parentElement.remove()" style="margin-left: auto; font-size: 10px;">✕</button>
    `;

    equipmentList.appendChild(equipmentItem);

    // Limpiar el campo
    document.getElementById("new-equipment").value = "";
}