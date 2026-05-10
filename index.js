const getThumbnail = (url, nome, customImage) => {
  if (customImage) return customImage;
  if (!url || url === '#') {
    return `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(nome)}`;
  }
  // WordPress mShots API for real website screenshots
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=600&h=450`;
};

const translations = {
  pt: {
    status: 'Disponível para novos projetos',
    title: 'Meus Projetos',
    subtitle: 'Uma coleção dos meus trabalhos e experimentos web',
    search_placeholder: 'Buscar projetos...',
    sort_label: 'Ordenar:',
    sort_options: {
      'nome-asc': 'Nome (A-Z)',
      'nome-desc': 'Nome (Z-A)',
      'categoria': 'Categoria'
    },
    visit_project: 'Visitar Projeto',
    view_details: 'Ver detalhes',
    modal_open: 'Abrir Projeto',
    cta_title: 'Vamos trabalhar juntos?',
    cta_subtitle: 'Estou sempre em busca de novos desafios e colaborações criativas.',
    email_link: 'E-mail',
    cta_form_btn: 'Enviar Mensagem',
    all_categories: 'Todos',
    loading: 'Carregando projetos...',
    status_live: (count, total) => `Exibindo ${count} projetos de ${total}.`,
    skills_title: 'Minhas Tecnologias'
  },
  en: {
    status: 'Available for new projects',
    title: 'My Projects',
    subtitle: 'A collection of my web works and experiments',
    search_placeholder: 'Search projects...',
    sort_label: 'Sort by:',
    sort_options: {
      'nome-asc': 'Name (A-Z)',
      'nome-desc': 'Name (Z-A)',
      'categoria': 'Category'
    },
    visit_project: 'Visit Project',
    view_details: 'View details',
    modal_open: 'Open Project',
    cta_title: "Let's work together?",
    cta_subtitle: "I'm always looking for new challenges and creative collaborations.",
    email_link: 'Email',
    cta_form_btn: 'Send Message',
    all_categories: 'All',
    loading: 'Loading projects...',
    status_live: (count, total) => `Showing ${count} projects out of ${total}.`,
    skills_title: 'My Tech Stack'
  }
};

let projetos = [];
let currentLang = 'pt';
let categoriaSelecionada = 'Todos';
let termoBusca = '';
let temaCurrent = 'dark';
let ordenacaoSelecionada = 'nome-asc';

const loadProjetos = async () => {
  try {
    const response = await fetch('./projetos.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    projetos = data.map((projeto) => ({
      ...projeto,
      thumbnail: getThumbnail(projeto.url, projeto.nome, projeto.imagem)
    }));
  } catch (error) {
    console.error('Falha ao carregar projetos:', error);
    projetos = [];
  }
};

const getCategorias = () => {
  const catField = currentLang === 'pt' ? 'categoria' : 'categoria_en';
  const categories = [
    ...new Set(projetos.map((projeto) => projeto[catField]))
  ];
  return [translations[currentLang].all_categories, ...categories];
};

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
  atualizarBotaoTema();
};

const toggleTema = () => aplicarTema(temaCurrent === 'dark' ? 'light' : 'dark');

const atualizarBotaoTema = () => {
  const botao = document.getElementById('toggleTema');
  if (botao) botao.textContent = temaCurrent === 'dark' ? '☀️' : '🌙';
};

const initLang = () => {
  const langArmazenado = localStorage.getItem('lang');
  currentLang = langArmazenado || (navigator.language.startsWith('en') ? 'en' : 'pt');
  updateLanguageUI();
};

const toggleLang = () => {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  localStorage.setItem('lang', currentLang);
  categoriaSelecionada = translations[currentLang].all_categories;
  updateLanguageUI();
  renderFiltros();
  renderOrdenacao();
  renderProjetos();
};

const updateLanguageUI = () => {
  const langButton = document.getElementById('toggleLang');
  if (langButton) langButton.textContent = currentLang.toUpperCase();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang][key]) {
      el.placeholder = translations[currentLang][key];
    }
  });
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

  const interactiveElements = 'a, button, select, input, .projeto, .skill-item';
  const addHoverClass = () => cursor.classList.add('hover');
  const removeHoverClass = () => cursor.classList.remove('hover');

  const setupHovers = () => {
    document.querySelectorAll(interactiveElements).forEach(el => {
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });
  };

  setupHovers();
  const observer = new MutationObserver(setupHovers);
  observer.observe(document.body, { childList: true, subtree: true });
};

const setupSearchInput = () => {
  const buscaInput = document.getElementById('busca');
  if (!buscaInput) return;
  buscaInput.addEventListener('input', (event) => {
    termoBusca = event.target.value.toLowerCase();
    renderProjetos();
  });
};

const renderOrdenacao = () => {
  const selectOrdenar = document.getElementById('ordenar');
  if (!selectOrdenar) return;
  selectOrdenar.innerHTML = '';

  Object.entries(translations[currentLang].sort_options).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value === ordenacaoSelecionada) option.selected = true;
    selectOrdenar.appendChild(option);
  });

  selectOrdenar.addEventListener('change', (event) => {
    ordenacaoSelecionada = event.target.value;
    renderProjetos();
  });
};

const openModal = (projeto) => {
  const modal = document.getElementById('modal');
  if (!modal) return;

  const descField = currentLang === 'pt' ? 'descricao' : 'descricao_en';
  const catField = currentLang === 'pt' ? 'categoria' : 'categoria_en';

  modal.querySelector('.modal-title').textContent = projeto.nome;
  modal.querySelector('.modal-category').textContent = projeto[catField];
  modal.querySelector('.modal-description').textContent = projeto[descField] || '...';
  
  const link = modal.querySelector('.modal-link');
  link.href = projeto.url;
  link.textContent = translations[currentLang].modal_open;

  const thumb = modal.querySelector('.modal-thumb');
  thumb.src = projeto.thumbnail;
  thumb.alt = projeto.nome;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const setupModalEvents = () => {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
};

const renderFiltros = () => {
  const filtrosContainer = document.getElementById('filtros');
  if (!filtrosContainer) return;
  filtrosContainer.innerHTML = '';

  const categorias = getCategorias();
  
  categorias.forEach((categoria) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('filtro-btn');
    if (categoria === categoriaSelecionada) btn.classList.add('active');
    btn.textContent = categoria;
    btn.addEventListener('click', () => {
      categoriaSelecionada = categoria;
      renderFiltros();
      renderProjetos();
    });
    filtrosContainer.appendChild(btn);
  });
};

const renderProjetos = () => {
  const container = document.getElementById('projetos');
  if (!container) return;
  container.innerHTML = '';

  const catField = currentLang === 'pt' ? 'categoria' : 'categoria_en';
  const descField = currentLang === 'pt' ? 'descricao' : 'descricao_en';

  const filtrados = projetos.filter(p => 
    categoriaSelecionada === translations[currentLang].all_categories || p[catField] === categoriaSelecionada
  );

  const buscados = filtrados.filter(p => 
    p.nome.toLowerCase().includes(termoBusca) || (p[descField] && p[descField].toLowerCase().includes(termoBusca))
  );

  const ordenados = [...buscados].sort((a, b) => {
    if (ordenacaoSelecionada === 'nome-asc') return a.nome.localeCompare(b.nome);
    if (ordenacaoSelecionada === 'nome-desc') return b.nome.localeCompare(a.nome);
    if (ordenacaoSelecionada === 'categoria') return a[catField].localeCompare(b[catField]) || a.nome.localeCompare(b.nome);
    return 0;
  });

  ordenados.forEach((projeto, index) => {
    const el = document.createElement('div');
    el.classList.add('projeto');
    el.style.animationDelay = `${index * 0.1}s`;
    el.innerHTML = `
      <img src="${projeto.thumbnail}" alt="${projeto.nome}" loading="lazy" class="projeto-thumbnail">
      <h2>${projeto.nome}</h2>
      <p class="projeto-descricao">${projeto[descField] || '...'}</p>
      <span class="categoria-badge">${projeto[catField]}</span>
      <div class="projeto-actions">
        <a href="${projeto.url}" target="_blank" rel="noopener noreferrer">${translations[currentLang].visit_project}</a>
        <button type="button" class="detalhes-btn">${translations[currentLang].view_details}</button>
      </div>
    `;
    el.querySelector('.detalhes-btn').addEventListener('click', () => openModal(projeto));
    container.appendChild(el);
  });

  const statusLive = document.getElementById('status-live');
  if (statusLive) statusLive.textContent = translations[currentLang].status_live(ordenados.length, projetos.length);
};

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('projetos');
  if (container) container.innerHTML = `<p class="loading">${translations[currentLang].loading}</p>`;

  await loadProjetos();
  initTema();
  initLang();
  initCursor();
  
  document.getElementById('toggleTema')?.addEventListener('click', toggleTema);
  document.getElementById('toggleLang')?.addEventListener('click', toggleLang);
  
  renderFiltros();
  renderOrdenacao();
  setupSearchInput();
  renderProjetos();
  setupModalEvents();
});
