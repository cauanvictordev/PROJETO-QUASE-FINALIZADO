// ===========================
// Seletores Principais
// ===========================
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeModalBtn = document.getElementById("close-modal-btn");
const menu = document.querySelector(".menu");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const checkoutBtn = document.getElementById("checkout-btn");
const customerNameInput = document.getElementById("customer-name");
const paymentProofInput = document.getElementById("payment-proof");
const paymentInfo = document.getElementById("payment-info");
const pixInfo = document.getElementById("pix-info");
const copyPixBtn = document.getElementById("copy-pix-btn");
const pixKey = document.getElementById("pix-key");

let cart = [];

// ===========================
// Exibição do Modal do Carrinho
// ===========================
cartBtn.addEventListener("click", () => {
  cartModal.classList.add("active");
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
  cartModal.style.display = "none";
});

// ===========================
// Adicionar Item ao Carrinho
// ===========================
menu.addEventListener("click", (event) => {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    const imageSrc = parentButton.querySelector("img")?.getAttribute("src") || "default-image.png";
    addToCart(name, price, imageSrc);
  }
});

const orderNoteInput = document.getElementById("order-note");

function addToCart(name, price, imageSrc) {
    const note = orderNoteInput.value.trim(); // Captura a observação
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
            imageSrc,
            note, // Adiciona a observação ao item
        });
    }

    function updateCartModal() {
      // Limpa o conteúdo atual do carrinho
      cartItemsContainer.innerHTML = "";
    
      // Itera sobre os itens do carrinho e cria os elementos para exibição
      cart.forEach((item, index) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
    
        // Adiciona os detalhes do item ao HTML
        cartItemElement.innerHTML = `
          <p><strong>${item.name}</strong> (${item.size})</p>
          <p>Sabores: ${item.flavors.join(", ")}</p>
          <p><strong>Massa:</strong> ${item.massa || "Não selecionada"}</p>
          <p><strong>Borda:</strong> ${item.borda || "Não selecionada"}</p>
          <p><strong>Refrigerante:</strong> ${item.refrigerante || "Não selecionado"}</p>
          <p>Observação: ${item.note || "Sem observação"}</p>
          <p><strong>Preço:</strong> R$ ${item.price}</p>
          <button class="remove-item-btn" data-index="${index}">Remover</button>
        `;
    
        // Adiciona o item ao container do carrinho
        cartItemsContainer.appendChild(cartItemElement);
      });
    
      // Atualiza o total do carrinho
      updateCartTotal();
    }
    
}

// ===========================
// Atualização do Modal do Carrinho
// ===========================
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
      <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <p><strong>Produto:</strong> ${item.name}</p>
        <p><strong>Quantidade:</strong> ${item.quantity}</p>
        <p><strong>Preço:</strong> R$ ${(item.price * item.quantity).toFixed(2)}</p>
        ${item.note ? `<p><strong>Observação:</strong> ${item.note}</p>` : ""}
      </div>
      <button class="remove-from-cart-btn" data-index="${index}">
        <i class="fas fa-trash-alt"></i> Remover
      </button>`;
    cartItemsContainer.appendChild(cartItemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  updateCartCount();
}

// ===========================
// Remover Item do Carrinho
// ===========================
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.closest(".remove-from-cart-btn")) {
    const index = parseInt(event.target.closest(".remove-from-cart-btn").getAttribute("data-index"));
    cart.splice(index, 1);
    updateCartModal();
  }
});

// ===========================
// Finalizar Compra
// ===========================
checkoutBtn.addEventListener("click", () => {
  const name = customerNameInput.value.trim();
  const address = addressInput.value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  const total = cartTotal.textContent;

  if (!name || !address || !paymentMethod) {
    alert("Por favor, preencha todas as informações.");
    return;
  }

  const cartItems = cart.map((item) => `${item.name} - Quantidade: ${item.quantity} - Preço: R$ ${(item.price * item.quantity).toFixed(2)}`).join("\n");

  let message = `Olá, segue o pedido:\n\nNome: ${name}\nEndereço: ${address}\nForma de Pagamento: ${paymentMethod}\nTotal: ${total}\n\nProdutos:\n${cartItems}`;

  if (paymentMethod === "PIX") {
    alert("Você selecionou PIX como forma de pagamento. Por favor, envie o comprovante manualmente na conversa do WhatsApp após abrir o link.");
    message += "\nPor favor, envie o comprovante de pagamento nesta conversa.";
  }

  window.open(`https://wa.me/67996123728?text=${encodeURIComponent(message)}`, "_blank");
  cart = [];
  addressInput.value = "";
  customerNameInput.value = "";
  updateCartModal();
});

// ===========================
// Atualizar Contador do Carrinho
// ===========================
function updateCartCount() {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// ===========================
// Forma de Pagamento - PIX
// ===========================
copyPixBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(pixKey.textContent).then(() => {
    alert("Chave Pix copiada para a área de transferência!");
  }).catch(() => {
    alert("Falha ao copiar a chave Pix. Por favor, copie manualmente.");
  });
});

document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", handlePaymentMethodChange);
});

function handlePaymentMethodChange() {
  document.querySelector('input[name="payment"]:checked').value === "pix" ? pixInfo.classList.remove("hidden") : pixInfo.classList.add("hidden");
}

// ===========================
// Funções de Notificação
// ===========================
function notifyPendingCart() {
  if (cart.length > 0) {
    alert("Você tem itens no carrinho! Não esqueça de finalizar sua compra.");
  }
}

function startCartNotification() {
  setInterval(() => {
    if (cart.length > 0 && !document.body.classList.contains("checkout-in-progress")) {
      notifyPendingCart();
    }
  }, 60000);
}

checkoutBtn.addEventListener("click", () => {
  document.body.classList.add("checkout-in-progress");
  setTimeout(() => document.body.classList.remove("checkout-in-progress"), 300000);
});

// ===========================
// Inicializar ao Carregar Página
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  startCartNotification();
});

// ===========================
// CUSTOM POPUP
// ===========================
let selectedPizza = null; // Pizza selecionada
let basePrice = 0; // Preço base

// Elementos do popup
const popup = document.getElementById('customPopup');
const popupTitle = document.querySelector('.custom-popup-title');
const popupCloseBtn = document.getElementById('closePopup');
const popupAddBtn = document.getElementById('addToCartBtn');
const flavorCheckboxes = document.querySelectorAll('input[name="flavor"]');
const maxFlavorsDisplay = document.getElementById('maxFlavors');

// Tabela de preços base por tamanho
const sizePrices = {
  small: 20.0,
  medium: 30.0,
  large: 40.0,
};

document.querySelectorAll('input[name="size"]').forEach(input => {
  input.addEventListener('change', () => {
    const selectedPrice = parseFloat(input.dataset.price).toFixed(2);
    document.getElementById('selectedPrice').textContent = `R$ ${selectedPrice.replace('.', ',')}`;
  });
});

// Funções de controle
function updateMaxFlavors() {
  const selectedSize = document.querySelector('input[name="size"]:checked');
  const maxFlavors = parseInt(selectedSize?.dataset.maxFlavors || 2);
  const selectedFlavors = Array.from(flavorCheckboxes).filter(cb => cb.checked);

  maxFlavorsDisplay.textContent = maxFlavors;

  flavorCheckboxes.forEach(cb => {
    cb.disabled = !cb.checked && selectedFlavors.length >= maxFlavors;
  });
}

function toggleAddButton() {
  const sizeSelected = !!document.querySelector('input[name="size"]:checked');
  const flavorsSelected = Array.from(flavorCheckboxes).some(cb => cb.checked);
  popupAddBtn.disabled = !(sizeSelected && flavorsSelected);
}

function openCustomPopup(name) {
  selectedPizza = name;
  popupTitle.textContent = `Personalize sua ${name}`;
  popup.style.display = 'flex';

  flavorCheckboxes.forEach(cb => (cb.checked = false));
  document.querySelectorAll('input[name="size"]').forEach(input => (input.checked = false));

  updateMaxFlavors();
  toggleAddButton();
}

// Adicionar um item ao carrinho ao clicar no botão "Adicionar ao Carrinho"
popupAddBtn.addEventListener("click", () => {
  // 1. Captura o tamanho selecionado no popup (ex.: Pequena, Média, Grande)
  const selectedSize = document.querySelector('input[name="size"]:checked').value;

  // 2. Captura os sabores selecionados no popup
  const selectedFlavors = Array.from(flavorCheckboxes) // Pega todos os checkboxes de sabores
    .filter(cb => cb.checked) // Filtra apenas os selecionados
    .map(cb => cb.value); // Extrai os valores dos sabores selecionados

  // 3. Captura a massa escolhida no popup (ex.: Massa Fina, Massa Média)
  const selectedMassa = document.querySelector('input[name="massa"]:checked')?.value || "Sem massa selecionada";

  // 4. Captura a borda escolhida no popup (ex.: Catupiry, Cheddar)
  const selectedBorda = document.querySelector('input[name="borda"]:checked')?.value || "Sem borda";

  // 5. Captura o refrigerante escolhido no popup (ex.: Pepsi, Fanta)
  const selectedRefrigerante = document.querySelector('input[name="refrigerante"]:checked')?.value || "Sem refrigerante";

  // 6. Captura a observação inserida pelo usuário (campo opcional)
  const observacao = document.getElementById("observacao").value.trim();

  // 7. Calcula o preço final com base no tamanho selecionado
  const finalPrice = parseFloat(sizePrices[selectedSize]).toFixed(2);

  // 8. Adiciona todas as informações ao carrinho
  cart.push({
    name: selectedPizza, // Nome do produto personalizado (ex.: "Pizza")
    size: selectedSize, // Tamanho escolhido
    flavors: selectedFlavors, // Sabores escolhidos
    massa: selectedMassa, // Massa escolhida
    borda: selectedBorda, // Borda escolhida
    refrigerante: selectedRefrigerante, // Refrigerante escolhido
    note: observacao, // Observação do usuário
    price: finalPrice, // Preço calculado
    quantity: 1, // Quantidade padrão (1 para itens personalizados)
  });

  // 9. Exibe o carrinho atualizado no console para depuração
  console.log("Carrinho:", cart);

  // 10. Atualiza a interface do carrinho na tela
  updateCartModal();

  // 11. Fecha o popup após adicionar o item ao carrinho
  popup.style.display = "none";
});


flavorCheckboxes.forEach(cb => cb.addEventListener('change', () => {
  updateMaxFlavors();
  toggleAddButton();
}));

document.querySelectorAll('input[name="size"]').forEach(input => input.addEventListener('change', () => {
  updateMaxFlavors();
  toggleAddButton();
}));

// Atualização do Carrinho
function updateCartUI() {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';

  cart.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <p><strong>${item.name}</strong> (${item.size})</p>
      <p>Sabores: ${item.flavors.join(', ')}</p>
      <p>Preço: R$ ${item.price}</p>
    `;
    cartContainer.appendChild(itemElement);
  });

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
  document.getElementById('cart-count').innerText = cart.length;
}




document.getElementById('closePopup').addEventListener('click', function () {
  const popup = document.getElementById('customPopup');
  popup.classList.add('hidden');
  setTimeout(() => popup.style.display = 'none', 300); // Aguarda a animação antes de esconder
});





















// ===========================
// <!-- CARROSSEL -->
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const carouselImages = document.querySelector(".carousel-images");
  const images = document.querySelectorAll(".carousel-image");

  let currentIndex = 0;

  const updateCarousel = () => {
      const offset = -currentIndex * 100; // Move para a próxima imagem (100% por imagem)
      carouselImages.style.transform = `translateX(${offset}%)`; // Corrigido: use crase (`) para template string
  };

  prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length; // Vai para a imagem anterior
      updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length; // Vai para a próxima imagem
      updateCarousel();
  });

  // Inicializa o carrossel
  updateCarousel();
});
