/* main.js - lógica básica: productos, render, carrito y validaciones */

// ---------- DATOS DE EJEMPLO ----------
const PRODUCTS = [
  { id: 'JM001', cat:'Juegos de Mesa', name:'Catan', price:29990, img:'img/catan.jpg' },
  { id: 'AC002', cat:'Accesorios', name:'Auriculares HyperX Cloud II', price:79990, img:'img/hyperx.jpg' },
  { id: 'CO001', cat:'Consolas', name:'PlayStation 5', price:549990, img:'img/ps5.jpg' },
  { id: 'MS001', cat:'Mouse', name:'Logitech G502', price:49990, img:'img/g502.jpg' },
];

// ---------- UTILIDADES ----------
const formatCLP = (n) => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(n);
const CART_KEY = 'levelup_cart';

// ---------- CARRITO (persistencia localStorage) ----------
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge(){
  const badge = document.getElementById('cart-badge');
  if(!badge) return;
  const totalCount = cart.reduce((s,i)=>s+i.qty,0);
  badge.textContent = totalCount;
}

// ---------- RENDER PRODUCTOS (cards bootstrap) ----------
function renderFeatured(){
  const container = document.getElementById('featured-products');
  if(!container) return;
  container.innerHTML = '';
  const featured = PRODUCTS.slice(0,4);
  featured.forEach(p=>{
    const col = document.createElement('div'); col.className = 'col-sm-6 col-md-3';
    col.innerHTML = `
      <article class="card h-100 text-white">
        <img src="${p.img}" class="card-img-top" alt="${p.name}" style="height:180px;object-fit:cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-muted small">${p.cat}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong>${formatCLP(p.price)}</strong>
            <button class="btn btn-sm btn-primary add-to-cart" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </article>`;
    container.appendChild(col);
  });
}

// ---------- AGREGAR AL CARRITO ----------
function addToCart(productId){
  const product = PRODUCTS.find(p=>p.id===productId);
  if(!product) return;
  const existing = cart.find(i=>i.id===productId);
  if(existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  saveCart();
}

// ---------- HANDLE CLIC EN BOTONES (delegation) ----------
document.addEventListener('click', (e) => {
  if(e.target.matches('.add-to-cart')) {
    const id = e.target.dataset.id;
    addToCart(id);
    // feedback rápido
    e.target.textContent = 'Añadido ✓';
    setTimeout(()=> e.target.textContent = 'Agregar', 900);
  }
});

// ---------- VALIDACIÓN FORM REGISTRO (modal) ----------
document.getElementById('form-registro')?.addEventListener('submit', function(evt){
  evt.preventDefault();
  const nombre = this.nombre.value.trim();
  const email = this.email.value.trim();
  const edad = Number(this.edad.value);

  const emailFeedback = document.getElementById('emailFeedback');
  const edadFeedback = document.getElementById('edadFeedback');

  // Limpio feedback
  this.nombre.classList.remove('is-invalid');
  this.email.classList.remove('is-invalid');
  this.edad.classList.remove('is-invalid');

  if(!nombre){ this.nombre.classList.add('is-invalid'); return; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ this.email.classList.add('is-invalid'); emailFeedback.textContent='Correo inválido.'; return; }
  if(edad < 18){ this.edad.classList.add('is-invalid'); edadFeedback.textContent='Debes ser mayor de 18 años.'; return; }

  // Check descuento Duoc (si el email contiene "duoc")
  const tieneDescuento = /duoc/i.test(email);
  const msg = document.getElementById('registroMessage');
  msg.classList.remove('d-none');
  msg.textContent = tieneDescuento ? 'Registro correcto. ¡Tienes 20% de descuento por correo Duoc!' : 'Registro correcto. Bienvenido/a a Level-Up.';

  // Aquí podrías guardar el usuario en localStorage (simulación)
  const users = JSON.parse(localStorage.getItem('levelup_users') || '[]');
  users.push({ nombre, email, edad, descuento: !!tieneDescuento, created: new Date().toISOString() });
  localStorage.setItem('levelup_users', JSON.stringify(users));

  // opcional: cerrar modal después de 1.2s
  setTimeout(()=>{ const modal = bootstrap.Modal.getInstance(document.getElementById('registroModal')); modal?.hide(); }, 1200);
});

// ---------- ONLOAD ----------
window.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  updateCartBadge();
  document.getElementById('year').textContent = new Date().getFullYear();
});
