const translations = {
  pt: {
    back_home: '← Voltar',
    contact_title: 'Fale Comigo',
    contact_subtitle: 'Envie uma mensagem e responderei o mais rápido possível',
    label_name: 'Nome',
    label_email: 'E-mail',
    label_subject: 'Assunto',
    label_message: 'Mensagem',
    placeholder_name: 'Seu nome completo',
    placeholder_email: 'seu@email.com',
    placeholder_subject: 'Qual o assunto?',
    placeholder_message: 'Sua mensagem aqui...',
    btn_send: 'Enviar Mensagem',
    contact_page_title: 'Contato | Meus Projetos',
    msg_success: 'Mensagem enviada com sucesso!',
    msg_error: 'Ops! Ocorreu um erro ao enviar.'
  },
  en: {
    back_home: '← Back',
    contact_title: 'Get in Touch',
    contact_subtitle: 'Send a message and I will reply as soon as possible',
    label_name: 'Name',
    label_email: 'Email',
    label_subject: 'Subject',
    label_message: 'Message',
    placeholder_name: 'Your full name',
    placeholder_email: 'your@email.com',
    placeholder_subject: 'What is the subject?',
    placeholder_message: 'Your message here...',
    btn_send: 'Send Message',
    contact_page_title: 'Contact | My Projects',
    msg_success: 'Message sent successfully!',
    msg_error: 'Oops! Something went wrong.'
  }
};

let currentLang = 'pt';
let temaCurrent = 'dark';

const initTema = () => {
  const temaArmazenado = localStorage.getItem('tema');
  const temaPrefersence = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  temaCurrent = temaArmazenado || temaPrefersence;
  aplicarTema(temaCurrent);
};

const aplicarTema = (tema) => {
  temaCurrent = tema;
  document.body.classList.toggle('light-mode', tema === 'light');
  localStorage.setItem('tema', tema);
  const botao = document.getElementById('toggleTema');
  if (botao) botao.textContent = temaCurrent === 'dark' ? '☀️' : '🌙';
};

const initLang = () => {
  const langArmazenado = localStorage.getItem('lang');
  currentLang = langArmazenado || (navigator.language.startsWith('en') ? 'en' : 'pt');
  updateLanguageUI();
};

const updateLanguageUI = () => {
  const langButton = document.getElementById('toggleLang');
  if (langButton) langButton.textContent = currentLang.toUpperCase();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
  });
};

const toggleLang = () => {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  localStorage.setItem('lang', currentLang);
  updateLanguageUI();
};

const initCursor = () => {
  const cursor = document.getElementById('cursor');
  const glow = document.getElementById('cursor-glow');
  if (!cursor || !glow) return;

  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    glow.style.transform = `translate(${x}px, ${y}px)`;
  });

  const interactiveElements = 'a, button, input, textarea';
  const addHoverClass = () => cursor.classList.add('hover');
  const removeHoverClass = () => cursor.classList.remove('hover');

  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', addHoverClass);
    el.addEventListener('mouseleave', removeHoverClass);
  });
};

const initForm = () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.textContent = translations[currentLang].msg_success;
      status.className = 'form-status success';
      form.reset();
    } else {
      status.textContent = translations[currentLang].msg_error;
      status.className = 'form-status error';
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initTema();
  initLang();
  initCursor();
  initForm();
  
  document.getElementById('toggleTema')?.addEventListener('click', () => aplicarTema(temaCurrent === 'dark' ? 'light' : 'dark'));
  document.getElementById('toggleLang')?.addEventListener('click', toggleLang);
});
