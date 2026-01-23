const phoneInputs = document.querySelectorAll("input[name=tel]");
const phoneInputHandler = function (input) {
  let x = input.value
    .replace(/\D/g, "")
    .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  const group1 = x[1] ? (x[1] == 9 ? "+7 (9" : "+7") : x[1];
  const group2 = x[2]
    ? " (" + (x[2][0] == 8 && x[2][1] == 9 ? "9" : x[2])
    : x[2];
  const group3 = x[3] ? ") " + x[3] : x[3];
  const group4 = x[4] ? "-" + x[4] : x[4];
  const group5 = x[5] ? "-" + x[5] : x[5];
  input.value = group1 + group2 + group3 + group4 + group5;
};
phoneInputs.forEach((input, idx) => {
  input.addEventListener("input", (e) => phoneInputHandler(e.target));
});
