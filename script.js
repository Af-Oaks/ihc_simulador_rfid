const state = {
    currentUser: null,
    users: {
        '123': { name: 'João', goal: 'Hipertrofia', condition: 'Nenhuma' },
        '456': { name: 'Maria', goal: 'Emagrecimento', condition: 'Dor no joelho' }
    },
    workoutActive: false,
    workoutSeconds: 0,
    isPaused: false,
    timerInterval: null
};

function initApp() {
    const btnRfid = document.getElementById('btn-rfid');
    if (btnRfid) {
        btnRfid.addEventListener('click', () => simulateRFID('456'));
    }
    const btnEmergency = document.getElementById('btn-emergency');
    if (btnEmergency) {
        btnEmergency.addEventListener('click', () => alert('Emergência acionada! Assistência solicitada.'));
    }
    renderWelcomeScreen();
}

function renderWelcomeScreen() {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    state.currentUser = null;
    if (state.timerInterval) clearInterval(state.timerInterval);

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
    
    state.workoutActive = true;
    state.workoutSeconds = 0;
    state.isPaused = false;
    if(state.timerInterval) clearInterval(state.timerInterval);

    if(statusLed) statusLed.className = 'led-indicator blinking-green';
    
    if(appRoot) {
        appRoot.innerHTML = `
            <div class="workout-screen">
                <h2>Treino em Andamento</h2>
                <div class="exercise-info">
                    <h3>Agachamento Livre</h3>
                    <p>Séries: 3 | Repetições: 12</p>
                </div>
                <div class="timer" id="workout-timer">00:00</div>
                <div class="actions">
                    <button id="btn-pause-workout" class="secondary-action">Pausar</button>
                    <button id="btn-finish-workout" class="danger-action">Finalizar</button>
                </div>
            </div>
        `;

        startTimer();

        document.getElementById('btn-pause-workout').addEventListener('click', togglePauseWorkout);
        document.getElementById('btn-finish-workout').addEventListener('click', () => finishWorkout(user));
    }
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('workout-timer');
    if (timerDisplay) {
        const mins = String(Math.floor(state.workoutSeconds / 60)).padStart(2, '0');
        const secs = String(state.workoutSeconds % 60).padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }
}

function startTimer() {
    state.timerInterval = setInterval(() => {
        if (!state.isPaused) {
            state.workoutSeconds++;
            updateTimerDisplay();
        }
    }, 1000);
}

function togglePauseWorkout() {
    state.isPaused = !state.isPaused;
    const btnPause = document.getElementById('btn-pause-workout');
    const statusLed = document.getElementById('status-led');
    
    if (state.isPaused) {
        if(btnPause) btnPause.textContent = 'Retomar';
        if(statusLed) statusLed.className = 'led-indicator blue'; // paused state
    } else {
        if(btnPause) btnPause.textContent = 'Pausar';
        if(statusLed) statusLed.className = 'led-indicator blinking-green';
    }
}

function finishWorkout(user) {
    if(state.timerInterval) clearInterval(state.timerInterval);
    state.workoutActive = false;
    renderWorkoutSummary(user);
}

function renderWorkoutSummary(user) {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    if(statusLed) statusLed.className = 'led-indicator blue';

    if(appRoot) {
        const mins = String(Math.floor(state.workoutSeconds / 60)).padStart(2, '0');
        const secs = String(state.workoutSeconds % 60).padStart(2, '0');
        
        appRoot.innerHTML = `
            <div class="summary-screen">
                <h2>Treino Concluído!</h2>
                <p>Parabéns, ${user.name}!</p>
                <p>Tempo total: ${mins}:${secs}</p>
                <button id="btn-home" class="primary-action">Sair (Aproximar Tag)</button>
            </div>
        `;

        document.getElementById('btn-home').addEventListener('click', renderWelcomeScreen);
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
    if (typeof process === 'undefined' || process.release.name !== 'node') {
        window.addEventListener('DOMContentLoaded', initApp);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initApp, 
        renderWelcomeScreen, 
        renderDashboard, 
        renderWorkoutScreen, 
        togglePauseWorkout,
        finishWorkout,
        simulateRFID, 
        state 
    };
}
