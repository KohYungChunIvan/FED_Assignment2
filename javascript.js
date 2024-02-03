// DONE BY: Koh Yung Chun Ivan, S10262491

document.addEventListener('DOMContentLoaded', function() {
  var categoryLinks = document.querySelectorAll('.category a');
  categoryLinks.forEach(function(link) {
      var hoverImage = link.getAttribute('data-hover-image');
      link.onmouseover = function() {
          link.style.setProperty('--hover-image', 'url(' + hoverImage + ')');
      };
      link.onmouseout = function() {
          link.style.setProperty('--hover-image', 'none');
      };
  });
});

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
    // Load cart from local storage
    loadCartFromLocalStorage();

   
    
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
function showNotificationBanner(message) {
  var notificationBanner = document.getElementById('notification-banner');
  if (!notificationBanner) {
    // Create the banner if it does not exist
    notificationBanner = document.createElement('div');
    notificationBanner.id = 'notification-banner';
    notificationBanner.className = 'notification-banner';
    document.body.insertBefore(notificationBanner, document.body.firstChild); // Add it at the top of the body
  }
  
  // Set the message and make the banner visible
  notificationBanner.textContent = message;
  notificationBanner.style.display = 'block';
  notificationBanner.style.opacity = '1';
  
  // Use setTimeout to hide the banner after 3 seconds
  setTimeout(function() {
    notificationBanner.style.opacity = '0';
    // Set another timeout to hide the banner after the fade out transition
    setTimeout(function() {
      notificationBanner.style.display = 'none';
    }, 500); // This should match the transition time in the CSS
  }, 1200);
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
  

  // Show notification banner
  showNotificationBanner('Shop the latest trends and timeless classics all in one place.');

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

/*
function checkout() {
  //Checkout
  alert("Proceeding to checkout!");

  const cartItems = document.querySelectorAll('.cart-item');
  const checkoutButton = document.getElementById('checkout-button')
  // Remove all items from local storage
  localStorage.removeItem('cartData');
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

  const totalAmount = calculateTotalPrice();
  const pointsEarned = totalAmount;
  console.log('Points to be earned from checkout:', pointsEarned);
  // Make sure this logs the correct value
  updateUserPoints(pointsEarned).then(() => {
    // Code here will run after updateUserPoints has finished.
    // This is where you should read the updated points from local storage
    // and update the UI accordingly.
    displayUserPoints();
  });
  

  // Update the cart total, item count, and check if the cart is empty
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();
  toggleCart();


  
}
*/

// Revised checkout function
async function checkout() {
  alert("Proceeding to checkout!");
  const cartItems = document.querySelectorAll('.cart-item');
  const totalAmount = calculateTotalPrice();
  const pointsEarned = totalAmount;

  try {
    // Ensure this function completes successfully
    await updateUserPoints(pointsEarned);

    // Clearing the cart and local storage
    localStorage.removeItem('cartData');
    cartItems.forEach(cartItem => cartItem.remove());

    // UI updates
    document.getElementById('checkout-button').style.display = 'none';
    document.getElementById('total-amount').textContent = '0.00';
    document.querySelector('.cart-total').style.display = 'none';
    document.querySelector('.empty-cart-title').style.display = 'block';
    updateCartItemCount();
    updateCartTotal();
    toggleCart();
  } catch (error) {
    console.error('Error during checkout:', error);
    alert("There was an issue during the checkout process. Please try again.");
  }
}

// Revised updateUserPoints function
async function updateUserPoints(pointsEarned) {
  const APIKEY = "65bd08cc27d23b767e1eee0a";
  const loggedInUser = localStorage.getItem('loggedInUser');
  const loggedInEmail = localStorage.getItem('loggedInEmail');
  const loggedInPwd = localStorage.getItem('loggedInPwd');

  if (!loggedInUser) {
    console.error('User is not logged in.');
    return;
  }

  const queryURL = `https://fedassignment2-964a.restdb.io/rest/mori-user?q={"user-name": "${loggedInUser}"}`;

  try {
    const getUserResponse = await fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY
      }
    });

    const users = await getUserResponse.json();

    if (users.length > 0) {
      const user = users[0];
      const updatedPoints = (user.points || 0) + pointsEarned;
      const updateURL = `https://fedassignment2-964a.restdb.io/rest/mori-user/${user._id}`;
      let datajson = {
        "user-name": loggedInUser,
        "user-email": loggedInEmail,
        "user-pwd": loggedInPwd,
        "points": updatedPoints

      }
      const updateResponse = await fetch(updateURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY
        },
        body: JSON.stringify(datajson) // This should match your database field
      });
      if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

      const updatedUser = await updateResponse.json();
      console.log("Points updated:", updatedUser);

      // Ensure local storage is updated here
      localStorage.setItem('userPoints', updatedUser.points);
      displayUserPoints();
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    console.error('Error updating points:', error);
    // Handle errors appropriately
  }
}



function displayUserPoints() {
  const points = localStorage.getItem('userPoints');
  const pointsDisplayElement = document.getElementById('user-points');
  
  if (pointsDisplayElement && points) {
    pointsDisplayElement.textContent = `Your Points: ${points}`;
  } else {
    console.log('Points display element or points not found.');
  }
}

// Call this function on page load to display points
document.addEventListener("DOMContentLoaded", function () {
  displayUserPoints();
});


// API
document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65bd08cc27d23b767e1eee0a";
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
              "points": 0 // Explicitly set to 0 for new users
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

          fetch("https://fedassignment2-964a.restdb.io/rest/mori-user", settings)
              .then(response => response.json())
              .then(data => {
                  console.log(data);
                  // Check if points exist in response
                  const points = data.points !== undefined ? data.points : 0;
                  localStorage.setItem("loggedInUser", userName);
                  localStorage.setItem("loggedInEmail", userEmail);
                  localStorage.setItem("loggedInPwd", userPwd);
                  localStorage.setItem("userPoints", points); // Set to 0 if undefined
                  updateUserDisplay(userName);
                  displayUserPoints(points); // Display the points
                  document.getElementById("add-contact-form").reset();
                  window.location.href = 'index.html';
              })
              .catch(error => {
                  console.error('Error creating account:', error);
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

      let queryURL = `https://fedassignment2-964a.restdb.io/rest/mori-user?q={"user-email": "${loginEmail}", "user-pwd": "${loginPassword}"}`;

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
        if (data.length > 0) {
          const user = data[0];
          localStorage.setItem("loggedInUser", user["user-name"]);
          localStorage.setItem("loggedInEmail", user["user-email"]);
          localStorage.setItem("loggedInPwd", user["user-pwd"]);
          // Assume the server sends back the points in the response
          localStorage.setItem("userPoints", user.points); 
          updateUserDisplay(user["user-name"]);
          // Update the points display with the retrieved points
          displayUserPoints(user.points);
          document.getElementById("login-contact-form").reset();
          window.location.href = 'index.html';
        } else {
          alert("No user found with these credentials.");
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
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
    // Clear all user-specific information from localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('loggedInPwd');
    localStorage.removeItem('userPoints'); // Make sure to remove the points
    
    // Update UI to reflect the user is logged out
    updateUserDisplay(null); // Reset the user display
    displayUserPoints(); // Reset the points display
    adjustCartCountPosition(); // Adjust the cart count position if necessary
    
    // Optionally, reload the page to ensure all user data is cleared from the UI
    window.location.reload();
  }


  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout); // Just pass the function reference here
  }

  // Check if user is logged in when the page loads
  const loggedInUser = localStorage.getItem('loggedInUser');
  updateUserDisplay(loggedInUser); // This will set the correct UI state on page load

});

async function redeem(points) {
  alert("Proceeding to redeem!");
  const pointsDeducted = points;
  console.log(pointsDeducted);
  try {
    // Ensure this function completes successfully
    await deductUserPoints(pointsDeducted);
  } catch (error) {
    console.error('Error during redeem:', error);
    alert("There was an issue during the redeeming process. Please try again.");
  }
}

// Revised updateUserPoints function
async function deductUserPoints(pointsDeducted) {
  const APIKEY = "65bd08cc27d23b767e1eee0a";
  const loggedInUser = localStorage.getItem('loggedInUser');
  const loggedInEmail = localStorage.getItem('loggedInEmail');
  const loggedInPwd = localStorage.getItem('loggedInPwd');

  if (!loggedInUser) {
    console.error('User is not logged in.');
    return;
  }
  const queryURL = `https://fedassignment2-964a.restdb.io/rest/mori-user?q={"user-name": "${loggedInUser}"}`;

  try {
    const getUserResponse = await fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY
      }
    });

    const users = await getUserResponse.json();

    if (users.length > 0) {
      const user = users[0];
      let originalPoints = (user.points || 0);
      let updatedPoints = originalPoints - pointsDeducted;
      if(updatedPoints >= 0){
        
      
      const updateURL = `https://fedassignment2-964a.restdb.io/rest/mori-user/${user._id}`;
      let deductdatajson = {
        "user-name": loggedInUser,
        "user-email": loggedInEmail,
        "user-pwd": loggedInPwd,
        "points": updatedPoints

      }
      const updateResponse = await fetch(updateURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY
        },
        body: JSON.stringify(deductdatajson) // This should match your database field
      });
      if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

      const updatedUser = await updateResponse.json();
      console.log("Points updated:", updatedUser);

      // Ensure local storage is updated here
      localStorage.setItem('userPoints', updatedUser.points);
      displayUserPoints();
      alert('Success!')
      }
      if(updatedPoints < 0){
        updatedPoints = originalPoints;
        alert('Not enough points to redeem.')
      }
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    console.error('Error updating points:', error);
    // Handle errors appropriately
  }
}

function redeemAndAddToCart(points, itemName, itemId, imagePath){
  const Pts = localStorage.getItem('userPoints');
  console.log(Pts);
  redeem(points);
  if (Pts >= points){
    addToCart(itemName, itemId, imagePath);
  }
}



// Attempt to deduct points and play the game
async function playGame(gameUrl, entryFee) {
  const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');

  if (currentPoints < entryFee) {
    alert('Not enough points to play the game. You need at least ' + entryFee + ' points.');
    return; // Exit if not enough points
  }

  // Attempt to deduct points
  await deductUserPoints(entryFee);

  // Re-check the points after deduction attempt
  const updatedPoints = parseInt(localStorage.getItem('userPoints') || '0');
  
  if (updatedPoints < currentPoints) { // Assuming points were successfully deducted
    alert(`Points have been deducted. You now have ${updatedPoints} points.`);
    window.location.href = gameUrl; // Redirect to the game URL
  } else {
    // Handle case where points might not have been deducted
    alert("There was an issue starting the game. Please try again.");
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const gameButtons = document.querySelectorAll('.game-btn a');
  gameButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const gameUrl = this.getAttribute('href');
      const entryFee = 200; // Adjust as necessary for each game
      playGame(gameUrl, entryFee);
    });
  });
});

