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
        
        // Mock window.speechSynthesis
        window.speechSynthesis = {
            cancel: jest.fn(),
            speak: jest.fn()
        };
        global.SpeechSynthesisUtterance = jest.fn().mockImplementation(function(text) {
            this.text = text;
            this.lang = '';
        });

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
        expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    test('deve iniciar treino a partir do dashboard e falar instrução', () => {
        simulateRFID('456');
        const btnStart = document.getElementById('btn-start-workout');
        btnStart.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino em Andamento');
        
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith(expect.stringContaining('Iniciando treino'));
    });

    test('deve pausar e retomar o treino falando alertas', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        const btnPause = document.getElementById('btn-pause-workout');
        
        // Pausar
        btnPause.click();
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Treino pausado.');

        // Retomar
        btnPause.click();
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Treino retomado.');
    });

    test('deve finalizar o treino e dar feedback positivo', () => {
        simulateRFID('456');
        document.getElementById('btn-start-workout').click();
        
        const btnFinish = document.getElementById('btn-finish-workout');
        btnFinish.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino Concluído!');
        
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith(expect.stringContaining('Bom trabalho, Maria!'));
    });
});
