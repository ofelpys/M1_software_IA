const buttons = document.querySelectorAll('.menu-item');
const screens = {
  dashboard: document.getElementById('screen-dashboard'),
  recepcao: document.getElementById('screen-recepcao'),
  cadastro: document.getElementById('screen-cadastro'),
  financeiro: document.getElementById('screen-financeiro'),
  professores: document.getElementById('screen-professores'),
  equipamentos: document.getElementById('screen-equipamentos'),
  comunicacao: document.getElementById('screen-comunicacao'),
  operacao: document.getElementById('screen-operacao'),
};

const titles = {
  dashboard: 'Dashboard Executivo',
  recepcao: 'Recepção e Check-in Rápido',
  cadastro: 'Cadastro e Validação',
  financeiro: 'Painel Financeiro',
  professores: 'Gestão de Professores',
  equipamentos: 'Equipamentos e Salas',
  comunicacao: 'Comunicação e Notificações',
  operacao: 'Checklist de Operação',
};

const titleEl = document.getElementById('screen-title');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.screen;
    buttons.forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');

    Object.values(screens).forEach((screen) => screen.classList.remove('is-visible'));
    screens[key].classList.add('is-visible');
    titleEl.textContent = titles[key];
  });
});

const checkinRun = document.getElementById('checkin-run');
const checkinStatus = document.getElementById('checkin-status');
const checkinCpf = document.getElementById('checkin-cpf');
const checkinResult = document.getElementById('checkin-result');

if (checkinRun) {
  checkinRun.addEventListener('click', () => {
    const status = checkinStatus.value;
    const cpf = (checkinCpf.value || 'Não informado').trim();

    checkinResult.className = 'feedback-box is-hidden';
    checkinResult.classList.remove('is-hidden');

    if (status === 'ativo') {
      checkinResult.classList.add('success-box');
      checkinResult.textContent = `Check-in liberado para CPF ${cpf}. Registro efetuado com sucesso.`;
      return;
    }

    if (status === 'inadimplente') {
      checkinResult.classList.add('error-box');
      checkinResult.textContent = `Acesso negado para CPF ${cpf}. Motivo: inadimplência após carência.`;
      return;
    }

    checkinResult.classList.add('error-box');
    checkinResult.textContent = `Acesso bloqueado para CPF ${cpf}. Encaminhar para coordenação.`;
  });
}

const unlockButtons = document.querySelectorAll('.debt-unlock');
const unlockResult = document.getElementById('unlock-result');

unlockButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('tr');
    const status = row?.querySelector('.debt-status');
    const aluno = row?.children?.[0]?.textContent || 'Aluno';

    if (status) {
      status.textContent = 'Ativo';
      status.classList.remove('debt');
      status.classList.add('active');
    }

    button.disabled = true;
    button.textContent = 'Desbloqueado';

    if (unlockResult) {
      unlockResult.className = 'feedback-box success-box';
      unlockResult.textContent = `${aluno} desbloqueado com registro de operador.`;
    }
  });
});

const comSend = document.getElementById('com-send');
const comFail = document.getElementById('com-fail');
const comResult = document.getElementById('com-result');

if (comSend && comResult) {
  comSend.addEventListener('click', () => {
    comResult.className = 'feedback-box success-box';
    comResult.textContent = 'Comunicação enviada com sucesso. Status: ENVIADA.';
  });
}

if (comFail && comResult) {
  comFail.addEventListener('click', () => {
    comResult.className = 'feedback-box error-box';
    comResult.textContent = 'Falha no envio. Status: RETRY agendado para 5 minutos.';
  });
}
