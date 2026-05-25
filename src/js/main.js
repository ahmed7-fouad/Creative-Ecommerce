import '../style/style.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


let cartItemsNum = document.getElementById("cartItemsNum");
let sideCartTotalPrice = document.querySelector("#sideCartTotalPrice span");



document.addEventListener("click",e=>{
    if(e.target.closest(".card-details-link")){
     const cardId=e.target.parentElement.parentElement.id;
        window.location.assign(`/productDetails.html?id=${cardId}`)
    }
})


// Remove Item From cart Manipulation
document.addEventListener("click",e=>{
    if(e.target.closest(".removeItemBtn")){
        let parent = e.target.parentElement.parentElement;
        let itemId=e.target.parentElement.parentElement.id;
        let itemPrice=parent.querySelector(".itemPrice span").innerHTML;

        let productCard = document.querySelector(`[data-itemId="${itemId}"] .addToCartBtn`);

        if(productCard){
            productCard.classList.toggle("disActive");
        }

        // Update Total Price
        let totalPriceAfterRemoving = (
          parseFloat(sideCartTotalPrice.innerHTML) - parseFloat(itemPrice)
        ).toFixed(2);

        sideCartTotalPrice.innerHTML = totalPriceAfterRemoving;

        productsCart=productsCart.filter((item)=>{
            return item.id != parent.id;
        })
        
        updateLocalStorageCart(productsCart);
        updateItemCountCounters(false,cartIconCounter,cartIconCounter,cartItemsNum);

        

        let sideBarProduct = sideBarCartItems.querySelector(`.item${itemId}`);

        if(sideBarProduct){
            sideBarProduct.remove()
        }

        let checkoutProduct = null;

        if (checkoutParent) {
            checkoutProduct = checkoutParent.querySelector(`.item${itemId}`);
            checkoutProduct.remove();
            checkoutSubtotalAmount.innerHTML = totalPriceAfterRemoving;
            checkoutTotalAmount.innerHTML = (parseFloat(totalPriceAfterRemoving) + parseFloat(checkoutShippingAmount.innerHTML)).toFixed(2);
        }
        showAlert("The item was deleted successfully");
    }
})
// ///=== Remove Item From cart Manipulation ===///


// Items Cart Indicators Increase & Decrease Manipulation


// Increase Btn Manipulation

document.addEventListener("click",e=>{
    if(e.target.closest(".increaseItemCartBtn")){
      let itemsCount = e.target.previousElementSibling;
      let itemId = itemsCount.parentElement.parentElement.parentElement.id;
      let parent = itemsCount.parentElement.parentElement;
      let count = parseInt(itemsCount.innerHTML);

      ++count;
      itemsCount.innerHTML = count;
      let productPrice = parent.parentElement.querySelector(".hiddenInput").value;
      let updatedPrice = parent.querySelector(".itemPrice span");

      updatedPrice.innerHTML = (parseFloat(productPrice) * count).toFixed(2);


      //   Syncronious Data Between Checkout And NavBar

        let sideBarProductNum = sideBarCartItems.querySelector(`.item${itemId} .cartItemsNum`)
        let sideBarProductPrice = sideBarCartItems.querySelector(`.item${itemId} .itemPrice > span`)

        let  checkoutProductNum = null;
        let checkoutProductPrice = null;

        if(checkoutParent){
          checkoutProductNum = checkoutParent.querySelector(`.item${itemId} .cartItemsNum`);
          checkoutProductPrice = checkoutParent.querySelector(`.item${itemId} .itemPrice > span`);
        }

        sideBarProductNum.innerHTML = count;
        sideBarProductPrice.innerHTML = updatedPrice.innerHTML

        if (checkoutProductNum && checkoutProductPrice) {
            checkoutProductNum.innerHTML = count;
            checkoutProductPrice.innerHTML = updatedPrice.innerHTML;
        }
        
      // //===  Syncronious Data Between Checkout And NavBar===//
    

      let cartTotalPrice=(parseFloat(sideCartTotalPrice.innerHTML) + parseFloat(productPrice)).toFixed(2);
      sideCartTotalPrice.innerHTML = cartTotalPrice;

      if(checkoutParent){
        checkoutSubtotalAmount.innerHTML = cartTotalPrice;
        checkoutTotalAmount.innerHTML = (parseFloat(cartTotalPrice) + parseFloat(checkoutShippingAmount.innerHTML)).toFixed(2);
      }

      productsCart = productsCart.map((item) => {
        if (item.id == itemId) {
          item.price = parseFloat(updatedPrice.innerHTML);
          item.totalCount = count;
        }
        return item;
      });
      updateLocalStorageCart(productsCart);
    }
})

// ///=== Increase Btn Manipulation===///



// Decrease Btn Manipulation

document.addEventListener("click",e=>{
    if(e.target.closest(".decreaseItemCartBtn")){
        let itemsCount = e.target.nextElementSibling;
        let itemId = itemsCount.parentElement.parentElement.parentElement.id;
        let parent=itemsCount.parentElement.parentElement;
        let count=parseInt(itemsCount.innerHTML);
        if(count > 1){
          --count;
          itemsCount.innerHTML = count;
          let productPrice =parent.parentElement.querySelector(".hiddenInput").value;
          let updatedPrice = parent.querySelector(".itemPrice span");

          updatedPrice.innerHTML = (parseFloat(productPrice) * count).toFixed(2);

          //   Syncronious Data Between Checkout And NavBar

          let sideBarProductNum = sideBarCartItems.querySelector(`.item${itemId} .cartItemsNum`);

          let sideBarProductPrice = sideBarCartItems.querySelector(`.item${itemId} .itemPrice > span`);

           let checkoutProductNum = null;
           let checkoutProductPrice = null;

           if (checkoutParent) {
             checkoutProductNum = checkoutParent.querySelector(`.item${itemId} .cartItemsNum`);
             checkoutProductPrice = checkoutParent.querySelector(`.item${itemId} .itemPrice > span`);
           }

          sideBarProductNum.innerHTML = count;
          sideBarProductPrice.innerHTML = updatedPrice.innerHTML;

          if (checkoutProductNum && checkoutProductPrice) {
            checkoutProductNum.innerHTML = count;
            checkoutProductPrice.innerHTML = updatedPrice.innerHTML;
          }
          // //===  Syncronious Data Between Checkout And NavBar===//

         
            let cartTotalPrice = (
                parseFloat(sideCartTotalPrice.innerHTML) - parseFloat(productPrice)
            ).toFixed(2);

            sideCartTotalPrice.innerHTML = cartTotalPrice;

            if (checkoutParent) {
                checkoutSubtotalAmount.innerHTML = cartTotalPrice;
                checkoutTotalAmount.innerHTML = (parseFloat(cartTotalPrice) + parseFloat(checkoutShippingAmount.innerHTML)).toFixed(2);
            }


          productsCart = productsCart.map((item) => {
            if (item.id == itemId) {
              item.price = parseFloat(updatedPrice.innerHTML);
              item.totalCount = count;
            }
            return item;
          });
          updateLocalStorageCart(productsCart);
        }

    }
})

// ///=== Decrease Btn Manipulation===///



// ///=== Items Cart Indicators Increase & Decrease Manipulation ===///

