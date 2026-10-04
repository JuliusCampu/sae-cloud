/* SAE.cloud — núcleo de UI: modales, avisos, shell (menú/cabecera) y acciones de botones */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const page = document.body.dataset.page || '';
  const base = page ? '' : 'pages/';
  const home = page ? '../index.html' : 'index.html';
  const session = () => { try { return JSON.parse(sessionStorage.getItem('sae_session')); } catch { return null; } };

  /* ---------- Toasts ---------- */
  function toast(msg, type = 'ok') {
    let w = $('#toasts');
    if (!w) { w = document.createElement('div'); w.id = 'toasts'; w.className = 'fixed bottom-4 right-4 left-4 sm:left-auto z-[200] flex flex-col gap-2 items-end'; document.body.appendChild(w); }
    const t = document.createElement('div');
    t.className = 'toast flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-body-sm text-white ' + (type === 'err' ? 'bg-error' : 'bg-inverse-surface');
    t.setAttribute('role', 'status');
    t.innerHTML = `<span class="material-symbols-outlined text-[18px]">${type === 'err' ? 'error' : 'check_circle'}</span><span>${esc(msg)}</span>`;
    w.appendChild(t); setTimeout(() => t.remove(), 3400);
  }

  /* ---------- Modales ---------- */
  let lastFocus = null;
  function fieldHTML(f) {
    const id = 'f_' + f.name, req = f.required ? 'required' : '';
    const cls = 'w-full rounded-lg bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary';
    let input;
    if (f.type === 'select') input = `<select id="${id}" name="${f.name}" class="${cls}" ${req}>${f.options.map(o => `<option>${esc(o)}</option>`).join('')}</select>`;
    else if (f.type === 'textarea') input = `<textarea id="${id}" name="${f.name}" rows="3" class="${cls}" placeholder="${esc(f.placeholder || '')}" ${req}></textarea>`;
    else input = `<input id="${id}" name="${f.name}" type="${f.type || 'text'}" class="${cls}" placeholder="${esc(f.placeholder || '')}" ${req}/>`;
    return `<label class="flex flex-col gap-1" for="${id}"><span class="font-label-sm text-on-surface">${esc(f.label)}${f.required ? ' <span class="text-error">*</span>' : ''}</span>${input}</label>`;
  }
  function closeModal() {
    const m = $('#modal-root'); if (!m) return;
    m.remove(); document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openModal({ title = 'SAE.cloud', body = '', fields = [], confirm = 'Confirmar', cancel = 'Cancelar', hideCancel = false, danger = false, onConfirm } = {}) {
    closeModal(); lastFocus = document.activeElement;
    const ov = document.createElement('div');
    ov.id = 'modal-root';
    ov.className = 'fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/50 sm:p-4';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', title);
    ov.innerHTML = `<form class="modal-card bg-surface-container-lowest w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col" novalidate>
      <div class="flex items-center justify-between px-5 py-4 border-b border-outline-variant/40"><h2 class="font-headline-md text-on-surface">${esc(title)}</h2>
        <button type="button" data-close class="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center" aria-label="Cerrar"><span class="material-symbols-outlined text-[20px]">close</span></button></div>
      <div class="px-5 py-4 overflow-y-auto flex flex-col gap-3 text-body-sm text-on-surface-variant">${body ? `<p>${body}</p>` : ''}${fields.map(fieldHTML).join('')}</div>
      <div class="px-5 py-4 border-t border-outline-variant/40 flex justify-end gap-2">
        ${hideCancel ? '' : `<button type="button" data-close class="px-4 h-9 rounded-lg bg-surface-container text-on-surface font-label-md hover:bg-surface-container-high">${esc(cancel)}</button>`}
        <button type="submit" class="px-4 h-9 rounded-lg font-label-md text-white ${danger ? 'bg-error' : 'bg-secondary hover:bg-secondary-container'}">${esc(confirm)}</button></div></form>`;
    document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    const form = $('form', ov);
    ov.addEventListener('mousedown', e => { if (e.target === ov) closeModal(); });
    $$('[data-close]', ov).forEach(b => b.addEventListener('click', closeModal));
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (!onConfirm || onConfirm(data) !== false) closeModal();
    });
    setTimeout(() => ($('input,select,textarea', ov) || $('button[type=submit]', ov)).focus(), 30);
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMenus(); $('#sidebar')?.classList.remove('open'); $('#scrim')?.classList.add('hidden'); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { const s = $('#globalSearch'); if (s) { e.preventDefault(); s.focus(); } }
  });
  window.alert = m => openModal({ title: 'SAE.cloud', body: esc(m).replace(/\n/g, '<br>'), confirm: 'Entendido', hideCancel: true });
  window.SAE = { openModal, closeModal, toast };

  /* ---------- Shell (solo páginas internas) ---------- */
  const NAV = [
    ['Dashboard', [['Resumen General', 'dashboard', 'dashboard'], ['Indicadores', 'trending_up', 'dashboard'], ['Alertas', 'notifications_active', 'bitacora']]],
    ['Académico', [['Alumnos', 'school', 'alumnos'], ['Expedientes', 'folder_shared', 'expediente'], ['Grupos y Salones', 'meeting_room', 'grupos'], ['Materias', 'menu_book', 'docentes'], ['Calificaciones', 'grade', 'calificaciones'], ['Asistencia', 'fact_check', 'asistencia'], ['Horarios', 'schedule', 'horarios']]],
    ['Administración', [['Inscripciones', 'how_to_reg', 'inscripciones'], ['Ciclos Escolares', 'event_repeat', 'configuracion'], ['Docentes y Personal', 'badge', 'docentes'], ['Tutores', 'escalator_warning', 'alumnos'], ['Roles y Permisos', 'admin_panel_settings', 'roles']]],
    ['Finanzas', [['Estado de Cuenta', 'account_balance_wallet', 'finanzas'], ['Cobranza y Colegiaturas', 'payments', 'finanzas'], ['Becas y Descuentos', 'savings', 'finanzas'], ['Recibos', 'receipt_long', 'finanzas']]],
    ['Comunicación', [['Centro de Avisos', 'campaign', 'comunicacion'], ['Eventos', 'calendar_month', 'calendario'], ['Mensajería', 'forum', 'comunicacion']]],
    ['Reportes y Auditoría', [['Centro de Reportes', 'analytics', 'reportes'], ['Bitácora de Auditoría', 'history', 'bitacora'], ['Verificación NOM-151', 'verified_user', 'hash'], ['Configuración', 'settings', 'configuracion']]]
  ];
  const ALL = NAV.flatMap(([, items]) => items);
  const closeMenus = () => $$('.dd').forEach(d => d.classList.add('hidden'));

  function buildShell() {
    const s = session();
    if (!s) { location.replace(home); return false; }
    const initials = ({ admin: 'CV', docente: 'DC', estudiante: 'FM' })[s.role] || 'US';
    const name = ({ admin: 'Mtra. Carmen Valenzuela G.', docente: 'Docente · ' + s.user, estudiante: 'Familia · ' + s.user })[s.role] || s.user;
    const campus = sessionStorage.getItem('sae_campus') || s.campus;
    const seen = new Set();
    const navHTML = NAV.map(([sec, items]) => `<div class="flex flex-col gap-space-2xs"><span class="px-space-sm font-label-xs text-primary-fixed-dim tracking-wider uppercase">${sec}</span>${items.map(([l, ic, p]) => {
      const active = p === page && !seen.has(p) && seen.add(p);
      return `<a href="${p}.html" ${active ? 'aria-current="page"' : ''} class="flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-colors ${active ? 'bg-secondary-container text-on-secondary-container font-headline-md' : 'text-primary-fixed font-body-sm hover:bg-surface-variant/20 hover:text-white'}"><span class="material-symbols-outlined text-[18px]">${ic}</span><span>${l}</span></a>`;
    }).join('')}</div>`).join('');
    const dd = 'dd hidden absolute right-0 top-full mt-2 bg-surface-container-lowest rounded-xl shadow-xl z-50 overflow-hidden';
    const item = 'w-full text-left flex items-center gap-2 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low';
    const wrap = document.createElement('div');
    wrap.innerHTML = `
    <div id="scrim" class="hidden fixed inset-0 bg-black/40 z-40 lg:hidden"></div>
    <aside id="sidebar" class="fixed left-0 top-0 h-full w-[260px] bg-primary-container z-50 flex flex-col text-surface-container-highest shadow-lg">
      <div class="p-space-lg flex items-center justify-between">
        <a href="dashboard.html" class="flex items-center gap-space-sm"><img src="../assets/img/favicon.svg" alt="SAE.cloud" class="h-9 w-9"/><div class="flex flex-col"><span class="font-headline-md text-white tracking-tight leading-5">SAE.cloud</span><span class="font-label-xs text-on-tertiary-container uppercase tracking-wider">Gobierno Educativo</span></div></a>
        <button id="closeNav" class="lg:hidden w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Cerrar menú"><span class="material-symbols-outlined">close</span></button></div>
      <div class="mx-space-md mb-space-sm p-space-sm rounded-lg bg-white/10 flex items-center justify-between"><span class="font-label-xs text-primary-fixed-dim uppercase">Ciclo</span><span class="font-code-num text-white">2024 - 2025</span><span class="px-2 rounded-full bg-secondary-container text-white font-label-xs">Vigente</span></div>
      <nav class="flex-1 overflow-y-auto px-space-md pb-space-lg flex flex-col gap-space-sm">${navHTML}</nav></aside>
    <header id="topbar" class="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-surface-container-lowest shadow-sm z-30 flex items-center justify-between gap-2 px-3 md:px-space-margin">
      <div class="flex items-center gap-2 flex-1 max-w-xl min-w-0">
        <button id="openNav" class="lg:hidden w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center shrink-0" aria-label="Abrir menú"><span class="material-symbols-outlined">menu</span></button>
        <div class="relative w-full"><span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input id="globalSearch" autocomplete="off" class="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary" placeholder="Buscar módulo o alumno… (Ctrl+K)"/>
          <div id="searchRes" class="dd hidden absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest rounded-xl shadow-xl z-50 overflow-hidden"></div></div></div>
      <div class="flex items-center gap-1 md:gap-space-md">
        <div class="relative"><button data-dd="ddQuick" class="h-9 px-3 rounded-lg bg-secondary text-white font-label-md flex items-center gap-1 hover:bg-secondary-container"><span class="material-symbols-outlined text-[18px]">add</span><span class="hidden sm:inline">Acción Rápida</span></button>
          <div id="ddQuick" class="${dd} w-56"><button data-quick="alumno" class="${item}"><span class="material-symbols-outlined text-[18px]">person_add</span>Nuevo alumno</button><button data-quick="pago" class="${item}"><span class="material-symbols-outlined text-[18px]">payments</span>Registrar pago</button><button data-quick="aviso" class="${item}"><span class="material-symbols-outlined text-[18px]">campaign</span>Nuevo comunicado</button><button data-quick="evento" class="${item}"><span class="material-symbols-outlined text-[18px]">event</span>Nuevo evento</button></div></div>
        <button id="campusBtn" class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-body-sm"><span class="material-symbols-outlined text-[18px] text-secondary">location_city</span><span id="campusLbl" class="font-label-sm truncate max-w-[180px]">${esc(campus)}</span><span class="material-symbols-outlined text-[16px] text-outline">expand_more</span></button>
        <div class="relative"><button data-dd="ddNotif" class="w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center relative" aria-label="Notificaciones"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">3</span></button>
          <div id="ddNotif" class="${dd} w-80 max-w-[90vw]"><p class="px-4 py-3 font-headline-md border-b border-outline-variant/40">Notificaciones</p>
            ${[['payments', 'Pago de colegiatura recibido', 'finanzas'], ['history', 'Modificación de calificación oficial', 'bitacora'], ['how_to_reg', 'Inscripción validada en sistema', 'inscripciones']].map(([i, t, p]) => `<a href="${p}.html" class="${item}"><span class="material-symbols-outlined text-[18px] text-secondary">${i}</span>${t}</a>`).join('')}</div></div>
        <div class="relative"><button data-dd="ddUser" class="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-container" aria-label="Menú de usuario"><span class="w-8 h-8 rounded-full bg-secondary text-white font-label-sm flex items-center justify-center">${initials}</span><span class="material-symbols-outlined text-[16px] text-outline hidden sm:inline">expand_more</span></button>
          <div id="ddUser" class="${dd} w-64"><div class="px-4 py-3 border-b border-outline-variant/40"><p class="font-label-md text-on-surface">${esc(name)}</p><p class="font-label-xs text-outline uppercase">${esc(s.role)}</p></div>
            <button data-act="perfil" class="${item}"><span class="material-symbols-outlined text-[18px]">account_circle</span>Mi perfil</button><a href="configuracion.html" class="${item}"><span class="material-symbols-outlined text-[18px]">settings</span>Configuración</a><button data-act="logout" class="${item} text-error"><span class="material-symbols-outlined text-[18px]">logout</span>Cerrar sesión</button></div></div></div></header>`;
    document.body.prepend(...wrap.children);
    /* menú móvil */
    const side = $('#sidebar'), scrim = $('#scrim');
    const toggle = o => { side.classList.toggle('open', o); scrim.classList.toggle('hidden', !o); };
    $('#openNav').onclick = () => toggle(true); $('#closeNav').onclick = () => toggle(false); scrim.onclick = () => toggle(false);
    /* dropdowns */
    $$('[data-dd]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const t = $('#' + b.dataset.dd), was = t.classList.contains('hidden'); closeMenus(); t.classList.toggle('hidden', !was); }));
    document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeMenus(); });
    /* acciones rápidas */
    $$('[data-quick]').forEach(b => b.addEventListener('click', () => { closeMenus(); runRule(RULES.find(r => r.id === b.dataset.quick)); }));
    $('[data-act=logout]').onclick = () => openModal({ title: 'Cerrar sesión', body: '¿Desea salir de SAE.cloud?', confirm: 'Cerrar sesión', onConfirm: () => { sessionStorage.clear(); location.href = home; } });
    $('[data-act=perfil]').onclick = () => { closeMenus(); openModal({ title: 'Mi perfil', body: `<b>${esc(name)}</b><br>Rol: ${esc(s.role)}<br>Campus: ${esc($('#campusLbl').textContent)}`, confirm: 'Cerrar', hideCancel: true }); };
    $('#campusBtn').onclick = () => openModal({ title: 'Cambiar de campus', fields: [{ name: 'campus', label: 'Campus', type: 'select', options: ['Campus Central (CDMX)', 'Campus Norte (Polanco - Satélite)', 'Campus Poniente (Santa Fe)', 'Bachillerato Tecnológico Especializado'] }], confirm: 'Cambiar', onConfirm: d => { sessionStorage.setItem('sae_campus', d.campus); $('#campusLbl').textContent = d.campus; toast('Campus activo: ' + d.campus); } });
    /* buscador global */
    const inp = $('#globalSearch'), res = $('#searchRes');
    inp.addEventListener('input', () => {
      const q = inp.value.trim().toLowerCase(); if (q.length < 2) return res.classList.add('hidden');
      const hits = ALL.filter(([l]) => l.toLowerCase().includes(q)).slice(0, 6);
      res.innerHTML = hits.map(([l, i, p]) => `<a href="${p}.html" class="flex items-center gap-2 px-4 py-2.5 text-body-sm hover:bg-surface-container-low"><span class="material-symbols-outlined text-[18px] text-secondary">${i}</span>${l}</a>`).join('') +
        `<a href="alumnos.html?q=${encodeURIComponent(q)}" class="flex items-center gap-2 px-4 py-2.5 text-body-sm hover:bg-surface-container-low border-t border-outline-variant/40"><span class="material-symbols-outlined text-[18px]">person_search</span>Buscar alumno “${esc(q)}”</a>`;
      res.classList.remove('hidden');
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const a = $('a', res); if (a) location.href = a.getAttribute('href'); } });
    return true;
  }

  /* ---------- Acciones de botones (reglas) ---------- */
  const T = (name, label, extra = {}) => ({ name, label, required: true, ...extra });
  const S = (name, label, options) => ({ name, label, type: 'select', options });
  const RULES = [
    { id: 'alumno', re: /nuevo alumno|agregar alumno|nueva inscripci|inscribir|nuevo ingreso|person_add/i, title: 'Nuevo alumno', fields: [T('nombre', 'Nombre completo'), T('curp', 'CURP'), S('grado', 'Grado', ['1° Secundaria', '2° Secundaria', '3° Secundaria', '1° Bachillerato']), S('grupo', 'Grupo', ['A', 'B', 'C'])], ok: 'Alumno registrado correctamente' },
    { id: 'pago', re: /pago|cobr|cargo|recibo|colegiatura|recargo|beca/i, title: 'Registrar pago', fields: [T('alumno', 'Alumno o matrícula'), T('monto', 'Monto (MXN)', { type: 'number' }), S('metodo', 'Método', ['SPEI', 'Tarjeta', 'Efectivo', 'Depósito'])], ok: 'Pago registrado' },
    { id: 'evento', re: /evento|calendario|event_add/i, title: 'Nuevo evento', fields: [T('titulo', 'Título'), T('fecha', 'Fecha', { type: 'date' }), S('tipo', 'Tipo', ['Académico', 'Cívico', 'Reunión', 'Receso'])], ok: 'Evento agendado' },
    { id: 'aviso', re: /comunicado|aviso|mensaje|redactar|circular|campaign|send/i, title: 'Nuevo comunicado', fields: [T('asunto', 'Asunto'), S('dest', 'Destinatarios', ['Toda la comunidad', 'Docentes', 'Tutores', 'Alumnos']), T('texto', 'Mensaje', { type: 'textarea' })], ok: 'Comunicado enviado' },
    { id: 'usuario', re: /usuario|rol|permiso|invitar/i, title: 'Nuevo usuario', fields: [T('nombre', 'Nombre'), T('correo', 'Correo institucional', { type: 'email' }), S('rol', 'Rol', ['Directivo', 'Coordinador', 'Docente', 'Finanzas', 'Control escolar'])], ok: 'Usuario creado' },
    { id: 'asignar', re: /docente|materia|asignar|horario|grupo|salon|salón/i, title: 'Nueva asignación', fields: [T('docente', 'Docente'), T('materia', 'Materia o grupo')], ok: 'Asignación guardada' },
    { id: 'export', re: /exportar|descargar|imprimir|reporte|boleta|pdf|excel|csv|download|print|ficha/i, title: 'Exportar', fields: [S('formato', 'Formato', ['PDF', 'Excel (.xlsx)', 'CSV'])], confirm: 'Exportar', ok: 'Exportación generada' },
    { id: 'filtro', re: /filtro|filtrar|filter/i, title: 'Filtros', fields: [S('periodo', 'Periodo', ['Ciclo actual', 'Último mes', 'Último parcial']), S('estatus', 'Estatus', ['Todos', 'Activos', 'Pendientes'])], confirm: 'Aplicar', ok: 'Filtros aplicados' },
    { id: 'eliminar', re: /eliminar|borrar|delete|baja/i, title: 'Confirmar eliminación', body: 'Esta acción no se puede deshacer.', danger: true, confirm: 'Eliminar', ok: 'Registro eliminado' },
    { id: 'guardar', re: /guardar|aplicar|actualizar|sincronizar|publicar|validar|firmar|timbrar|save|sync|check/i, direct: 'Cambios guardados' },
    { id: 'fila', re: /more_vert|more_horiz|acciones/i, title: 'Acciones del registro', fields: [S('accion', 'Acción', ['Ver detalle', 'Editar', 'Archivar'])], ok: 'Acción aplicada' }
  ];
  function runRule(r, label) {
    if (!r) return openModal({ title: label || 'Acción', body: 'Esta acción se ejecutará en modo demostración.', onConfirm: () => toast('Acción registrada') });
    if (r.direct) return toast(r.direct);
    openModal({ title: r.title, body: r.body || '', fields: r.fields || [], confirm: r.confirm || 'Guardar', danger: r.danger, onConfirm: () => toast(r.ok) });
  }

  function wireMain() {
    const main = $('main'); if (!main) return;
    main.addEventListener('click', e => {
      const a = e.target.closest('a[href="#"]');
      if (a) { e.preventDefault(); const t = a.textContent.replace(/\s+/g, ' ').trim().toLowerCase(); const hit = ALL.find(([l]) => t && l.toLowerCase() === t); return hit ? location.href = hit[2] + '.html' : toast('Vista disponible próximamente'); }
      const b = e.target.closest('button');
      if (!b || b.id || b.hasAttribute('onclick') || b.hasAttribute('data-own') || b.getAttribute('type') === 'submit' || b.closest('#modal-root') || b.closest('input,label')) return;
      if (b.closest('#main-tab-bar,#profile-tabs,[role=tablist]') || (page === 'calendario' && b.closest('.bg-surface-container-low'))) return; /* pestañas: ya tienen su propio script */
      const clone = b.cloneNode(true); $$('.material-symbols-outlined', clone).forEach(i => i.remove());
      const label = (b.getAttribute('aria-label') || clone.textContent || '').replace(/\s+/g, ' ').trim();
      const icons = $$('.material-symbols-outlined', b).map(i => i.textContent.trim()).join(' ');
      if (!label && !icons) return;
      runRule(RULES.find(r => r.re && r.re.test(label + ' ' + icons)), label);
    });
    $('#btn-marcar-todos')?.addEventListener('click', () => toast('Todos los alumnos marcados como presentes'));
    /* búsqueda local en tablas */
    $$('input', main).filter(i => /buscar|search|filtrar/i.test(i.placeholder || '')).forEach(i => {
      const run = () => { const q = i.value.toLowerCase(); $$('tbody tr', main).forEach(tr => tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'); };
      i.addEventListener('input', run);
      const q = new URLSearchParams(location.search).get('q'); if (q && page === 'alumnos' && i === $$('input', main).find(x => /buscar/i.test(x.placeholder))) { i.value = q; run(); }
    });
    /* tablas con scroll horizontal en móvil */
    $$('table', main).forEach(t => { if (!t.parentElement.classList.contains('overflow-x-auto')) { const w = document.createElement('div'); w.className = 'overflow-x-auto'; t.replaceWith(w); w.appendChild(t); } });
  }

  if (page) { if (buildShell()) wireMain(); }
})();
