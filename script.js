const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const clouseModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("car-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})
// fechar modal com botao fechar
clouseModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// pegar nome e valor do produto clicado
menu.addEventListener("click", function(event){
    
    let parentbutton = event.target.closest(".add-to-cart-btn")
    
    if(parentbutton){
        const name = parentbutton.getAttribute("data-name")
        const price = parentbutton.getAttribute("data-praice")

        addTocart(name, price)

    }
    
})

//adicinar no carrinho
function addTocart(name, price){
    const existingItem = cart.find(item => item.name ===  name)
    if (existingItem){
        //se o intem ja esxite almenta a  quantidade 
        existingItem.quantity +=1;
    }else{

    cart.push({
        name,
        price,
        quantity: 1,
    })
    }
    updateCartModal()
}


//atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div calss="flex items-center, justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price}</p>
                </div>
               
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;

}

//funçao para remover items do carrinho 
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

//pegar valor do endereço 

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if (inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
        
    }

})
//finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops loja esta fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value ===""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    
    //Enviar o pedido para api wahts
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade:(${item.quantity}) preço: R$${item.price}}`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone = "5566996070709"


    window.open(`https://wa.me/${phone}?text=${message} endereço: ${addressInput.value}`, "_blank")
    cart = [];
    updateCartModal();

    })

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const aber = hora >= 6 && hora < 22;
    return aber

}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

