const urlBack = "http://localhost:3000/api/products/";

var cart =
  typeof localStorage.cart !== "undefined" ? JSON.parse(localStorage.cart) : [];

const sectionCart = document.getElementById("cart__items");

// Afficher les produits
if (cart !== []) {
  cart.map((product) => {
    // création des éléments du DOM de l'item
    const article = document.createElement("article");
    article.classList.add("cart__item");

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

    // fetch infos du produit
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

        // Assemblage de l'élément
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
        getTotal();
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

/**
 * Récupère les prix et en fait un total
 * @returns total des prix
 */
const getTotal = function () {
  const totalDOM = document.getElementById("totalPrice");
  if (cart !== []) {
    return new Promise((resolve, reject) => {
      var total = 0;
      cart.map((product) => {
        fetch(urlBack + product.id)
          .then((res) => res.json())
          .then((res) => {
            total = total + Number(product.count) * res.price;
          })
          .catch((error) => {
            console.error(error);
          });
      });
      resolve(total);
    }).then((res) => {
      totalDOM.innerText = res.toString();
      return res;
    });
  } else {
    totalDOM.innerText = "0";
    return 0;
  }
};
