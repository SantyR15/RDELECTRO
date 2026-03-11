const API_URL = 'https://script.google.com/macros/s/AKfycbwoS3lcvba0pD1yWT8SOjxWfu_4LoBUtBCV34jMu0387xOW2JeI1NUeLNgNE8gk0Kk7/exec'; // Reemplaza con tu link /exec
const grid = document.getElementById('product-grid');
const searchBar = document.getElementById('searchBar');
const buttons = document.querySelectorAll('.filter-btn');
let allProducts = [];

async function loadCatalog() {
    try {
        grid.innerHTML = '<p>Actualizando catálogo de Las Tres B...</p>';
        const response = await fetch(API_URL);
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (e) {
        grid.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

// Busca esta parte en tu script.js y cámbiala:

function renderProducts(list) {
    if (list.length === 0) {
        grid.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    grid.innerHTML = list.map(p => {
        // 1. Limpiamos el precio: quitamos cualquier cosa que no sea un número
        let precioLimpio = p.precio.toString().replace(/[^0-9]/g, '');
        
        // 2. Formateamos con puntos de miles manualmente
        let precioFinal = "";
        if (precioLimpio !== "") {
            precioFinal = "$" + new Intl.NumberFormat('es-AR').format(precioLimpio);
        } else {
            precioFinal = "Consultar"; // Por si la celda está vacía
        }

        return `
            <div class="product-card">
                <img src="${p.imagen}" alt="${p.nombre}">
                <div>
                    <h3>${p.nombre}</h3>
                    <p class="price">${precioFinal}</p>
                </div>
                <a href="https://wa.me/5493751566824?text=${encodeURIComponent('Hola! Me interesa el producto: ' + p.nombre + ' que vi en la web.')}" 
                   class="btn-consult" target="_blank">Consultar</a>
            </div>
        `;
    }).join('');
}

buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        const filtered = cat === 'todos' ? allProducts : allProducts.filter(p => p.categoria.toLowerCase().trim() === cat);
        renderProducts(filtered);
    });
});

searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderProducts(allProducts.filter(p => p.nombre.toLowerCase().includes(term)));
});


loadCatalog();








