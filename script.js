document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos
    const form = document.getElementById('formContato');
    const inputNome = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const inputTelefone = document.getElementById('telefone');
    const inputData = document.getElementById('dataNascimento');
    const selectAssunto = document.getElementById('assunto');
    const inputMensagem = document.getElementById('mensagem');
    const inputTermos = document.getElementById('termos');
    const charCount = document.getElementById('charCount');
    const totalContatosEl = document.getElementById('totalContatos');
    const toastSucesso = document.getElementById('toastSucesso');

    atualizarContadorContatos();

    // 🏆 Máscara de Telefone: (00) 00000-0000
    inputTelefone.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);

        if (val.length > 6) {
            val = `(${val.slice(0, 2)})${val.slice(2, 7)}-${val.slice(7)}`; } else if (val.length > 2) { val = `(${val.slice(0, 2)}) ${val.slice(2)}`; } else if (val.length > 0) { val = `(${val}`;
        }
        e.target.value = val;
    });

    // 🏆 Contador de Caracteres na Mensagem
    inputMensagem.addEventListener('input', () => {
        const len = inputMensagem.value.length;
        charCount.textContent = len;
        charCount.style.color = len >= 300 ? '#e74c3c' : '#6c757d';
    });

    // Função de validação de e-mail por regex
    function validarEmail(email) {
        return /^[^%\s@]+@[^%\s@]+\.[^%\s@]+$/.test(email);
    }

    function mostrarErro(input, elErro, msg) {
        if (input) input.classList.add('input-error');
        elErro.textContent = msg;
    }

    function limparErro(input, elErro) {
        if (input) input.classList.remove('input-error');
        elErro.textContent = '';
    }

    // Submissão
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // 🚫 Não recarrega a página

        let valido = true;

        // Validar Nome
        if (inputNome.value.trim() === '') {
            mostrarErro(inputNome, document.getElementById('erroNome'), '❌ Informe seu nome completo.');
            valido = false;
        } else {
            limparErro(inputNome, document.getElementById('erroNome'));
        }

        // Validar Email
        if (!validarEmail(inputEmail.value.trim())) {
            mostrarErro(inputEmail, document.getElementById('erroEmail'), '❌ Informe um e-mail válido.');
            valido = false;
        } else {
            limparErro(inputEmail, document.getElementById('erroEmail'));
        }

        // Validar Telefone
        if (inputTelefone.value.replace(/\D/g, '').length < 10) {
            mostrarErro(inputTelefone, document.getElementById('erroTelefone'), '❌ Telefone incompleto.');
            valido = false;
        } else {
            limparErro(inputTelefone, document.getElementById('erroTelefone'));
        }

        // Validar Data
        if (inputData.value === '') {
            mostrarErro(inputData, document.getElementById('erroDataNascimento'), '❌ Selecione a data.');
            valido = false;
        } else {
            limparErro(inputData, document.getElementById('erroDataNascimento'));
        }

        // Validar Assunto
        if (selectAssunto.value === '') {
            mostrarErro(selectAssunto, document.getElementById('erroAssunto'), '❌ Selecione o assunto.');
            valido = false;
        } else {
            limparErro(selectAssunto, document.getElementById('erroAssunto'));
        }

        // Validar Radio Button
        const radioPref = document.querySelector('input[name="preferencia"]:checked');
        if (!radioPref) {
            mostrarErro(null, document.getElementById('erroPreferencia'), '❌ Selecione uma preferência.');
            valido = false;
        } else {
            limparErro(null, document.getElementById('erroPreferencia'));
        }

        // Validar Mensagem
        if (inputMensagem.value.trim().length < 10) {
            mostrarErro(inputMensagem, document.getElementById('erroMensagem'), '❌ Mínimo de 10 caracteres.');
            valido = false;
        } else {
            limparErro(inputMensagem, document.getElementById('erroMensagem'));
        }

        // Validar Termos
        if (!inputTermos.checked) {
            mostrarErro(null, document.getElementById('erroTermos'), '❌ Aceite os termos.');
            valido = false;
        } else {
            limparErro(null, document.getElementById('erroTermos'));
        }

        // TUDO CERTO!
        if (valido) {
            const novoContato = {
                id: Date.now(),
                nome: inputNome.value.trim(),
                email: inputEmail.value.trim(),
                telefone: inputTelefone.value.trim(),
                dataNascimento: inputData.value,
                assunto: selectAssunto.value,
                preferencia: radioPref.value,
                mensagem: inputMensagem.value.trim(),
                data: new Date().toLocaleString('pt-BR')
            };

            // 💾 Salvar no LocalStorage
            const contatos = JSON.parse(localStorage.getItem('contatos') || '[]');
            contatos.push(novoContato);
            localStorage.setItem('contatos', JSON.stringify(contatos));

            // 🎉 Exibir Toast de Sucesso & Limpar Form
            toastSucesso.classList.add('show');
            setTimeout(() => toastSucesso.classList.remove('show'), 4000);

            form.reset();
            charCount.textContent = '0';
            atualizarContadorContatos();
        }
    });

    function atualizarContadorContatos() {
        const contatos = JSON.parse(localStorage.getItem('contatos') || '[]');
        totalContatosEl.textContent = contatos.length;
    }
});