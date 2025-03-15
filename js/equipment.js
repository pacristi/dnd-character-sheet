/**
 * Equipment Module
 * Handles character equipment and inventory management
 */

// Initialize module
document.addEventListener('DOMContentLoaded', function () {
  setupEquipmentEventListeners();
});

/**
 * Sets up event listeners for the equipment module
 */
function setupEquipmentEventListeners() {
  // Add equipment on Enter key in the input field
  const equipmentInput = document.getElementById('new-equipment');
  if (equipmentInput) {
    equipmentInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addEquipment();
        e.preventDefault();
      }
    });
  }

  // Add bulk equipment button
  const equipmentSection = document.querySelector('.section h2:contains("Equipo")');
  if (equipmentSection) {
    const bulkButton = document.createElement('button');
    bulkButton.textContent = 'Añadir varios';
    bulkButton.className = 'secondary-button';
    bulkButton.style.marginLeft = '10px';
    bulkButton.addEventListener('click', showBulkEquipmentDialog);
    equipmentSection.appendChild(bulkButton);
  }

  // Add equipment weight tracking
  addWeightTrackingToEquipment();
}

/**
 * Adds a new equipment item to the character sheet
 */
function addEquipment() {
  const equipmentText = document.getElementById("new-equipment").value.trim();
  if (!equipmentText) return;

  const equipmentList = document.getElementById("equipment-list");
  if (!equipmentList) return;

  // Create the equipment item element
  const equipmentItem = createEquipmentElement(equipmentText);
  equipmentList.appendChild(equipmentItem);

  // Clear the input field
  document.getElementById("new-equipment").value = "";
}

/**
 * Creates an equipment item element
 * @param {string} itemText - Text description of the item
 * @param {boolean} isEquipped - Whether the item is equipped
 * @returns {HTMLElement} Equipment item element
 */
function createEquipmentElement(itemText, isEquipped = false) {
  const equipmentItem = document.createElement("div");
  equipmentItem.className = "equipment-item";

  equipmentItem.innerHTML = `
    <input type="checkbox" class="equipment-checkbox" aria-label="Equipped ${escapeHTML(itemText)}" ${isEquipped ? "checked" : ""}>
    <span>${escapeHTML(itemText)}</span>
    <button type="button" onclick="removeEquipment(this)" aria-label="Remove item" style="margin-left: auto; font-size: 10px;">✕</button>
  `;

  return equipmentItem;
}

/**
 * Removes an equipment item
 * @param {HTMLElement} button - The remove button
 */
function removeEquipment(button) {
  const item = button.closest('.equipment-item');
  if (item) {
    item.remove();
    updateTotalWeight();
  }
}

/**
 * Shows a dialog for adding multiple equipment items at once
 */
function showBulkEquipmentDialog() {
  // Create modal dialog element
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h3>Añadir Varios Objetos</h3>
      
      <p style="margin-bottom: 10px;">
        Ingresa un objeto por línea. Puedes añadir [P] al inicio para indicar que está equipado.
      </p>
      
      <textarea id="bulk-equipment" style="width: 100%; height: 150px; margin-bottom: 15px;" 
                placeholder="Ejemplo:
[P] Armadura de cuero
Cuerda (50 pies)
Raciones (5 días)"></textarea>
      
      <div class="modal-buttons">
        <button type="button" onclick="addBulkEquipment(this)">Añadir Objetos</button>
        <button type="button" class="secondary-button" onclick="this.parentElement.parentElement.parentElement.remove()">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Focus on the textarea
  setTimeout(() => {
    document.getElementById('bulk-equipment').focus();
  }, 0);
}

/**
 * Adds multiple equipment items from the bulk dialog
 * @param {HTMLElement} button - The button that triggered the action
 */
function addBulkEquipment(button) {
  const modalContent = button.closest('.modal-content');
  const textarea = modalContent.querySelector('#bulk-equipment');
  const itemsText = textarea.value.trim();

  if (!itemsText) {
    modalContent.parentElement.remove();
    return;
  }

  const equipmentList = document.getElementById("equipment-list");
  if (!equipmentList) {
    modalContent.parentElement.remove();
    return;
  }

  // Process each line as an equipment item
  const lines = itemsText.split('\n');
  let itemsAdded = 0;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Check if the item should be equipped
    const equippedMatch = line.match(/^\[P\]\s*(.*)/i);
    const isEquipped = !!equippedMatch;
    const itemText = isEquipped ? equippedMatch[1] : line;

    if (itemText) {
      equipmentList.appendChild(createEquipmentElement(itemText, isEquipped));
      itemsAdded++;
    }
  });

  // Close the modal and show feedback
  modalContent.parentElement.remove();

  if (itemsAdded > 0) {
    showNotification(`Se añadieron ${itemsAdded} objetos al equipo.`, 'info');
  }

  // Update weight if tracking is enabled
  updateTotalWeight();
}

/**
 * Adds weight tracking functionality to the equipment section
 */
function addWeightTrackingToEquipment() {
  const equipmentSection = document.querySelector('.section h2:contains("Equipo")').parentElement;
  if (!equipmentSection) return;

  // Check if weight tracker already exists
  if (document.getElementById('equipment-weight-tracker')) return;

  // Create weight tracker element
  const weightTracker = document.createElement('div');
  weightTracker.id = 'equipment-weight-tracker';
  weightTracker.className = 'equipment-weight-tracker';
  weightTracker.style.marginTop = '15px';
  weightTracker.style.display = 'flex';
  weightTracker.style.alignItems = 'center';
  weightTracker.style.justifyContent = 'flex-end';

  weightTracker.innerHTML = `
    <label for="weight-tracking-toggle" style="display: flex; align-items: center; margin-right: 15px;">
      <input type="checkbox" id="weight-tracking-toggle">
      <span style="margin-left: 5px;">Rastrear peso</span>
    </label>
    
    <div id="weight-display" style="display: none;">
      Peso total: <span id="total-weight">0</span> kg
      <span style="margin: 0 10px;">/</span>
      Capacidad: <input type="number" id="weight-capacity" value="60" min="1" style="width: 50px;"> kg
    </div>
  `;

  // Insert after the equipment list
  const moneyContainer = equipmentSection.querySelector('.equipment-item:contains("Monedas:")');
  if (moneyContainer) {
    moneyContainer.after(weightTracker);
  } else {
    equipmentSection.appendChild(weightTracker);
  }

  // Add event listeners
  const weightToggle = document.getElementById('weight-tracking-toggle');
  const weightDisplay = document.getElementById('weight-display');

  if (weightToggle && weightDisplay) {
    weightToggle.addEventListener('change', function () {
      weightDisplay.style.display = this.checked ? 'inline' : 'none';

      if (this.checked) {
        // Add weight input to all existing items
        addWeightInputsToItems();
        updateTotalWeight();
      } else {
        // Remove weight inputs
        removeWeightInputsFromItems();
      }
    });
  }
}

/**
 * Adds weight input fields to all equipment items
 */
function addWeightInputsToItems() {
  document.querySelectorAll('.equipment-item').forEach(item => {
    // Skip if it's the money item or already has weight input
    if (item.textContent.includes('Monedas:') || item.querySelector('.item-weight')) return;

    // Add weight input
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.className = 'item-weight';
    weightInput.value = '0';
    weightInput.min = '0';
    weightInput.step = '0.1';
    weightInput.style.width = '40px';
    weightInput.style.marginLeft = '10px';
    weightInput.setAttribute('aria-label', 'Item weight in kg');

    // Add change event
    weightInput.addEventListener('change', updateTotalWeight);

    // Add to item before the remove button
    const removeButton = item.querySelector('button');
    if (removeButton) {
      removeButton.before(weightInput);
      removeButton.before(document.createTextNode(' kg '));
    } else {
      item.appendChild(weightInput);
      item.appendChild(document.createTextNode(' kg'));
    }
  });
}

/**
 * Removes weight input fields from all equipment items
 */
function removeWeightInputsFromItems() {
  document.querySelectorAll('.item-weight').forEach(input => {
    // Remove the input and any adjacent text nodes
    const parent = input.parentNode;
    const nextSibling = input.nextSibling;

    parent.removeChild(input);

    // Remove any adjacent kg text
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.includes('kg')) {
      parent.removeChild(nextSibling);
    }
  });
}

/**
 * Updates the total weight display
 */
function updateTotalWeight() {
  const totalWeightElement = document.getElementById('total-weight');
  if (!totalWeightElement) return;

  // Calculate total weight
  let totalWeight = 0;
  document.querySelectorAll('.item-weight').forEach(input => {
    totalWeight += parseFloat(input.value) || 0;
  });

  // Add gold weight (1 kg per 50 gold)
  const goldInput = document.getElementById('gold');
  if (goldInput) {
    const goldWeight = Math.floor((parseInt(goldInput.value) || 0) / 50) * 1;
    totalWeight += goldWeight;
  }

  // Update display
  totalWeightElement.textContent = totalWeight.toFixed(1);

  // Check capacity
  const capacityInput = document.getElementById('weight-capacity');
  if (capacityInput) {
    const capacity = parseFloat(capacityInput.value) || 60;

    // Update color based on capacity
    if (totalWeight > capacity) {
      totalWeightElement.style.color = '#cc0000';
    } else if (totalWeight > capacity * 0.8) {
      totalWeightElement.style.color = '#cc6600';
    } else {
      totalWeightElement.style.color = '';
    }
  }
}

/**
 * Escapes HTML special characters
 * @param {string} unsafe - String to escape
 * @returns {string} Escaped string
 */
function escapeHTML(unsafe) {
  if (typeof unsafe !== 'string') return '';

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Shows a notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Notification type (info/error)
 */
function showNotification(message, type = 'info') {
  // Use global function if available
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    // Fallback for critical errors
    if (type === 'error') {
      alert(message);
    } else {
      console.log(message);
    }
  }
}