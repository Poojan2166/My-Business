const productsData = {
    "TMT BARS": {
        code: "PR-01",
        description: "Thermo-Mechanically Treated bars with superior strength, bendability and earthquake resistance — ideal for RCC structures, high-rise buildings and bridges.",
        sizes: "8MM - 40MM",
        grades: "FE 500 / FE 500D / FE 550D",
        specs: [
            { label: "Yield Strength", value: "> 500 MPA" },
            { label: "Elongation", value: "16% - 18%" },
            { label: "Standard", value: "IS 1786:2008" },
            { label: "Finish", value: "RIBBED / CORRUGATED" }
        ],
        apps: ["Residential Buildings", "Bridges & Flyovers", "Dams", "Industrial Plants"]
    },
    "STEEL PIPES": {
        code: "PR-02",
        description: "High-quality mild steel (MS) and carbon steel pipes designed for fluid transmission, structural support, gas pipelines, and industrial engineering.",
        sizes: "1/2 INCH - 24 INCH",
        grades: "IS 1239 / IS 3589 / API 5L",
        specs: [
            { label: "Thickness", value: "2.0MM - 12.7MM" },
            { label: "Tensile Strength", value: "> 320 MPA" },
            { label: "Connection", value: "THREADED / BEVELED" },
            { label: "Coating", value: "BLACK / GALVANIZED" }
        ],
        apps: ["Water & Gas Pipeline", "Industrial Piping", "Structural Scaffolding", "Automobile Frames"]
    },
    "MS SHEETS": {
        code: "PR-03",
        description: "Hot rolled and cold rolled Mild Steel (MS) sheets offering excellent weldability, ductility, and smooth surface finish, suitable for manufacturing and fabrication.",
        sizes: "1.2MM - 25MM THICKNESS",
        grades: "IS 2062 GR-A/B / ASTM A36",
        specs: [
            { label: "Yield Strength", value: "> 250 MPA" },
            { label: "Standard Length", value: "2000MM / 2500MM / 3000MM" },
            { label: "Finish", value: "HOT ROLLED / COLD ROLLED" },
            { label: "Tolerance", value: "ASTM A568 COMPLIANT" }
        ],
        apps: ["Automobile Bodies", "Fabrication Work", "Heavy Machinery", "Storage Tanks"]
    },
    "GI SHEETS": {
        code: "PR-04",
        description: "Galvanized Iron (GI) sheets treated with protective zinc coating to prevent rusting and corrosion. Extremely durable and perfect for outdoor installations.",
        sizes: "0.35MM - 2.0MM THICKNESS",
        grades: "IS 277 / ASTM A653",
        specs: [
            { label: "Zinc Coating", value: "90 - 275 GSM" },
            { label: "Width Options", value: "910MM / 1220MM" },
            { label: "Spangle Type", value: "REGULAR / MINIMIZED" },
            { label: "Surface Treatment", value: "CHROMATED / OILED" }
        ],
        apps: ["Roofing & Cladding", "Ducting Systems", "Agricultural Equipment", "Electrical Panels"]
    },
    "STRUCTURAL STEEL": {
        code: "PR-05",
        description: "Heavy-duty structural sections including Beams, Channels, and Angles designed to bear load and provide mechanical integrity in infrastructure projects.",
        sizes: "50MM - 600MM SECTION SIZE",
        grades: "IS 2062 E250 / E350",
        specs: [
            { label: "Section Types", value: "I-BEAM / CHANNEL / ANGLE" },
            { label: "Standard Length", value: "6M / 12M" },
            { label: "Weldability", value: "HIGH COMPATIBILITY" },
            { label: "Flange Thickness", value: "5.0MM - 24MM" }
        ],
        apps: ["Factory Sheds", "High-Rise Structures", "Bridges & Flyovers", "Heavy Industrial Framing"]
    },
    "ROOFING SHEETS": {
        code: "PR-06",
        description: "Color-coated profile roofing sheets with high weather resistance, thermal stability, and premium aesthetics, available in multiple color coatings.",
        sizes: "0.40MM - 0.80MM THICKNESS",
        grades: "CGGL / DX51D",
        specs: [
            { label: "Base Material", value: "GALVALUME / GALVANIZED" },
            { label: "Profile Depth", value: "28MM - 32MM" },
            { label: "Color Coating", value: "RMP / SMP / PVDF" },
            { label: "Effective Width", value: "1000MM - 1050MM" }
        ],
        apps: ["Industrial Sheds", "Warehouses", "Residential Roofing", "Commercial Complex"]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("productModal");
    const closeBtn = document.getElementById("modalCloseBtn");
    
    const modalCode = document.getElementById("modalProductCode");
    const modalDesc = document.getElementById("modalProductDesc");
    const modalSizes = document.getElementById("modalProductSizes");
    const modalGrades = document.getElementById("modalProductGrades");
    const modalSpecs = document.getElementById("modalProductSpecs");
    const modalApps = document.getElementById("modalProductApps");
    const modalFormTitle = document.getElementById("modalFormTitle");
    const modalFormProductInput = document.getElementById("modal-user-product");
    
    function openProductModal(productName) {
        const data = productsData[productName];
        if (!data) return;
        
        modalCode.textContent = data.code;
        modalDesc.textContent = data.description;
        modalSizes.textContent = data.sizes;
        modalGrades.textContent = data.grades;
        modalFormTitle.textContent = `REQUEST ${productName}`;
        modalFormProductInput.value = productName;
        
        modalSpecs.innerHTML = "";
        data.specs.forEach(spec => {
            const row = document.createElement("div");
            row.className = "modal-spec-row";
            row.innerHTML = `
                <span class="modal-spec-label">${spec.label}</span>
                <span class="modal-spec-value">${spec.value}</span>
            `;
            modalSpecs.appendChild(row);
        });
        
        modalApps.innerHTML = "";
        data.apps.forEach(app => {
            const item = document.createElement("div");
            item.className = "modal-app-item";
            item.innerHTML = `
                <div class="modal-app-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <span class="modal-app-text">${app}</span>
            `;
            modalApps.appendChild(item);
        });
        
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    
    function closeProductModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
    
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
        const link = card.querySelector(".view-details-link");
        const productName = card.querySelector(".product-name").textContent.trim();
        
        if (link) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                openProductModal(productName);
            });
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener("click", closeProductModal);
    }
    
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeProductModal();
        }
    });

    // Mobile Drawer Controller
    const mobileMenuTrigger = document.getElementById("mobileMenuTrigger");
    const mobileDrawerOverlay = document.getElementById("mobileDrawerOverlay");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerCloseBtn = document.getElementById("drawerCloseBtn");
    const drawerLinks = document.querySelectorAll(".drawer-link");

    function openMobileDrawer() {
        mobileDrawerOverlay.classList.add("active");
        mobileDrawer.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileDrawer() {
        mobileDrawerOverlay.classList.remove("active");
        mobileDrawer.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener("click", openMobileDrawer);
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener("click", closeMobileDrawer);
    }

    if (mobileDrawerOverlay) {
        mobileDrawerOverlay.addEventListener("click", (e) => {
            if (e.target === mobileDrawerOverlay) {
                closeMobileDrawer();
            }
        });
    }

    drawerLinks.forEach(link => {
        link.addEventListener("click", closeMobileDrawer);
    });
});
