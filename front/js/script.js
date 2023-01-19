const urlBack = "http://localhost:3000/api/products/";

const itemsContainer = document.getElementById("items");

// Récupération des items
fetch(urlBack)
  .then((res) => {
    // Interprétation du body json
    return res.json();
  })
  .then((res) => {
    // Création des cartes products
    for (product of res) {
      // Link
      const link = document.createElement("a");
      link.href = "./product.html?id=" + product._id.toString();

      const article = document.createElement("article");

      // Image
      const img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.altTxt;

      // Titre
      const title = document.createElement("h3");
      title.classList.add("productName");
      title.innerText = product.name;

      // Description
      const description = document.createElement("p");
      description.classList.add("productDescription");
      description.innerText = product.description;

      // Imbrication des éléments
      article.append(img);
      article.append(title);
      article.append(description);
      link.append(article);

      itemsContainer.append(link);
    }
  })
  .catch((error) => {
    console.error(error);
  });
