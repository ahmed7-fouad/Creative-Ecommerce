import axios from "axios";

let placeOrderBtn = document.getElementById("placeOrderBtn");

let checkoutForm=document.querySelector(".checkoutForm");

let allInputs = checkoutForm.querySelectorAll("input");


let userName = allInputs[0];
let nameValidation = document.querySelector(".nameValidation");

let email = allInputs[1];
let emailValidation = document.querySelector(".emailValidation");

let address = allInputs[2];
let addressValidation = document.querySelector(".addressValidation");

let phone = allInputs[3];
let phoneValidation = document.querySelector(".phoneValidation");

let applyCouponBtn = document.getElementById("applyCouponBtn");
let applyCouponField = document.querySelector(".couponInpField");


let checkoutBanner=document.getElementById("checkoutBanner");
let loaderBody = document.getElementById("loaderBody");

function updateStorageData(objElement , value , validationElementVal) {
   objElement.value = value
   objElement.state = validationElementVal;
   updateSessionStorageCustomerData(customerData);
}


let customerData={
    name:{value:"",state:""},
    email:{value:"",state:""},
    address:{value:"",state:""},
    phone:{value:"",state:""},
}

// Clear Form Inputs Data
function clearInputs(){
  [userName,email,address,phone].forEach(input=>{
    input.value="";
  })
}
// Clear Validation States
function clearStates(){
  [nameValidation,emailValidation,addressValidation,phoneValidation].forEach(validationInput=>{
    validationInput.innerHTML="";
  })
}

if (window.sessionStorage.getItem("customerData"))
  {
  customerData = JSON.parse(window.sessionStorage.getItem("customerData"));
  // Update Input Fields
  userName.value = customerData.name.value;
  email.value = customerData.email.value;
  address.value = customerData.address.value;
  phone.value = customerData.phone.value;

  // Update Validation Elements
  nameValidation.innerHTML = customerData.name.state;
  emailValidation.innerHTML = customerData.email.state;
  addressValidation.innerHTML = customerData.address.state;
  phoneValidation.innerHTML = customerData.phone.state;

  let validationSet = [
    nameValidation,
    emailValidation,
    addressValidation,
    phoneValidation,
  ];

  validationSet.forEach((el) => {
    if (el.innerHTML === "valid") {
      handleValidationMsgFormat(el);
    } else {
      handleValidationMsgFormat(el, false);
    }
  });
}


// window.sessionStorage.setItem();
function handleValidationMsgFormat(element,state=true){
    if(state){
        element.style.setProperty("color", "#16A34A");
    }else{
        element.style.setProperty("color", "#DC2626");
    }
    
}

userName.addEventListener("input",_=>{
    if(userName.value.length >= 7){
        handleValidationMsgFormat(nameValidation);
        nameValidation.innerHTML="valid";
    }else{
        handleValidationMsgFormat(nameValidation, false);
        nameValidation.innerHTML = "Name must be at least 7 characters long";
    }
    updateStorageData(
        customerData.name,
        userName.value,
        nameValidation.innerHTML
    );
})

email.addEventListener("input",_=>{
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
       if (email.value.match(regex)){
        handleValidationMsgFormat(emailValidation);
        emailValidation.innerHTML="valid";
    }else{
        handleValidationMsgFormat(emailValidation, false);
        emailValidation.innerHTML = "this email is invalid";
    }

   updateStorageData(
     customerData.email,
     email.value,
     emailValidation.innerHTML,
   );
})

address.addEventListener("input",_=>{
    if (address.value.length >= 25) {
      handleValidationMsgFormat(addressValidation);
      addressValidation.innerHTML = "valid";
    } else {
      handleValidationMsgFormat(addressValidation, false);
      addressValidation.innerHTML = "address must be at least 25 characters long";
    }
     updateStorageData(
       customerData.address,
       address.value,
       addressValidation.innerHTML,
     );
})

phone.addEventListener("input",_=>{
    let regex = /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    if(phone.value.match(regex)){
       handleValidationMsgFormat(phoneValidation);
       phoneValidation.innerHTML = "valid"; 
    }else{
       handleValidationMsgFormat(phoneValidation, false);
       phoneValidation.innerHTML = "phone format not valid";  
    }
   updateStorageData(
     customerData.phone,
     phone.value,
     phoneValidation.innerHTML,
   );
})


placeOrderBtn.addEventListener("click",()=>{
 let allValidationTags=Array.from(document.querySelectorAll(".validation"));
 let validationState=allValidationTags.every(tag=>{
    return tag.innerHTML=="valid";
 })
 if(!validationState){
    if(nameValidation.innerHTML!=="valid"){
        showAlert("username is not valid" , false)
    }else if(emailValidation.innerHTML!=="valid"){
        showAlert("email is not valid" , false)
    }
    else if(addressValidation.innerHTML!=="valid"){
        showAlert("address is not valid" , false)
    }
    else if(phoneValidation.innerHTML!=="valid"){
        showAlert("phone number is not valid" , false)
    }
 }else{
   if(parseInt(cartItemsNum.innerHTML) < 1){
        showAlert("Cart Is Empty",false)
   }else{
    
      let itemData =productsCart.map((item) => {
            return `
                ================================
                item ID : ${item.id}
                item name : ${item.title}
                item price : $${item.originalPrice}
                item count : ${item.totalCount}
                total price : $${item.price}
                ================================
            `;
          })
          .join("");

          let items = `
            ${itemData}
               All Items Total Price : $${checkoutTotalAmount.innerHTML}
          `;
    
    const order = {
        name:userName.value,
        email:email.value,
        address:address.value,
        phone:phone.value,
        items:items,
    }
    const googleSheetUrl =
      "https://script.google.com/macros/s/AKfycbwb6RQ_HfD7jCotQ5E2y189zehg3mEhDvOtsPYW_jrio_O4ksgle5Rrr3xTWNspMdRP/exec";

   axios.post(googleSheetUrl, JSON.stringify(order), {
      headers: {
        "Content-Type": "text/plain",
      },
    })
    .then(_=> {
      placeOrderBtn.classList.add("disActive");
      checkoutBanner.classList.toggle("activeCheckoutBanner");
      clearInputs();
      window.sessionStorage.removeItem("customerData");
      clearStates();
      clearCart()
      loaderBody.style.cssText="width:100%";
      window.setTimeout(()=>{
        checkoutBanner.classList.toggle("activeCheckoutBanner");
        placeOrderBtn.classList.remove("disActive");
      },2200)
      loaderBody
    })
    .catch(_=> {
      showAlert("Data Error => ",false)
    });
    
   }
 }

})


applyCouponBtn.addEventListener("click",_=>{
   
})