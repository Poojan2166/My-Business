document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // ==========================================
  // 1. Mobile Menu Drawer Toggle
  // ==========================================
  const toggleMobileMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    
    // Toggle body scroll locking to prevent double scrolling issues
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (e) => {
    const isMenuOpen = navMenu.classList.contains('open');
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickInsideToggle = navToggle.contains(e.target);

    if (isMenuOpen && !isClickInsideMenu && !isClickInsideToggle) {
      toggleMobileMenu();
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
      
      // Update active nav class
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ==========================================
  // 2. Scrolled Header Polish Effect
  // ==========================================
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check on load
  handleScroll();

  // ==========================================
  // 3. FAQ Accordion Toggling Interactivity
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    
    questionButton.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
        questionButton.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('open');
        questionButton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ==========================================
  // 4. Detail Popup Modal Interactivity
  // ==========================================
  const menuData = {
    "Classic Burger": {
      tag: "Signature",
      image: "Images/Classic_Burger.svg",
      desc: "Single patty, aged cheddar, garden lettuce, vine tomato, toasted brioche.",
      ingredients: [
        "100% Angus beef patty",
        "Aged cheddar",
        "Vine tomato",
        "Garden lettuce",
        "House sauce"
      ],
      price: "$8.50",
      originalPrice: "$10.65"
    },
    "Double Cheese": {
      tag: "Best Seller",
      image: "Images/Double_Cheese.svg",
      desc: "Two smashed patties, double American cheese, secret sauce, toasted brioche bun.",
      ingredients: [
        "Two smash beef patties",
        "Double American cheese",
        "Secret signature sauce",
        "Dill pickle slices",
        "Toasted sesame bun"
      ],
      price: "$11.90",
      originalPrice: "$14.50"
    },
    "Crispy Chicken": {
      tag: "Spicy",
      image: "Images/Crispy_Chicken.svg",
      desc: "Buttermilk-brined chicken, crunchy slaw, chipotle mayo, toasted bun.",
      ingredients: [
        "Buttermilk-brined crispy chicken breast",
        "Crunchy cabbage slaw",
        "Chipotle mayonnaise",
        "Pickled jalapenos",
        "Brioche bun"
      ],
      price: "$9.40",
      originalPrice: "$11.80"
    },
    "Loaded Fries": {
      tag: "Sharing",
      image: "Images/Loaded_Fries.svg",
      desc: "Hand-cut potatoes, melted cheese, smoked bacon, fresh scallions.",
      ingredients: [
        "Hand-cut Idaho potatoes",
        "Melted cheddar cheese sauce",
        "Crispy smoked bacon bits",
        "Fresh chopped scallions",
        "House ranch drizzle"
      ],
      price: "$6.90",
      originalPrice: "$8.50"
    },
    "Signature Shake": {
      tag: "Sweet",
      image: "Images/Signature_Shake.svg",
      desc: "Slow-churned chocolate, fresh whipped cream, ganache drip.",
      ingredients: [
        "Slow-churned premium chocolate ice cream",
        "Fresh whipped cream",
        "Dark chocolate ganache drip",
        "Grated Belgian chocolate shavings"
      ],
      price: "$5.50",
      originalPrice: "$7.00"
    }
  };

  const modal = document.getElementById('detailModal');
  const modalCloseIconBtn = document.getElementById('modalCloseIconBtn');
  const modalBtnClose = document.getElementById('modalBtnClose');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalImageTag = document.getElementById('modalImageTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalIngredientsWrapper = document.getElementById('modalIngredientsWrapper');
  const modalIngredientsList = document.getElementById('modalIngredientsList');
  const modalPriceBlock = document.getElementById('modalPriceBlock');
  const modalPriceCurrent = document.getElementById('modalPriceCurrent');
  const modalPriceOriginal = document.getElementById('modalPriceOriginal');

  // Open Modal function
  const openModal = () => {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  };

  // Close Modal function
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  // Bind close buttons
  modalCloseIconBtn.addEventListener('click', closeModal);
  modalBtnClose.addEventListener('click', closeModal);
  
  // Close on overlay backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Bind click event to Menu Cards
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent navigation if clicked on links
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'a' || targetTag === 'button' || e.target.closest('.btn-card-action')) {
        e.preventDefault();
      }

      const titleEl = card.querySelector('.menu-card-title');
      if (!titleEl) return;
      
      const title = titleEl.textContent.trim();
      const data = menuData[title];
      if (!data) return;

      // Populate Menu Card Details
      modalProductImg.src = data.image;
      modalProductImg.alt = title;
      modalImageTag.textContent = data.tag;
      modalTitle.textContent = title;
      modalDesc.textContent = data.desc;

      // Populate ingredients
      modalIngredientsList.innerHTML = '';
      data.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        modalIngredientsList.appendChild(li);
      });
      modalIngredientsWrapper.style.display = 'block';

      // Populate prices
      modalPriceCurrent.textContent = data.price;
      modalPriceOriginal.textContent = data.originalPrice;
      modalPriceBlock.style.display = 'flex';

      openModal();
    });
  });

  // Bind click event to Gallery Cards
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();

      const imgEl = card.querySelector('.gallery-img');
      const titleEl = card.querySelector('.gallery-card-title');
      if (!imgEl || !titleEl) return;

      const title = titleEl.textContent.trim();
      const imgSrc = imgEl.getAttribute('src');

      // Populate Gallery Details (As shown in screenshot)
      modalProductImg.src = imgSrc;
      modalProductImg.alt = title;
      modalImageTag.textContent = "BEHIND THE FLAVOR";
      modalTitle.textContent = title;
      modalDesc.textContent = "Patties Hitting The Open Flame — That Signature Char That Defines Every FlameByte Burger.";

      // Hide menu-specific fields
      modalIngredientsWrapper.style.display = 'none';
      modalPriceBlock.style.display = 'none';

      openModal();
    });
  });
});
