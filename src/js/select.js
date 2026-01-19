document.querySelectorAll(".custom-multiselect").forEach(function (wrapper) {
  const selectedBtn = wrapper.querySelector(".select-selected");
  const options = wrapper.querySelectorAll(".select-items div");

  function updateSelectedText() {
    const selectedOptions = wrapper.querySelectorAll(
      ".select-items div.selected"
    );

    if (selectedOptions.length === 0) {
      const firstOptionText = options[0]?.textContent.trim() || "Выберите";
      selectedBtn.textContent = firstOptionText;
      selectedBtn.classList.add("placeholder");
    } else if (selectedOptions.length === 1) {
      selectedBtn.textContent = selectedOptions[0].textContent.trim();
      selectedBtn.classList.remove("placeholder");
    } else {
      selectedBtn.textContent = `${selectedOptions.length} выбрано`;
      selectedBtn.classList.remove("placeholder");
    }
  }

  selectedBtn.addEventListener("click", function (e) {
    e.stopPropagation();

    document.querySelectorAll(".custom-multiselect").forEach((w) => {
      if (w !== wrapper) w.classList.remove("select-open");
    });

    wrapper.classList.toggle("select-open");
  });

  options.forEach(function (option) {
    option.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("selected");

      updateSelectedText();
    });
  });

  document.addEventListener("click", function () {
    wrapper.classList.remove("select-open");
  });

  updateSelectedText();
});
