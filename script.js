const state = {
    currentUser: null,
    users: {
        '123': { name: 'João', goal: 'Hipertrofia', condition: 'Nenhuma' },
        '456': { name: 'Maria', goal: 'Emagrecimento', condition: 'Dor no joelho' }
    }
};

function initApp() {
    const btnRfid = document.getElementById('btn-rfid');
    if (btnRfid) {
        btnRfid.addEventListener('click', () => simulateRFID('456'));
    }
    renderWelcomeScreen();
}

function renderWelcomeScreen() {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    if(statusLed) statusLed.className = 'led-indicator blue';
    if(appRoot) {
        appRoot.innerHTML = `
            <div class="welcome-screen">
                <h1>S.H.A.P.E.</h1>
                <p>Aproxime sua pulseira/tag para iniciar o seu treino.</p>
            </div>
        `;
    }
}

function renderDashboard(user) {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    state.currentUser = user;
    if(statusLed) statusLed.className = 'led-indicator green';
    
    if(appRoot) {
        appRoot.innerHTML = `
            <div class="dashboard">
                <h2>Olá, ${user.name}!</h2>
                <p><strong>Objetivo:</strong> ${user.goal}</p>
                <p class="warning-text"><strong>Atenção:</strong> ${user.condition}</p>
                <button id="btn-start-workout" class="primary-action">Iniciar Treino de Hoje</button>
            </div>
        `;

        const btnStart = document.getElementById('btn-start-workout');
        if(btnStart) {
            btnStart.addEventListener('click', () => {
                renderWorkoutScreen(user);
            });
        }
    }
}

function renderWorkoutScreen(user) {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    if(statusLed) statusLed.className = 'led-indicator blinking-green';
    if(appRoot) {
        appRoot.innerHTML = `
            <div class="workout-screen">
                <h2>Treino em Andamento</h2>
                <div class="exercise-info">
                    <h3>Agachamento Livre</h3>
                    <p>Séries: 3 | Repetições: 12</p>
                </div>
                <div class="timer">00:00</div>
                <div class="actions">
                    <button id="btn-pause-workout" class="secondary-action">Pausar</button>
                    <button id="btn-finish-workout" class="danger-action">Finalizar</button>
                </div>
            </div>
        `;
    }
}

function simulateRFID(tagId) {
    const user = state.users[tagId];
    if (user) {
        renderDashboard(user);
    } else {
        alert("Usuário não encontrado.");
    }
}

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    // Apenas adiciona o listener se estiver rodando no navegador (não no Jest)
    if (typeof process === 'undefined' || process.release.name !== 'node') {
        window.addEventListener('DOMContentLoaded', initApp);
    }
}

// Exportação para testes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initApp, renderWelcomeScreen, renderDashboard, renderWorkoutScreen, simulateRFID, state };
}
