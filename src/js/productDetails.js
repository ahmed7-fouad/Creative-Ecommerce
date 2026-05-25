
const url=window.location.search;

const params = new URLSearchParams(url);

const ID = params.get("id");

let productDetails = document.querySelector(".product-details-parent");
let productData="";
let sunglassesParent=document.getElementById("sunglassesParent");

// Change The Current Image State In Case Clicking On Any Image Button
function changeMainImage(imageSource) {
  document.querySelector(".mainImage img").src = imageSource;
}  


// Magnifier Effect Or Magnifying Glass On Image


document.addEventListener("mousemove", (e) => {

    const mainImageContainer = e.target.closest(".mainImage");
    if (mainImageContainer) {
        const img = mainImageContainer.querySelector("img");
        
        const rect = mainImageContainer.getBoundingClientRect();
        
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        img.style.transform = "scale(2.2)";
        img.style.transformOrigin = `${x}% ${y}%`;
    }
});

document.addEventListener("mouseout", (e) => {
    const mainImageContainer = e.target.closest(".mainImage");
    if (mainImageContainer && !mainImageContainer.contains(e.relatedTarget)) {
        const img = mainImageContainer.querySelector("img");
        if (img) {
            img.style.transform = "scale(1)";
            img.style.transformOrigin = "center center";
        }
    }
});



// Set Tags List
function setSmallTags(tagsList){
    if(!Array.isArray(tagsList)){
        tagsList=tagsList.split(" ");
    }
    let newTagsList = tagsList.map(tag=>{
        return (
                 `<span class="tag bg-[#ddd] text-secondaryPar p-1 mx-1.5">${tag}</span>`
               );
    })

    return newTagsList.join("");
}


document.addEventListener("click",e=>{
    if(e.target.closest(".productImage")){
        let clickedElement=e.target.closest(".productImage");
        let allProductImages=document.querySelectorAll(".images li");
        allProductImages.forEach((im) => {
          im.classList.remove("activeImage");
        });
        clickedElement.classList.add("activeImage");
    }
})


axios.get(`https://dummyjson.com/products/${ID}`)
.then((response)=>{
    productData=response.data;
    let productPriceAfterDiscount = getPriceAfterDiscount(
      productData.price,
      productData.discountPercentage,
    );
    function getAllProductImages(){
        let productImages=productData.images.map((imgSrc , index )=>{
            return (`
                    <li style="box-shadow:rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset"
                    class="productImage cursor-pointer ${index==0? "activeImage" : ""} size-[7rem] inline-block" onClick="changeMainImage('${imgSrc}')">
                        <img src="${imgSrc}" alt="" class="h-full">
                    </li>
                `);
        });
        return productImages.join(" ");
    }

    let productDetailsSec = `
         <section class="h-[35rem] flex flex-col lg:flex-row justify-center items-center  gap-3" data-itemId="${productData.id}">
                <ul class="images space-x-2 text-[0px] px-0  whitespace-nowrap  w-[14rem] h-[10rem] overflow-auto
                lg:h-full lg:space-x-0 lg:flex lg:flex-col lg:w-[7rem]  lg:gap-3 lg:justify-start  ">
                    ${getAllProductImages()}
                </ul>
                <section class="mainImage overflow-hidden h-[calc(100%-10rem)] lg:h-full lg:min-w-[35rem] cursor-zoom-in inline-block">
                    <img src="${productData.images[0]}" alt="" class="h-full">
                </section>
            </section>

            <section class="space-y-3 text-center lg:text-left!">
                <h1 class="text-3xl! font-semibold! mb-4 leading-11">${productData.title}</h1>
                <p class="description text-xl font-medium leading-9">${productData.description}</p>
                <p class="font-semibold">Availability : <span class="text-main">${productData.availabilityStatus}</span></p>

                <section class="rank">
                    ${setRating(productData.rating)}
                </section>
                
                <p class=" text-3xl"><span class="text-main me-3 font-semibold">$${productPriceAfterDiscount.toFixed(2)}</span><span class="text-decoration-line-through font-light">$${productData.price.toFixed(2)}</span></p>
                <section>

                    <p class="categories font-semibold text-capitalize"> Categories :
                        <span class="">
                            ${setSmallTags(productData.category)}
                        </span>
                    </p>

                    <p class="tags font-semibold text-capitalize">
                        Tags : 
                        ${setSmallTags(productData.tags)}
                    </p>
                    <p class="Share font-semibold text-capitalize"> Stock : ${productData.stock} Items <span></span></p>
                    <button  class="mainAddToCartBtn  h-11 px-4 text-2xl text-soft border-none! bg-main hover:bg-main-hover rounded-0 capitalize"><i class="fa-solid fa-cart-shopping me-1"></i> add to cart</button>
                </section>
  
            </section>
    `;
    
    productDetails.innerHTML=productDetailsSec;
});


axios.get("https://dummyjson.com/products/category/sunglasses")
.then((response)=>{
    let allProducts=response.data.products;
    setCards(allProducts,sunglassesParent);
}).then(()=>{
    for (let product of productsCart) {
      let item=document.querySelector(`[data-itemId="${product.id}"] .addToCartBtn`)
      if(item){
        item.classList.toggle("disActive");
      }
    }
});


// Add To Cart Btn Manipulation

document.addEventListener("click", (e) => {
  if (
    e.target.closest(".addToCartBtn") ||
    e.target.closest(".mainAddToCartBtn")
  ) {
    
    let productId = ID;

    if (window.localStorage.getItem("token")) {
      if (e.target.closest(".addToCartBtn")) {
        let btn=e.target.closest(".addToCartBtn");
        let product=btn.parentElement.parentElement.parentElement;
        productId = product.id;
      }
      axios
        .get(`https://dummyjson.com/products/${productId}`)
        .then((response) => {
          let state = updateSideCartContent(response.data);
          
          if (state) {
              let productBtn = document.querySelector(`[data-itemid="${productId}"] .addToCartBtn`)
              if(productBtn){
                  productBtn.classList.toggle("disActive");
              }
          }
        });
    } else {
      showAlert("Log in first to be able to add products to your shopping cart",false);
    }
  }
});
