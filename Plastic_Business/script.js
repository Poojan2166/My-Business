const productsData = [
  {
    title: "HDPE Granules",
    badge: "[SERIES_A]",
    desc: "High-density polyethylene compounds for industrial piping and infrastructure.",
    image: "Images/hdpe_closeup.png",
    specs: [
      { label: "GRADE", value: "PE-100 / Black & Natural" },
      { label: "DENSITY", value: "0.955 g/cm³" },
      { label: "TENSILE STRENGTH", value: "26 MPa" },
      { label: "MELT FLOW INDEX", value: "0.30 g/10min" }
    ],
    features: [
      "Pressure pipes (PN 6–25)",
      "Geomembranes",
      "Cable conduits",
      "Industrial tanks",
      "Certified: ISO 4427",
      "Certified: DIN 8074",
      "Certified: BIS IS 4984"
    ]
  },
  {
    title: "Medical Grade Polymers",
    badge: "[SERIES_B]",
    desc: "FDA & ISO 13485 certified materials for sterile healthcare applications.",
    image: "Images/medical_closeup.png",
    specs: [
      { label: "GRADE", value: "Mediprene / Medical PP" },
      { label: "DENSITY", value: "0.910 g/cm³" },
      { label: "STERILIZATION", value: "Autoclave / Gamma" },
      { label: "HARDNESS", value: "75 Shore A" }
    ],
    features: [
      "Catheters & Syringe Barrels",
      "IV tubing sets",
      "Fluid administration kits",
      "Certified: ISO 10993",
      "Certified: ISO 13485",
      "USP Class VI compliant"
    ]
  },
  {
    title: "Automotive Components",
    badge: "[SERIES_C]",
    desc: "Heat-resistant precision parts for EV drivetrains and engine assemblies.",
    image: "Images/automotive_closeup.png",
    specs: [
      { label: "GRADE", value: "Polyamide PA66 / GF30" },
      { label: "DENSITY", value: "1.350 g/cm³" },
      { label: "TEMP RESISTANCE", value: "Up to 220°C" },
      { label: "FLEXURAL MODULUS", value: "8,500 MPa" }
    ],
    features: [
      "EV motor housings",
      "Engine covers & manifolds",
      "Radiator end tanks",
      "Under-hood connectors",
      "Certified: IATF 16949",
      "Low-emission formulation"
    ]
  },
  {
    title: "PVC Pipes & Fittings",
    badge: "[SERIES_D]",
    desc: "Pressure-tested conduit systems for water and chemical distribution.",
    image: "Images/pvc_closeup.png",
    specs: [
      { label: "GRADE", value: "PVC-U / High-Impact" },
      { label: "DENSITY", value: "1.420 g/cm³" },
      { label: "NOMINAL PRESSURE", value: "PN 10 / PN 16" },
      { label: "SHORE HARDNESS", value: "82 Shore D" }
    ],
    features: [
      "Potable water mains",
      "Soil and waste drainage",
      "Chemical transfer pipes",
      "Threaded adapters & bends",
      "Certified: EN 1452",
      "Lead-free stabilizers"
    ]
  },
  {
    title: "Polycarbonate Sheets",
    badge: "[SERIES_E]",
    desc: "Optically clear impact-resistant panels for industrial glazing.",
    image: "Images/polycarbonate_closeup.png",
    specs: [
      { label: "GRADE", value: "Lexan / UV-Protected" },
      { label: "DENSITY", value: "1.200 g/cm³" },
      { label: "TRANSMITTANCE", value: "89% Optical" },
      { label: "IMPACT RESISTANCE", value: "250x Glass" }
    ],
    features: [
      "Machine safety guards",
      "Sound barrier walls",
      "Architectural skylights",
      "Ballistic shields",
      "Certified: EN 13501-1",
      "Co-extruded UV protection"
    ]
  },
  {
    title: "Recycled Compounds",
    badge: "[SERIES_F]",
    desc: "100% post-consumer recycled polymers with 98% structural integrity.",
    image: "Images/recycled_closeup.png",
    specs: [
      { label: "GRADE", value: "rPP / rHDPE Pellet" },
      { label: "DENSITY", value: "0.940 g/cm³" },
      { label: "PCR CONTENT", value: "100% Recycled" },
      { label: "TENSILE YIELD", value: "24 MPa" }
    ],
    features: [
      "Consumer packaging products",
      "Logistics pallets & crates",
      "Agricultural drainage sheets",
      "Non-food grade containers",
      "Certified: GRS (Recycled)",
      "RoHS & REACH compliant"
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("product-modal");
  const modalClose = document.getElementById("modal-close");
  const modalBadge = document.getElementById("modal-badge");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalSpecs = document.getElementById("modal-specs");
  const modalFeatures = document.getElementById("modal-features");
  const modalCta = document.getElementById("modal-cta");

  const openModal = (index) => {
    const data = productsData[index];
    if (!data) return;

    // Set simple details
    modalBadge.textContent = data.badge;
    modalImg.src = data.image;
    modalImg.alt = `${data.title} Closeup`;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    // Populate specs grid
    modalSpecs.innerHTML = "";
    data.specs.forEach(spec => {
      const box = document.createElement("div");
      box.className = "spec-box";
      box.innerHTML = `
        <span class="spec-label">${spec.label}</span>
        <span class="spec-value">${spec.value}</span>
      `;
      modalSpecs.appendChild(box);
    });

    // Populate features list
    modalFeatures.innerHTML = "";
    data.features.forEach(feat => {
      const li = document.createElement("li");
      li.className = "modal-feature-item";
      li.innerHTML = `
        <span class="modal-feature-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>${feat}</span>
      `;
      modalFeatures.appendChild(li);
    });

    // Show modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable background scroll
  };

  // Add click event listeners to card links
  const cardLinks = document.querySelectorAll(".card-link");
  cardLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(link.getAttribute("data-product-index"), 10);
      openModal(index);
    });
  });

  // Close modal events
  modalClose.addEventListener("click", closeModal);
  
  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Redirect CTA clicks to contact section and close modal
  modalCta.addEventListener("click", () => {
    closeModal();
  });

  // Mobile Nav Drawer Toggle
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const drawerClose = document.getElementById("drawer-close");
  const drawerLinks = document.querySelectorAll(".drawer-link");
  const btnDrawerQuote = document.getElementById("btn-drawer-quote");

  const openDrawer = () => {
    mobileNavToggle.classList.add("active");
    mobileNavDrawer.classList.add("active");
    mobileNavOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    mobileNavToggle.classList.remove("active");
    mobileNavDrawer.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  mobileNavToggle.addEventListener("click", () => {
    const isOpen = mobileNavDrawer.classList.contains("active");
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerClose.addEventListener("click", closeDrawer);
  mobileNavOverlay.addEventListener("click", closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener("click", closeDrawer);
  });

  if (btnDrawerQuote) {
    btnDrawerQuote.addEventListener("click", closeDrawer);
  }
});
