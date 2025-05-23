# Lua de Hoje 🌙

Um site moderno que mostra a fase atual da lua com informações detalhadas, otimizado para GitHub Pages.

## Funcionalidades

- 🌙 Exibe a fase atual da lua em tempo real
- 📅 Mostra a próxima fase lunar e quando ocorrerá
- 📱 Design responsivo estilo TikTok
- 🔄 Atualização automática a cada minuto
- 📤 Função de compartilhamento
- 📖 Detalhes expandíveis com curiosidades
- 🇧🇷 Horário de Brasília

## Como usar

1. Clone este repositório
2. Instale as dependências: `npm install`
3. Execute localmente: `npm run dev`
4. Para build: `npm run build`

## Deploy no GitHub Pages

1. Ajuste o `basePath` no `next.config.js` com o nome do seu repositório
2. Faça push para a branch `main`
3. O GitHub Actions fará o deploy automaticamente

## Configuração para Organização

No arquivo `next.config.js`, ajuste:

\`\`\`js
basePath: '/NOME-DO-SEU-REPOSITORIO',
assetPrefix: '/NOME-DO-SEU-REPOSITORIO/',
\`\`\`

Seu site estará disponível em: `https://SUA-ORGANIZACAO.github.io/NOME-DO-SEU-REPOSITORIO`

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
