// Récupérer l'url de la page
const url = new URL(document.location.href);

// Récupérer l'id du produit
const order = url.searchParams.get("order");

// Si l'id de produit n'est pas renseigné, on revient à la page d'accueil
if (typeof order === undefined || order === null) {
  document.location.href = "./index.html";
}

// afficher dans le DOM
const orderDOM = document.getElementById("orderId");

orderDOM.innerText = order.toString();
