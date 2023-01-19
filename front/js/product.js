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
