let hotDealsSec = document.getElementById("hotDealsCardsParent");
let electornicsSec = document.getElementById("electronicsParent");
let applianceSec = document.getElementById("appliancesParent");
let mobilesSec = document.getElementById("mobilesParent");
let hotDealsItems = [];
let electronicsItems = [];
let mobilesItems = [];
let applianceItems = [];


function getPriceAfterDiscount(priceBeforeDiscount,discountPercentage){
  let discountAmount = priceBeforeDiscount * (discountPercentage / 100);
  let itemPriceAfterDiscount = priceBeforeDiscount - discountAmount;
  return itemPriceAfterDiscount;
}


axios
  .get("https://dummyjson.com/products?limit=200")
  .then((response) => {
    return new Promise((resolve, reject) => {
      const allProducts = response.data.products;
      for (let product of allProducts) {
        if (
          product.category === "laptops" ||
          product.category === "mobile-accessories"
        ) {
          electronicsItems.push(product);
        } else if (product.category === "smartphones") {
          mobilesItems.push(product);
        } else if (
          product.category === "womens-watches" ||
          product.category === "mens-watches"
        ) {
          applianceItems.push(product);
        } else {
          hotDealsItems.push(product);
        }
      }
      resolve();
    });
  })
  .then((_) => {
    if(hotDealsSec){
      setCards(hotDealsItems, hotDealsSec);
    }
    if(electornicsSec){
      setCards(electronicsItems, electornicsSec);
    }
    if(mobilesSec){
      setCards(mobilesItems, mobilesSec);
    }
    if(applianceSec){
      setCards(applianceItems, applianceSec);
    }
  })
  .then(() => {
    updateAddToCartBtnsStateOnLoad();
    updateLovedBtnsStateOnLoad();
  });


if(window.location.href !== "/productDetails.html"){
  // Adding Items To Cart
  document.addEventListener("click", (e) => {
    if (e.target.closest(".addToCartBtn")) {
      if (window.localStorage.getItem("token")) {
        e.target.classList.add("disActive");
        let cardId = e.target.parentElement.parentElement.parentElement.id;
        axios
          .get(`https://dummyjson.com/products/${cardId}`)
          .then((response) => {
            updateSideCartContent(response.data, sideBarCartItems);
          });
      } else {
        showAlert(
          "Log in first to be able to add products to your shopping cart",
          false,
        );
      }
    }
  });
}