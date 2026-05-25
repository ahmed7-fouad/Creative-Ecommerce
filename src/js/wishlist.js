let shopNowBtn = document.getElementById("wishListShopNowBtn");
let clearWishListBtn=document.getElementById("clearWishListBtn");
let wishListParent = document.getElementById("wishListParent");
let wishListCards=[];

function switchToWishListEmptyLayout(){
     wishListParent.innerHTML = `
             <h2 class="text-main! whitespace-normal w-fit lg:whitespace-nowrap">Your Wishlist is empty! <i class="fa-solid fa-heart-crack"></i></h2>
        `;
}

async function addproducts(idsList){   
        for(let id of idsList){
            let response = await axios.get(`https://dummyjson.com/products/${id}`);
            let dataObj = await response.data;
            wishListCards.push(dataObj);
            console.log(wishListCards)
        }
}

shopNowBtn.addEventListener("click",_=>{
    window.location.assign("/");
})

clearWishListBtn.addEventListener("click",_=>{
    if(wishListCards.length > 0){
        wishListCards=[];
        window.localStorage.removeItem("lovedList");
        switchToWishListEmptyLayout();
        loveIconCounter.innerHTML="0";
        showAlert("Wishlist cleared successfully");
    }else{
        showAlert("Your WishList Is Already Empty",false)
    }
})

let allwishListItems=[];

if(lovedItems.length < 1){
        switchToWishListEmptyLayout();
        }else{
            wishListParent.innerHTML="";
            addproducts(lovedItems)
            .then(()=>{
                setCards(wishListCards,wishListParent,false);
            }).then(_=>{
                updateAddToCartBtnsStateOnLoad();
                updateLovedBtnsStateOnLoad();
            });       
            
       
       
        
   
   
    updateAddToCartBtnsStateOnLoad();
    updateLovedBtnsStateOnLoad();
}