// DONE BY: Koh Yung Chun Ivan, S10262491


// Hide loading screen after 3 seconds
setTimeout(function () {
  document.getElementById('loading-screen').style.display = 'none';
}, 1500);

// Wait for the page to fully load
window.addEventListener('load', function() {
  // Show the content
  document.getElementById("content").style.display = 'block';
  // Pause the loading animation
  document.getElementById("loading-screen").pause();
});

// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function() {
  // Get all anchor elements inside elements with the class 'category'
  var categoryLinks = document.querySelectorAll('.category a');

  // Iterate over each anchor element
  categoryLinks.forEach(function(link) {
    // Get the value of the 'data-hover-image' attribute from the current anchor
    var hoverImage = link.getAttribute('data-hover-image');

    // Add a mouseover event listener to the current anchor
    link.onmouseover = function() {
      // Set a CSS custom property '--hover-image' to change the background image
      link.style.setProperty('--hover-image', 'url(' + hoverImage + ')');
    };

    // Add a mouseout event listener to the current anchor
    link.onmouseout = function() {
      // Reset the '--hover-image' CSS custom property to 'none'
      link.style.setProperty('--hover-image', 'none');
    };
  });
});

// Select all elements with the class 'product-box' and store them in the 'cards' variable
var cards = document.querySelectorAll('.product-box');


// Convert the 'cards' NodeList into an array and iterate through each card
[...cards].forEach((card) => {
  // Add a mouseover event listener to each card
  card.addEventListener('mouseover', function() {
      // Add the class 'is-hover' to the card when hovered over
      card.classList.add('is-hover');
  });

  // Add a mouseleave event listener to each card
  card.addEventListener('mouseleave', function() {
      // Remove the class 'is-hover' from the card when mouse leaves
      card.classList.remove('is-hover');
  });
});


// Execute the following code when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Select the first 'video' element in the document
  var videoElement = document.querySelector('video');

  // Set the playback rate of the video to 0.75 (75% of the normal speed)
  videoElement.playbackRate = 0.75;

  // Create an IntersectionObserver to check if the video element is in the viewport
  var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          // If the video element is 25% or more in view, play the video
          if (entry.isIntersecting) {
              videoElement.play();
          } else {
              // Pause the video when it's less than 25% in view
              videoElement.pause();
          }
      });
  }, { threshold: 0.25 }); // The threshold defines when to trigger the intersection callback

  // Observe the video element for intersection changes
  observer.observe(videoElement);

  // Load cart data from local storage (assuming 'loadCartFromLocalStorage' is defined elsewhere)
  loadCartFromLocalStorage();
});


// Execute the following code when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Select the cart popup element with the class 'cart-popup'
  var cartPopup = document.querySelector('.cart-popup');
  
  // Select the cart link element with the class 'open-cart'
  var cartLink = document.querySelector('.open-cart'); // Make sure this class matches your HTML structure

  // Add a click event listener to the cart link
  cartLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior (e.g., navigating to a new page)

      // Get the current 'right' CSS property value of the cart-popup element, or default to 0 if it's not set
      var currentRight = parseInt(cartPopup.style.right) || 0;
      
      // Calculate the new 'right' property value based on the current state
      var newRight = (currentRight === 0) ? -500 : 0;

      // Set the 'right' property of the cart-popup element to the new value, sliding it in or out
      cartPopup.style.right = newRight + 'px';
  });
});

// Function to toggle the visibility of the cart popup
function toggleCart() {
  // Select the cart popup element with the class 'cart-popup'
  const cartPopup = document.querySelector('.cart-popup');

  // Check if the 'right' CSS property of the cart popup is currently '0px' (visible)
  if (cartPopup.style.right === '0px') {
    // If it's visible, set the 'right' property to '-500px' to hide it (slide it out to the right)
    cartPopup.style.right = '-500px';
  } else {
    // If it's hidden, set the 'right' property to '0px' to show it (slide it in from the right)
    cartPopup.style.right = '0px';
  }
}


// Function to show a notification banner with a message
function showNotificationBanner(message) {
  // Find the notification banner element by its ID
  var notificationBanner = document.getElementById('notification-banner');

  // Check if the notification banner element does not exist
  if (!notificationBanner) {
    // Create the banner if it does not exist
    notificationBanner = document.createElement('div');
    notificationBanner.id = 'notification-banner'; // Set the ID
    notificationBanner.className = 'notification-banner'; // Set the CSS class
    // Add the notification banner at the top of the body
    document.body.insertBefore(notificationBanner, document.body.firstChild);
  }
  
  // Set the message content to the provided message
  notificationBanner.textContent = message;

  // Make the banner visible by setting its display and opacity
  notificationBanner.style.display = 'block'; // Show the banner
  notificationBanner.style.opacity = '1'; // Fully visible
  
  // Use setTimeout to hide the banner after 3 seconds (3000 milliseconds)
  setTimeout(function() {
    // Fade out the banner by reducing its opacity to 0
    notificationBanner.style.opacity = '0';

    // Set another timeout to hide the banner after the fade-out transition completes
    setTimeout(function() {
      notificationBanner.style.display = 'none'; // Hide the banner
    }, 500); // This should match the transition time in the CSS (0.5 seconds)
  }, 1200); // Wait for 1200 milliseconds (1.2 seconds) before starting the fade-out
}


// Function to add items to the cart
function addToCart(productName, productPrice, productImage) {
  const cartPopupContent = document.querySelector('.cart-popup-content');
  
  // Create a new cart item element
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  // Add the data-price attribute to the cart item to store the product price
  cartItem.setAttribute('data-price', productPrice);

  // Create a delete button for the cart item
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cart-delete-button');
  deleteButton.innerHTML = '&#10006;'; // Cross symbol
  deleteButton.addEventListener('click', function () {
    // Get the product price from the data-price attribute of the cart item
    const productPrice = parseFloat(cartItem.getAttribute('data-price'));
    // Remove the cart item when the delete button is clicked
    cartPopupContent.removeChild(cartItem);

    // Update the cart total by deducting the price of the deleted item
    const currentTotal = calculateTotalPrice();
    const newTotal = Math.max(0, currentTotal - productPrice); // Ensure the total doesn't go below 0
    updateCartTotal(newTotal);

    // Update the cart item count
    updateCartItemCount();

    // Update the visibility of the checkout button
    updateCheckoutButtonVisibility();

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

  // Append product name and price to product details
  productDetails.appendChild(productNameHeading);
  productDetails.appendChild(productPriceSpan);
  cartItem.appendChild(productDetails);

  // Add the cart item to the cart pop-up content
  cartPopupContent.appendChild(cartItem);

  // Show a notification banner with a message
  showNotificationBanner('Shop the latest trends and timeless classics all in one place.');

  // Check if the cart has items and hide the "Your Cart is Empty" message
  checkEmptyCart();

  // Update the cart item count
  updateCartItemCount();

  // Update the cart total
  updateCartTotal();

  // Update the visibility of the checkout button
  updateCheckoutButtonVisibility();

  // Save the cart to local storage
  saveCartToLocalStorage();
}

// Function to save cart data to local storage
function saveCartToLocalStorage() {
  // Select all cart items in the DOM
  const cartItems = document.querySelectorAll('.cart-item');

  // Initialize an empty array to store cart data
  const cartData = [];

  // Iterate through each cart item in the DOM
  cartItems.forEach((cartItem) => {
    // Extract the product name from the cart item
    const itemName = cartItem.querySelector('.product-details h6').textContent;

    // Extract the product price from the 'data-price' attribute of the cart item
    const itemPrice = parseFloat(cartItem.getAttribute('data-price'));

    // Extract the product image URL from the cart item
    const itemImage = cartItem.querySelector('.cart-item-image').src;

    // Create an object representing the cart item with name, price, and image
    const item = {
      name: itemName,
      price: itemPrice,
      image: itemImage,
    };

    // Add the cart item object to the cartData array
    cartData.push(item);
  });

  // Save the cartData array to local storage as a JSON string
  localStorage.setItem('cartData', JSON.stringify(cartData));
}

// Function to load cart data from local storage
function loadCartFromLocalStorage() {
  // Retrieve cart data as a JSON string from local storage
  const cartData = localStorage.getItem('cartData');

  // Check if cartData exists in local storage
  if (cartData) {
    // Parse the JSON string into an array of cart items
    const parsedCartData = JSON.parse(cartData);

    // Clear the existing cart items from the cart popup
    const cartPopupContent = document.querySelector('.cart-popup-content');
    cartPopupContent.innerHTML = '';

    // Iterate through each item in the parsed cart data and add them to the cart
    parsedCartData.forEach((item) => {
      // Call the addToCart function to add each item to the cart popup
      // Pass the item's name, price, and image as arguments
      addToCart(item.name, item.price, item.image);
    });

    // After adding items from local storage, update the cart total and item count
    updateCartTotal();
    updateCartItemCount();
  }
}


// Call loadCartFromLocalStorage on page load to load any existing cart data from local storage
window.addEventListener('load', loadCartFromLocalStorage);

// Call removeFromCart and update local storage when removing items from the cart
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('cart-delete-button')) {
    removeFromCart(event.target.closest('.cart-item'));
    saveCartToLocalStorage(); // Save updated cart data to local storage
  }
});

// Function to check if the cart is empty and show/hide the "Your Cart is Empty" message
function checkEmptyCart() {
  // Select the cart popup content and the empty cart message elements
  const cartPopupContent = document.querySelector('.cart-popup-content');
  const emptyCartMessage = document.querySelector('.empty-cart-title');

  // Check if the cart popup content has no children (cart is empty)
  if (cartPopupContent.children.length === 0) {
    emptyCartMessage.style.display = 'block'; // Show the message if the cart is empty
  } else {
    emptyCartMessage.style.display = 'none'; // Hide the message if the cart has items
  }
}


// Function to calculate the total price of items in the cart
function calculateTotalPrice() {
  // Select all cart item elements
  const cartItems = document.querySelectorAll('.cart-item');
  let total = 0;

  // Loop through each cart item and sum up the prices
  cartItems.forEach((cartItem) => {
    const productPrice = parseFloat(cartItem.getAttribute('data-price'));
    total += productPrice;
  });

  return total; // Return the calculated total
}

// Function to update the cart total in the popup
function updateCartTotal() {
  // Select the cart total element and calculate the total price
  const cartTotalElement = document.querySelector('.cart-total');
  const total = calculateTotalPrice();

  // Select the total amount span element to display the total price
  const totalAmountSpan = document.getElementById('total-amount');
  totalAmountSpan.textContent = total.toFixed(2); // Display total with two decimal places

  // Show or hide the cart-total element based on the total value
  cartTotalElement.style.display = total > 0 ? 'block' : 'none';

  // You can update the "Total" text within the cart-total element if needed
  // cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to remove items from the cart
function removeFromCart(cartItem) {
  // Remove the specified cart item element from the DOM
  cartItem.remove();

  // Save the updated cart data to local storage
  saveCartToLocalStorage();

  // Update the cart total, item count, and cart empty message visibility
  updateCartTotal(); // Update the total price of items in the cart
  updateCartItemCount(); // Update the number of items in the cart
  checkEmptyCart(); // Check if the cart is empty and show/hide the "Your Cart is Empty" message
  updateCheckoutButtonVisibility(); // Update the visibility of the checkout button

  // Check if the cart is empty and show/hide the "Your Cart is Empty" message
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  const cartItems = document.querySelectorAll('.cart-item');
  if (cartItems.length === 0) {
    emptyCartMessage.style.display = 'block'; // Show the message if the cart is empty
  } else {
    emptyCartMessage.style.display = 'none'; // Hide the message if the cart has items
  }
}


// Function to update the cart item count in the cart icon
function updateCartItemCount() {
  // Get the cart item count element
  const cartItemCount = document.getElementById('cart-item-count');

  // Get all the cart item elements
  const cartItems = document.querySelectorAll('.cart-item');

  // Update the cart item count text to reflect the number of items in the cart
  cartItemCount.textContent = cartItems.length;
}

// Function to update the visibility of the checkout button
function updateCheckoutButtonVisibility() {
  // Get the checkout button element
  const checkoutButton = document.getElementById('checkout-button');

  // Get all the cart item elements
  const cartItems = document.querySelectorAll('.cart-item');

  // If there are items in the cart, show the checkout button; otherwise, hide it
  checkoutButton.style.display = cartItems.length > 0 ? 'block' : 'none';
}



// Revised checkout function
async function checkout() {
  // Display an alert to notify the user about proceeding to checkout
  alert("Proceeding to checkout!");

  // Get all the cart item elements
  const cartItems = document.querySelectorAll('.cart-item');

  // Calculate the total amount of the items in the cart
  const totalAmount = calculateTotalPrice();

  // Calculate points earned (assumed to be the same as the total amount)
  const pointsEarned = totalAmount;

  try {
    // Attempt to update user points asynchronously
    await updateUserPoints(pointsEarned);

    // Clear cart items and local storage
    localStorage.removeItem('cartData');
    cartItems.forEach(cartItem => cartItem.remove());

    // Update the UI to reflect a successful checkout
    document.getElementById('checkout-button').style.display = 'none';
    document.getElementById('total-amount').textContent = '0.00';
    document.querySelector('.cart-total').style.display = 'none';
    document.querySelector('.empty-cart-title').style.display = 'block';

    // Update the cart item count and total
    updateCartItemCount();
    updateCartTotal();

    // Close the cart popup
    toggleCart();
  } catch (error) {
    // Handle errors during the checkout process
    console.error('Error during checkout:', error);
    alert("There was an issue during the checkout process. Please try again.");
  }
}


// Revised updateUserPoints function
async function updateUserPoints(pointsEarned) {
  // Define your API key and other necessary variables
  const APIKEY = "65bd08cc27d23b767e1eee0a";
  const loggedInUser = localStorage.getItem('loggedInUser');
  const loggedInEmail = localStorage.getItem('loggedInEmail');
  const loggedInPwd = localStorage.getItem('loggedInPwd');

  // Check if a user is logged in, and if not, return with an error
  if (!loggedInUser) {
    console.error('User is not logged in.');
    return;
  }

  // Construct the URL for fetching user data based on the logged-in user's name
  const queryURL = `https://fedassignment2-964a.restdb.io/rest/mori-user?q={"user-name": "${loggedInUser}"}`;

  try {
    // Fetch the user data from the database
    const getUserResponse = await fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY
      }
    });

    // Parse the response into JSON
    const users = await getUserResponse.json();

    // Check if a user with the given name exists in the database
    if (users.length > 0) {
      const user = users[0];

      // Calculate the updated points by adding the earned points to the current points (default to 0)
      const updatedPoints = (user.points || 0) + pointsEarned;

      // Construct the URL for updating the user's data in the database
      const updateURL = `https://fedassignment2-964a.restdb.io/rest/mori-user/${user._id}`;

      // Create a JSON object with updated user data
      let datajson = {
        "user-name": loggedInUser,
        "user-email": loggedInEmail,
        "user-pwd": loggedInPwd,
        "points": updatedPoints
      };

      // Send a PUT request to update the user's data in the database
      const updateResponse = await fetch(updateURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY
        },
        body: JSON.stringify(datajson) // Ensure that this matches your database structure
      });

      // Check if the update request was successful
      if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

      // Parse the response into JSON, which should contain the updated user data
      const updatedUser = await updateResponse.json();
      console.log("Points updated:", updatedUser);

      // Update the user's points in local storage
      localStorage.setItem('userPoints', updatedUser.points);

      // Update the displayed user points on the UI
      displayUserPoints();
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    // Handle errors appropriately, such as logging and alerting the user
    console.error('Error updating points:', error);
  }
}


// Function to display user points on the UI
function displayUserPoints() {
  // Retrieve the user's points from local storage
  const points = localStorage.getItem('userPoints');
  
  // Get the HTML element where you want to display the points
  const pointsDisplayElement = document.getElementById('user-points');
  
  // Check if the points display element and points data are available
  if (pointsDisplayElement && points) {
    // Update the content of the element to show the user's points
    pointsDisplayElement.textContent = `Your Points: ${points}`;
  } else {
    // Log a message if the points display element or points data is not found
    console.log('Points display element or points not found.');
  }
}

// Call the displayUserPoints function on page load to show the user's points
document.addEventListener("DOMContentLoaded", function () {
  displayUserPoints();
});


// API
document.addEventListener("DOMContentLoaded", function () {
  // Define API key for making API requests
  const APIKEY = "65bd08cc27d23b767e1eee0a";

  // Check and adjust the position of the cart count based on the user's login status
  adjustCartCountPosition();

  // Check if the sign-up form exists on the current page
  const signUpButton = document.getElementById("contact-submit");
  if (signUpButton) {
    // Add a click event listener to the sign-up button
    signUpButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Retrieve user input values from the form
      let userName = document.getElementById("user-name").value;
      let userEmail = document.getElementById("user-email").value;
      let userPwd = document.getElementById("user-pwd").value;
      
      // Prepare JSON data for user registration
      let jsondata = {
        "user-name": userName,
        "user-email": userEmail,
        "user-pwd": userPwd,
        "points": 0 // Explicitly set to 0 for new users
      };

      // Configure settings for the POST request to create a new user
      let settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY,
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata)
      };

      // Send the registration request to the API
      fetch("https://fedassignment2-964a.restdb.io/rest/mori-user", settings)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Check if points exist in the response
          const points = data.points !== undefined ? data.points : 0;
          // Store user information in local storage
          localStorage.setItem("loggedInUser", userName);
          localStorage.setItem("loggedInEmail", userEmail);
          localStorage.setItem("loggedInPwd", userPwd);
          localStorage.setItem("userPoints", points); // Set to 0 if undefined
          // Update the user display and points display
          updateUserDisplay(userName);
          displayUserPoints(points); // Display the points
          document.getElementById("add-contact-form").reset();
          // Redirect to the index.html page
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
    // Add a click event listener to the login button
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Retrieve user login email and password
      let loginEmail = document.getElementById("user-email").value.trim();
      let loginPassword = document.getElementById("user-pwd").value.trim();

      // Validate input
      if (!loginEmail || !loginPassword) {
        alert("Please enter both email and password.");
        return;
      }

      // Construct the query URL for retrieving user data
      let queryURL = `https://fedassignment2-964a.restdb.io/rest/mori-user?q={"user-email": "${loginEmail}", "user-pwd": "${loginPassword}"}`;

      // Send a GET request to check user credentials
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
          // Store user information in local storage
          localStorage.setItem("loggedInUser", user["user-name"]);
          localStorage.setItem("loggedInEmail", user["user-email"]);
          localStorage.setItem("loggedInPwd", user["user-pwd"]);
          // Assume the server sends back the points in the response
          localStorage.setItem("userPoints", user.points); 
          // Update the user display and points display
          updateUserDisplay(user["user-name"]);
          displayUserPoints(user.points);
          document.getElementById("login-contact-form").reset();
          // Redirect to the index.html page
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

  // Function to adjust the position of the cart count based on user login status
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
  
  // Function to update the user display based on login status
  function updateUserDisplay(userName) {
    const userDisplayElement = document.getElementById('user-display');
    const loginButton = document.getElementById('login-button');
    const signUpButton = document.getElementById('signup-button');
    const cartItemCount = document.getElementById('cart-item-count');
    const logoutDropdown = document.querySelector('.dropdown'); // Make sure this selector matches your dropdown

    if (!userName) {
      // User is not logged in, hide user-related elements
      userDisplayElement.style.display = 'none';
      loginButton.style.display = 'block';
      signUpButton.style.display = 'block';
      cartItemCount.classList.remove('user-logged-in');
      logoutDropdown.style.display = 'none'; // Hide the logout dropdown
    } else {
      // User is logged in, display user-specific information
      userDisplayElement.textContent = `Welcome, ${userName}`;
      userDisplayElement.style.display = 'block';
      loginButton.style.display = 'none';
      signUpButton.style.display = 'none';
      cartItemCount.classList.add('user-logged-in');
      logoutDropdown.style.display = 'block'; // Show the logout dropdown
    }
  }

  // Function to handle user logout
  function handleLogout() {
    // Clear all user-specific information from localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('loggedInPwd');
    localStorage.removeItem('userPoints'); // Make sure to remove the points
    localStorage.removeItem('cartData'); // Clear the cart data

    // Clear the cart UI
    const cartPopupContent = document.querySelector('.cart-popup-content');
    if (cartPopupContent) {
      cartPopupContent.innerHTML = ''; // This will remove all cart item elements
    }

    // Update UI elements that depend on the cart items
    updateCartTotal();
    updateCartItemCount();
    checkEmptyCart();
    updateCheckoutButtonVisibility();
    
    // Update UI to reflect the user is logged out
    updateUserDisplay(null); // Reset the user display
    displayUserPoints(); // Reset the points display
    adjustCartCountPosition(); // Adjust the cart count position if necessary
    
    // Optionally, reload the page to ensure all user data is cleared from the UI
    window.location.reload();
  }

  // Attach the logout event listener
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout); // Just pass the function reference here
  }

  // Check if user is logged in when the page loads
  const loggedInUser = localStorage.getItem('loggedInUser');
  updateUserDisplay(loggedInUser); // Set the correct UI state on page load
});


// Function to redeem items with user points
async function redeem(points) {
  // Retrieve the currently logged-in user from local storage
  const loggedInUser = localStorage.getItem('loggedInUser');

  // Check if user is logged in
  if (!loggedInUser) {
    // Display an alert and redirect to the login page (or show login modal)
    alert('Please log in to redeem items.');
    window.location.href = 'login.html'; // Redirect to login page or pop up the login modal
    return; // Exit the function if the user is not logged in
  }

  // Display an alert to indicate that the redemption is in progress
  alert("Proceeding to redeem!");
  
  // Calculate the points to be deducted for the redemption
  const pointsDeducted = points;
  console.log(pointsDeducted);
  
  try {
    // Ensure this function completes successfully by awaiting the deduction of user points
    await deductUserPoints(pointsDeducted);
  } catch (error) {
    // Handle any errors that occur during the redemption process
    console.error('Error during redeem:', error);
    alert("There was an issue during the redeeming process. Please try again.");
  }
}


// Function to deduct points from the user's balance
async function deductUserPoints(pointsDeducted) {
  // API key for authentication
  const APIKEY = "65bd08cc27d23b767e1eee0a";

  // Retrieve user information from local storage
  const loggedInUser = localStorage.getItem('loggedInUser');
  const loggedInEmail = localStorage.getItem('loggedInEmail');
  const loggedInPwd = localStorage.getItem('loggedInPwd');

  // Check if a user is logged in
  if (!loggedInUser) {
    console.error('User is not logged in.');
    return;
  }

  // Build the query URL to fetch user data from the database
  const queryURL = `https://fedassignment2-964a.restdb.io/rest/mori-user?q={"user-name": "${loggedInUser}"}`;

  try {
    // Fetch user data from the database
    const getUserResponse = await fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY
      }
    });

    // Parse the response as JSON
    const users = await getUserResponse.json();

    // Check if a user was found
    if (users.length > 0) {
      const user = users[0];
      let originalPoints = (user.points || 0);

      // Calculate the updated points balance after deduction
      let updatedPoints = originalPoints - pointsDeducted;

      // Ensure the points balance does not go below zero
      if (updatedPoints >= 0) {
        // Build the URL to update user data in the database
        const updateURL = `https://fedassignment2-964a.restdb.io/rest/mori-user/${user._id}`;

        // Prepare the data to be sent for the update
        let deductdatajson = {
          "user-name": loggedInUser,
          "user-email": loggedInEmail,
          "user-pwd": loggedInPwd,
          "points": updatedPoints
        };

        // Perform the update operation by sending a PUT request
        const updateResponse = await fetch(updateURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY
          },
          body: JSON.stringify(deductdatajson)
        });

        // Check if the update was successful
        if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

        // Parse the updated user data
        const updatedUser = await updateResponse.json();
        console.log("Points updated:", updatedUser);

        // Update the points in local storage
        localStorage.setItem('userPoints', updatedUser.points);
        
        // Display the updated points balance
        displayUserPoints();
        
        // Display a success message
        alert('Points deducted successfully!');
      } 
      // Handle the case where there are not enough points to deduct
      if (updatedPoints < 0) {
        updatedPoints = originalPoints;
        alert('Not enough points to redeem.');
      }
    } else {
      // Handle the case where the user is not found
      throw new Error('User not found.');
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error updating points:', error);
    // Handle errors appropriately
  }
}


// Function to redeem points and add an item to the cart
function redeemAndAddToCart(points, itemName, itemId, imagePath) {
  // Get the user's current points from local storage
  const userPoints = localStorage.getItem('userPoints');
  
  // Log the user's current points to the console
  console.log(userPoints);
  
  // Call the redeem function to deduct points
  redeem(points);

  // Check if the user has enough points to add the item to the cart
  if (userPoints >= points) {
    // Call the addToCart function to add the item to the cart
    addToCart(itemName, itemId, imagePath);
  }
}


// Function to play a game with an entry fee
async function playGame(gameUrl, entryFee) {
  // Get the logged-in user's username from local storage
  const loggedInUser = localStorage.getItem('loggedInUser');
  
  // Check if the user is not logged in
  if (!loggedInUser) {
    alert('Please log in to play the game.');
    window.location.href = 'login.html'; // Redirect to the login page
    return; // Exit the function if the user is not logged in
  }

  // Get the user's current points from local storage, parse it as an integer
  const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');

  // Check if the user has enough points to play the game
  if (currentPoints < entryFee) {
    alert('Not enough points to play the game. You need at least ' + entryFee + ' points.');
    return; // Exit the function if the user doesn't have enough points
  }

  // Attempt to deduct the entry fee from the user's points
  await deductUserPoints(entryFee);

  // Re-check the points after the deduction attempt
  const updatedPoints = parseInt(localStorage.getItem('userPoints') || '0');
  
  // Check if points were successfully deducted
  if (updatedPoints < currentPoints) {
    alert(`Points have been deducted. You now have ${updatedPoints} points.`);
    window.location.href = gameUrl; // Redirect to the game URL
  } else {
    // Handle the case where points might not have been deducted (error)
    alert("There was an issue starting the game. Please try again.");
  }
}


// Listen for the DOMContentLoaded event to ensure the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get all elements with the class 'game-btn' and 'a' tags within them
  const gameButtons = document.querySelectorAll('.game-btn a');

  // Iterate through each game button
  gameButtons.forEach(function(button) {
    // Add a click event listener to each game button
    button.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default link behavior

      // Get the game URL from the 'href' attribute of the clicked button
      const gameUrl = this.getAttribute('href');

      // Set the entry fee for the game (adjust as necessary)
      const entryFee = 200;

      // Call the playGame function with the game URL and entry fee
      playGame(gameUrl, entryFee);
    });
  });
});



document.getElementById("exampleModal").addEventListener('hidden.bs.modal', function () {
  document.getElementById("contactForm").reset();
});

document.getElementById("exampleModalLabel").addEventListener("click", function() {
  document.getElementById("contactForm").submit(); // Submit the form
});
