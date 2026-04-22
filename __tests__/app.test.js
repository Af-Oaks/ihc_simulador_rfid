const { 
    initApp, 
    renderWelcomeScreen, 
    renderDashboard, 
    renderWorkoutScreen, 
    simulateRFID, 
    togglePauseWorkout,
    finishWorkout,
    speak,
    state 
} = require('../script');

describe('S.H.A.P.E. Prototype App', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        
        // Mock window.speechSynthesis e window.alert
        window.speechSynthesis = { cancel: jest.fn(), speak: jest.fn() };
        global.SpeechSynthesisUtterance = jest.fn().mockImplementation(function(text) {
            this.text = text;
            this.lang = '';
        });
        window.alert = jest.fn();

        document.body.innerHTML = `
            <div id="status-led"></div>
            <div id="app-root"></div>
            <button id="btn-rfid"></button>
            <button id="btn-emergency"></button>
            <button id="btn-bpm-up"></button>
            <button id="btn-bpm-down"></button>
            <button id="btn-move"></button>
        `;
        initApp();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    test('deve renderizar a tela de boas-vindas na inicialização', () => {
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('S.H.A.P.E.');
    });

    test('deve simular aproximação RFID, mostrar dashboard do usuário e falar mensagem', () => {
        simulateRFID('456');
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Olá, Maria!');
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Bem-vinda, Maria');
    });

    test('deve iniciar treino a partir do dashboard com animação e instruções', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino em Andamento');
        expect(appRoot.innerHTML).toContain('Mantenha a coluna reta e desça até 90 graus');
        expect(appRoot.innerHTML).toContain('<img src="https://media.giphy.com/media/l41YkxvU8c7J7Bba0/giphy.gif"');
    });

    test('deve disparar emergencia se BPM passar de 180', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        const btnBpmUp = document.getElementById('btn-bpm-up');
        // BPM inicial é 80. +100 = 180
        for(let i = 0; i < 10; i++) btnBpmUp.click();
        
        expect(state.emergencyTriggered).toBe(true);
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith(expect.stringContaining('Batimento cardíaco muito alto'));
        const led = document.getElementById('status-led');
        expect(led.className).toContain('danger-action');
    });

    test('deve mostrar mensagem de incentivo apos 10s de inatividade do acelerometro', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        // Avancar 10 segundos
        jest.advanceTimersByTime(10000);
        
        const motivationText = document.getElementById('motivation-text');
        expect(motivationText.textContent).toContain('Vamos lá! Não pare agora!');
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith(expect.stringContaining('Mantenha o ritmo do exercício'));
        
        // Simular movimento (acelerômetro) zera a inatividade e limpa o texto
        const btnMove = document.getElementById('btn-move');
        btnMove.click();
        expect(state.inactivitySeconds).toBe(0);
        expect(motivationText.textContent).toBe('');
    });

    test('deve finalizar o treino e dar feedback positivo', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        const btnFinish = document.getElementById('btn-finish-workout');
        btnFinish.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino Concluído!');
    });
});
