const CartIcon = document.querySelector(".icon-cart"),
  Wrapper = document.querySelector(".wrapper"),
  cartclose = document.querySelectorAll(".cartclose"),
  listProduct = document.querySelector(".listProduct"),
  left_side = document.querySelector(".left-side"),
  Current = document.querySelector(".icon-cart span"),
  totalworth = document.querySelector(".totalworth"),
  totalAmount = document.querySelector(".totalAmount")

let Products,
  carts = []
cartclose.forEach((item) => {
  item.addEventListener("click", () => {
    Wrapper.classList.toggle("show");
    document.querySelector("body").style.overflowY="scroll"
  });
});
CartIcon.addEventListener("click", () => {
  Wrapper.classList.toggle("show");
  document.querySelector("body").style.overflowY="hidden"
});

const AddProduct = () => {
  listProduct.innerHTML = "";
  const ItemProduct = Products.map((item) => {
    return `
            <div  class="colitem col-6 col-sm-6 col-md-4 col-lg-3">
                <div id=${item.id} class="item">
                    <img src=${item.image} alt=${item.name}>
                    <h2>${item.name}</h2>
                    <div class="price">$${item.price}</div>
                    <button class="addCart">Add To Cart</button>
                </div>
            </div>
            `;
  }).join("");

  listProduct.innerHTML += ItemProduct;
};



const AddCartItem = (product_id) => {
  let positionCart = carts.findIndex((value) => value.product_id == product_id);
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionCart].quantity = carts[positionCart].quantity + 1;
  }

  AddCartToHTML();
  AddCartMemory()
};

const AddCartMemory=()=>{
  localStorage.setItem("cart",JSON.stringify(carts))
}

listProduct.addEventListener("click", (item) => {
  if (item.target.classList.contains("addCart")) {
    AddCartItem(item.target.parentElement.id);
  }
});

const AddCartToHTML = () => {
  left_side.innerHTML = "";
  let Totalquantity=0 , TotalPrice=0

  if (carts.length > 0) {
    
    const CartItem = carts.map((item) => {
        Totalquantity=Totalquantity + item.quantity
        
        let positionProduct = Products.findIndex((value)=> value.id == item.product_id)
        let info = Products[positionProduct]
        TotalPrice = TotalPrice + (info.price * item.quantity)
      return `
                    <div class="cartItem" >
                    <div class="cartImage"><img src=${info.image} alt=${info.name}></div>
                    <div class="name"><h3>${info.name }</h3></div>
                    <div class="addItem" id=${item.product_id}>
                        <div class="prev">-</div>
                        <div class="amount">${item.quantity}</div>
                        <div class="next">+</div>
                    </div>
                    <div class="itemPrice">
                        $${info.price * item.quantity}
                    </div>
                    <div class="underline"></div>
                </div>
                    `;
    }).join("");
    left_side.innerHTML+=CartItem
  }else{
    left_side.innerHTML = "<h1> Not Found </h1>"
  }
  Current.innerText=Totalquantity
  totalworth.innerText=Totalquantity
  totalAmount.innerText= "$"+TotalPrice
};



left_side.addEventListener("click",(e)=>{
  if(e.target.classList.contains("prev") || e.target.classList.contains("next")){
   let cart_id = e.target.parentElement.id
   let type = "prev"
   if(e.target.classList.contains("next")){
    type="next"
   }
   ChangeCartItem(type,cart_id)
  }
})


const  ChangeCartItem = (type,cart_id)=>{
  let positionItemCart = carts.findIndex((item)=> item.product_id == cart_id)
    if(positionItemCart>=0){
      switch (type) {
        case "next":
          carts[positionItemCart].quantity=carts[positionItemCart].quantity+1
          break;
      
        default:
        let valuechange = carts[positionItemCart].quantity-1
        if(valuechange>0){
          carts[positionItemCart].quantity=valuechange
        }else{
          carts.splice(positionItemCart,1)
        }
          break;
      }
    }
       AddCartMemory()
       AddCartToHTML()
}

const GetData = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      Products = data;
      AddProduct();

      if(localStorage.getItem("cart")){
        carts=JSON.parse(localStorage.getItem("cart"))
        AddCartToHTML()
      }

    });
};

GetData();