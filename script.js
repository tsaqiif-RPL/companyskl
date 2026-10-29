const ORDER_WEBHOOK_URL = "https://tsaqiifco.app.n8n.cloud/webhook/Vobia Order";
/* ========== DATA CAROUSEL ========== */

const products = [
    {
        image: "image 2/images.jpeg",
        category: "VOBIA COLLECTION",
        name: "Vobia-Gelora Series",
        price: "Rp299.000",
        variant: "Black",
        description: "Produk Vobia dengan desain minimalis dan modern."
    },
    {
        image: "image 2/images (1).jpeg",
        category: "VOBIA COLLECTION",
        name: "Vobia Knitwear-Football Edition",
        price: "Rp349.000",
        variant: "White",
        description: "Knitwear dengan desain nyaman dan cocok digunakan sehari-hari."
    },
    {
        image: "image 2/images (2).jpeg",
        category: "VOBIA COLLECTION",
        name: "Vobia Sekarnala",
        price: "Rp399.000",
        variant: "Navy",
        description: "Sekarnala punya rasa yang berbeda. Setiap fungsi dan karakter punya tempatnya masing-masing."
    }
];

let currentIndex = 0;
let autoSlide = null;

/* ========== ELEMENT CAROUSEL ========== */

const productImage = document.getElementById("productImage");
const productCategory = document.getElementById("productCategory");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productVariant = document.getElementById("productVariant");
const productDescription = document.getElementById("productDescription");
const productInfo = document.getElementById("productInfo");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

function showProduct(index) {
    const product = products[index];
    if (!product) return;

    if (productImage) productImage.src = product.image;
    if (productCategory) productCategory.textContent = product.category;
    if (productName) productName.textContent = product.name;
    if (productPrice) productPrice.textContent = product.price;
    if (productVariant) productVariant.textContent = product.variant;
    if (productDescription) productDescription.textContent = product.description;

    if (productInfo) {
        productInfo.classList.remove("animate");
        void productInfo.offsetWidth;
        productInfo.classList.add("animate");
    }
}

function nextProduct() {
    currentIndex = (currentIndex + 1) % products.length;
    showProduct(currentIndex);
}

function prevProduct() {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    showProduct(currentIndex);
}

function startAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextProduct, 3000);
}

nextBtn?.addEventListener("click", () => {
    nextProduct();
    startAutoSlide();
});

prevBtn?.addEventListener("click", () => {
    prevProduct();
    startAutoSlide();
});

showProduct(currentIndex);
startAutoSlide();

/* ========== ELEMENT MODAL ========== */

const modal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalBadge = document.getElementById("modalBadge");
const modalName = document.getElementById("modalName");
const modalSeries = document.getElementById("modalSeries");
const modalRating = document.getElementById("modalRating");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");

const addCartBtn = document.getElementById("addCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const cards = document.querySelectorAll(".card");

let selectedProductName = "";
let selectedRating = 0;

function openModal(card) {
    if (!modal || !card) return;

    const cardImage = card.querySelector(".card-image img");
    const badge = card.querySelector(".badge");
    const title = card.querySelector("h3");
    const series = card.querySelector(".card-info p");
    const rating = card.querySelector(".rating");
    const price = card.querySelector(".price");

    if (modalImage && cardImage) modalImage.src = cardImage.src;
    if (modalBadge && badge) modalBadge.textContent = badge.textContent;
    if (modalName && title) modalName.textContent = title.textContent;
    if (modalSeries && series) modalSeries.textContent = series.textContent;
    if (modalRating && rating) modalRating.textContent = rating.textContent;
    if (modalPrice && price) modalPrice.textContent = price.textContent;

    selectedProductName = title?.textContent.trim() || "";
    selectedRating = 0;

    // Reset bintang setiap kali modal dibuka
    starInput?.querySelectorAll("span").forEach(star => {
        star.classList.remove("active");
        star.textContent = "☆";
    });

    // Reset form komentar
    if (commentName) commentName.value = "";
    if (commentText) commentText.value = "";

    renderComments();

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal?.classList.remove("show");
    document.body.style.overflow = "";
}

cards.forEach(card => {
    card.addEventListener("click", () => openModal(card));
});

modalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
        closeDrawer();
    }
});

/* ========== ELEMENT KERANJANG ========== */

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerClose = document.getElementById("drawerClose");
const drawerTitle = document.getElementById("drawerTitle");
const drawerBody = document.getElementById("drawerBody");
const drawerFooter = document.getElementById("drawerFooter");

const toast = document.getElementById("toast");

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("vobiaCart") || "[]");
    cart = Array.isArray(savedCart) ? savedCart : [];
} catch {
    cart = [];
}

/* ========== UTILITAS ========== */

function getPrice(priceText) {
    return Number(String(priceText).replace(/[^\d]/g, ""));
}

function formatPrice(price) {
    return "Rp" + Number(price).toLocaleString("id-ID");
}

function escapeHTML(value) {
    const element = document.createElement("span");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}

function showToast(message) {
    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* ========== DATA PRODUK TERPILIH ========== */

function getSelectedProduct() {
    return {
        name: modalName?.textContent.trim() || "",
        image: modalImage?.src || "",
        price: getPrice(modalPrice?.textContent || "0"),
        variant: modalSeries?.textContent.trim() || ""
    };
}

/* ========== SISTEM KERANJANG ========== */

function saveCart() {
    localStorage.setItem("vobiaCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    if (!cartCount) return;

    const totalItems = cart.reduce((total, item) => {
        return total + Number(item.qty || 0);
    }, 0);

    cartCount.textContent = totalItems;
}

function addToCart(product) {
    if (!product.name || product.price <= 0) {
        showToast("Data produk tidak valid.");
        return;
    }

    const existing = cart.find(item =>
        item.name === product.name &&
        item.variant === product.variant
    );

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            ...product,
            qty: 1
        });
    }

    saveCart();
    showToast("Produk berhasil masuk keranjang!");
}

function closeDrawer() {
    drawer?.classList.remove("show");
    drawerOverlay?.classList.remove("show");
    document.body.style.overflow = "";
}

function openDrawer(mode = "cart") {
    if (!drawer || !drawerOverlay) return;

    if (drawerTitle) {
        drawerTitle.textContent =
            mode === "checkout" ? "Checkout Pesanan" :
                mode === "orders" ? "Riwayat Pembelian" :
                    "Keranjang Belanja";
    }

    renderDrawer(mode);

    drawer.classList.add("show");
    drawerOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function renderDrawer(mode = "cart") {
    if (!drawerBody || !drawerFooter) return;

    if (mode === "orders") {
        const orders = JSON.parse(
            localStorage.getItem("vobiaOrders") || "[]"
        );

        if (orders.length === 0) {
            drawerBody.innerHTML = `
            <div class="drawer-empty">
                <p>Belum ada riwayat pembelian.</p>
                <p>Pesanan demo kamu akan muncul di sini.</p>
            </div>
        `;
            drawerFooter.innerHTML = "";
            return;
        }

        drawerBody.innerHTML = [...orders].reverse().map((order, index) => `
        <div class="order-card">
            <h4>Pesanan #${orders.length - index}</h4>
            <p>${new Date(order.date).toLocaleString("id-ID")}</p>
            <p><strong>${order.customer}</strong></p>
            <p>${order.items.map(item =>
            `${item.name} × ${item.qty}`
        ).join("<br>")}</p>
            <p class="order-total">
                Total: <strong>${formatPrice(order.total)}</strong>
            </p>
        </div>
    `).join("");

        drawerFooter.innerHTML = `
        <button type="button" class="btn btn-solid"
            id="closeOrdersBtn">Tutup Riwayat</button>
    `;

        document.getElementById("closeOrdersBtn").addEventListener(
            "click", closeDrawer
        );

        return;
    }


    if (cart.length === 0) {
        drawerBody.innerHTML =
            '<p class="drawer-empty">Keranjang kamu masih kosong.</p>';
        drawerFooter.innerHTML = "";
        return;
    }

    const total = cart.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.qty);
    }, 0);

    drawerBody.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
                style="width:70px;height:80px;object-fit:cover;"
            >

            <div>
                <strong>${escapeHTML(item.name)}</strong>
                <p>${formatPrice(item.price)}</p>
                <small>${escapeHTML(item.variant)}</small>

                <div class="qty">
                    <button type="button" data-action="minus" data-index="${index}">−</button>
                    <span>${item.qty}</span>
                    <button type="button" data-action="plus" data-index="${index}">+</button>
                    
<button
    type="button"
    class="trash-btn"
    data-action="remove"
    data-index="${index}"
    aria-label="Hapus produk"
    title="Hapus produk"
>
    <svg
        class="trash-icon"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path class="trash-lid" d="M4 7h16M9 7V4h6v3" />
        <path d="m6 7 1 13h10l1-13" />
        <path d="M10 11v5M14 11v5" />
    </svg>
</button>

                </div>
            </div>
        </div>
    `).join("");

    if (mode === "checkout") {
        drawerFooter.innerHTML = `
            <p class="drawer-total">
                Total: <strong>${formatPrice(total)}</strong>
            </p>

            <form id="checkoutForm">
                <input
                    name="customerName"
                    type="text"
                    placeholder="Nama lengkap"
                    required
                >

                <input
                    name="phone"
                    type="tel"
                    placeholder="Nomor WhatsApp"
                    required
                >

                <textarea
                    name="address"
                    placeholder="Alamat pengiriman"
                    required
                ></textarea>

                <button class="btn btn-solid" type="submit">
                    Buat Pesanan
                </button>

                <button class="btn btn-outline" type="button" id="backToCart">
                    Kembali ke Keranjang
                </button>
            </form>
        `;
    } else {
        drawerFooter.innerHTML = `
            <p class="drawer-total">
                Total: <strong>${formatPrice(total)}</strong>
            </p>

            <button class="btn btn-solid" type="button" id="checkoutBtn">
                Lanjut Checkout
            </button>
        `;
    }
}

/* ========== AKSI TOMBOL PRODUK ========== */

addCartBtn?.addEventListener("click", () => {
    addToCart(getSelectedProduct());
    closeModal();
});

buyNowBtn?.addEventListener("click", () => {
    addToCart(getSelectedProduct());
    closeModal();
    openDrawer("checkout");
});

cartBtn?.addEventListener("click", () => {
    openDrawer("cart");
});

drawerClose?.addEventListener("click", closeDrawer);
drawerOverlay?.addEventListener("click", closeDrawer);

/* ========== AKSI DI PANEL KERANJANG ========== */

drawer?.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-action]");

    if (actionButton) {
        const index = Number(actionButton.dataset.index);
        const action = actionButton.dataset.action;
        const item = cart[index];

        if (!item) return;

        if (action === "plus") item.qty++;
        if (action === "minus") item.qty--;
        if (action === "remove" || item.qty <= 0) {
            cart.splice(index, 1);
        }

        saveCart();

        const isCheckout = drawerTitle?.textContent === "Checkout Pesanan";
        renderDrawer(isCheckout ? "checkout" : "cart");
        return;
    }

    if (event.target.closest("#checkoutBtn")) {
        openDrawer("checkout");
    }

    if (event.target.closest("#backToCart")) {
        openDrawer("cart");
    }
});


/* ========== CHECKOUT KE N8N + GOOGLE SHEETS ========== */

drawer?.addEventListener("submit", async (event) => {
    if (event.target.id !== "checkoutForm") return;

    event.preventDefault();

    if (cart.length === 0) {
        showToast("Keranjang masih kosong.");
        return;
    }

    const form = event.target;
    const submitBtn = form.querySelector(
        'button[type="submit"]'
    );

    const formData = new FormData(form);

    const order = {
        waktu: new Date().toISOString(),
        nama: String(formData.get("customerName") || "").trim(),
        whatsapp: String(formData.get("phone") || "").trim(),
        alamat: String(formData.get("address") || "").trim(),

        produk: cart.map(item => item.name).join(", "),
        varian: cart.map(item => item.variant).join(", "),
        jumlah: cart.reduce(
            (sum, item) => sum + Number(item.qty || 0),
            0
        ),
        total: cart.reduce(
            (sum, item) =>
                sum + Number(item.price) * Number(item.qty),
            0
        ),

        items: cart.map(item => ({ ...item }))
    };

    if (!order.nama || !order.whatsapp || !order.alamat) {
        showToast("Lengkapi data checkout terlebih dahulu.");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";
    }

    try {
        const response = await fetch(ORDER_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error("Webhook gagal: " + response.status);
        }

        // Simpan riwayat lokal setelah webhook berhasil
        let orders = [];

        try {
            orders = JSON.parse(
                localStorage.getItem("vobiaOrders") || "[]"
            );

            if (!Array.isArray(orders)) orders = [];
        } catch {
            orders = [];
        }

        orders.push(order);
        localStorage.setItem(
            "vobiaOrders",
            JSON.stringify(orders)
        );

        cart = [];
        saveCart();
        closeDrawer();

        showToast("Pesanan berhasil dikirim!");

    } catch (error) {
        console.error("Checkout error:", error);
        showToast(
            "Pesanan gagal dikirim. Periksa koneksi dan webhook."
        );
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Buat Pesanan";
        }
    }
});


/* ========== RATING BINTANG ========== */

const starInput = document.getElementById("starInput");

if (starInput) {
    const stars = starInput.querySelectorAll("span");

    stars.forEach((star, index) => {
        star.style.cursor = "pointer";

        star.addEventListener("click", () => {
            selectedRating = index + 1;

            stars.forEach((item, i) => {
                const active = i < selectedRating;
                item.classList.toggle("active", active);
                item.textContent = active ? "★" : "☆";
            });
        });
    });
}

/* ========== KOMENTAR PRODUK ========== */

const commentName = document.getElementById("commentName");
const commentText = document.getElementById("commentText");
const sendComment = document.getElementById("sendComment");
const commentList = document.getElementById("commentList");

function getComments() {
    try {
        const comments = JSON.parse(
            localStorage.getItem("vobiaComments") || "{}"
        );

        return comments && typeof comments === "object" ? comments : {};
    } catch {
        return {};
    }
}

function renderComments() {
    if (!commentList) return;

    const comments = getComments()[selectedProductName] || [];

    if (comments.length === 0) {
        commentList.innerHTML =
            '<p class="comment-empty">Belum ada komentar untuk produk ini.</p>';
        return;
    }

    commentList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-top">
                <strong>${escapeHTML(comment.name)}</strong>
                <span class="stars">
                    ${"★".repeat(comment.rating)}${"☆".repeat(5 - comment.rating)}
                </span>
            </div>
            <p>${escapeHTML(comment.text)}</p>
        </div>
    `).join("");
}

sendComment?.addEventListener("click", () => {
    const name = commentName?.value.trim() || "";
    const text = commentText?.value.trim() || "";

    if (!selectedProductName) {
        showToast("Pilih produk terlebih dahulu.");
        return;
    }

    if (!name || !text) {
        showToast("Isi nama dan komentar terlebih dahulu.");
        return;
    }

    if (selectedRating === 0) {
        showToast("Pilih rating bintang terlebih dahulu.");
        return;
    }

    const comments = getComments();

    if (!Array.isArray(comments[selectedProductName])) {
        comments[selectedProductName] = [];
    }

    comments[selectedProductName].push({
        name,
        text,
        rating: selectedRating,
        date: new Date().toISOString()
    });

    localStorage.setItem("vobiaComments", JSON.stringify(comments));

    commentName.value = "";
    commentText.value = "";
    selectedRating = 0;

    starInput?.querySelectorAll("span").forEach(star => {
        star.classList.remove("active");
        star.textContent = "☆";
    });

    renderComments();
    showToast("Komentar berhasil dikirim!");
});


/* ========== INISIALISASI ========== */

updateCartCount();

// Menu riwayat pembelian
const ordersLink = document.getElementById("ordersLink");

ordersLink?.addEventListener("click", function (event) {
    event.preventDefault();
    openDrawer("orders");
});


/* ===== MOBILE HAMBURGER ===== */

const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

function closeMobileMenu() {
    hamburger?.classList.remove("active");
    navbar?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Buka menu");
}

hamburger?.addEventListener("click", () => {
    const isOpen = navbar?.classList.toggle("open");

    hamburger.classList.toggle("active", Boolean(isOpen));
    hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
    hamburger.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu" : "Buka menu"
    );
});

navbar?.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
        if (link.id !== "ordersLink") {
            closeMobileMenu();
        }
    });
});

document.addEventListener("click", event => {
    if (
        navbar?.classList.contains("open") &&
        !navbar.contains(event.target) &&
        !hamburger?.contains(event.target)
    ) {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});
