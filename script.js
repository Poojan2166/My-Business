document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.navbar-toggle');
  const navLinks = document.querySelector('.navbar-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('is-active');
      navLinks.classList.toggle('is-active');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('.nav-link, .navbar-cta');
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('is-active');
        navLinks.classList.remove('is-active');
      });
    });
  }

  // Menu Popup Modal Logic
  const menuRows = document.querySelectorAll('.menu-row');
  const modal = document.getElementById('menuModal');
  const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;

  // Database of menu details
  const menuData = [
    {
      title: "Hand-Drawn Espresso",
      subtitle: "Two ounces. No compromises.",
      tasting: "cocoa nib &middot; stewed plum &middot; brown sugar",
      origin: "Ethiopia + Karnataka",
      roast: "Medium",
      price: "&#8377;180",
      description: "Pulled in 28 seconds from our house Pelago blend &mdash; a 70/30 of Ethiopian Guji and washed Karnataka. Served in a warmed demitasse with a glass of cold water on the side."
    },
    {
      title: "Flat White",
      subtitle: "Double ristretto. Microfoam, not architecture.",
      tasting: "milk chocolate &middot; roasted hazelnut &middot; cream",
      origin: "Colombia (Huila) + Brazil",
      roast: "Medium-Dark",
      price: "&#8377;240",
      description: "Two shots of ristretto topped with silky, textured milk. A heavy body with sweet, nutty notes that cut through the milk perfectly."
    },
    {
      title: "Slow-Pour Filter",
      subtitle: "Single origin. Brewed at the counter, on a timer.",
      tasting: "white peach &middot; jasmine &middot; honeycomb",
      origin: "Ethiopia (Yirgacheffe)",
      roast: "Light",
      price: "&#8377;260",
      description: "Meticulously hand-brewed over a V60. Clean and tea-like with bright floral aromatics, showcasing the true terroir of single-origin beans."
    },
    {
      title: "Cardamom Cortado",
      subtitle: "A house ritual. Lightly spiced, never sweet.",
      tasting: "cardamom &middot; burnt cream &middot; orange peel",
      origin: "Karnataka (Washed)",
      roast: "Medium",
      price: "&#8377;220",
      description: "Equal parts espresso and steamed milk, infused with freshly crushed green cardamom pods. A warm, aromatic version of the Spanish classic."
    },
    {
      title: "Cold Brew, 18 Hours",
      subtitle: "Steeped overnight. Poured over a single rock.",
      tasting: "dark chocolate &middot; fig &middot; molasses",
      origin: "Wayanad (Robusta Blend)",
      roast: "Dark",
      price: "&#8377;260",
      description: "Slow-steeped in cold water for 18 hours to extract a smooth, low-acid concentration. Served over a single hand-carved ice sphere."
    },
    {
      title: "Almond Croissant",
      subtitle: "Baked next door. Out by eleven.",
      tasting: "frangipane &middot; sea salt &middot; cultured butter",
      origin: "House Bakery (Kochi)",
      roast: "Baked Daily",
      price: "&#8377;160",
      description: "Twice-baked croissant filled with rich almond frangipane, topped with sliced almonds and a dusting of powdered sugar. Crispy outside, soft inside."
    }
  ];

  if (modal) {
    const modalTitle = modal.querySelector('#modalTitle');
    const modalSubtitle = modal.querySelector('#modalSubtitle');
    const modalTasting = modal.querySelector('#modalTasting');
    const modalOrigin = modal.querySelector('#modalOrigin');
    const modalRoast = modal.querySelector('#modalRoast');
    const modalPrice = modal.querySelector('#modalPrice');
    const modalDescription = modal.querySelector('#modalDescription');

    // Menu rows click handlers
    if (menuRows.length > 0) {
      menuRows.forEach(row => {
        row.addEventListener('click', (e) => {
          if (e.target.closest('.row-action')) {
            e.preventDefault();
          }
          
          const index = parseInt(row.getAttribute('data-item-index'), 10);
          const data = menuData[index];

          if (data) {
            if (modalTitle) modalTitle.innerHTML = data.title;
            if (modalSubtitle) modalSubtitle.innerHTML = data.subtitle;
            if (modalTasting) modalTasting.innerHTML = data.tasting;
            if (modalOrigin) modalOrigin.innerHTML = data.origin;
            if (modalRoast) modalRoast.innerHTML = data.roast;
            if (modalPrice) modalPrice.innerHTML = data.price;
            if (modalDescription) modalDescription.innerHTML = data.description;

            modal.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
          }
        });
      });
    }

    // Retail cards database and click handlers
    const retailCards = document.querySelectorAll('.retail-card');
    const retailData = [
      {
        title: "Yirgacheffe Konga",
        subtitle: "Gedeb, Ethiopia &middot; Washed",
        tasting: "Bergamot &middot; White Peach &middot; Jasmine",
        origin: "Gedeb, Ethiopia",
        roast: "-",
        price: "&#8377;780",
        description: "250 G Of Yirgacheffe Konga From Gedeb, Ethiopia, Processed Washed At 2050 M. Roasted To Order, Shipped Within Seventy-Two Hours Of The Roast Date."
      },
      {
        title: "Kerehaklu Estate",
        subtitle: "Chikmagalur, India &middot; Anaerobic natural",
        tasting: "Ripe Mango &middot; Maple &middot; Clove",
        origin: "Chikmagalur, India",
        roast: "-",
        price: "&#8377;720",
        description: "250 G Of Kerehaklu Estate From Chikmagalur, India, Processed Anaerobic Natural. Roasted To Order, Shipped Within Seventy-Two Hours Of The Roast Date."
      },
      {
        title: "Finca La Fany",
        subtitle: "Huehuetenango, Guatemala &middot; Honey",
        tasting: "Red Apple &middot; Toffee &middot; Almond",
        origin: "Huehuetenango, Guatemala",
        roast: "-",
        price: "&#8377;840",
        description: "250 G Of Finca La Fany From Huehuetenango, Guatemala, Processed Honey. Roasted To Order, Shipped Within Seventy-Two Hours Of The Roast Date."
      },
      {
        title: "Pelago &mdash; House Blend",
        subtitle: "Ethiopia + Karnataka &middot; Blend",
        tasting: "Cocoa &middot; Plum &middot; Brown Sugar",
        origin: "Ethiopia + Karnataka",
        roast: "-",
        price: "&#8377;680",
        description: "250 G Of Pelago Blend, A 70/30 Blend Of Ethiopian Guji And Washed Karnataka. Roasted To Order, Shipped Within Seventy-Two Hours Of The Roast Date."
      }
    ];

    if (retailCards.length > 0) {
      retailCards.forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.card-open')) {
            e.preventDefault();
          }
          
          const index = parseInt(card.getAttribute('data-retail-index'), 10);
          const data = retailData[index];

          if (data) {
            if (modalTitle) modalTitle.innerHTML = data.title;
            if (modalSubtitle) modalSubtitle.innerHTML = data.subtitle;
            if (modalTasting) modalTasting.innerHTML = data.tasting;
            if (modalOrigin) modalOrigin.innerHTML = data.origin;
            if (modalRoast) modalRoast.innerHTML = data.roast;
            if (modalPrice) modalPrice.innerHTML = data.price;
            if (modalDescription) modalDescription.innerHTML = data.description;

            modal.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
          }
        });
      });
    }

    const closeModal = () => {
      modal.classList.remove('is-visible');
      document.body.style.overflow = '';
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
      }
    });
  }

  // Archive Photo Lightbox Modal Logic
  const archivePhotos = document.querySelectorAll('.archive-photo');
  const archiveModal = document.getElementById('archiveModal');
  const archiveCloseBtn = archiveModal ? archiveModal.querySelector('.archive-modal-close-btn') : null;
  const archiveModalImg = archiveModal ? archiveModal.querySelector('#archiveModalImg') : null;
  const archiveModalCaption = archiveModal ? archiveModal.querySelector('#archiveModalCaption') : null;

  const archiveCaptions = {
    "1": "THE BAR, BREWING AT SEVEN AM",
    "2": "OUR ESPRESSO MACHINE, WARMED UP",
    "3": "POURING MILK, TEXTURED SLOWLY",
    "4": "FRESH ROASTED BEANS, ON TUESDAYS",
    "5": "THE ROOM, ON A TUESDAY MORNING",
    "6": "A CORNER TABLE, BY THE TEXTILE MILL"
  };

  if (archivePhotos.length > 0 && archiveModal && archiveModalImg) {
    archivePhotos.forEach(photo => {
      photo.addEventListener('click', () => {
        const index = photo.getAttribute('data-index');
        const imgTag = photo.querySelector('img');
        const src = imgTag ? imgTag.getAttribute('src') : '';
        const caption = archiveCaptions[index] || "MAREN & MILL — ARCHIVE";

        if (src) {
          archiveModalImg.src = src;
          if (archiveModalCaption) {
            archiveModalCaption.textContent = caption;
          }
          archiveModal.classList.add('is-visible');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeArchiveModal = () => {
      archiveModal.classList.remove('is-visible');
      document.body.style.overflow = '';
    };

    if (archiveCloseBtn) {
      archiveCloseBtn.addEventListener('click', closeArchiveModal);
    }

    archiveModal.addEventListener('click', (e) => {
      if (e.target === archiveModal) {
        closeArchiveModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && archiveModal.classList.contains('is-visible')) {
        closeArchiveModal();
      }
    });
  }
});
