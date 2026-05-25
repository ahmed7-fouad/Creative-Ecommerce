let sideBarCartBox = document.querySelector(".sideBarCartBox");
let navCartBtn = document.querySelector(".navCartBtn");
let sidecartShopMoreBtn = document.querySelector(".sidecartShopMoreBtn");
let sidecartCheckoutBtn = document.querySelector(".sidecartCheckoutBtn");
let sideBarexitBtn = document.querySelector(".exitBtn");
let logout = document.querySelector(".logout");
let responseMsgALert = document.querySelector(".responseMsgAlert");

let registerModal = document.querySelector(".registerModal");
let loginModal = document.querySelector(".loginModal");

// Authenticaion Sections

let checkoutParent = document.getElementById("cartItemsParent");
let registerBtn = document.getElementById("registerRequestBtn");
let loginBtn = document.getElementById("loginRequestBtn");

let unAuthSec = document.querySelector(".unAuthSec");
let authSec = document.querySelector(".AuthSec");


let productsCart = [];
let lovedItems=[];
let sideBarCartItems = document.getElementById("sideBarCartItems");
let sideCartTotalPrice = document.querySelector("#sideCartTotalPrice span");

let cartItemsNum = document.getElementById("cartItemsNum");

let cartIconCounter = document.getElementById("navCartIconCounter");
let loveIconCounter = document.querySelector(".favIconCounter");
// Checkout Variables 
let checkoutSubtotalAmount = document.getElementById("subtotalAmount");
let checkoutShippingAmount=document.getElementById("shippingAmount");
let checkoutTotalAmount = document.getElementById("totalAmount");

window.onscroll=_=>{
  let pageNav=document.querySelector("nav");
  if(window.scrollY > 10){
    pageNav.style.setProperty(
      "box-shadow",
      "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
      "important",
    );
  }else{
    pageNav.style.setProperty("box-shadow", "none", "important");
  }
}


function updateItemCountCounters(state = true , currentCounterValue , ...elementsToUpdate) {
  let counter = parseInt(currentCounterValue.innerHTML);

  if (state) {
    ++counter;
  } else {
    --counter;
  }
  for(let item of elementsToUpdate){
    item.innerHTML=counter;
  }
}

function updateLocalStorageCart(data) {
  window.localStorage.setItem("cartProducts", JSON.stringify(data));
}

function updateSessionStorageCustomerData(data){
  window.sessionStorage.setItem("customerData",JSON.stringify(data));
}

function addElementToSideBar(itemObj , parent , state=true) {
  let card = `
          <section id="${itemObj.id}" class="item${itemObj.id}  flex items-center gap-3 my-3 min-h-40">
                    <section class="${state ? "max-w-100" : "size-50"}">
                        <img src="${itemObj.images[0]}" alt="cartItemImg" class="w-full h-full">    
                    </section>
                    <input type="hidden" class="hiddenInput" value="${itemObj.originalPrice}">
                    <section class="grow">
                        <p class="itemName text-md fw-semibold">${itemObj.title}</p>
                        <p class="itemPrice text-secondaryPar font-semibold text-xl">$<span>${itemObj.price}</span></p>
                        <div class="btn-group gap-2 w-full" role="group" aria-label="Basic example">
                            <button type="button" class="decreaseItemCartBtn ${state ? "" : "checkoutDecreaseIndicator"} rounded-0 bg-mainBg! text-black border-main! hover:text-main!  flex-grow-1 ">-</button>
                            <span   class="cartItemsNum bg-mainBg! text-black border-main! hover:text-black!  flex items-center justify-center flex-grow-1!">${itemObj.totalCount}</span>
                            <button type="button" class="increaseItemCartBtn ${state ? "" : "checkoutIncreaseIndicator"} rounded-0 bg-mainBg! text-black border-main! hover:text-main! flex-grow-1">+</button>
                        </div>
                    </section>
                    <section  class="removeItemBtn bg-light h-full cursor-pointer text-2xl">
                        <i class="fa-solid fa-trash-can"></i>
                    </section>
                </section>
    `;
  parent.innerHTML += card;
}


document.addEventListener("click", (e) => {
  if (
    e.target.closest(".navCartBtn") ||
    e.target.closest(".exitBtn")
  ) {
    sideBarCartBox.classList.toggle("activeSideBar");
  }
});


sidecartShopMoreBtn.addEventListener("click",_=>{
  window.location.assign("/");
})


function getPriceAfterDiscount(originalPrice, discount) {
  let discountAmount = parseFloat(originalPrice) * (parseFloat(discount) / 100);
  let itemPriceAfterDiscount = parseFloat(originalPrice) - discountAmount;
  return itemPriceAfterDiscount;
}


function updateSideCartContent(productObj){
   let cardObj = productObj;
   let product = productsCart.find((product)=>{
    return product.id == cardObj.id;
   })

   if(!product){
     let newObj = {
       id: cardObj.id,
       title: cardObj.title,
       images: [cardObj.images[0]],
       originalPrice: parseFloat(getPriceAfterDiscount(cardObj.price, cardObj.discountPercentage).toFixed(2)),
       price: parseFloat(getPriceAfterDiscount(cardObj.price,cardObj.discountPercentage).toFixed(2)),
       discountPercentage: cardObj.discountPercentage,
       totalCount: 1,
       loveState:false,
     };

     updateItemCountCounters(true,cartIconCounter,cartIconCounter,cartItemsNum);
     addElementToSideBar(newObj, sideBarCartItems);

     sideCartTotalPrice.innerHTML = (
       parseFloat(sideCartTotalPrice.innerHTML) + parseFloat(newObj.price)
     ).toFixed(2);
     productsCart.push(newObj);
     updateLocalStorageCart(productsCart);
     showAlert("The Product has been successfully added to the cart.")
     return true;
   }else{
    showAlert("The product has already been added to the cart",false);
    return false;
   }
}

// Left & Right Indicators Manipulations

const leftArrows = document.querySelectorAll(".leftIndicator");
const rightArrows = document.querySelectorAll(".rightIndicator");

// Left Arrows Indicators Movement

leftArrows.forEach((arrow)=>{
    arrow.addEventListener("click",_=>{
        const parent =arrow.parentElement.parentElement.nextElementSibling.nextElementSibling;
        parent.scrollBy({
            left:-1000,
            behavior:"smooth",
        })
    })
})

// Right Arrows Indicators Movement

rightArrows.forEach((arrow)=>{
    arrow.addEventListener("click",_=>{
        const parent =arrow.parentElement.parentElement.nextElementSibling.nextElementSibling;
        parent.scrollBy({
            left:1000,
            behavior:"smooth",
        })
    })
})


// Show API Response Message As Alert

function showAlert(msg, state = true) {
  if (state) {
    responseMsgALert.classList.replace("alert-danger", "alert-success");
  } else {
    responseMsgALert.classList.replace("alert-success", "alert-danger");
  }
  responseMsgALert.innerHTML = msg;
  responseMsgALert.classList.add("activateAlert");
  window.setTimeout(() => {
    responseMsgALert.classList.remove("activateAlert");
  }, 1500);
}

// Clean Body Attributes After Opening Bootstrap Modal

function cleanBodyModalAttributes() {
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}


// Switch UI In Case Person Is Registered Or Not

function switchUi(state = true) {
  if (state) {
    unAuthSec.classList.replace("flex", "hidden");
    authSec.classList.replace("hidden", "flex");
  } else {
    unAuthSec.classList.replace("hidden", "flex");
    authSec.classList.replace("flex", "hidden");
  }
}


// Set Rating With Stars

function setRating(rating) {
  let parentElement = "";
  for (let i = 1; i <= 5; ++i) {
    if (i <= rating) {
      parentElement += ` <i class="fa-solid fa-star text-main "></i>`;
    } else {
      parentElement += ` <i class="fa-solid fa-star text-[#ddd]"></i>`;
    }
  }
  return parentElement;
}

// Set Cards To Parent Section

function setCards(itemsList, parentElement , controledWidth=true) {
  for (let item of itemsList) {
    let itemPriceAfterDiscount = getPriceAfterDiscount(
      item.price,
      item.discountPercentage,
    );
    let rating = Math.round(item.rating);
    let card = `
                 <!-- product card -->
                        <div id="${item.id}" data-itemId ="${item.id}" class="card relative shadow-xl shadow-gray-300 border-gray-200!  inline-block! me-3" style="${controledWidth ? "width:18rem" : ""}">

                            <section class="discountAmount absolute top-2 right-2 py-1 px-2 text-sm   text-soft bg-danger">
                                ${item.discountPercentage}%
                            </section>
                            
                            <section class="flex justify-center py-3">
                                <img src="${item.images[0]}" class="card-img-top w-50" alt="...">
                            </section>

                            <div class="card-body">
                                <section class="stars  pb-3">
                                    ${setRating(rating)}
                                </section>

                                <p class="card-title card-details-link capitalize text-decoration-none block whitespace-normal cursor-pointer">${item.title}</p>

                                <section class="pricePart flex items-center gap-2 pb-3">
                                    <p class="productPrice text-main text-2xl m-0">$${itemPriceAfterDiscount.toFixed(2)}</p>
                                    <span class="text-md text-decoration-line-through text-secondaryPar">$${item.price}</span>
                                </section>
                                
                                <section class="flex items-center gap-3">
                                    <button  class="addToCartBtn  h-9 px-3 text-soft border-none! bg-main hover:bg-main-hover rounded-0 capitalize"><i class="fa-solid fa-cart-shopping me-1"></i> add to cart</button>
                                    <button type="button" class="loveBtn size-9 flex items-center justify-center border-[0.5px] border-secondaryPar text-secondaryPar">
                                        <i class="fa-regular fa-heart"></i>
                                    </button>
                                </section>
                            </div>
                        </div>
                    <!--//=== product card ===//-->
    `;
    parentElement.innerHTML += card;
  }
}


// Update The State Of Add To Cart Buttons When The Page Has Loaded

function updateAddToCartBtnsStateOnLoad(){
     productsCart.forEach((product) => {
       if (document.querySelector(`[data-itemId="${product.id}"]`)) {
         document.querySelector(`[data-itemId="${product.id}"] .addToCartBtn`)
         .classList.toggle("disActive");
       }
     });
}

// Update The State Of Loved Buttons When The Page Has Loaded

function updateLovedBtnsStateOnLoad(){
    lovedItems.forEach((id) => {
      if (document.querySelector(`[data-itemId="${id}"] .loveBtn`)) {
        document
          .querySelector(`[data-itemId="${id}"] .loveBtn`)
          .classList.toggle("activeLoveIcon");
      }
    });
}


// Register Btn Manipulation

registerBtn.addEventListener("click", (_) => {
    let registerModalInputs = document.querySelectorAll(
        ".register-modal-body input",
    );
    let firstNameVal = registerModalInputs[0].value;
    let lastNameVal = registerModalInputs[1].value;
    let userNameVal = registerModalInputs[2].value;
    let emailVal = registerModalInputs[3].value;
    let passwordVal = registerModalInputs[4].value;
    let imageVal = registerModalInputs[5].files[0];
    
    const formData = new FormData();
    formData.append("username", userNameVal);
    formData.append("firstName", firstNameVal);
    formData.append("lastName", lastNameVal);
    formData.append("email", emailVal);
    formData.append("password", passwordVal);
    formData.append("image", imageVal);
    
    authSec.querySelector(".profileUserName").innerHTML = userNameVal;
    
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    if(userNameVal !== "" && passwordVal !== ""){
      axios
        .post("https://dummyjson.com/users/add", formData, config)
        .then((response) => {
          showAlert("user has been added successfully");
          cleanBodyModalAttributes();

          window.setTimeout(() => {
            registerModal.style.setProperty("display", "none");
          }, 1500);
          switchUi();
        })
        .catch((error) => {
          showAlert("Error => ");
        });
    }else{
        showAlert("Username And Password Are Required",false);
    }
});

//=== Register Btn Manipulation ===//

// login Btn Manipulation

loginBtn.addEventListener("click", (_) => {
    let loginModalInputs = document.querySelectorAll(".login-modal-body input");

    let userNameVal=loginModalInputs[0].value;
    let passwordVal=loginModalInputs[1].value;

    const data={
        username:userNameVal,
        password:passwordVal,
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios.post("https://dummyjson.com/user/login",data,config)
    .then((response)=>{
        let user=response.data;
        let token = response.data.accessToken;

        window.localStorage.setItem("user",JSON.stringify(user));
        window.localStorage.setItem("token",token);
        console.log(user.image)
        authSec.querySelector(".profileUserName").innerHTML = user.username;
        authSec.querySelector(".profileImage img").src = user.image;
        showAlert("Welcome Back !")
        cleanBodyModalAttributes();
        window.setTimeout(() => {
        loginModal.style.setProperty("display", "none");
        }, 1500);

        switchUi()

    }).catch((error)=>{
        showAlert(error.response.data.message,false);
    })
});

//=== login Btn Manipulation===//

// Logout Btn Code

logout.addEventListener("click", (_) => {
  switchUi(false);
  window.localStorage.clear();
  window.location.assign("/");
});

//=== logout Btn Manipulation===/


function getTotalPrice(list){
  let totalPrice=list.reduce((acc, item) => {
    return acc + item.price;
  }, 0);
  return totalPrice;
}


// Checkout Btn Manipulation


document.addEventListener("click", (e) => {
 
    if (e.target.closest(".sidecartCheckoutBtn")) {
       if (window.localStorage.getItem("token")) {
          if (window.location.pathname !== "/checkout.html") {
            window.location.assign("/checkout.html");
          } else {
            showAlert("You are now in checkout page", false);
          }
       }else{
        showAlert("Please Login First",false);
       }
    }
  
});


// Wishlist Btn Manipulation
document.addEventListener("click",e=>{
  if (e.target.closest(".wishListMainBtn")) {
    if (window.location.pathname !== "/wishlist.html") {
      window.location.assign("/wishlist.html");
    }
  }
})

// Love Btn Manipulation
document.addEventListener("click",e=>{
  if(e.target.closest(".loveBtn")){
    if(window.localStorage.getItem("token")){
        let state = e.target.closest(".loveBtn")
        .classList.toggle("activeLoveIcon");

        let targetEl =e.target.closest(".loveBtn").parentElement
        .parentElement.parentElement;
        let itemId = targetEl.id;

        if (state) {
          lovedItems.push(itemId);
          updateItemCountCounters(true, loveIconCounter, loveIconCounter);
        } else {
          lovedItems = lovedItems.filter((id) => {
            if (itemId != id) {
              return id;
            }
            updateItemCountCounters(false, loveIconCounter, loveIconCounter);

            if (window.location.pathname == "/wishlist.html") {
              targetEl.remove();
              console.log(loveIconCounter.innerHTML);

              if (loveIconCounter.innerHTML === "0") {
                switchToWishListEmptyLayout();
              }
            }
          });
        }
        window.localStorage.setItem("lovedList", JSON.stringify(lovedItems));   
      }else{
        showAlert("Please Login First",false);
      }

    }
})

// Clear Cart Function
function clearCart(){
  productsCart=[];
  updateLocalStorageCart(productsCart);
  sideBarCartItems.innerHTML="";
  cartIconCounter.innerHTML="0";
  cartItemsNum.innerHTML="0";
  sideCartTotalPrice.innerHTML="$0";

  if(checkoutParent){
    checkoutSubtotalAmount.innerHTML="0";
    checkoutTotalAmount.innerHTML="20";
    checkoutParent.innerHTML="";
  }
}

// Fetch Data From Local Storage

if (window.localStorage.getItem("token")) {
  switchUi();
  let user = JSON.parse(window.localStorage.getItem("user"));
  
  if(window.localStorage.getItem("lovedList")){
    lovedItems=JSON.parse(window.localStorage.getItem("lovedList"));
    loveIconCounter.innerHTML = lovedItems.length;
  }

  authSec.querySelector(".profileUserName").innerHTML = user.username;
  authSec.querySelector(".profileImage img").src = user.image;

  if (window.localStorage.getItem("cartProducts")) {
    productsCart = JSON.parse(window.localStorage.getItem("cartProducts"));
    if (productsCart.length !== 0) {
      for (let product of productsCart) {
        addElementToSideBar(product, sideBarCartItems);  
        if(checkoutParent){
          addElementToSideBar(product, checkoutParent , false);
        }
        document.querySelector(`.item${product.id} .cartItemsNum`).innerHTML = product.totalCount;
      }
      
      cartItemsNum.innerHTML = productsCart.length;
      cartIconCounter.innerHTML = productsCart.length;
      let totalPrice = getTotalPrice(productsCart);

      sideCartTotalPrice.innerHTML = totalPrice.toFixed(2);

      let checkoutSubtotalAmount = document.getElementById("subtotalAmount");
      let checkoutShippingAmount=document.getElementById("shippingAmount");
      let checkoutTotalAmount = document.getElementById("totalAmount");

      if (checkoutParent) {
        let shppingAmount= checkoutShippingAmount.innerHTML;
        checkoutSubtotalAmount.innerHTML = `${totalPrice.toFixed(2)}`;
        checkoutTotalAmount.innerHTML = `${(parseFloat(totalPrice.toFixed(2)) + parseFloat(shppingAmount)).toFixed(2)}`;
        checkoutShippingAmount.innerHTML=`20`;
      }
    }
  }
}



//=== Product Details Btn Manipulation===/

