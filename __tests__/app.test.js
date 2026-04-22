const { 
    initApp, 
    renderWelcomeScreen, 
    renderDashboard, 
    renderWorkoutScreen, 
    simulateRFID, 
    togglePauseWorkout,
    finishWorkout,
    state 
} = require('../script');

describe('S.H.A.P.E. Prototype App', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = `
            <div id="status-led"></div>
            <div id="app-root"></div>
            <button id="btn-rfid"></button>
            <button id="btn-emergency"></button>
        `;
        initApp();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('deve renderizar a tela de boas-vindas na inicialização', () => {
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('S.H.A.P.E.');
        const led = document.getElementById('status-led');
        expect(led.className).toContain('blue');
    });

    test('deve simular aproximação RFID e mostrar dashboard do usuário', () => {
        simulateRFID('456');
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Olá, Maria!');
        const led = document.getElementById('status-led');
        expect(led.className).toContain('green');
    });

    test('deve iniciar treino a partir do dashboard', () => {
        simulateRFID('456');
        const btnStart = document.getElementById('btn-start-workout');
        btnStart.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino em Andamento');
        expect(appRoot.innerHTML).toContain('Agachamento Livre');
        
        const led = document.getElementById('status-led');
        expect(led.className).toContain('blinking-green');
    });

    test('deve pausar e retomar o treino', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        const btnPause = document.getElementById('btn-pause-workout');
        const led = document.getElementById('status-led');
        
        // Pausar
        btnPause.click();
        expect(state.isPaused).toBe(true);
        expect(btnPause.textContent).toBe('Retomar');
        expect(led.className).toContain('blue');

        // Retomar
        btnPause.click();
        expect(state.isPaused).toBe(false);
        expect(btnPause.textContent).toBe('Pausar');
        expect(led.className).toContain('blinking-green');
    });

    test('deve finalizar o treino e mostrar resumo de tempo', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        // Simular 65 segundos
        jest.advanceTimersByTime(65000);
        
        const btnFinish = document.getElementById('btn-finish-workout');
        btnFinish.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino Concluído!');
        expect(appRoot.innerHTML).toContain('Tempo total: 01:05');
        
        // Simular saída do usuário
        const btnHome = document.getElementById('btn-home');
        btnHome.click();
        expect(appRoot.innerHTML).toContain('Aproxime sua pulseira');
    });
});
