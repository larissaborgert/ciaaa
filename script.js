document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const telefoneInput = document.getElementById('telefone');
    const mensagemTextarea = document.getElementById('mensagem');
    const charCounter = document.getElementById('char-count');
    const counterDisplay = document.getElementById('contact-counter');
    
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Inicializa contador recuperando dados do localStorage
    updateContactCounter();

    // 🏆 Máscara Dinâmica de Telefone: (00) 00000-0000 ou (00) 0000-0000
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); 
        
        if (value.length > 0) {
            value = '(' + value;
        }
        if (value.length > 3) {
            value = value.slice(0, 3) + ') ' + value.slice(3);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + '-' + value.slice(10, 15);
        }
        
        e.target.value = value;
    });

    // 🏆 Contador de caracteres em tempo real na Mensagem
    mensagemTextarea.addEventListener('input', (e) => {
        const count = e.target.value.length;
        charCounter.textContent = count;
    });

    // Evento de Envio e Validação Customizada
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // 🚫 Impede recarregamento automático

        let isValid = true;

        // Limpa erros anteriores antes de validar novamente
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('invalid'));

        // Validação: Nome Completo
        const nome = document.getElementById('nome');
        if (nome.value.trim() === '') {
            setError(nome);
            isValid = false;
        }

        // Validação: E-mail (Validando formato correto 📧)
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            setError(email);
            isValid = false;
        }

        // Validação: Telefone mínimo
        if (telefoneInput.value.replace(/\D/g, '').length < 10) {
            setError(telefoneInput);
            isValid = false;
        }

        // Validação: Seleção do Departamento
        const departamento = document.getElementById('departamento');
        if (departamento.value === '') {
            setError(departamento);
            isValid = false;
        }

        // Validação: Radio buttons (Tipo de Solicitação)
        const radioGroup = document.getElementsByName('tipo-solicitacao');
        let radioChecked = false;
        for (const radio of radioGroup) {
            if (radio.checked) {
                radioChecked = true;
                break;
            }
        }
        if (!radioChecked) {
            document.getElementById('error-tipo-solicitacao').parentElement.classList.add('invalid');
            isValid = false;
        }

        // Validação: Mensagem
        if (mensagemTextarea.value.trim() === '') {
            setError(mensagemTextarea);
            isValid = false;
        }

        // Validação: Checkbox dos Termos
        const termos = document.getElementById('termos');
        if (!termos.checked) {
            setError(termos);
            isValid = false;
        }

        // Se tudo estiver ✅ válido
        if (isValid) {
            // Puxa do localStorage ou cria array se vazio
            let contatos = JSON.parse(localStorage.getItem('contatos')) || [];

            // Monta o objeto com as informações recolhidas
            const novoContato = {
                id: Date.now(),
                nome: nome.value.trim(),
                email: email.value.trim(),
                telefone: telefoneInput.value,
                dataNascimento: document.getElementById('data-nascimento').value,
                departamento: departamento.value,
                tipoSolicitacao: document.querySelector('input[name="tipo-solicitacao"]:checked').value,
                mensagem: mensagemTextarea.value.trim()
            };

            // 💾 Salva no localStorage
            contatos.push(novoContato);
            localStorage.setItem('contatos', JSON.stringify(contatos));

            // Atualiza exibição de contatos salvos
            updateContactCounter();

            // 🎉 Exibe o Modal popup animado de sucesso
            successModal.classList.add('active');

            // Reseta todos os campos e o contador de texto
            form.reset();
            charCounter.textContent = '0';
        }
    });

    function setError(inputElement) {
        inputElement.parentElement.classList.add('invalid');
    }

    function updateContactCounter() {
        const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
        counterDisplay.textContent = contatos.length;
    }

    // Fecha o modal de feedback
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
});
