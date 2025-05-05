let cartarr = { total: 0, cart: [] };
window.onload = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    if (parsedCart.cart) {
      cartarr = parsedCart;
    }
  }
  renderCart();
};
const main = document.querySelector("#mainContent");
const fetchData = async () => {
  const url = "http://192.168.7.112:4000/api/phones";
  try {
    const resp = await fetch(`${url}`);
    if (!resp.ok) {
      throw new Error("Error fetching data");
    }
    return resp.json();
  } catch (error) {
    main.innerHTML = "";
    const div = document.createElement("div");
    div.id = "onError";
    const para = document.createElement("p");
    para.innerHTML = `${error}`;
    div.appendChild(para);
    main.appendChild(div);
  }
};

fetchData().then((data) => {
  if (data) {
    main.innerHTML = "";
    data.forEach((i) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "cardWrapper";

      const imgWrapper = document.createElement("div");
      imgWrapper.className = "imgWrapper";

      const dataImg = document.createElement("img");
      dataImg.className = "dataImg";

      const descWrapper = document.createElement("div");
      descWrapper.className = "descWrapper";

      const descPara = document.createElement("p");
      descPara.className = "descText";

      const priceWrapper = document.createElement("div");
      priceWrapper.className = "priceWrapper";

      const pricePara = document.createElement("p");
      pricePara.className = "priceText";

      const nameWrapper = document.createElement("div");
      nameWrapper.className = "nameWrapper";

      const namePara = document.createElement("h5");
      namePara.className = "nameText";
      dataImg.src = `${i.image}`;
      dataImg.alt = `${i.brand} ${i.model}`;
      dataImg.onerror = () => {
        dataImg.src =
          "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg"; // Fallback image
      };
      imgWrapper.appendChild(dataImg);
      namePara.innerText = `${i.brand} ${i.model}`;
      nameWrapper.appendChild(namePara);
      let specsHTML = "";
      Object.entries(i.specs).forEach(([key, val]) => {
        specsHTML += `<b>${key}: </b>${val}</br>`;
      });
      descPara.innerHTML = specsHTML;
      descWrapper.appendChild(descPara);
      pricePara.innerHTML = `<b>Price: </b>${i.price}`;
      priceWrapper.appendChild(pricePara);
      cardWrapper.appendChild(imgWrapper);
      cardWrapper.appendChild(nameWrapper);
      cardWrapper.appendChild(descWrapper);
      cardWrapper.appendChild(priceWrapper);
      const btnWrapper = document.createElement("div");
      btnWrapper.className = "btnWrapper";
      const priceValue = Number(i.price.replace(/[^0-9.-]+/g, ""));
      let selectedData = {
        image: i.image,
        brand: i.brand,
        model: i.model,
        price: i.price,
      };
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.type = "button";
      btn.onclick = () => {
        const resp = confirm(`${i.brand} ${i.model} added to cart`);
        if (resp) {
          cartarr.cart.push(selectedData);
          cartarr.total += priceValue;
          localStorage.setItem("cart", JSON.stringify(cartarr));
          renderCart();
        }
      };
      btn.innerText = "Add to Cart";
      btnWrapper.appendChild(btn);
      cardWrapper.addEventListener("mouseover", () => {
        cardWrapper.appendChild(btnWrapper);
        cardWrapper.style.border = "5px solid rgba(10, 10, 10, 0.5)";
        cardWrapper.style.borderRadius = "20px";
        cardWrapper.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.75)";
      });

      cardWrapper.addEventListener("mouseleave", () => {
        if (cardWrapper.contains(btn)) {
          cardWrapper.removeChild(btnWrapper);
          cardWrapper.style.border = "5px solid rgba(123, 217, 246, 0)";
          cardWrapper.style.borderRadius = "20px";
          cardWrapper.style.boxShadow = "none";
        }
      });
      main.appendChild(cardWrapper);
    });
  }
});

const clearCart = document.createElement("button");
clearCart.id = "clearCart";
clearCart.type = "button";
clearCart.innerText = "Clear Cart?";
clearCart.onclick = () => {
  cartarr = { total: 0, cart: [] };
  localStorage.removeItem("cart");
  renderCart();
};
const renderCart = () => {
  let flag = true;
  const aside = document.querySelector("aside");
  const cartItemsDiv = document.querySelector("#cartItems");
  cartItemsDiv.innerHTML = "";
  if (cartarr.cart.length > 0) {
    cartarr.cart.map((i) => {
      const para = document.createElement("p");
      para.innerText = `${i.brand} ${i.model} ${i.price}`;
      cartItemsDiv.appendChild(para);
    });
  } else {
    const para = document.createElement("p");
    para.innerText = "No items in cart";
    flag = false;
    cartItemsDiv.appendChild(para);
  }
  if (cartarr.cart.length >= 0) {
    const oldTotal = aside.querySelector("#totalPrice");
    if (oldTotal) oldTotal.remove();
    if (flag) {
      const para = document.createElement("p");
      para.id = "totalPrice";
      para.innerText = `Total: $${cartarr.total}`;
      aside.append(para);
      aside.appendChild(clearCart);
    } else {
      aside.removeChild(clearCart);
    }
  }
};
const cartBtn = document.querySelector("#cartRender");
const slider = document.querySelector("aside");
const closeSliderBtn = document.querySelector("#closeCart");
cartBtn.onclick = () => {
  slider.classList.remove("close");
  renderCart();
};
closeSliderBtn.onclick = () => {
  slider.classList.add("close");
};
