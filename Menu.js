/* Foto stock Unsplash: una per tipo di piatto. Sostituiscile con le foto reali (es. "images/tagliatelle.jpg"). */
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
const IMG = {
  pasta:  U('photo-1621996346565-e3dbc646d9a9'),
  carne:  U('photo-1544025162-d76694265947'),
  dolce:  U('photo-1571877227200-a0d98ea607e9'),
  pizza:  U('photo-1513104890138-7c749659a591'),
  pizza2: U('photo-1565299624946-b28f40a0ae38'),
  antip:  U('photo-1504674900247-0877df9cc836')
};

/* Menu. Prezzi, descrizioni e allergeni sono indicativi: verificali con la cucina. */
const MENU = {
  antipasti: { label: 'Antipasti', items: [
    { name: 'Antipasto della Casa', price: 14, img: IMG.antip, desc: 'Selezione di salumi emiliani con erbazzone reggiano e gnocco fritto caldo.', allergens: ['Glutine', 'Latte'] },
    { name: 'Erbazzone reggiano', price: 8, img: IMG.antip, desc: 'Torta salata con bietole, parmigiano reggiano e cipolla.', allergens: ['Glutine', 'Latte'] },
    { name: 'Tagliere di salumi e gnocco fritto', price: 13, img: IMG.antip, desc: 'Salumi emiliani tagliati al momento, serviti con gnocco fritto croccante.', allergens: ['Glutine'] }
  ]},
  primi: { label: 'Primi Piatti', items: [
    { name: 'Cappelletti in brodo', price: 12, img: IMG.pasta, desc: 'Pasta fresca ripiena in un ricco brodo di carne, come vuole la tradizione.', allergens: ['Glutine', 'Uova', 'Latte', 'Sedano'] },
    { name: 'Tortelli di erbetta', price: 11, img: IMG.pasta, desc: 'Ripieno di ricotta ed erbette, burro fuso e parmigiano.', allergens: ['Glutine', 'Uova', 'Latte'] },
    { name: 'Tagliatelle al ragù di cinghiale', price: 13, img: IMG.pasta, desc: 'Sfoglia tirata a mano con ragù di cinghiale cotto lentamente.', allergens: ['Glutine', 'Uova', 'Sedano', 'Solfiti'] }
  ]},
  secondi: { label: 'Secondi Piatti', items: [
    { name: 'Guancialino brasato C.B.T. con polenta', price: 17, img: IMG.carne, desc: 'Guancia di manzo cotta a bassa temperatura, brasata nel vino rosso e servita con polenta.', allergens: ['Sedano', 'Solfiti'] },
    { name: 'Tagliata di manzo', price: 18, img: IMG.carne, desc: 'Controfiletto alla griglia con rucola e scaglie di parmigiano.', allergens: ['Latte'] }
  ]},
  dolci: { label: 'Dolci', items: [
    { name: 'Tiramisù della casa', price: 6, img: IMG.dolce, desc: 'Savoiardi, caffè, crema al mascarpone e cacao amaro.', allergens: ['Glutine', 'Uova', 'Latte'] },
    { name: 'Panna cotta', price: 5.5, img: IMG.dolce, desc: 'Panna cotta cremosa con coulis ai frutti di bosco.', allergens: ['Latte'] }
  ]},
  pizze: { label: 'Pizze', items: [
    { name: 'Margherita', price: 6, img: IMG.pizza, desc: 'Pomodoro, fior di latte, basilico, olio extravergine.', allergens: ['Glutine', 'Latte'] },
    { name: 'Emiliana', price: 10, img: IMG.pizza2, desc: 'Mozzarella, crudo, scaglie di parmigiano e rucola.', allergens: ['Glutine', 'Latte'] },
    { name: 'Stracciapolpo', price: 14, img: IMG.pizza2, desc: 'Stracciatella fresca e polpo, la nostra pizza speciale di mare.', allergens: ['Glutine', 'Latte', 'Molluschi'] },
    { name: 'Conchiglia Arki', price: 13, img: IMG.pizza, desc: 'La specialità della casa a forma di conchiglia, ripiena e condita con ingredienti selezionati.', allergens: ['Glutine', 'Latte'] }
  ]}
};

(() => {
  const $ = (id) => document.getElementById(id);
  const modal = $('dishModal');
  const card = modal.querySelector('.modal-card');
  const photo = $('modalImg');
  const fmt = (n) => '€ ' + n.toFixed(n % 1 ? 2 : 0).replace('.', ',');

  /* Indice piatti: i listener sono registrati UNA sola volta (nessuna accumulazione) */
  const dishes = [];

  Object.entries(MENU).forEach(([key, cat]) => {
    const box = $('sec-' + key);
    const frag = document.createDocumentFragment();
    cat.items.forEach((d) => {
      const i = dishes.push({ ...d, category: cat.label }) - 1;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dish';
      btn.dataset.index = i;
      btn.innerHTML = '<div><h3></h3><p></p></div><span class="price"></span>';
      btn.querySelector('h3').textContent = d.name;
      btn.querySelector('p').textContent = d.desc;
      btn.querySelector('.price').textContent = fmt(d.price);
      frag.appendChild(btn);
    });
    box.appendChild(frag);
  });

  /* Gestione immagine: handler unici, nessun onerror riassegnato ad ogni apertura */
  photo.addEventListener('error', () => photo.classList.add('failed'));
  photo.addEventListener('load', () => photo.classList.remove('failed'));

  let lastFocus = null;

  function openModal(d) {
    lastFocus = document.activeElement;
    photo.classList.remove('failed');
    photo.alt = d.name;
    if (photo.getAttribute('src') !== d.img) photo.src = d.img;

    $('modalCategory').textContent = d.category;
    $('modalTitle').textContent = d.name;
    $('modalDescription').textContent = d.desc;
    $('modalPrice').textContent = fmt(d.price);

    const frag = document.createDocumentFragment();
    (d.allergens.length ? d.allergens : ['Nessun allergene dichiarato']).forEach((a) => {
      const s = document.createElement('span');
      s.className = 'chip' + (d.allergens.length ? '' : ' none');
      s.textContent = a;
      frag.appendChild(s);
    });
    $('modalAllergens').replaceChildren(frag);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    card.scrollTop = 0;
    card.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* Delegazione: un click ovunque sul box del piatto apre il modale */
  document.querySelector('main').addEventListener('click', (e) => {
    const btn = e.target.closest('.dish');
    if (btn) openModal(dishes[btn.dataset.index]);
  });

  $('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* Sfondo interattivo: alone morbido che segue il puntatore */
  const root = document.documentElement;
  window.addEventListener('pointermove', (e) => {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  /* Comparsa morbida delle sezioni */
  const secs = document.querySelectorAll('.menu-section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .08 });
    secs.forEach((s) => io.observe(s));
  } else secs.forEach((s) => s.classList.add('in'));

  $('year').textContent = new Date().getFullYear();
})();
