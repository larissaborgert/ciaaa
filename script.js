document.addEventListener('DOMContentLoaded', () => {

  // Elementos do Formulário
  const form = document.getElementById('contactForm');
  const inputNome = document.getElementById('nome');
  const inputEmail = document.getElementById('email');
  const inputTelefone = document.getElementById('telefone');
  const inputDataNascimento = document.getElementById('dataNascimento');
  const selectAssunto = document.getElementById('assunto');
  const inputMensagem = document.getElementById('mensagem');
  const checkboxTermos = document.getElementById('termos');
  
  // Elementos Auxiliares
  const charCounter = document.getElementById('charCounter');
  const registeredCountEl = document.getElementById('registeredCount');

  // Elementos do Toast (Janelinha Flutuante)
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  // 1. Atualiza Contador de Contatos do LocalStorage ao Iniciar
  atualizarContadorContatos();

  // 2. Máscara de Telefone: (00) 00000-0000
  inputTelefone.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    e.target.value = value;
  });

  // 3. Contador de Caracteres na Mensagem
  inputMensagem.addEventListener('input', () => {
    const total = inputMensagem.value.length;
    charCounter.textContent = `${total} / 300`;
    
    if (total >= 280) {
      charCounter.style.color = 'var(--error-red)';
    } else {
      charCounter.style.color = 'var(--text-muted)';
    }
  });

  // 4. Validação do Formulário no Envio (Submit)
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    let isValid = true;
    limparErros();

    // Validação: Nome Completo
    if (inputNome.value.trim().length < 3) {
      exibirErro('nome', 'Por favor, informe seu nome completo (mínimo 3 letras).');
      isValid = false;
    }

    // Validação: E-mail (expressão regular)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputEmail.value.trim())) {
      exibirErro('email', 'Por favor, informe um e-mail válido (ex: nome@dominio.com).');
      isValid = false;
    }

    // Validação: Telefone Completo
    if (inputTelefone.value.trim().length < 14) {
      exibirErro('telefone', 'Informe um telefone completo com DDD.');
      isValid = false;
    }

    // Validação: Data de Nascimento
    if (!inputDataNascimento.value) {
      exibirErro('dataNascimento', 'Por favor, selecione sua data de nascimento.');
      isValid = false;
    }

    // Validação: Assunto / Motivo
    if (!selectAssunto.value) {
      exibirErro('assunto', 'Selecione o motivo do contato.');
      isValid = false;
    }

    // Validação: Mensagem
    if (inputMensagem.value.trim().length < 10) {
      exibirErro('mensagem', 'A mensagem deve conter pelo menos 10 caracteres.');
      isValid = false;
    }

    // Validação: Checkbox dos Termos
    if (!checkboxTermos.checked) {
      exibirErro('termos', 'Você precisa aceitar os termos de privacidade.');
      isValid = false;
    }

    // Se houver erros: Exibe alerta visual de erro
    if (!isValid) {
      mostrarToast('Atenção!', 'Preencha corretamente todos os campos destacados.', 'error');
      return;
    }

    // Se estiver tudo certo: Salva no LocalStorage
    const radioPreferencia = document.querySelector('input[name="preferencia"]:checked');
    const novoContato = {
      id: Date.now(),
      nome: inputNome.value.trim(),
      email: inputEmail.value.trim(),
      telefone: inputTelefone.value.trim(),
      dataNascimento: inputDataNascimento.value,
      assunto: selectAssunto.value,
      preferencia: radioPreferencia ? radioPreferencia.value : 'Email',
      mensagem: inputMensagem.value.trim(),
      dataEnvio: new Date().toLocaleString('pt-BR')
    };

    salvarNoLocalStorage(novoContato);

    // Sucesso 🎉
    mostrarToast('Sucesso! 🎉', 'Sua mensagem foi enviada e cadastrada com sucesso.', 'success');
    
    // Limpa formulário e contadores
    form.reset();
    charCounter.textContent = '0 / 300';
    atualizarContadorContatos();
  });

  // Funções Auxiliares de Validação e Feedback Visual
  function exibirErro(campoId, mensagem) {
    const group = document.getElementById(`group-${campoId}`);
    const errorSpan = document.getElementById(`error-${campoId}`);
    if (group && errorSpan) {
      group.classList.add('has-error');
      errorSpan.textContent = mensagem;
    }
  }

  function limparErros() {
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
    });
    document.querySelectorAll('.error-message').forEach(span => {
      span.textContent = '';
    });
  }

  // Função para salvar no LocalStorage
  function salvarNoLocalStorage(contato) {
    const contatosSalvos = JSON.parse(localStorage.getItem('contatos_website')) || [];
    contatosSalvos.push(contato);
    localStorage.setItem('contatos_website', JSON.stringify(contatosSalvos));
  }

  // Atualiza contador de contatos salvos
  function atualizarContadorContatos() {
    const contatosSalvos = JSON.parse(localStorage.getItem('contatos_website')) || [];
    registeredCountEl.textContent = contatosSalvos.length;
  }

  // Função do Toast (Animação de Notificação)
  let toastTimeout;
  function mostrarToast(titulo, mensagem, tipo = 'success') {
    clearTimeout(toastTimeout);
    
    toastTitle.textContent = titulo;
    toastMessage.textContent = mensagem;

    if (tipo === 'error') {
      toast.classList.add('toast-error');
      toastIcon.textContent = '❌';
    } else {
      toast.classList.remove('toast-error');
      toastIcon.textContent = '🎉';
    }

    toast.classList.remove('hidden');

    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }
});