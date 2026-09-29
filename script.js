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
        description: "Sekarnala punya rasa yang berbeda. Setiap fungsi dan karakter punya tempatnya masing-masing"
    }

];


let currentIndex = 0;
let autoSlide; 




const image = document.getElementById("productImage");
const category = document.getElementById("productCategory");
const name = document.getElementById("productName");
const price = document.getElementById("productPrice");
const variant = document.getElementById("productVariant");
const description = document.getElementById("productDescription");
const info = document.getElementById("productInfo");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");




function showProduct(index) {

    const product = products[index];

    image.src = product.image;
    category.textContent = product.category;
    name.textContent = product.name;
    price.textContent = product.price;
    variant.textContent = product.variant;
    description.textContent = product.description;

    
    info.classList.remove("animate");
    void info.offsetWidth;
    info.classList.add("animate");
}




function nextProduct() {

    currentIndex++;

    if (currentIndex >= products.length) {
        currentIndex = 0;
    }

    showProduct(currentIndex);
}




function prevProduct() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = products.length - 1;
    }

    showProduct(currentIndex);
}




function startAutoSlide() {
    clearInterval(autoSlide);                    
    autoSlide = setInterval(nextProduct, 3000);  
}


// TOMBOL

nextBtn.addEventListener("click", function () {
    nextProduct();
    startAutoSlide();   
});

prevBtn.addEventListener("click", function () {
    prevProduct();
    startAutoSlide();
});


// SAAT HALAMAN DIBUKA

showProduct(currentIndex);   // tampilkan produk pertama (gambar dari JS)
startAutoSlide();            // mulai auto slide