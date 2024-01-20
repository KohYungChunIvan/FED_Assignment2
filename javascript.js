// DONE BY: Koh Yung Chun Ivan, S10262491

var cards = document.querySelectorAll('.product-box');

[...cards].forEach((card)=>{
    card.addEventListener('mouseover', function(){
        card.classList.add('is-hover');
    })
    card.addEventListener('mouseleave', function(){
        card.classList.remove('is-hover');
    })
})

document.addEventListener("DOMContentLoaded", function() {
    var videoElement = document.querySelector('video');
    videoElement.playbackRate = 0.75;
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });
    }, { threshold: 0.25 }); // 0.25 means 25% of the item is in view
  
    observer.observe(videoElement);
});

document.addEventListener('DOMContentLoaded', function () {
  var cartPopup = document.querySelector('.cart-popup');
  var cartLink = document.querySelector('.open-cart'); // Make sure to assign the proper class

  cartLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior

      // Toggle the right property of the cart-popup
      var currentRight = parseInt(cartPopup.style.right) || 0;
      var newRight = (currentRight === 0) ? -500 : 0;
      cartPopup.style.right = newRight + 'px';
  });
});

// Function to toggle the visibility of the cart popup
function toggleCart() {
  const cartPopup = document.querySelector('.cart-popup');
  cartPopup.style.right = cartPopup.style.right === '0px' ? '-500px' : '0px';
}

// Function to add items to the cart
function addToCart(productName, productPrice, productImage) {
  const cartPopupContent = document.querySelector('.cart-popup-content');
  
  // Create a new cart item element
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');

  // Create a delete button for the cart item
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cart-delete-button');
  deleteButton.innerHTML = '&#10006;'; // Cross symbol
  deleteButton.addEventListener('click', function () {
    // Remove the cart item when the delete button is clicked
    cartPopupContent.removeChild(cartItem);
    updateCartItemCount()
    // Check if the cart is empty and show/hide the "Your Cart is Empty" message
    checkEmptyCart();
  });

  // Create an image element for the product
  const productImg = document.createElement('img');
  productImg.src = productImage;
  productImg.classList.add('cart-item-image'); // Add this class
  cartItem.appendChild(deleteButton); // Add the delete button before the image
  cartItem.appendChild(productImg);

  // Create a div for product details
  const productDetails = document.createElement('div');
  productDetails.classList.add('product-details');

  // Create a heading for the product name
  const productNameHeading = document.createElement('h6');
  productNameHeading.textContent = productName;

  // Create a span for the product price
  const productPriceSpan = document.createElement('span');
  productPriceSpan.textContent = `$${productPrice}`;

  

  productDetails.appendChild(productNameHeading);
  productDetails.appendChild(productPriceSpan);
  cartItem.appendChild(productDetails);

  // Add the cart item to the cart pop-up
  cartPopupContent.appendChild(cartItem);

  // Show the cart pop-up
  const cartPopup = document.querySelector('.cart-popup');
  cartPopup.style.right = '0px';

  // Check if the cart has items and hide the "Your Cart is Empty" message
  checkEmptyCart();
  updateCartItemCount();
  // Update the cart total
  updateCartTotal();
}

// Function to check if the cart is empty and show/hide the "Your Cart is Empty" message
function checkEmptyCart() {
  const cartPopupContent = document.querySelector('.cart-popup-content');
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  if (cartPopupContent.children.length === 0) {
    emptyCartMessage.style.display = 'block'; // Show the message if the cart is empty
  } else {
    emptyCartMessage.style.display = 'none'; // Hide the message if the cart has items
  }
}


function calculateTotalPrice() {
  const cartItems = document.querySelectorAll('.cart-item');
  let total = 0;

  cartItems.forEach((cartItem) => {
    const productPrice = parseFloat(cartItem.getAttribute('data-price'));
    total += productPrice;
  });

  return total;
}


// Function to update the cart total in the popup
function updateCartTotal() {
  const cartTotalElement = document.querySelector('.cart-total');
  const total = calculateTotalPrice();
  
  // Update the content of the total-amount span
  const totalAmountSpan = document.getElementById('total-amount');
  totalAmountSpan.textContent = total.toFixed(2);

  // Update the "Total" text (optional)
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to remove items from the cart
function removeFromCart(cartItem) {
  cartItem.remove();
  
  // Update the cart total
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();

  // Check if the cart is empty and show/hide the "Your Cart is Empty" message
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  const cartItems = document.querySelectorAll('.cart-item');
  if (cartItems.length === 0) {
    emptyCartMessage.style.display = 'block';
  } else {
    emptyCartMessage.style.display = 'none';
  }
}

function updateCartItemCount() {
  const cartItemCount = document.getElementById('cart-item-count');
  const cartItems = document.querySelectorAll('.cart-item');
  cartItemCount.textContent = cartItems.length;
}