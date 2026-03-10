const API_URL = 'https://script.google.com/macros/s/AKfycbz-0toaVNhpRLnRRqe-LG86IhFYrTxjma0oWpnb7ghafh4VWiNi0gmdz_EiyhDuNjg3/exec'; // Reemplaza con tu link /exec
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

function renderProducts(list) {
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <div>
                <h3>${p.nombre}</h3>
                <p class="price">$${p.precio}</p>
            </div>
            <a href="https://wa.me/+5493751566824?text=${encodeURIComponent('Hola Las Tres B! Me interesa este producto: ' + p.nombre)}" 
               class="btn-consult" target="_blank">Consultar</a>
        </div>
    `).join('');
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




