# 🎮 English Quest - Plataforma de Ensino de Inglês através de Jogos

Uma plataforma interativa de ensino de inglês para adultos, onde os usuários aprendem resolvendo desafios e avançando de nível em um ambiente gamificado.

## ✨ Funcionalidades

### Para Usuários
- **🎯 Sistema de Desafios**: Questões de inglês organizadas por níveis de dificuldade
- **📈 Progressão por Níveis**: Avance de nível ao completar questões
- **⭐ Sistema de Pontuação**: Ganhe pontos a cada resposta correta
- **🏆 Recompensas e Prêmios**: Desbloqueie badges e itens exclusivos
- **🎮 Interface Gamificada**: Experiência de aprendizado divertida e envolvente

### Para Administradores
- **📝 Gestão de Questões**: Adicionar, visualizar e excluir questões
- **🎁 Gestão de Recompensas**: Criar novas recompensas para os usuários
- **⚙️ Painel Administrativo**: Controle completo do conteúdo da plataforma

## 🔐 Usuários de Teste

A aplicação já vem com dois usuários pré-configurados para testes:

| Tipo | E-mail | Senha | Acesso |
|------|--------|-------|--------|
| Demo | demo@english.com | demo123 | Dashboard do Jogador |
| Admin | admin@english.com | admin123 | Painel Administrativo |

## 🎨 Design

A paleta de cores da aplicação utiliza tons de **vermelho e preto**, criando uma atmosfera moderna e envolvente:
- Vermelho intenso (#DC2626) para elementos de destaque
- Preto e cinza escuro para fundos
- Gradientes sutis para profundidade visual

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React para produção
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Estilização utilitária
- **LocalStorage** - Armazenamento de dados no navegador (sem backend)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

## 📱 Estrutura da Aplicação

```
src/
├── app/
│   ├── page.tsx              # Página inicial
│   ├── auth/
│   │   ├── login/page.tsx    # Login
│   │   └── register/page.tsx # Cadastro
│   ├── dashboard/page.tsx    # Dashboard do usuário
│   ├── admin/page.tsx        # Painel administrativo
│   └── game/                 # Área do jogo (futuro)
├── components/               # Componentes reutilizáveis
├── lib/
│   └── storage.ts           # Funções de armazenamento (localStorage)
└── types/
    └── index.ts             # Tipos TypeScript
```

## 💾 Armazenamento de Dados

Todos os dados são armazenados no **localStorage** do navegador:
- `english_game_users` - Lista de usuários cadastrados
- `english_game_current_user` - Usuário logado atualmente
- `english_game_questions` - Questões do jogo
- `english_game_rewards` - Recompensas disponíveis

> ⚠️ **Importante**: Como os dados são armazenados apenas no localStorage, eles são específicos do navegador e dispositivo utilizado.

## 🎮 Como Jogar

1. **Faça login** com uma das contas de teste ou crie uma nova conta
2. **Responda as questões** apresentadas no dashboard
3. **Acerte as respostas** para ganhar pontos e subir de nível
4. **Desbloqueie recompensas** conforme avança na plataforma
5. **Complete todos os níveis** para se tornar um mestre!

## 🔧 Funcionalidades do Admin

O painel administrativo permite:

### Gerenciar Questões
- Criar novas questões com:
  - Nível de dificuldade (1-10)
  - Enunciado em inglês
  - 4 opções de resposta
  - Seleção da resposta correta
  - Explicação da resposta (em português)
- Visualizar todas as questões cadastradas
- Excluir questões existentes

### Gerenciar Recompensas
- Criar novas recompensas com:
  - Nome e descrição
  - Custo em pontos
  - Nível mínimo necessário
  - Ícone (emoji)
- Visualizar todas as recompensas cadastradas

## 📝 Próximas Funcionalidades (Roadmap)

- [ ] Mais questões e níveis
- [ ] Sistema de ranking/leaderboard
- [ ] Conquistas especiais
- [ ] Modo competitivo
- [ ] Estatísticas detalhadas de progresso
- [ ] Temas personalizáveis
- [ ] Exportação de dados do usuário

## 🤝 Contribuição

Este é um projeto protótipo demonstrativo. Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Criar novas funcionalidades

## 📄 Licença

Projeto desenvolvido para fins educacionais e de demonstração.

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
