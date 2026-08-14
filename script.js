document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }



  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const answer = item.querySelector(".faq-answer");

    if (trigger && answer) {
      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all other accordion items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherTrigger = otherItem.querySelector(".faq-trigger");
            const otherAnswer = otherItem.querySelector(".faq-answer");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove("active");
          trigger.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = null;
        } else {
          item.classList.add("active");
          trigger.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });

  // Product details data mapping for popup details modal
  const productData = {
    "butter-croissants": {
      title: "Butter Croissants",
      subtitle: "Laminated · 24 folds",
      price: "$5",
      img: "images/Butter_Croissants.svg",
      desc: "Forty-eight hour cold proof, hand-laminated with cultured Isigny butter. Shatter-crisp exterior, honeycomb interior, finished with a sea-salt bloom.",
      ingredients: "Heritage wheat, Isigny butter, sea salt, raw cane sugar, wild yeast."
    },
    "heritage-sourdough": {
      title: "Heritage Sourdough",
      subtitle: "Stone-milled · 82% hydration",
      price: "$12",
      img: "images/Heritage_Sourdough.svg",
      desc: "Naturally leavened wild yeast sourdough proofed in willow bannetons. Open crumb, blistering caramelized crust, deep lactic acidity.",
      ingredients: "Stone-milled heritage wheat flour, wild yeast culture, spring water, sea salt."
    },
    "layered-cakes": {
      title: "Layered Cakes",
      subtitle: "Single-origin · Hand-poured",
      price: "$48",
      img: "images/Layered_Cakes.svg",
      desc: "Layers of moist sponge infused with Madagascar vanilla bean, separated by house-made wild blackberry preserves and wrapped in dark chocolate ganache.",
      ingredients: "Heirloom wheat flour, Madagascar vanilla, organic fruit preserves, pasture eggs, dark cacao."
    },
    "danish-pastries": {
      title: "Danish Pastries",
      subtitle: "Seasonal fruit · House jam",
      price: "$6",
      img: "images/Danish_Pastries.svg",
      desc: "Crispy flaky pastry base filled with organic almond cream, topped with fresh seasonal berries and glazed with raw honey.",
      ingredients: "Laminated yeast dough, house-made seasonal fruit compote, organic almond meal, raw honey."
    },
    "artisan-loaves": {
      title: "Artisan Loaves",
      subtitle: "Hearth fired · Daily",
      price: "$10",
      img: "images/Artisan_Loaves.svg",
      desc: "A dense, nourishing crumb made from a blend of organic spelt and heritage rye. Fired directly on the stone hearth for a rustic, thick crust.",
      ingredients: "Organic spelt flour, heritage rye, toasted sunflower seeds, raw honey, sea salt."
    },
    "specialty-coffee": {
      title: "Specialty Coffee",
      subtitle: "Single-origin · Pour over",
      price: "$5",
      img: "images/Specialty_Coffee.svg",
      desc: "Lightly roasted single-origin washed Ethiopian Arabica. Notes of jasmine, peach, and black tea, hand-poured through a paper filter.",
      ingredients: "Single-origin washed Ethiopian Arabica coffee beans, filtered spring water."
    }
  };

  const modal = document.getElementById("product-modal");
  const modalClose = document.getElementById("modal-close");
  const modalImg = document.getElementById("modal-img");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalIngredients = document.getElementById("modal-ingredients");
  const modalPrice = document.getElementById("modal-price");

  if (modal && modalClose) {
    // Open modal when card is clicked
    document.querySelectorAll(".collection-card").forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card.getAttribute("data-product-id");
        const data = productData[productId];
        if (data) {
          modalImg.src = data.img;
          modalImg.alt = data.title;
          modalSubtitle.textContent = data.subtitle;
          modalTitle.textContent = data.title;
          modalDesc.textContent = data.desc;
          modalIngredients.textContent = data.ingredients;
          modalPrice.textContent = data.price;

          modal.classList.add("active");
          modal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden"; // Lock scroll
        }
      });
    });

    // Close modal function
    const closeModal = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Unlock scroll
    };

    // Close on button click
    modalClose.addEventListener("click", closeModal);

    // Close on overlay background click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on ESC key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
