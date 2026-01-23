document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.querySelector(".modal-close");
  const appointmentForm = document.getElementById("appointmentForm");
  const addressForm = document.querySelector(".address__form");

  let currentService = "";

  const submitButtons = document.querySelectorAll(".btn-blue");
  const allForms = [appointmentForm, addressForm];

  function validatePhone(phoneValue) {
    const cleaned = phoneValue.replace(/\D/g, "");
    return cleaned.length === 11 && (cleaned[0] === "7" || cleaned[0] === "8");
  }

  function openModal(event) {
    const button = event.currentTarget;
    currentService =
      button.getAttribute("data-service") || "Запись на тест-драйв";

    modalOverlay.classList.add("active");
    document.getElementById("name").focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    if (appointmentForm) appointmentForm.reset();
    currentService = "";
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document
      .querySelectorAll("input")
      .forEach((input) => input.classList.remove("error"));
  }

  // Универсальная функция обработки отправки
  function handleFormSubmit(event, formElement) {
    event.preventDefault();

    // Определяем, какая форма отправляется
    const isModalForm = formElement === appointmentForm;

    // Получаем данные формы
    let formData;

    if (isModalForm) {
      // Модальная форма
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("tel");

      formData = {
        service: currentService,
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
      };

      // Валидация для модальной формы
      let hasError = false;
      document.querySelectorAll(".error-message").forEach((el) => el.remove());
      nameInput.classList.remove("error");
      phoneInput.classList.remove("error");

      if (!formData.name || formData.name.length < 2) {
        showError(nameInput, "Введите имя (минимум 2 символа)");
        hasError = true;
      }

      if (!formData.phone) {
        showError(phoneInput, "Введите номер телефона");
        hasError = true;
      } else if (!validatePhone(formData.phone)) {
        showError(phoneInput, "Введите корректный номер телефона (11 цифр)");
        hasError = true;
      }

      if (hasError) {
        const firstError = document.querySelector(".error");
        if (firstError) firstError.focus();
        return;
      }
    } else {
      // Форма address__form
      const formInputs = formElement.querySelectorAll("input");
      formData = {
        service: "Запись на тест-драйв",
        name: formInputs[0]?.value.trim() || "",
        phone: formInputs[1]?.value.trim() || "",
      };

      // Валидация для формы address__form
      let hasError = false;
      formInputs.forEach((input) => {
        input.classList.remove("error");
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains("error-message")) {
          errorMsg.remove();
        }
      });

      if (!formData.name || formData.name.length < 2) {
        showError(formInputs[0], "Введите имя (минимум 2 символа)");
        hasError = true;
      }

      if (!formData.phone) {
        showError(formInputs[1], "Введите номер телефона");
        hasError = true;
      } else if (!validatePhone(formData.phone)) {
        showError(formInputs[1], "Введите корректный номер телефона (11 цифр)");
        hasError = true;
      }

      if (hasError) return;
    }

    // Отправка данных
    sendAppointmentData(formData, isModalForm);
  }

  // Единая функция отправки данных
  function sendAppointmentData(formData, closeModalAfterSend = true) {
    console.log("Данные для отправки:", formData);

    // Здесь реализуйте отправку данных на сервер
    /*
    fetch('your-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        // После успешной отправки переходим на страницу благодарности
        redirectToThanksPage(formData.name);
        
        // Закрываем модальное окно если оно было открыто
        if (closeModalAfterSend && modalOverlay.classList.contains("active")) {
          closeModal();
        }
        
        // Сбрасываем форму address__form если она была отправлена
        if (!closeModalAfterSend && addressForm) {
          addressForm.reset();
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    });
    */

    // Для демонстрации сразу перенаправляем
    redirectToThanksPage(formData.name);

    // Закрываем модальное окно если оно было открыто
    if (closeModalAfterSend && modalOverlay.classList.contains("active")) {
      closeModal();
    }

    // Сбрасываем форму address__form если она была отправлена
    if (!closeModalAfterSend && addressForm) {
      addressForm.reset();
    }
  }

  function showError(inputElement, message) {
    if (!inputElement) return;

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

  function redirectToThanksPage(userName) {
    const encodedName = encodeURIComponent(userName);
    window.location.href = `thanks.html?name=${encodedName}`;
  }

  // Назначаем обработчики для всех форм
  allForms.forEach((form) => {
    if (form) {
      form.addEventListener("submit", (event) => handleFormSubmit(event, form));
    }
  });

  // Назначаем обработчики для всех кнопок открытия модального окна
  submitButtons.forEach((button) => {
    // Проверяем, является ли кнопка кнопкой открытия модального окна
    if (
      button.classList.contains("open-modal") ||
      button.parentElement.tagName !== "FORM"
    ) {
      button.addEventListener("click", openModal);
    }
  });

  // Обработчики для модального окна
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Валидация телефона при потере фокуса (для всех форм)
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value && !validatePhone(this.value)) {
        showError(this, "Введите корректный номер телефона");
      }
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        this.classList.remove("error");
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains("error-message")) {
          errorMsg.remove();
        }
      }
    });
  });
});
