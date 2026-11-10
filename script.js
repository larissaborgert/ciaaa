document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const charCount = document.getElementById("char-count");
    const totalContactsSpan = document.getElementById("total-contacts");
    const successMessage = document.getElementById("success-message");

    // Inicializa o contador de cadastros salvos no localStorage
    updateContactCounter();

    // 1. Máscara de Telefone em Tempo Real: (00) 00000-0000
    phoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
        
        if (value.length > 11) value = value.slice(0, 11); // Limita em 11 dígitos

        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        e.target.value = value;
    });

    // 2. Contador de caracteres na Área de Texto (Mensagem)
    messageInput.addEventListener("input", (e) => {
        const count = e.target.value.length;
        charCount.textContent = count;
        
        // Altera a cor do contador quando chega perto do limite
        if (count >= 450) {
            charCount.style.color = "#ef4444";
        } else {
            charCount.style.color = "#4b5563";
        }
    });

    // 3. Lógica e Validação do Envio do Formulário
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento da página 🚫
        
        let isFormValid = true;

        // Validação do Nome
        const name = document.getElementById("name");
        if (name.value.trim() === "") {
            showError(name);
            isFormValid = false;
        } else {
            clearError(name);
        }

        // Validação do E-mail (Regex)
        const email = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email);
            isFormValid = false;
        } else {
            clearError(email);
        }

        // Validação do Telefone (Mínimo de caracteres para formato válido)
        if (phoneInput.value.replace(/\D/g, "").length < 10) {
            showError(phoneInput);
            isFormValid = false;
        } else {
            clearError(phoneInput);
        }

        // Validação do Motivo (Select)
        const subject = document.getElementById("subject");
        if (subject.value === "") {
            showError(subject);
            isFormValid = false;
        } else {
            clearError(subject);
        }

        // Validação da Mensagem
        if (messageInput.value.trim() === "") {
            showError(messageInput);
            isFormValid = false;
        } else {
            clearError(messageInput);
        }

        // Validação do Checkbox de Termos
        const terms = document.getElementById("terms");
        if (!terms.checked) {
            showError(terms);
            isFormValid = false;
        } else {
            clearError(terms);
        }

        // 4. Fluxo de Sucesso
        if (isFormValid) {
            // Captura os dados preenchidos
            const replyPreference = document.querySelector('input[name="reply-preference"]:checked').value;
            const contactData = {
                nome: name.value.trim(),
                email: email.value.trim(),
                telefone: phoneInput.value,
                dataReuniao: document.getElementById("date").value,
                motivo: subject.value,
                preferenciaRetorno: replyPreference,
                mensagem: messageInput.value.trim(),
                dataCadastro: new Date().toLocaleString("pt-BR")
            };

            // Salva no localStorage 💾
            saveToStorage(contactData);

            // Exibe mensagem de sucesso com efeito visual 🎉
            successMessage.classList.remove("hidden");
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Limpa o formulário e reseta contadores
            form.reset();
            charCount.textContent = "0";
            updateContactCounter();

            // Esconde a mensagem de sucesso após 5 segundos
            setTimeout(() => {
                successMessage.classList.add("hidden");
            }, 5000);
        }
    });

    // Funções Auxiliares de Controle Visual e Armazenamento
    function showError(inputElement) {
        const group = inputElement.closest(".form-group");
        group.classList.add("invalid");
    }

    function clearError(inputElement) {
        const group = inputElement.closest(".form-group");
        group.classList.remove("invalid");
    }

    function saveToStorage(data) {
        let contacts = JSON.parse(localStorage.getItem("contactsList")) || [];
        contacts.push(data);
        localStorage.setItem("contactsList", JSON.stringify(contacts));
    }

    function updateContactCounter() {
        let contacts = JSON.parse(localStorage.getItem("contactsList")) || [];
        totalContactsSpan.textContent = contacts.length;
    }
});
