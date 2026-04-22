# S.H.A.P.E. Prototype - Studio GS-Fit

Este é o protótipo de alta fidelidade para o S.H.A.P.E. (Solução de Hardware para Apoio à Prática de Exercício), desenvolvido para a disciplina de Interação Humano-Computador (IHC). 

O foco deste projeto é apresentar as **interfaces e a interação** de um dispositivo físico dedicado a auxiliar alunos durante a prática de exercícios no Studio GS-Fit.

## 🛠️ Tecnologias Utilizadas
- **HTML5, CSS3, JavaScript (Vanilla)**: Nenhuma dependência externa ou framework pesado para a interface, simulando o ambiente restrito de um hardware embarcado.
- **Jest & JSDOM**: Para os testes unitários da interface e de suas lógicas de estado.
- **Web Speech API (SpeechSynthesis)**: Para feedback interativo por voz.

## 🚀 Como Executar o Protótipo Localmente

Para garantir que todos os recursos do navegador (especialmente a reprodução de voz e possíveis bloqueios de CORS para arquivos locais) funcionem perfeitamente, é recomendado rodar o projeto através de um servidor local (*localhost*).

Escolha **uma** das opções abaixo:

### Opção 1: Usando Node.js (Recomendado)
Se você já tem o Node.js e o npm instalados (já utilizados para os testes do projeto):
1. Abra o terminal na pasta do projeto (`ihc`).
2. Execute o comando usando o pacote `serve` (não precisa instalar globalmente, o `npx` baixa na hora):
   ```bash
   npx serve .
   ```
3. Acesse no seu navegador o endereço fornecido no terminal (geralmente `http://localhost:3000`).

### Opção 2: Usando VS Code (Extensão Live Server)
Se você utiliza o editor Visual Studio Code:
1. Instale a extensão **Live Server** de Ritwick Dey.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
4. O navegador abrirá automaticamente em algo como `http://127.0.0.1:5500/index.html`.

### Opção 3: Usando Python
Se você possui o Python instalado na sua máquina:
1. Abra o terminal na pasta do projeto.
2. Execute o comando:
   ```bash
   python -m http.server 8000
   ```
   *(Ou `python3 -m http.server 8000` dependendo do seu sistema)*
3. Acesse `http://localhost:8000` no seu navegador.

---

## 🧪 Como Rodar os Testes Unitários

Para verificar a integridade da aplicação e garantir que as futuras mudanças não quebrem a lógica:
1. Certifique-se de que as dependências do projeto estão instaladas:
   ```bash
   npm install
   ```
2. Execute o comando de teste:
   ```bash
   npm test
   ```

## 📖 Documentação Completa
Para mais detalhes sobre as decisões de design, domínio do problema, público alvo e diário de bordo com as iterações, consulte o arquivo [projeto_documentacao.md](projeto_documentacao.md).
