const { 
    initApp, 
    simulateRFID, 
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

    test('deve simular aproximação RFID e mostrar dashboard com as opcoes de treino', () => {
        simulateRFID('456');
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Olá, Maria!');
        expect(appRoot.innerHTML).toContain('Selecione seu Treino:');
        expect(appRoot.innerHTML).toContain('Treino A (Pernas)');
        expect(appRoot.innerHTML).toContain('Treino B (Superiores)');
        expect(appRoot.innerHTML).toContain('Treino C (Perda de Peso)');
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Bem-vinda, Maria');
    });

    test('deve iniciar treino A e apresentar o primeiro exercicio', () => {
        simulateRFID('456');
        
        // Clica no botão do Treino A
        const btnWorkoutA = document.querySelector('[data-workout="A"]');
        btnWorkoutA.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Treino A - Pernas');
        expect(appRoot.innerHTML).toContain('Agachamento Livre (1/3)');
        expect(appRoot.innerHTML).toContain('Mantenha a coluna reta');
        
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith(expect.stringContaining('Iniciando Treino A - Pernas. Primeiro exercício: Agachamento Livre.'));
    });

    test('deve navegar pelos exercicios ate o final do treino', () => {
        simulateRFID('456');
        document.querySelector('[data-workout="A"]').click();
        
        // No exercicio 1, clica em proximo
        const btnNext1 = document.getElementById('btn-next-exercise');
        expect(btnNext1).not.toBeNull();
        btnNext1.click();
        
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Leg Press (2/3)');
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Próximo exercício: Leg Press.');
        
        // No exercicio 2, clica em proximo
        const btnNext2 = document.getElementById('btn-next-exercise');
        btnNext2.click();
        
        expect(appRoot.innerHTML).toContain('Cadeira Extensora (3/3)');
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Próximo exercício: Cadeira Extensora.');
        
        // No exercicio 3 (ultimo), o botão deve ser Finalizar
        const btnNext3 = document.getElementById('btn-next-exercise');
        expect(btnNext3).toBeNull(); // Nao deve existir mais
        
        const btnFinish = document.getElementById('btn-finish-workout');
        expect(btnFinish).not.toBeNull(); // Deve existir o botão de finalizar
        
        btnFinish.click();
        expect(appRoot.innerHTML).toContain('Treino Concluído!');
    });

    test('deve disparar emergencia se BPM passar de 180 durante o treino', () => {
        simulateRFID('456');
        document.querySelector('[data-workout="C"]').click(); // Treino C
        
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
        document.querySelector('[data-workout="B"]').click();
        
        // Avancar 10 segundos
        jest.advanceTimersByTime(10000);
        
        const motivationText = document.getElementById('motivation-text');
        expect(motivationText.textContent).toContain('Vamos lá! Não pare agora!');
        
        // Simular movimento (acelerômetro) zera a inatividade e limpa o texto
        const btnMove = document.getElementById('btn-move');
        btnMove.click();
        expect(state.inactivitySeconds).toBe(0);
        expect(motivationText.textContent).toBe('');
    });
});
