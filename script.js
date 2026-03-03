function showToast(message) {
  const toastElement = document.querySelector(".toast");
  if (!toastElement) return;

  toastElement.textContent = message;
  toastElement.hidden = false;

  window.setTimeout(function () {
    toastElement.hidden = true;
  }, 2200);
}

function setupCopyButtons() {
  const copyButtons = document.querySelectorAll("button[data-copy]");
  copyButtons.forEach(function (buttonElement) {
    buttonElement.addEventListener("click", async function () {
      const valueToCopy = String(buttonElement.getAttribute("data-copy"));
      try {
        await navigator.clipboard.writeText(valueToCopy);
        showToast("E-Mail kopiert.");
      } catch (error) {
        showToast("Kopieren nicht möglich – bitte manuell kopieren.");
      }
    });
  });
}

function setupMobileMenu() {
  const menuButton = document.querySelector(".menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!menuButton || !mobileNav) return;

  function setOpen(isOpen) {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileNav.hidden = !isOpen;
  }

  setOpen(false);

  menuButton.addEventListener("click", function () {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  const links = mobileNav.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });
}

function setupYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupCopyButtons();
  setupMobileMenu();
  setupYear();
});