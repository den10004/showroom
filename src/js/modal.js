document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.querySelector(".modal-close");
  const openModalButtons = document.querySelectorAll(".open-modal");
  const appointmentForm = document.getElementById("appointmentForm");
  const phoneInput = document.getElementById("tel");

  let currentService = "";

  function validatePhone(phoneValue) {
    const cleaned = phoneValue.replace(/\D/g, "");
    return cleaned.length === 11 && (cleaned[0] === "7" || cleaned[0] === "8");
  }

  function openModal(event) {
    const button = event.currentTarget;
    currentService = button.getAttribute("data-service") || "Запись";

    modalOverlay.classList.add("active");
    document.getElementById("name").focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    appointmentForm.reset();
    currentService = "";
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    phoneInput.classList.remove("error");
  }

  function submitForm(event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    nameInput.classList.remove("error");
    phoneInput.classList.remove("error");

    let hasError = false;

    if (!name || name.length < 2) {
      showError(nameInput, "Введите имя (минимум 2 символа)");
      hasError = true;
    }

    if (!phone) {
      showError(phoneInput, "Введите номер телефона");
      hasError = true;
    } else if (!validatePhone(phone)) {
      showError(phoneInput, "Введите корректный номер телефона (11 цифр)");
      hasError = true;
    }

    if (hasError) {
      const firstError = document.querySelector(".error");
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    const formData = {
      service: currentService,
      name: name,
      phone: phone,
    };

    sendAppointmentData(formData);
  }

  function showError(inputElement, message) {
    inputElement.classList.add("error");
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.color = "red";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "4px";
    errorElement.textContent = message;

    inputElement.parentNode.insertBefore(
      errorElement,
      inputElement.nextSibling,
    );
  }

  // Функция отправки данных на сервер
  function sendAppointmentData(data) {
    // Здесь реализуйте отправку данных
    // Пример с fetch:
    /*
    fetch('endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        showSuccessMessage();
        closeModal();
      } else {
        throw new Error('Ошибка отправки');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    });
    */

    // Для демонстрации - просто выводим в консоль
    console.log("Данные для отправки:", data);

    // Имитация успешной отправки
    showSuccessMessage();
    closeModal();
  }

  function showSuccessMessage() {
    alert(
      `Спасибо! Ваша заявка на "${currentService}" успешно отправлена. Мы свяжемся с вами в ближайшее время.`,
    );
  }

  openModalButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  modalClose.addEventListener("click", closeModal);
  appointmentForm.addEventListener("submit", submitForm);

  phoneInput.addEventListener("blur", function () {
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
      showError(phoneInput, "Введите корректный номер телефона");
    }
  });

  phoneInput.addEventListener("input", function () {
    if (phoneInput.classList.contains("error")) {
      phoneInput.classList.remove("error");
      const errorMsg = phoneInput.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains("error-message")) {
        errorMsg.remove();
      }
    }
  });
});
