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
  // Add the data-price attribute to the cart item
  cartItem.setAttribute('data-price', productPrice);

  // Create a delete button for the cart item
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cart-delete-button');
  deleteButton.innerHTML = '&#10006;'; // Cross symbol
  deleteButton.addEventListener('click', function () {
    const productPrice = parseFloat(cartItem.getAttribute('data-price'));
    // Remove the cart item when the delete button is clicked
    cartPopupContent.removeChild(cartItem);

    // Update the cart total by deducting the price of the deleted item
    const currentTotal = calculateTotalPrice();
    const newTotal = Math.max(0, currentTotal - productPrice); // Ensure the total doesn't go below 0
    updateCartTotal(newTotal);
    updateCartItemCount()
    updateCheckoutButtonVisibility()
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
  updateCheckoutButtonVisibility();
  saveCartToLocalStorage();
}
// Function to save cart data to local storage
function saveCartToLocalStorage() {
  const cartItems = document.querySelectorAll('.cart-item');
  const cartData = [];

  cartItems.forEach((cartItem) => {
    const itemName = cartItem.querySelector('.product-details h6').textContent;
    const itemPrice = parseFloat(cartItem.getAttribute('data-price'));
    const itemImage = cartItem.querySelector('.cart-item-image').src;

    const item = {
      name: itemName,
      price: itemPrice,
      image: itemImage,
    };

    cartData.push(item);
  });

  // Save cart data to local storage
  localStorage.setItem('cartData', JSON.stringify(cartData));
}
// Function to load cart data from local storage
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem('cartData');
  if (cartData) {
    const parsedCartData = JSON.parse(cartData);

    // Clear existing cart items
    const cartPopupContent = document.querySelector('.cart-popup-content');
    cartPopupContent.innerHTML = '';

    // Add each item from local storage to the cart
    parsedCartData.forEach((item) => {
      addToCart(item.name, item.price, item.image);
    });

    // Update cart total and item count
    updateCartTotal();
    updateCartItemCount();
  }
}

// Call loadCartFromLocalStorage on page load
window.addEventListener('load', loadCartFromLocalStorage);
// Call saveCartToLocalStorage when removing items from the cart
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('cart-delete-button')) {
    removeFromCart(event.target.closest('.cart-item'));
  }
});
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

  // Show or hide the cart-total based on the total value
  cartTotalElement.style.display = total > 0 ? 'block' : 'none';

  // Update the "Total" text (optional)
  //cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to remove items from the cart
function removeFromCart(cartItem) {
  cartItem.remove();
  
  // Save updated cart data to local storage
  saveCartToLocalStorage();
  
  // Update the cart total
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();
  updateCheckoutButtonVisibility()

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
function updateCheckoutButtonVisibility() {
  const checkoutButton = document.getElementById('checkout-button');
  const cartItems = document.querySelectorAll('.cart-item');
  
  // If there are items in the cart, show the checkout button; otherwise, hide it
  checkoutButton.style.display = cartItems.length > 0 ? 'block' : 'none';
}
function checkout() {
  //Checkout
  alert("Proceeding to checkout!");

  const cartItems = document.querySelectorAll('.cart-item');
  const checkoutButton = document.getElementById('checkout-button')
  // Remove each cart item
  cartItems.forEach((cartItem) => {
    cartItem.remove();
  });
  // Close the checkout button
  checkoutButton.style.display = 'none';
  // Reset the cart total to 0
  const totalAmountSpan = document.getElementById('total-amount');
  totalAmountSpan.textContent = '0.00';

  // Hide the cart total
  const cartTotalElement = document.querySelector('.cart-total');
  cartTotalElement.style.display = 'none';

  // Check if the cart is empty and show/hide the "Your Cart is Empty" message
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  if (cartItems.length === 0) {
    emptyCartMessage.style.display = 'block';
  } else {
    emptyCartMessage.style.display = 'none';
  }

  // Update the cart total, item count, and check if the cart is empty
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();
  toggleCart();
}


document.addEventListener('DOMContentLoaded', function () {
  let wheel = document.querySelector('.wheel');
  let spinBtn = document.querySelector('.spinBtn');
  let deg = 0;
  let isSpinning = false; // A flag to determine if the wheel is spinning
  const maxPrizes = 8; // The number of segments on the wheel

  spinBtn.onclick = function () {
    if (!isSpinning) { // Check if the wheel is already spinning
      isSpinning = true; // Set the flag to true to indicate spinning has started
      deg += Math.floor(500 + Math.random() * 3100); // Ensures a full rotation
      wheel.style.transition = 'transform 4s ease-out';
      wheel.style.transform = `rotate(${deg}deg)`;

      setTimeout(function () {
        const singleSlice = 360 / maxPrizes; // degrees for each segment
        const offset = singleSlice / 2; // offset to point to the middle of a segment
        const degreeNormalized = (deg % 360 + offset) % 360;
        let prizeIndex = Math.ceil((360 - degreeNormalized) / singleSlice) + 1;
      
        // The index should not exceed maxPrizes, if it does, reset to 1 (the first prize)
        if (prizeIndex > maxPrizes) {
          prizeIndex = 1;
        }
      
        // Get the selected prize amount based on the index
        const prizeAmount = wheel.querySelector(`.number:nth-child(${prizeIndex}) span`).textContent;
      
        // Show an alert with the selected prize
        alert(`Congratulations! You won: ${prizeAmount}`);
      
        isSpinning = false; // Reset the flag to allow spinning again
      }, 4000);
    }
  };
});






document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65ab507be8b7cb2cc9ce52f9";
  adjustCartCountPosition();
  // Check if the sign-up form exists on the current page
  const signUpButton = document.getElementById("contact-submit");
  if (signUpButton) {
      signUpButton.addEventListener("click", function (e) {
          e.preventDefault();

          let userName = document.getElementById("user-name").value;
          let userEmail = document.getElementById("user-email").value;
          let userPwd = document.getElementById("user-pwd").value;
          
          let jsondata = {
              "user-name": userName,
              "user-email": userEmail,
              "user-pwd": userPwd,
          };

          let settings = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "x-apikey": APIKEY,
                  "Cache-Control": "no-cache"
              },
              body: JSON.stringify(jsondata)
          };

          fetch("https://fedassignment2-7f7e.restdb.io/rest/mori-user", settings)
              .then(response => response.json())
              .then(data => {
                  console.log(data);
                  // Store user information in localStorage
                  localStorage.setItem('loggedInUser', userName);
                  // Update UI to reflect logged-in user
                  updateUserDisplay(userName);
                  document.getElementById("add-contact-form").reset();
                  document.getElementById("contact-submit").disabled = false;
                  // Redirect to homepage after successful signup
                  window.location.href = 'index.html';
              });
      });
  }

  // Check if the login form exists on the current page
  const loginButton = document.getElementById("login-submit");

  if (loginButton) {
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();
  
      let loginEmail = document.getElementById("user-email").value.trim();
      let loginPassword = document.getElementById("user-pwd").value.trim();
  
      if (!loginEmail || !loginPassword) {
        alert("Please enter both email and password.");
        return;
      }
  
      // Construct the query URL with the email and password
      let queryURL = `https://fedassignment2-7f7e.restdb.io/rest/mori-user?q={"user-email": "${loginEmail}", "user-pwd": "${loginPassword}"}`;
  
      fetch(queryURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY,
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed. Please check your credentials.");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the response is an array of users
        if (data.length > 0) {
          // User found, proceed with login
          const loggedInUserName = data[0]["user-name"]; // Take the first user's name
          localStorage.setItem("loggedInUser", loggedInUserName);
          updateUserDisplay(loggedInUserName);
          document.getElementById("login-contact-form").reset();
          // Redirect to homepage after successful login
          window.location.href = 'index.html';
        } else {
          // No user found, handle accordingly
          alert("No user found with these credentials.");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
    });
  }

  function adjustCartCountPosition() {
    const cartItemCount = document.getElementById('cart-item-count');
    if (!cartItemCount) return; // Exit if cart item count doesn't exist

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // User is logged in, adjust the position of the cart count
        cartItemCount.classList.add('user-logged-in');
    } else {
        // User is not logged in, set the position back to default
        cartItemCount.classList.remove('user-logged-in');
    }
  }
  

  function updateUserDisplay(userName) {
    const userDisplayElement = document.getElementById('user-display');
    const loginButton = document.getElementById('login-button');
    const signUpButton = document.getElementById('signup-button');
    const cartItemCount = document.getElementById('cart-item-count');
    const logoutDropdown = document.querySelector('.dropdown'); // Make sure this selector matches your dropdown


    if (!userName) {
      userDisplayElement.style.display = 'none';
      loginButton.style.display = 'block';
      signUpButton.style.display = 'block';
      cartItemCount.classList.remove('user-logged-in');
      logoutDropdown.style.display = 'none'; // Hide the logout dropdown
    } else {
      userDisplayElement.textContent = `Welcome, ${userName}`;
      userDisplayElement.style.display = 'block';
      loginButton.style.display = 'none';
      signUpButton.style.display = 'none';
      cartItemCount.classList.add('user-logged-in');
      logoutDropdown.style.display = 'block'; // Show the logout dropdown
    }
  }

  function handleLogout() {
    localStorage.removeItem('loggedInUser');
    updateUserDisplay(null);
    adjustCartCountPosition();
    window.location.reload(); // Refresh the page to update UI
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      localStorage.removeItem('loggedInUser');
      updateUserDisplay(null);
      // No need to call adjustCartCountPosition or location.reload here
      // since updateUserDisplay handles the UI update
    });
  }

  // Check if user is logged in when the page loads
  const loggedInUser = localStorage.getItem('loggedInUser');
  updateUserDisplay(loggedInUser); // This will set the correct UI state on page load

});

 