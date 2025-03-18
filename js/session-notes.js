/**
 * Session Notes Module
 * Handles managing, saving, and loading session notes
 */

// Session notes state
const sessionNotesState = {
    sessions: [],
    currentSession: null
};

// Initialize the session notes module
document.addEventListener('DOMContentLoaded', function () {
    setupSessionNotes();
    loadSessionNotes();
});

/**
 * Sets up session notes functionality
 */
function setupSessionNotes() {
    // Set up event handlers
    const addSessionBtn = document.getElementById('add-session-btn');
    if (addSessionBtn) {
        addSessionBtn.addEventListener('click', addNewSession);
    }

    // Set up sorting for timeline events
    const sortTimelineBtn = document.getElementById('sort-timeline-btn');
    if (sortTimelineBtn) {
        sortTimelineBtn.addEventListener('click', sortTimelineEvents);
    }

    // Setup saving
    const saveNotesBtn = document.getElementById('save-notes-btn');
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', saveSessionNotes);
    }
}

/**
 * Adds a new session to the list
 */
function addNewSession() {
    const sessionList = document.getElementById('sessions-list');
    const sessionNameInput = document.getElementById('new-session-name');

    if (!sessionList || !sessionNameInput) return;

    const sessionName = sessionNameInput.value.trim();
    if (!sessionName) {
        showNotification('Por favor, ingresa un nombre para la sesión', 'error');
        return;
    }

    // Create a new session object
    const sessionId = 'session-' + Date.now();
    const sessionObj = {
        id: sessionId,
        name: sessionName,
        date: new Date().toISOString().split('T')[0],
        summary: '',
        characters: [],
        locations: [],
        quests: [],
        treasures: [],
        factions: [],
        timeline: []
    };

    // Add to state
    sessionNotesState.sessions.push(sessionObj);
    sessionNotesState.currentSession = sessionObj;

    // Clear input
    sessionNameInput.value = '';

    // Create session tab
    const sessionTab = createSessionTab(sessionObj);
    sessionList.appendChild(sessionTab);

    // Create and show session content
    createSessionContent(sessionObj);

    // Save session notes
    saveSessionNotes();

    showNotification('Nueva sesión creada: ' + sessionName, 'info');

    // Set focus on summary
    setTimeout(() => {
        const summaryTextarea = document.getElementById('session-summary');
        if (summaryTextarea) summaryTextarea.focus();
    }, 100);
}

/**
 * Creates a tab for the session in the sidebar
 * @param {Object} session - Session data
 * @returns {HTMLElement} Session tab element
 */
function createSessionTab(session) {
    const tab = document.createElement('li');
    tab.className = 'session-tab';
    tab.dataset.sessionId = session.id;

    tab.innerHTML = `
        <div class="session-tab-header">
            <span class="session-name">${escapeHTML(session.name)}</span>
            <div class="session-tab-actions">
                <button class="tab-action-btn" title="Editar nombre" onclick="renameSession('${session.id}')">✎</button>
                <button class="tab-action-btn" title="Eliminar sesión" onclick="deleteSession('${session.id}')">✕</button>
            </div>
        </div>
        <div class="session-date">${formatDate(session.date)}</div>
    `;

    // Add click event to select this session
    tab.addEventListener('click', function (e) {
        // Don't trigger if clicked on buttons
        if (e.target.tagName === 'BUTTON') return;

        selectSession(session.id);
    });

    return tab;
}

/**
 * Creates or updates the content area for a session
 * @param {Object} session - Session data
 */
function createSessionContent(session) {
    const contentArea = document.getElementById('session-content-area');
    if (!contentArea) return;

    // Clear existing content
    contentArea.innerHTML = '';

    // Create content structure
    contentArea.innerHTML = `
        <div class="session-header">
            <h2>${escapeHTML(session.name)}</h2>
            <div class="session-date-display">${formatDate(session.date)}</div>
        </div>
        
        <div class="session-tabs">
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="summary">Resumen</button>
                <button class="tab-button" data-tab="characters">Personajes</button>
                <button class="tab-button" data-tab="locations">Lugares</button>
                <button class="tab-button" data-tab="quests">Misiones</button>
                <button class="tab-button" data-tab="treasures">Tesoros</button>
                <button class="tab-button" data-tab="factions">Facciones</button>
                <button class="tab-button" data-tab="timeline">Cronología</button>
            </div>
            
            <div class="tab-content">
                <!-- Summary Tab -->
                <div class="tab-pane active" id="summary-tab">
                    <textarea id="session-summary" class="session-summary" placeholder="Escribe un resumen de la sesión aquí...">${escapeHTML(session.summary || '')}</textarea>
                </div>
                
                <!-- Characters Tab -->
                <div class="tab-pane" id="characters-tab">
                    <div class="entity-list" id="characters-list">
                        ${generateEntityItems(session.characters, 'character')}
                    </div>
                    <div class="entity-add">
                        <input type="text" id="new-character-name" placeholder="Nombre del personaje">
                        <button onclick="addEntity('character')">Añadir Personaje</button>
                    </div>
                </div>
                
                <!-- Locations Tab -->
                <div class="tab-pane" id="locations-tab">
                    <div class="entity-list" id="locations-list">
                        ${generateEntityItems(session.locations, 'location')}
                    </div>
                    <div class="entity-add">
                        <input type="text" id="new-location-name" placeholder="Nombre del lugar">
                        <button onclick="addEntity('location')">Añadir Lugar</button>
                    </div>
                </div>
                
                <!-- Quests Tab -->
                <div class="tab-pane" id="quests-tab">
                    <div class="entity-list" id="quests-list">
                        ${generateEntityItems(session.quests, 'quest')}
                    </div>
                    <div class="entity-add">
                        <input type="text" id="new-quest-name" placeholder="Nombre de la misión">
                        <button onclick="addEntity('quest')">Añadir Misión</button>
                    </div>
                </div>
                
                <!-- Treasures Tab -->
                <div class="tab-pane" id="treasures-tab">
                    <div class="entity-list" id="treasures-list">
                        ${generateEntityItems(session.treasures, 'treasure')}
                    </div>
                    <div class="entity-add">
                        <input type="text" id="new-treasure-name" placeholder="Nombre del tesoro">
                        <button onclick="addEntity('treasure')">Añadir Tesoro</button>
                    </div>
                </div>
                
                <!-- Factions Tab -->
                <div class="tab-pane" id="factions-tab">
                    <div class="entity-list" id="factions-list">
                        ${generateEntityItems(session.factions, 'faction')}
                    </div>
                    <div class="entity-add">
                        <input type="text" id="new-faction-name" placeholder="Nombre de la facción">
                        <button onclick="addEntity('faction')">Añadir Facción</button>
                    </div>
                </div>
                
                <!-- Timeline Tab -->
                <div class="tab-pane" id="timeline-tab">
                    <div class="timeline-controls">
                        <button id="sort-timeline-btn">Ordenar por tiempo</button>
                    </div>
                    <div class="entity-list timeline-list" id="timeline-list">
                        ${generateTimelineItems(session.timeline)}
                    </div>
                    <div class="entity-add timeline-add">
                        <input type="text" id="timeline-time" placeholder="Tiempo" style="width: 80px;">
                        <input type="text" id="new-timeline-event" placeholder="Evento">
                        <button onclick="addTimelineEvent()">Añadir Evento</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Set up tab switching
    const tabButtons = contentArea.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            contentArea.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const tabName = this.dataset.tab;
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });

    // Set up auto-save for summary
    const summaryTextarea = document.getElementById('session-summary');
    if (summaryTextarea) {
        summaryTextarea.addEventListener('input', function () {
            // Update the session object
            const currentSession = sessionNotesState.currentSession;
            if (currentSession) {
                currentSession.summary = this.value;

                // Auto-save after typing stops for 2 seconds
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => {
                    saveSessionNotes();
                }, 2000);
            }
        });
    }
}

/**
 * Generates HTML for entity items (characters, locations, etc.)
 * @param {Array} entities - Array of entity objects
 * @param {string} type - Entity type (character, location, etc.)
 * @returns {string} HTML for entity items
 */
function generateEntityItems(entities, type) {
    if (!entities || !entities.length) return '';

    return entities.map(entity => `
        <div class="entity-item" data-id="${entity.id}">
            <div class="entity-header">
                <span class="entity-name">${escapeHTML(entity.name)}</span>
                <div class="entity-actions">
                    <button class="entity-edit-btn" onclick="editEntity('${type}', '${entity.id}')">✎</button>
                    <button class="entity-delete-btn" onclick="deleteEntity('${type}', '${entity.id}')">✕</button>
                </div>
            </div>
            <div class="entity-details">${escapeHTML(entity.details || '')}</div>
        </div>
    `).join('');
}

/**
 * Generates HTML for timeline items
 * @param {Array} events - Array of timeline event objects
 * @returns {string} HTML for timeline items
 */
function generateTimelineItems(events) {
    if (!events || !events.length) return '';

    return events.map(event => `
        <div class="timeline-item" data-id="${event.id}">
            <div class="timeline-time">${escapeHTML(event.time)}</div>
            <div class="timeline-event">
                <span class="event-text">${escapeHTML(event.event)}</span>
                <div class="entity-actions">
                    <button class="entity-edit-btn" onclick="editTimelineEvent('${event.id}')">✎</button>
                    <button class="entity-delete-btn" onclick="deleteTimelineEvent('${event.id}')">✕</button>
                </div>
            </div>
            ${event.important ? '<div class="important-marker">⭐ Importante</div>' : ''}
        </div>
    `).join('');
}

/**
 * Adds a new entity to the current session
 * @param {string} type - Entity type (character, location, etc.)
 */
function addEntity(type) {
    if (!sessionNotesState.currentSession) {
        showNotification('Por favor, crea o selecciona una sesión primero', 'error');
        return;
    }

    const nameInput = document.getElementById(`new-${type}-name`);
    if (!nameInput) return;

    const name = nameInput.value.trim();
    if (!name) {
        showNotification(`Por favor, ingresa un nombre para el ${getEntityTypeName(type)}`, 'error');
        return;
    }

    // Create entity object
    const entity = {
        id: `${type}-${Date.now()}`,
        name: name,
        details: ''
    };

    // Add to current session
    sessionNotesState.currentSession[`${type}s`].push(entity);

    // Clear input
    nameInput.value = '';

    // Update display
    const listElement = document.getElementById(`${type}s-list`);
    if (listElement) {
        const entityHtml = generateEntityItems([entity], type);
        listElement.insertAdjacentHTML('beforeend', entityHtml);
    }

    // Save session notes
    saveSessionNotes();

    // Prompt to edit details
    setTimeout(() => {
        editEntity(type, entity.id);
    }, 100);
}

/**
 * Edits an entity
 * @param {string} type - Entity type (character, location, etc.)
 * @param {string} id - Entity ID
 */
function editEntity(type, id) {
    if (!sessionNotesState.currentSession) return;

    // Find the entity
    const entities = sessionNotesState.currentSession[`${type}s`];
    const entity = entities.find(e => e.id === id);
    if (!entity) return;

    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>Editar ${getEntityTypeName(type)}</h3>
            
            <div class="modal-form">
                <div class="form-group">
                    <label for="edit-entity-name">Nombre:</label>
                    <input type="text" id="edit-entity-name" value="${escapeHTML(entity.name)}">
                </div>
                
                <div class="form-group">
                    <label for="edit-entity-details">Detalles:</label>
                    <textarea id="edit-entity-details" rows="8">${escapeHTML(entity.details || '')}</textarea>
                </div>
                
                <div class="modal-buttons">
                    <button onclick="saveEntityEdit('${type}', '${id}')">Guardar</button>
                    <button class="secondary-button" onclick="this.closest('.modal').remove()">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Focus on the name field
    setTimeout(() => {
        document.getElementById('edit-entity-name').focus();
    }, 0);
}

/**
 * Saves entity edits
 * @param {string} type - Entity type (character, location, etc.)
 * @param {string} id - Entity ID
 */
function saveEntityEdit(type, id) {
    if (!sessionNotesState.currentSession) return;

    // Get form values
    const nameInput = document.getElementById('edit-entity-name');
    const detailsInput = document.getElementById('edit-entity-details');

    if (!nameInput || !detailsInput) return;

    const name = nameInput.value.trim();
    if (!name) {
        showNotification('El nombre no puede estar vacío', 'error');
        return;
    }

    // Find and update the entity
    const entities = sessionNotesState.currentSession[`${type}s`];
    const entity = entities.find(e => e.id === id);
    if (!entity) return;

    entity.name = name;
    entity.details = detailsInput.value;

    // Update the UI
    const entityItem = document.querySelector(`.entity-item[data-id="${id}"]`);
    if (entityItem) {
        entityItem.querySelector('.entity-name').textContent = name;
        entityItem.querySelector('.entity-details').textContent = entity.details;
    }

    // Close the modal
    const modal = nameInput.closest('.modal');
    if (modal) modal.remove();

    // Save session notes
    saveSessionNotes();

    showNotification(`${getEntityTypeName(type)} actualizado`, 'info');
}

/**
 * Deletes an entity
 * @param {string} type - Entity type (character, location, etc.)
 * @param {string} id - Entity ID
 */
function deleteEntity(type, id) {
    if (!sessionNotesState.currentSession) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar este ${getEntityTypeName(type)}?`)) {
        return;
    }

    // Remove from session data
    const entities = sessionNotesState.currentSession[`${type}s`];
    const index = entities.findIndex(e => e.id === id);
    if (index !== -1) {
        entities.splice(index, 1);
    }

    // Remove from UI
    const entityItem = document.querySelector(`.entity-item[data-id="${id}"]`);
    if (entityItem) entityItem.remove();

    // Save session notes
    saveSessionNotes();

    showNotification(`${getEntityTypeName(type)} eliminado`, 'info');
}

/**
 * Adds a timeline event to the current session
 */
function addTimelineEvent() {
    if (!sessionNotesState.currentSession) {
        showNotification('Por favor, crea o selecciona una sesión primero', 'error');
        return;
    }

    const timeInput = document.getElementById('timeline-time');
    const eventInput = document.getElementById('new-timeline-event');

    if (!timeInput || !eventInput) return;

    const time = timeInput.value.trim();
    const event = eventInput.value.trim();

    if (!event) {
        showNotification('Por favor, ingresa un evento', 'error');
        return;
    }

    // Create event object
    const timelineEvent = {
        id: `timeline-${Date.now()}`,
        time: time || 'N/A',
        event: event,
        important: false
    };

    // Add to current session
    sessionNotesState.currentSession.timeline.push(timelineEvent);

    // Clear inputs
    timeInput.value = '';
    eventInput.value = '';

    // Update display
    const listElement = document.getElementById('timeline-list');
    if (listElement) {
        const eventHtml = generateTimelineItems([timelineEvent]);
        listElement.insertAdjacentHTML('beforeend', eventHtml);
    }

    // Save session notes
    saveSessionNotes();

    // Focus on time input for next entry
    timeInput.focus();
}

/**
 * Edits a timeline event
 * @param {string} id - Event ID
 */
function editTimelineEvent(id) {
    if (!sessionNotesState.currentSession) return;

    // Find the event
    const events = sessionNotesState.currentSession.timeline;
    const event = events.find(e => e.id === id);
    if (!event) return;

    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>Editar Evento</h3>
            
            <div class="modal-form">
                <div class="form-group">
                    <label for="edit-event-time">Tiempo:</label>
                    <input type="text" id="edit-event-time" value="${escapeHTML(event.time)}">
                </div>
                
                <div class="form-group">
                    <label for="edit-event-text">Evento:</label>
                    <textarea id="edit-event-text" rows="4">${escapeHTML(event.event)}</textarea>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="edit-event-important" ${event.important ? 'checked' : ''}>
                        Marcar como importante
                    </label>
                </div>
                
                <div class="modal-buttons">
                    <button onclick="saveTimelineEventEdit('${id}')">Guardar</button>
                    <button class="secondary-button" onclick="this.closest('.modal').remove()">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Focus on the time field
    setTimeout(() => {
        document.getElementById('edit-event-time').focus();
    }, 0);
}

/**
 * Saves timeline event edits
 * @param {string} id - Event ID
 */
function saveTimelineEventEdit(id) {
    if (!sessionNotesState.currentSession) return;

    // Get form values
    const timeInput = document.getElementById('edit-event-time');
    const textInput = document.getElementById('edit-event-text');
    const importantCheckbox = document.getElementById('edit-event-important');

    if (!timeInput || !textInput || !importantCheckbox) return;

    const eventText = textInput.value.trim();
    if (!eventText) {
        showNotification('El evento no puede estar vacío', 'error');
        return;
    }

    // Find and update the event
    const events = sessionNotesState.currentSession.timeline;
    const event = events.find(e => e.id === id);
    if (!event) return;

    event.time = timeInput.value.trim() || 'N/A';
    event.event = eventText;
    event.important = importantCheckbox.checked;

    // Update the timeline display
    refreshTimelineDisplay();

    // Close the modal
    const modal = timeInput.closest('.modal');
    if (modal) modal.remove();

    // Save session notes
    saveSessionNotes();

    showNotification('Evento actualizado', 'info');
}

/**
 * Deletes a timeline event
 * @param {string} id - Event ID
 */
function deleteTimelineEvent(id) {
    if (!sessionNotesState.currentSession) return;

    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        return;
    }

    // Remove from session data
    const events = sessionNotesState.currentSession.timeline;
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
        events.splice(index, 1);
    }

    // Remove from UI
    const eventItem = document.querySelector(`.timeline-item[data-id="${id}"]`);
    if (eventItem) eventItem.remove();

    // Save session notes
    saveSessionNotes();

    showNotification('Evento eliminado', 'info');
}

/**
 * Sorts timeline events by time
 */
function sortTimelineEvents() {
    if (!sessionNotesState.currentSession || !sessionNotesState.currentSession.timeline.length) {
        return;
    }

    // Sort the timeline
    sessionNotesState.currentSession.timeline.sort((a, b) => {
        // If both have time values, sort by time
        if (a.time !== 'N/A' && b.time !== 'N/A') {
            return a.time.localeCompare(b.time);
        }
        // If only one has a time value, put that first
        if (a.time !== 'N/A') return -1;
        if (b.time !== 'N/A') return 1;
        // If neither has a time value, keep original order
        return 0;
    });

    // Refresh the display
    refreshTimelineDisplay();

    // Save changes
    saveSessionNotes();

    showNotification('Cronología ordenada por tiempo', 'info');
}

/**
 * Refreshes the timeline display
 */
function refreshTimelineDisplay() {
    if (!sessionNotesState.currentSession) return;

    const listElement = document.getElementById('timeline-list');
    if (listElement) {
        listElement.innerHTML = generateTimelineItems(sessionNotesState.currentSession.timeline);
    }
}

/**
 * Selects a session to display
 * @param {string} sessionId - Session ID
 */
function selectSession(sessionId) {
    // First find the session
    const session = sessionNotesState.sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Update current session
    sessionNotesState.currentSession = session;

    // Update UI
    document.querySelectorAll('.session-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.querySelector(`.session-tab[data-session-id="${sessionId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Create or update session content
    createSessionContent(session);
}

/**
 * Renames a session
 * @param {string} sessionId - Session ID
 */
function renameSession(sessionId) {
    // Find the session
    const session = sessionNotesState.sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Prompt for new name
    const newName = prompt('Enter new session name:', session.name);
    if (!newName || newName.trim() === '') return;

    // Update session name
    session.name = newName.trim();

    // Update UI
    const sessionTab = document.querySelector(`.session-tab[data-session-id="${sessionId}"]`);
    if (sessionTab) {
        sessionTab.querySelector('.session-name').textContent = session.name;
    }

    // If this is the current session, update content area
    if (sessionNotesState.currentSession && sessionNotesState.currentSession.id === sessionId) {
        const headerTitle = document.querySelector('.session-header h2');
        if (headerTitle) {
            headerTitle.textContent = session.name;
        }
    }

    // Save changes
    saveSessionNotes();

    showNotification('Session renamed', 'info');
}

/**
 * Deletes a session
 * @param {string} sessionId - Session ID
 */
function deleteSession(sessionId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.')) {
        return;
    }

    // Find and remove the session
    const index = sessionNotesState.sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
        sessionNotesState.sessions.splice(index, 1);
    }

    // Remove from UI
    const sessionTab = document.querySelector(`.session-tab[data-session-id="${sessionId}"]`);
    if (sessionTab) {
        sessionTab.remove();
    }

    // If this was the current session, clear the content area or select another session
    if (sessionNotesState.currentSession && sessionNotesState.currentSession.id === sessionId) {
        if (sessionNotesState.sessions.length > 0) {
            // Select the first available session
            selectSession(sessionNotesState.sessions[0].id);
        } else {
            // Clear the content area if no sessions left
            const contentArea = document.getElementById('session-content-area');
            if (contentArea) {
                contentArea.innerHTML = '<div class="empty-state">No hay sesiones. Crea una nueva sesión para comenzar.</div>';
            }
            sessionNotesState.currentSession = null;
        }
    }

    // Save changes
    saveSessionNotes();

    showNotification('Sesión eliminada', 'info');
}

/**
 * Saves session notes to localStorage
 */
function saveSessionNotes() {
    try {
        localStorage.setItem('dnd-session-notes', JSON.stringify(sessionNotesState.sessions));
        showNotification('Notas guardadas correctamente', 'info', true);
    } catch (error) {
        console.error('Error saving session notes:', error);
        showNotification('Error al guardar las notas. El almacenamiento puede estar lleno.', 'error');
    }
}

/**
 * Loads session notes from localStorage
 */
function loadSessionNotes() {
    try {
        const savedNotes = localStorage.getItem('dnd-session-notes');
        if (savedNotes) {
            sessionNotesState.sessions = JSON.parse(savedNotes);

            // Populate sessions list
            populateSessionsList();

            // Select the first session if available
            if (sessionNotesState.sessions.length > 0) {
                selectSession(sessionNotesState.sessions[0].id);
            }
        }
    } catch (error) {
        console.error('Error loading session notes:', error);
        showNotification('Error al cargar las notas guardadas', 'error');
    }
}

/**
 * Populates the sessions list from state
 */
function populateSessionsList() {
    const sessionList = document.getElementById('sessions-list');
    if (!sessionList) return;

    // Clear existing sessions
    sessionList.innerHTML = '';

    // Add each session
    sessionNotesState.sessions.forEach(session => {
        const sessionTab = createSessionTab(session);
        sessionList.appendChild(sessionTab);
    });
}

/**
 * Gets a friendly name for an entity type
 * @param {string} type - Entity type code
 * @returns {string} Friendly entity type name
 */
function getEntityTypeName(type) {
    const names = {
        'character': 'personaje',
        'location': 'lugar',
        'quest': 'misión',
        'treasure': 'tesoro',
        'faction': 'facción'
    };

    return names[type] || type;
}

/**
 * Formats a date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Shows a notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Notification type (info/error)
 * @param {boolean} autoHide - Whether to hide the notification automatically
 */
function showNotification(message, type = 'info', autoHide = true) {
    // Use global function if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }

    // Otherwise create our own notification
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.backgroundColor = type === 'error' ? '#f8d7da' : '#d4edda';
    notification.style.color = type === 'error' ? '#721c24' : '#155724';
    notification.style.padding = '10px 15px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';

    notification.innerHTML = `
        <span>${escapeHTML(message)}</span>
        <button style="background: none; border: none; cursor: pointer; font-weight: bold; margin-left: 15px;">&times;</button>
    `;

    notificationContainer.appendChild(notification);

    // Set up close button
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', function () {
        notification.remove();
    });

    // Auto-hide
    if (autoHide) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
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
 * Exports session notes to a JSON file for download
 */
function exportSessionNotes() {
    try {
        const filename = `dnd-session-notes-${new Date().toISOString().split('T')[0]}.json`;

        const jsonBlob = new Blob([JSON.stringify(sessionNotesState.sessions, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(jsonBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        }, 100);

        showNotification('Notas de sesión exportadas correctamente');
    } catch (error) {
        console.error('Error exporting session notes:', error);
        showNotification('Error al exportar las notas de sesión', 'error');
    }
}

/**
 * Import session notes from a JSON file
 */
function importSessionNotes() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedNotes = JSON.parse(e.target.result);
                if (Array.isArray(importedNotes)) {
                    // Ask if user wants to replace or append
                    const action = confirm('¿Deseas reemplazar las notas actuales o añadir las importadas a las existentes?\n\nAceptar = Reemplazar\nCancelar = Añadir');

                    if (action) {
                        // Replace
                        sessionNotesState.sessions = importedNotes;
                    } else {
                        // Append
                        sessionNotesState.sessions = sessionNotesState.sessions.concat(importedNotes);
                    }

                    // Save and reload
                    saveSessionNotes();
                    populateSessionsList();

                    // Select the first session if available
                    if (sessionNotesState.sessions.length > 0) {
                        selectSession(sessionNotesState.sessions[0].id);
                    }

                    showNotification('Notas de sesión importadas correctamente');
                } else {
                    throw new Error('Invalid format');
                }
            } catch (error) {
                console.error('Error parsing imported notes:', error);
                showNotification('Error al importar las notas. Formato de archivo inválido.', 'error');
            }
        };

        reader.onerror = function () {
            showNotification('Error al leer el archivo', 'error');
        };

        reader.readAsText(file);

        // Clean up
        document.body.removeChild(fileInput);
    });

    fileInput.click();
}