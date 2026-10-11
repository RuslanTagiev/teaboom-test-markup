// База данных вариаций товаров с добавленными значениями SKU артикулов для ТЗ
const productVariations = {
  100: {
    sku: "01306",
    currentPrice: "326,40 ₽",
    oldPrice: "349,20 ₽",
  },
  500: {
    sku: "01307",
    currentPrice: "1 432 ₽",
    oldPrice: "1 646 ₽",
  },
  1000: {
    sku: "01308",
    currentPrice: "2 064 ₽",
    oldPrice: "2 592 ₽",
  },
  5000: {
    sku: "01309",
    currentPrice: "6 320 ₽",
    oldPrice: "8 710 ₽",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const variationRows = document.querySelectorAll(
    ".product-card__variation-row",
  );

  const globalSkuElement = document.getElementById("product-sku");
  const currentPriceElement = document.getElementById("current-price");
  const oldPriceElement = document.getElementById("old-price");

  const favoriteButton = document.querySelector(".product-card__favorite-btn");
  const mainBuyButton = document.getElementById("main-buy-btn");

  const modal = document.getElementById("image-modal");
  const mainImage = document.getElementById("product-main-img");
  const openModalButton = document.getElementById("open-modal-btn");
  const thumbButton = document.getElementById("product-thumb-btn");
  const closeModalButton = document.getElementById("close-modal-btn");
  const modalOverlay = document.getElementById("modal-overlay");

  let lastFocusedElement = null;

  // Метод динамического изменения цен и артикула в шапке карточки по ТЗ
  function updateSummaryPrice(weight) {
    const variation = productVariations[weight];
    if (!variation) return;

    if (currentPriceElement)
      currentPriceElement.textContent = variation.currentPrice;
    if (oldPriceElement) oldPriceElement.textContent = variation.oldPrice;
    if (globalSkuElement) globalSkuElement.textContent = variation.sku;
  }

  function setActiveVariation(row, shouldFocus = false) {
    variationRows.forEach((item) => {
      item.classList.remove("product-card__variation-row--active");
      item.setAttribute("aria-checked", "false");
      item.setAttribute("tabindex", "-1");
    });

    row.classList.add("product-card__variation-row--active");
    row.setAttribute("aria-checked", "true");
    row.setAttribute("tabindex", "0");

    updateSummaryPrice(row.dataset.weight);
    if (shouldFocus) row.focus();
  }
  variationRows.forEach((row) => {
    row.addEventListener("click", (event) => {
      const clickedCartButton = event.target.closest(".product-card__cart-btn");
      if (clickedCartButton) return;
      setActiveVariation(row);
    });

    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveVariation(row, true);
      }
    });

    const cartButton = row.querySelector(".product-card__cart-btn");
    if (cartButton) {
      cartButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const selectedWeight = row.dataset.weight;
        setActiveVariation(row);
        alert(`Фасовка ${selectedWeight} г успешно добавлена в корзину!`);
      });
    }
  });

  // Логика работы главной большой кнопки заказа внизу блока
  if (mainBuyButton) {
    mainBuyButton.addEventListener("click", () => {
      const activeRow = document.querySelector(
        ".product-card__variation-row--active",
      );
      if (activeRow) {
        const weight = activeRow.dataset.weight;
        alert(`Выбранный вариант (${weight} г) успешно добавлен в корзину!`);
      }
    });
  }

  if (favoriteButton) {
    const favoriteIcon = favoriteButton.querySelector("span");

    favoriteButton.addEventListener("click", () => {
      const isActive = favoriteButton.classList.toggle(
        "product-card__favorite-btn--active",
      );

      favoriteButton.setAttribute("aria-pressed", String(isActive));
      favoriteButton.setAttribute(
        "aria-label",
        isActive ? "Удалить из избранного" : "Добавить в избранное",
      );

      if (favoriteIcon) {
        favoriteIcon.textContent = isActive ? "♥" : "♡";
      }
    });
  }

  function openModal() {
    if (!modal) return;

    lastFocusedElement = document.activeElement;
    modal.classList.add("modal--show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (closeModalButton) closeModalButton.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("modal--show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  if (openModalButton) openModalButton.addEventListener("click", openModal);
  if (thumbButton) thumbButton.addEventListener("click", openModal);

  if (mainImage) {
    mainImage.addEventListener("click", openModal);
    mainImage.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal();
      }
    });
  }

  if (closeModalButton) closeModalButton.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    const isModalOpen = modal?.classList.contains("modal--show");
    if (event.key === "Escape" && isModalOpen) {
      closeModal();
    }
  });
});
