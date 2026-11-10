document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const telefoneInput = document.getElementById("telefone");
    const mensagemInput = document.getElementById("mensagem");
    const charCounter = document.getElementById("char-count");
    const globalCounterEl = document.getElementById("global-counter");
    const successModal = document.getElementById("success-modal");
    const closeModalBtn = document.getElementById("close-modal");

    // Atualiza o contador global inicial a partir do localStorage
    atualizarContadorGlobal();

    /* ==========================================================================
       🏆 REGRA: MÁSCARA DO TELEFONE (00) 00000-0000
       ========================================================================== */
    telefoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito
        if (value.length > 0) {
            value = "(" + value;
        }
        if (value.length > 3) {
            value = value.slice(0, 3) + ") " + value.slice(3);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + "-" + value.slice(10, 14);
        }
        e.target.value = value.slice(0, 15); // Limita ao tamanho máximo com máscara
    });

    /* ==========================================================================
       🏆 REGRA: CONTADOR DE CARACTERES EM TEMPO REAL
       ========================================================================== */
    mensagemInput.addEventListener("input", (e) => {
        const len = e.target.value.length;
        charCounter.textContent = len;
    });

    /* ==========================================================================
       LÓGICA DE VALIDAÇÃO E SUBMIT 🚫
       ========================================================================== */
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento padrão da página
        let isValid = true;

        // 1. Validar Nome
        const nome = document.getElementById("nome");
        if (nome.value.trim() === "") {
            showError(nome);
            isValid = false;
        } else {
            clearError(nome);
        }

        // 2. Validar E-mail (RegEx obrigatório pelas instruções)
        const email = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email);
            isValid = false;
        } else {
            clearError(email);
        }

        // 3. Validar Telefone (precisa estar completo com DDD e número)
        if (telefoneInput.value.replace(/\D/g, "").length < 10) {
            showError(telefoneInput);
            isValid = false;
        } else {
            clearError(telefoneInput);
        }

        // 4. Validar Data
        const dataContato = document.getElementById("data-contato");
        if (dataContato.value === "") {
            showError(dataContato);
            isValid = false;
        } else {
            clearError(dataContato);
        }

        // 5. Validar Motivo (Seleção)
        const motivo = document.getElementById("motivo");
        if (motivo.value === "") {
            showError(motivo);
            isValid = false;
        } else {
            clearError(motivo);
        }

        // 6. Validar Mensagem (Mínimo de 10 caracteres)
        if (mensagemInput.value.trim().length < 10) {
            showError(mensagemInput);
            isValid = false;
        } else {
            clearError(mensagemInput);
        }

        // 7. Validar Termos (Checkbox)
        const termos = document.getElementById("termos");
        if (!termos.checked) {
            showError(termos);
            isValid = false;
        } else {
            clearError(termos);
        }

        /* ==========================================================================
           SUCESSO: SALVAMENTO E FEEDBACK 🎉
           ========================================================================== */
        if (isValid) {
            // Captura o valor do Radio Selecionado
            const preferencia = document.querySelector('input[name="preferencia"]:checked').value;

            // Cria objeto com os dados limpos
            const novoContato = {
                nome: nome.value.trim(),
                email: email.value.trim(),
                telefone: telefoneInput.value,
                dataContato: dataContato.value,
                motivo: motivo.value,
                preferencia: preferencia,
                mensagem: mensagemInput.value.trim(),
                dataRegistro: new Date().toISOString()
            };

            // Recupera lista do localStorage ou cria uma nova se vazia
            const listaContatos = JSON.parse(localStorage.getItem("contatos_cadastrados")) || [];
            listaContatos.push(novoContato);

            // Salva de volta no LocalStorage 💾
            localStorage.setItem("contatos_cadastrados", JSON.stringify(listaContatos));

            // Atualiza os contadores na tela 🌟
            atualizarContadorGlobal();

            // Exibe a Janelinha Modal de Sucesso
            successModal.style.display = "flex";

            // Reseta os campos do formulário e contadores internos
            form.reset();
            charCounter.textContent = "0";
        }
    });

    // Fechar o modal de sucesso ao clicar
    closeModalBtn.addEventListener("click", () => {
        successModal.style.display = "none";
    });

    /* ==========================================================================
       FUNÇÕES AUXILIARES DE SUPORTE
       ========================================================================== */
    function showError(inputElement) {
        inputElement.classList.add("invalid");
        // Encontra a mensagem de erro que fica logo após ou dentro do input-group
        const group = inputElement.closest(".input-group");
        const errorSpan = group.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.style.display = "flex"; // Alterado para flex para alinhar com o ícone
        }
    }

    function clearError(inputElement) {
        inputElement.classList.remove("invalid");
        const group = inputElement.closest(".input-group");
        const errorSpan = group.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.style.display = "none";
        }
    }

    function atualizarContadorGlobal() {
        const listaContatos = JSON.parse(localStorage.getItem("contatos_cadastrados")) || [];
        globalCounterEl.textContent = listaContatos.length;
    }
});