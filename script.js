const workouts = {
    'A': {
        name: 'Treino A - Pernas',
        exercises: [
            { name: 'Agachamento Livre', sets: '3', reps: '12', instruction: 'Mantenha a coluna reta e desça até 90 graus.', gif: 'https://media.giphy.com/media/l41YkxvU8c7J7Bba0/giphy.gif' },
            { name: 'Leg Press', sets: '3', reps: '10', instruction: 'Pés alinhados com os ombros, não estique os joelhos totalmente.', gif: 'https://media.giphy.com/media/3o7TKnP2vjU82F1JbO/giphy.gif' },
            { name: 'Cadeira Extensora', sets: '3', reps: '15', instruction: 'Contraia o quadríceps e segure 1 segundo no topo.', gif: 'https://media.giphy.com/media/l3q2HXZzX1kYtMhRS/giphy.gif' }
        ]
    },
    'B': {
        name: 'Treino B - Superiores',
        exercises: [
            { name: 'Supino Reto', sets: '3', reps: '10', instruction: 'Desça a barra até a altura do peito de forma controlada.', gif: 'https://media.giphy.com/media/l0HlJzE6W10XQkG0U/giphy.gif' },
            { name: 'Puxada Frontal', sets: '3', reps: '12', instruction: 'Traga a barra até o queixo e contraia as costas.', gif: 'https://media.giphy.com/media/3o6vY6f7KoAQXL5ePq/giphy.gif' },
            { name: 'Desenvolvimento Halteres', sets: '3', reps: '12', instruction: 'Suba os halteres até quase tocarem no topo.', gif: 'https://media.giphy.com/media/26FPsHb1z8WAvY1K8/giphy.gif' }
        ]
    },
    'C': {
        name: 'Treino C - Perda de Peso',
        exercises: [
            { name: 'Burpees', sets: '3', reps: '15', instruction: 'Pulo explosivo e flexão completa no chão.', gif: 'https://media.giphy.com/media/23hPPMRgPtl0D7wUuc/giphy.gif' },
            { name: 'Polichinelos', sets: '3', reps: '30', instruction: 'Mantenha um ritmo constante e respiração fluida.', gif: 'https://media.giphy.com/media/1n6eB2h7iB0G0Hoz5d/giphy.gif' },
            { name: 'Corrida Estacionária', sets: '3', reps: '1 min', instruction: 'Eleve bem os joelhos e mova os braços alternadamente.', gif: 'https://media.giphy.com/media/1xVbZRmFkQkEg5jT9P/giphy.gif' }
        ]
    }
};

const state = {
    currentUser: null,
    users: {
        '123': { name: 'João', goal: 'Hipertrofia', condition: 'Nenhuma' },
        '456': { name: 'Maria', goal: 'Emagrecimento', condition: 'Dor no joelho' }
    },
    workoutActive: false,
    workoutSeconds: 0,
    isPaused: false,
    timerInterval: null,
    bpm: 80,
    inactivitySeconds: 0,
    emergencyTriggered: false,
    currentWorkout: null,
    currentExerciseIndex: 0
};

function speak(text) {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    }
}

function triggerEmergency(reason) {
    state.emergencyTriggered = true;
    speak(reason);
    alert(reason);
    const statusLed = document.getElementById('status-led');
    if(statusLed) statusLed.className = 'led-indicator danger-action';
    if(state.timerInterval) clearInterval(state.timerInterval);
}

function initApp() {
    const btnRfid = document.getElementById('btn-rfid');
    if (btnRfid) btnRfid.addEventListener('click', () => simulateRFID('456'));
    
    const btnEmergency = document.getElementById('btn-emergency');
    if (btnEmergency) btnEmergency.addEventListener('click', () => {
        triggerEmergency('Emergência acionada manualmente. Aguarde assistência.');
    });

    const btnBpmUp = document.getElementById('btn-bpm-up');
    if (btnBpmUp) btnBpmUp.addEventListener('click', () => {
        state.bpm += 10;
        updateSensorsDisplay();
    });

    const btnBpmDown = document.getElementById('btn-bpm-down');
    if (btnBpmDown) btnBpmDown.addEventListener('click', () => {
        state.bpm = Math.max(40, state.bpm - 10);
        updateSensorsDisplay();
    });

    const btnMove = document.getElementById('btn-move');
    if (btnMove) btnMove.addEventListener('click', () => {
        state.inactivitySeconds = 0;
        const motivationText = document.getElementById('motivation-text');
        if (motivationText) motivationText.textContent = ''; 
    });

    renderWelcomeScreen();
}

function updateSensorsDisplay() {
    const bpmDisplay = document.getElementById('bpm-value');
    if (bpmDisplay) {
        bpmDisplay.textContent = state.bpm;
    }
    
    if (state.bpm >= 180 && !state.emergencyTriggered && state.workoutActive) {
        triggerEmergency("Batimento cardíaco muito alto detectado! Emergência acionada automaticamente.");
    }
}

function renderWelcomeScreen() {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    state.currentUser = null;
    state.workoutActive = false;
    state.emergencyTriggered = false;
    state.currentWorkout = null;
    if (state.timerInterval) clearInterval(state.timerInterval);

    if(statusLed) statusLed.className = 'led-indicator blue';
    if(appRoot) {
        appRoot.innerHTML = `
            <div class="welcome-screen">
                <h1>S.H.A.P.E.</h1>
                <p>Olá! Sou o seu assistente de hardware do Studio GS-Fit.</p>
                <p><strong>Aproxime sua pulseira ou tag para que eu possa identificar o seu perfil e preparar o seu treino de hoje.</strong></p>
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
                <h2>Bem-vinda, ${user.name}!</h2>
                
                <div class="semiotic-message">
                    <p><em>"Eu identifiquei que seu principal objetivo é <strong>${user.goal}</strong> e levarei em consideração a sua restrição médica: <strong>${user.condition}</strong>. Com base nisso, eu organizei os seguintes treinos para você realizar de forma segura hoje:"</em></p>
                </div>
                
                <div class="workout-selection">
                    <h3>Escolha o foco do seu treino:</h3>
                    <button class="primary-action btn-workout" data-workout="A">Treino A (Pernas)</button>
                    <button class="primary-action btn-workout" data-workout="B">Treino B (Superiores)</button>
                    <button class="primary-action btn-workout" data-workout="C">Treino C (Perda de Peso)</button>
                </div>
            </div>
        `;

        const btnWorkouts = document.querySelectorAll('.btn-workout');
        btnWorkouts.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workoutType = e.target.getAttribute('data-workout');
                startWorkout(user, workoutType);
            });
        });
    }
}

function startWorkout(user, workoutType) {
    state.currentWorkout = workouts[workoutType];
    state.currentExerciseIndex = 0;
    state.workoutActive = true;
    state.workoutSeconds = 0;
    state.isPaused = false;
    state.bpm = 80;
    state.inactivitySeconds = 0;
    state.emergencyTriggered = false;

    if(state.timerInterval) clearInterval(state.timerInterval);
    
    speak(`Tudo pronto, ${user.name}. Iniciando o ${state.currentWorkout.name}. Eu vou guiar você. O primeiro exercício é ${state.currentWorkout.exercises[0].name}.`);
    
    renderExerciseScreen(user);
    startTimer();
}

function nextExercise(user) {
    if (state.currentExerciseIndex < state.currentWorkout.exercises.length - 1) {
        state.currentExerciseIndex++;
        const ex = state.currentWorkout.exercises[state.currentExerciseIndex];
        speak(`Muito bem! Agora vamos para o próximo exercício: ${ex.name}. Observe o visor para instruções.`);
        renderExerciseScreen(user);
    }
}

function renderExerciseScreen(user) {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    
    if(statusLed) statusLed.className = 'led-indicator blinking-green';
    
    const ex = state.currentWorkout.exercises[state.currentExerciseIndex];
    const isLast = state.currentExerciseIndex === state.currentWorkout.exercises.length - 1;

    if(appRoot) {
        appRoot.innerHTML = `
            <div class="workout-screen">
                <h2>${state.currentWorkout.name}</h2>
                
                <div class="exercise-info">
                    <h3>${ex.name} (${state.currentExerciseIndex + 1}/${state.currentWorkout.exercises.length})</h3>
                    <p>Séries: ${ex.sets} | Repetições/Tempo: ${ex.reps}</p>
                    <div class="semiotic-instruction">
                        <p><strong>Minha dica:</strong> ${ex.instruction}</p>
                    </div>
                </div>
                
                <div class="gif-container">
                    <img src="${ex.gif}" alt="Animação demonstrativa de como fazer o exercício ${ex.name}">
                </div>

                <div class="bpm-display">
                    <span class="bpm-icon">❤️</span> <span id="bpm-value">${state.bpm}</span> BPM
                    <span class="bpm-tooltip" title="Estou monitorando seu coração para sua segurança. Se passar de 180, eu chamo ajuda!">ℹ️</span>
                </div>

                <div class="timer" id="workout-timer">${formatTime(state.workoutSeconds)}</div>
                <div id="motivation-text" class="motivation-text"></div>

                <div class="actions">
                    <button id="btn-pause-workout" class="secondary-action">Pausar</button>
                    ${isLast ? 
                        `<button id="btn-finish-workout" class="danger-action">Finalizar Treino</button>` : 
                        `<button id="btn-next-exercise" class="primary-action" style="margin-top: 0; padding: 10px 20px;">Próximo Exercício</button>`
                    }
                </div>
            </div>
        `;

        document.getElementById('btn-pause-workout').addEventListener('click', togglePauseWorkout);
        
        if (isLast) {
            document.getElementById('btn-finish-workout').addEventListener('click', () => finishWorkout(user));
        } else {
            document.getElementById('btn-next-exercise').addEventListener('click', () => nextExercise(user));
        }
    }
}

function formatTime(totalSeconds) {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('workout-timer');
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(state.workoutSeconds);
    }
}

function startTimer() {
    state.timerInterval = setInterval(() => {
        if (!state.isPaused && !state.emergencyTriggered) {
            state.workoutSeconds++;
            state.inactivitySeconds++;
            updateTimerDisplay();

            if (state.inactivitySeconds >= 10) {
                speak("Notei que você parou. Vamos lá, você consegue! Mantenha o ritmo!");
                const motivationText = document.getElementById('motivation-text');
                if (motivationText) motivationText.textContent = "Estou acompanhando você. Vamos lá, não desista!";
                state.inactivitySeconds = 0; 
            }
        }
    }, 1000);
}

function togglePauseWorkout() {
    if(state.emergencyTriggered) return;

    state.isPaused = !state.isPaused;
    const btnPause = document.getElementById('btn-pause-workout');
    const statusLed = document.getElementById('status-led');
    
    if (state.isPaused) {
        speak("Treino pausado. Descanse um pouco e retome quando estiver pronto.");
        if(btnPause) btnPause.textContent = 'Retomar';
        if(statusLed) statusLed.className = 'led-indicator blue';
    } else {
        speak("Treino retomado. Vamos voltar ao foco!");
        if(btnPause) btnPause.textContent = 'Pausar';
        if(statusLed) statusLed.className = 'led-indicator blinking-green';
        state.inactivitySeconds = 0; 
    }
}

function finishWorkout(user) {
    if(state.timerInterval) clearInterval(state.timerInterval);
    state.workoutActive = false;
    speak(`Treino concluído com sucesso. Parabéns pela dedicação, ${user.name}!`);
    renderWorkoutSummary(user);
}

function renderWorkoutSummary(user) {
    const appRoot = document.getElementById('app-root');
    const statusLed = document.getElementById('status-led');
    if(statusLed) statusLed.className = 'led-indicator blue';

    if(appRoot) {
        appRoot.innerHTML = `
            <div class="summary-screen">
                <h2>Treino Concluído!</h2>
                <div class="semiotic-message">
                    <p><em>"Eu registrei todo o seu progresso. Você foi excelente!"</em></p>
                </div>
                <p>Parabéns, ${user.name}!</p>
                <p>Tempo total ativo: ${formatTime(state.workoutSeconds)}</p>
                <button id="btn-home" class="primary-action">Sair (Aproximar Tag)</button>
            </div>
        `;

        const btnHome = document.getElementById('btn-home');
        if(btnHome) {
            btnHome.addEventListener('click', () => {
                speak("Sessão finalizada. Estou aguardando você para o próximo treino. Até logo!");
                renderWelcomeScreen();
            });
        }
    }
}

function simulateRFID(tagId) {
    const user = state.users[tagId];
    if (user) {
        speak(`Olá, ${user.name}. Bem-vinda de volta.`);
        renderDashboard(user);
    } else {
        speak("Desculpe, não consegui encontrar o seu perfil. Tente novamente.");
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
        startWorkout,
        renderExerciseScreen, 
        togglePauseWorkout,
        finishWorkout,
        simulateRFID,
        speak,
        state,
        workouts
    };
}
