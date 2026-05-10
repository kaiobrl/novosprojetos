# 🚀 Portfólio Premium -

Um portfólio web moderno, dinâmico e bilíngue, desenvolvido com foco em experiência do usuário (UX), acessibilidade e alta performance.

## ✨ Funcionalidades

- **🌍 Suporte Multi-idioma (i18n)**: Alternância dinâmica entre Português e Inglês com persistência de escolha.
- **🌓 Modo Escuro/Claro**: Sistema de tema inteligente com detecção de preferência do sistema e salvamento local.
- **🖱️ Micro-interações de Cursor**: Cursor customizado com efeito de brilho (glow) e reações dinâmicas a elementos interativos.
- **📸 Screenshots Automáticos**: Visualização real dos projetos através da integração com a API de capturas de tela (mShots).
- **🛠️ Vitrine de Skills**: Seção visual das tecnologias dominadas utilizando ícones vetoriais do Devicon.
- **📩 Página de Contato**: Área dedicada com formulário funcional integrado ao Formspree.
- **♿ Acessibilidade (WCAG)**: Implementação de regiões `aria-live`, foco visível otimizado e estrutura semântica para leitores de tela.

## 🛠️ Tecnologias Utilizadas

- **Core**: HTML5 Semântico, CSS3 (Vanilla), JavaScript (ES6+).
- **Design**: Glassmorphism, CSS Variables, Flexbox/Grid.
- **Ícones**: [Devicon](https://devicon.dev/) e Emojis modernos.
- **Fontes**: [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter).
- **Serviços**: [Formspree](https://formspree.io/) (Contato) e [mShots](https://s.wordpress.com/mshots/) (Screenshots).

## 📁 Estrutura do Projeto

```bash
├── index.html          # Página principal (Home/Projetos)
├── contato.html        # Página de formulário de contato
├── index.css           # Design System e estilos globais
├── index.js            # Lógica principal, i18n e renderização
├── contato.js          # Lógica específica da página de contato
└── projetos.json       # Banco de dados local dos projetos
```

## 🚀 Como Customizar

### Adicionar Projetos
Não é mais necessário mexer no código JavaScript. Basta editar o arquivo `projetos.json`:

```json
{
  "nome": "Nome do Projeto",
  "url": "https://link-do-projeto.com",
  "categoria": "Web Design",
  "categoria_en": "Web Design",
  "descricao": "Descrição em PT",
  "descricao_en": "Description in EN",
  "imagem": "" (opcional: link para imagem customizada)
}
```

### Configurar o Formulário
No arquivo `contato.html`, localize o campo `action` do formulário e substitua o ID pelo seu ID do **Formspree**:
```html
<form id="contact-form" action="https://formspree.io/f/seu-id-aqui" method="POST">
```

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo.

---
*Desenvolvido com ❤️ por KaioBRL*
