const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

document.documentElement.classList.add("js-enabled");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("[type=submit]");
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.dataset.state = "sending";
    formStatus.textContent = "Sending your message securely...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = result.errors?.map((error) => error.message).join(" ");
        throw new Error(detail || "The message could not be sent. Please try again.");
      }

      contactForm.reset();
      formStatus.dataset.state = "success";
      formStatus.textContent = "Thanks for reaching out. Your message has been sent.";
    } catch (error) {
      formStatus.dataset.state = "error";
      formStatus.textContent = error.message || "A network error occurred. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

const revealTargets = document.querySelectorAll(
  "main > section:not(#hero), .skill-group, .galeria .card, .footer-contenido",
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 90}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}
