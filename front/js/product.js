const urlBack = "http://localhost:3000/api/products/";

// Éléments du DOM
const imageContainer = document.getElementsByClassName("item__img")[0];
const image = document.createElement("img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colorsContainer = document.getElementById("colors");

// Récupérer l'url de la page
const url = new URL(document.location.href);

// Récupérer l'id du produit
const idProduct = url.searchParams.get("id");

// Si l'id de produit n'est pas renseigné, on revient à la page d'accueil
if (typeof idProduct === undefined || idProduct === null) {
  document.location.href = "./index.html";
}

// Récupérer le produit
fetch(urlBack + idProduct)
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    // Image
    image.src = res.imageUrl;
    image.alt = res.altTxt;
    imageContainer.append(image);

    // Map des infos de produit
    title.innerText = res.name;
    price.innerText = res.price;
    description.innerText = res.description;

    // Colors
    for (color of res.colors) {
      const option = document.createElement("option");
      option.value = color;
      option.innerText = color;
      colorsContainer.append(option);
    }
  })
  .catch((error) => {
    console.error(error);
  });

// gestion du panier

/**
 * Récupère les données pour créer l'élément pour le panier
 * @returns l'élément prêt pour le panier
 */
const getElemProduct = function () {
  return (elem = {
    id: idProduct,
    count: document.getElementById("quantity").value,
    color: document.getElementById("colors").value,
  });
};

/**
 * Contrôle si la couleur est renseignée et si la quantité est supérieure à 0
 * @returns boolean
 */
const testInputs = function () {
  return (
    document.getElementById("colors").value !== "" &&
    Number(document.getElementById("quantity").value) > 0
  );
};

// Gestion de l'évènement du click sur le bouton AddToCart
const buttonAddToCart = document
  .getElementById("addToCart")
  .addEventListener("click", () => {
    if (testInputs()) {
      // récupération du panier
      var cart =
        typeof localStorage.cart !== "undefined"
          ? JSON.parse(localStorage.cart)
          : [];

      // création de l'élément du panier
      const elem = getElemProduct();

      // vérifier la présence d'un produit de la même couleur
      if (cart.some((e) => e.id === idProduct && e.color === elem.color)) {
        // récupérer elem de la liste cart
        const elemInCart = cart.find(
          (e) => e.id === idProduct && e.color === elem.color
        );
        cart[cart.indexOf(elemInCart)] = {
          id: idProduct,
          count: (Number(elemInCart.count) + Number(elem.count)).toString(), //incrémenter
          color: elem.color,
        };
      } else {
        cart.push(elem);
      }
      // sauvegarde du panier
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(elem.count + " articles ajoutés au panier !");
    } else {
      alert("Veuillez renseigner une couleur et une quantité !");
    }
  });
