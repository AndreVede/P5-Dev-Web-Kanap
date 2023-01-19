const urlBack = "http://localhost:3000/api/products/";

var cart =
  typeof localStorage.cart !== "undefined" ? JSON.parse(localStorage.cart) : [];

/**
 * Récupère les prix et en fait un total
 * Le DOM est également mis à jour
 * @returns total des prix
 */
const getTotal = function () {
  const totalDOM = document.getElementById("totalPrice");
  if (cart !== []) {
    var total = 0;
    return Promise.all(
      cart.map(async (product) => {
        await fetch(urlBack + product.id.toString())
          .then((res) => res.json())
          .then((res) => {
            total = total + Number(product.count) * res.price;
          })
          .catch((error) => {
            console.error(error);
          });
      })
    ).then(() => {
      totalDOM.innerText = total.toString();
      return total;
    });
  } else {
    totalDOM.innerText = "0";
    return 0;
  }
};

/**
 * Récupère le total des articles
 * Le DOM est également mis à jour
 * @returns total des articles
 */
const getTotalOfItem = function () {
  const totalItemsDOM = document.getElementById("totalQuantity");
  if (cart !== []) {
    var total = 0;
    return Promise.all(
      cart.map(async (product) => {
        await fetch(urlBack + product.id.toString())
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            total = total + Number(product.count);
          })
          .catch((error) => {
            console.error(error);
          });
      })
    ).then(() => {
      totalItemsDOM.innerText = total.toString();
      return total;
    });
  } else {
    totalItemsDOM.innerText = "0";
    return 0;
  }
};

/**
 * Met à jour le nombre d'article d'un produit
 * @param {number} productId Id du produit à mettre à jour
 * @param {string} color Couleur du produit à mettre à jour
 * @param {string} newCount Nouveau nombre d'article
 */
const updateCount = function (productId, color, newCount) {
  const elemInCart = cart.find((e) => e.id === productId && e.color === color);
  cart[cart.indexOf(elemInCart)] = {
    id: productId,
    count: newCount.toString(), //incrémenter
    color: color,
  };
  localStorage.setItem("cart", JSON.stringify(cart));
  getTotalOfItem();
  getTotal();
};

/**
 * Supprime le produit du panier
 * @param {number} productId Id du produit à supprimer
 * @param {string} color Couleur du produit à supprimer
 */
const deleteProduct = function (productId, color) {
  console.log(cart);
  const elemInCart = cart.find((e) => e.id === productId && e.color === color);
  cart.splice(cart.indexOf(elemInCart), 1);
  console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));

  // refresh list
  const sectionCart = document.getElementById("cart__items");
  Array.prototype.map.call(sectionCart.children, (child) => {
    if (child.getAttribute("data-id") === productId.toString()) {
      sectionCart.removeChild(child);
    }
  });
  getTotalOfItem();
  getTotal();
};

/**
 * Initialise le panier
 */
const initCart = function () {
  const sectionCart = document.getElementById("cart__items");

  if (cart !== []) {
    cart.map((product) => {
      // création des éléments du DOM de l'item -----
      const article = document.createElement("article");
      article.classList.add("cart__item");
      article.setAttribute("data-id", product.id.toString());
      article.setAttribute("data-color", product.color);

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("cart__item__img");

      const itemContent = document.createElement("div");
      itemContent.classList.add("cart__item__content");

      const contentDescription = document.createElement("div");
      contentDescription.classList.add("cart__item__content__description");

      const contentSettings = document.createElement("div");
      contentSettings.classList.add("cart__item__content__settings");
      const settingsQuantity = document.createElement("div");
      settingsQuantity.classList.add("cart__item__content__settings__quantity");

      // bouton delete
      const settingsDelete = document.createElement("div");
      settingsDelete.classList.add("cart__item__content__settings__delete");
      const deleteCommand = document.createElement("p");
      deleteCommand.classList.add("deleteItem");
      deleteCommand.innerText = "Supprimer";

      settingsDelete.append(deleteCommand);

      // fetch infos du produit -----
      fetch(urlBack + product.id.toString())
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          // image
          const img = document.createElement("img");
          img.src = res.imageUrl;
          img.alt = res.altTxt;
          imageContainer.append(img);

          // title
          const title = document.createElement("h2");
          title.innerText = res.name;
          contentDescription.append(title);

          // color
          const color = document.createElement("p");
          color.innerText = product.color;
          contentDescription.append(color);

          // price
          const price = document.createElement("p");
          price.innerText = res.price.toString() + " €";
          contentDescription.append(price);

          // count
          const count = document.createElement("p");
          count.innerText = "Qté : ";

          // set count
          const settingCount = document.createElement("input");
          settingCount.type = "number";
          settingCount.classList.add("itemQuantity");
          settingCount.name = "itemQuantity";
          settingCount.min = 1;
          settingCount.max = 100;
          settingCount.value = product.count;

          settingsQuantity.append(count);
          settingsQuantity.append(settingCount);

          // Assemblage de l'élément -----
          contentSettings.append(settingsQuantity);
          contentSettings.append(settingsDelete);

          // content
          itemContent.append(contentDescription);
          itemContent.append(contentSettings);

          // cart item
          article.append(imageContainer);
          article.append(itemContent);

          // ajouter dans le DOM
          sectionCart.append(article);

          // Remplir le prix total
          getTotalOfItem();
          getTotal();

          // création du listener sur les inputs -----
          settingCount.onchange = (e) => {
            updateCount(product.id, product.color, e.target.value);
          };
          // création du listener sur les delete -----
          deleteCommand.addEventListener("click", (e) => {
            deleteProduct(product.id, product.color);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
};

// Initialisation du panier
initCart();
