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
  const elemInCart = cart.find((e) => e.id === productId && e.color === color);
  cart.splice(cart.indexOf(elemInCart), 1);
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
const initCart = async function () {
  const sectionCart = document.getElementById("cart__items");

  if (cart !== []) {
    cart.map(async (product) => {
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
      await fetch(urlBack + product.id.toString())
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
  // Remplir le prix total
  getTotalOfItem();
  getTotal();
};

// Tests formulaires
/**
 * Vérifie si le prénom est valide
 * @param {string} firstName prénom à tester
 * @returns boolean
 */
const testFirstName = function (firstName) {
  const regex = /^[A-ZÀ-ÖØ-ẞ][A-Za-zÀ-ÖØ-öø-ÿ-]+$/g;
  return regex.test(firstName);
};

/**
 * Vérifie si le nom est valide
 * @param {string} lastName nom à tester
 * @returns boolean
 */
const testLastName = function (lastName) {
  const regex = /^[A-ZÀ-ÖØ-ẞ][A-Za-zÀ-ÖØ-öø-ÿ-]+$/g;
  return regex.test(lastName);
};

/**
 * Vérifie si l'adresse est valide
 * @param {string} address address à tester
 * @returns boolean
 */
const testAddress = function (address) {
  const regex = /^[0-9]{0,3}[A-Za-zÀ-ÖØ-öø-ÿ0-9\ -]{5,50}$/g;
  return regex.test(address);
};

/**
 * Vérifie si la ville est valide
 * @param {string} city ville à tester
 * @returns boolean
 */
const testCity = function (city) {
  const regex = /[A-ZÀ-ÖØ-ẞ][A-Za-zÀ-ÖØ-öø-ÿ\ -]+$/g;
  return regex.test(city);
};

/**
 * Vérifie si l'email est valide
 * @param {string} email email à tester
 * @returns boolean
 */
const testEmail = function (email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return regex.test(email);
};

/**
 * Initialisation des éléments du formulaire
 */
const initForm = function () {
  const submit = document.getElementById("order");
  submit.disabled = true;

  const firstName = document.getElementById("firstName");
  const firstNameError = document.getElementById("firstNameErrorMsg");

  const lastName = document.getElementById("lastName");
  const lastNameError = document.getElementById("lastNameErrorMsg");

  const address = document.getElementById("address");
  const addressError = document.getElementById("addressErrorMsg");

  const city = document.getElementById("city");
  const cityError = document.getElementById("cityErrorMsg");

  const email = document.getElementById("email");
  const emailError = document.getElementById("emailErrorMsg");

  const validateForm = function () {
    return (
      testFirstName(firstName.value) &&
      testLastName(lastName.value) &&
      testAddress(address.value) &&
      testCity(city.value) &&
      testEmail(email.value) &&
      cart !== []
    );
  };

  firstName.onchange = (e) => {
    if (testFirstName(e.target.value)) {
      firstNameError.innerText = "";
      if (validateForm()) {
        submit.disabled = false;
      }
    } else {
      firstNameError.innerText = "Veuillez renseigner un prénom valide.";
    }
  };

  lastName.onchange = (e) => {
    if (testLastName(e.target.value)) {
      lastNameError.innerText = "";
      if (validateForm()) {
        submit.disabled = false;
      }
    } else {
      lastNameError.innerText = "Veuillez renseigner un nom valide.";
    }
  };

  address.onchange = (e) => {
    if (testAddress(e.target.value)) {
      addressError.innerText = "";
      if (validateForm()) {
        submit.disabled = false;
      }
    } else {
      addressError.innerText = "Veuillez renseigner une adresse valide.";
    }
  };

  city.onchange = (e) => {
    if (testCity(e.target.value)) {
      cityError.innerText = "";
      if (validateForm()) {
        submit.disabled = false;
      }
    } else {
      cityError.innerText = "Veuillez renseigner une ville valide.";
    }
  };

  email.onchange = (e) => {
    if (testEmail(e.target.value)) {
      emailError.innerText = "";
      if (validateForm()) {
        submit.disabled = false;
      }
    } else {
      emailError.innerText = "Veuillez renseigner une adresse mail valide.";
    }
  };

  submit.addEventListener("click", (e) => {
    if (validateForm()) {
      // création de l'objet de la commande
      const command = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: JSON.parse(localStorage.cart).map((product) =>
          product.id.toString()
        ),
      };
      // submit
      fetch(urlBack + "order", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        method: "POST",
        body: JSON.stringify(command),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          // réinitialiser le panier
          localStorage.removeItem("cart");
          // redirection
          document.location.href =
            "./confirmation.html?order=" + res.orderId.toString();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    e.preventDefault();
  });
};

// Initialisation des tests Formulaires
initForm();
// Initialisation du panier
initCart();
