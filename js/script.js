// Gallery filter
const buttons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".gallery-item");

buttons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // active button badalna
    buttons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    // items dikhana ya chhupana
    const filter = btn.getAttribute("data-filter");
    items.forEach(function (item) {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  });
});