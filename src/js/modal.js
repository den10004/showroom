document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.querySelector(".modal-close");
  const appointmentForm = document.getElementById("appointmentForm");
  const addressForm = document.querySelector(".address__form");

  let currentService = "";

  const submitButtons = document.querySelectorAll(".btn-blue");
  const allForms = [appointmentForm, addressForm];

  function getUtmParams() {
    const utmParams = {};
    const urlParams = new URLSearchParams(window.location.search);

    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_campaign_name",
      "utm_term",
      "utm_content",
      "utm_placement",
      "utm_device",
      "utm_region_name",
      "utm_position",
      "utm_position_type",
      "utm_source_type",
    ];

    utmKeys.forEach((key) => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key] = value;
      }
    });

    return utmParams;
  }

  function addUtmFieldsToForm(form, formData) {
    const utmParams = getUtmParams();

    Object.assign(formData, utmParams);

    if (form) {
      Object.keys(utmParams).forEach((key) => {
        if (!form.querySelector(`[name="${key}"]`)) {
          const hiddenInput = document.createElement("input");
          hiddenInput.type = "hidden";
          hiddenInput.name = key;
          hiddenInput.value = utmParams[key];
          form.appendChild(hiddenInput);
        }
      });

      if (!form.querySelector('[name="page_url"]')) {
        const pageUrlInput = document.createElement("input");
        pageUrlInput.type = "hidden";
        pageUrlInput.name = "page_url";
        pageUrlInput.value = window.location.href;
        form.appendChild(pageUrlInput);
      }

      if (!form.querySelector('[name="referrer"]')) {
        const referrerInput = document.createElement("input");
        referrerInput.type = "hidden";
        referrerInput.name = "referrer";
        referrerInput.value = document.referrer;
        form.appendChild(referrerInput);
      }
    }

    return formData;
  }

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

  function handleFormSubmit(event, formElement) {
    event.preventDefault();

    const isModalForm = formElement === appointmentForm;

    let formData;

    if (isModalForm) {
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("tel");

      formData = {
        service: currentService,
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
      };

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
        showError(phoneInput, "Введите корректный номер телефона");
        hasError = true;
      }

      if (hasError) {
        const firstError = document.querySelector(".error");
        if (firstError) firstError.focus();
        return;
      }
    } else {
      const formInputs = formElement.querySelectorAll("input");
      formData = {
        service: "Запись на тест-драйв",
        name: formInputs[0]?.value.trim() || "",
        phone: formInputs[1]?.value.trim() || "",
      };

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

    formData = addUtmFieldsToForm(formElement, formData);

    sendAppointmentData(formData, isModalForm);
  }

  function sendAppointmentData(formData, closeModalAfterSend = true) {
    fetch("/wp-json/my-email-api/v1/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          redirectToThanksPage(formData.name);
          if (
            closeModalAfterSend &&
            modalOverlay.classList.contains("active")
          ) {
            closeModal();
          }
          if (!closeModalAfterSend && addressForm) {
            addressForm.reset();
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Произошла ошибка при отправке. Попробуйте еще раз.");
      });

    if (closeModalAfterSend && modalOverlay.classList.contains("active")) {
      closeModal();
    }

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

    const utmParams = getUtmParams();
    sessionStorage.setItem("utm_params", JSON.stringify(utmParams));

    window.location.href = `thanks?username=${encodedName}`;
  }

  allForms.forEach((form) => {
    if (form) {
      form.addEventListener("submit", (event) => handleFormSubmit(event, form));
    }
  });

  submitButtons.forEach((button) => {
    if (
      button.classList.contains("open-modal") ||
      button.parentElement.tagName !== "FORM"
    ) {
      button.addEventListener("click", openModal);
    }
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

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
