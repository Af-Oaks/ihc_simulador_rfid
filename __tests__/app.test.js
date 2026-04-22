const { initApp, renderWelcomeScreen, renderDashboard, simulateRFID, state } = require('../script');

describe('S.H.A.P.E. Prototype App', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="status-led"></div>
            <div id="app-root"></div>
            <button id="btn-rfid"></button>
        `;
    });

    test('deve renderizar a tela de boas-vindas na inicialização', () => {
        initApp();
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('S.H.A.P.E.');
        expect(appRoot.innerHTML).toContain('Aproxime sua pulseira');
        
        const led = document.getElementById('status-led');
        expect(led.className).toContain('blue');
    });

    test('deve simular aproximação RFID e mostrar dashboard do usuário', () => {
        simulateRFID('456');
        const appRoot = document.getElementById('app-root');
        expect(appRoot.innerHTML).toContain('Olá, Maria!');
        expect(appRoot.innerHTML).toContain('Objetivo:</strong> Emagrecimento');
        expect(appRoot.innerHTML).toContain('Atenção:</strong> Dor no joelho');
        
        const led = document.getElementById('status-led');
        expect(led.className).toContain('green');
    });
});
