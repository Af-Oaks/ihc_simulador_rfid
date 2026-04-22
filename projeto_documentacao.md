# Projeto S.H.A.P.E. - Studio GS-Fit

## Domínio do Projeto
O S.H.A.P.E. (Solução de Hardware para Apoio à Prática de Exercício) é um dispositivo físico interativo projetado para auxiliar os alunos do Studio GS-Fit. O estúdio atende até 10 pessoas por horário com treinos personalizados, principalmente com foco em funcional e cross. O dispositivo visa orientar, motivar e corrigir o aluno durante a prática do exercício, sem depender de smartphones ou computadores externos. O dispositivo deve contemplar elementos de interface modernos integrados ao hardware, como telas, botões físicos, LEDs de feedback e interação por voz.

A solução consiste em uma interface *frontend* em um protótipo de tela navegável e de alta fidelidade que simula um hardware operando, conforme as restrições da competição de IHC.

## Documentação Técnica
- **Tecnologias**: HTML5, CSS3, JavaScript (Vanilla). Optou-se por utilizar o mínimo de frameworks possíveis para manter o protótipo leve e fiel ao conceito de um software embarcado.
- **Testes Unitários**: Jest e JSDOM, garantindo a solidez das lógicas de timer, mudança de telas e interatividade.
- **Acessibilidade e Interação**:
  - Respostas audiovisuais em tempo real (mudança de cor de LEDs e feedbacks audíveis usando a API de `SpeechSynthesis` do navegador).
  - Alertas visuais e sonoros para inícios e interrupções de treino (empatia e comunicabilidade).
- **Estrutura**:
  - `index.html`: Base semântica, simulando o dispositivo em volta da tela.
  - `style.css`: Layout moderno de interface de dispositivo, simulando LEDs interativos e responsivos de acordo com o estado do sistema.
  - `script.js`: Sistema reativo baseado em estado que cuida de temporizadores, transições de tela e alertas de fala.

## Diário de Bordo (Logbook)

- **[22/04/2026] - Setup e Planejamento**: Entendimento do enunciado (PDF) e vídeo do cliente (GS-Fit). Configuração do ambiente Git, Jest para testes locais e estrutura base (HTML, CSS e JS).
- **[22/04/2026] - Autenticação e Interface Inicial**: Implementação da tela de boas-vindas com simulação de RFID (pulseira) para evitar interação via teclado. Atualização dinâmica dos dados na *dashboard* conforme o usuário identificado com seus objetivos e condições físicas.
- **[22/04/2026] - Lógica do Treino e Feedbacks Visuais/Áudio**: Inserção de cronômetro no aplicativo. Interação do usuário com Pausa, Retomada e Finalização de treinos. Introduzimos `SpeechSynthesis` para feedback por voz contínuo e assertivo (acessibilidade auditiva e guiamento "hands-free" para os treinos) e luzes (LEDs) interativos dependendo do estado do sistema. Criação de testes unitários para a API de voz e comportamentos do hardware virtual. Todos os testes rodando com sucesso.
