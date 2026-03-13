import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyBnq9n6P0yb2cbjuimFwH5vUZBYhYnWMyU",
  authDomain: "test-61e9a.firebaseapp.com",
  projectId: "test-61e9a",
  storageBucket: "test-61e9a.firebasestorage.app",
  messagingSenderId: "470527202630",
  appId: "1:470527202630:web:ae8a5f4404491aa34e0147"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productsRef = collection(db, "products");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const addBtn = document.getElementById("addBtn");
const productsDiv = document.getElementById("products");
const statusText = document.getElementById("status");

function showStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "crimson" : "green";
}

addBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const image = imageInput.value.trim();

  if (!name || !price) {
    showStatus("Enter a product name and price.", true);
    return;
  }

  try {
    await addDoc(productsRef, {
      name,
      price,
      image,
      createdAt: Date.now()
    });

    nameInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    showStatus("Product added.");
  } catch (error) {
    showStatus("Could not save product.", true);
    console.error(error);
  }
});

const productsQuery = query(productsRef, orderBy("createdAt", "desc"));

onSnapshot(productsQuery, (snapshot) => {
  productsDiv.innerHTML = "";

  snapshot.forEach((item) => {
    const product = item.data();
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img src="${product.image || "https://via.placeholder.com/400x180?text=No+Image"}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button class="delete-btn" data-id="${item.id}">Delete</button>
    `;

    productsDiv.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        await deleteDoc(doc(db, "products", id));
        showStatus("Product deleted.");
      } catch (error) {
        showStatus("Could not delete product.", true);
        console.error(error);
      }
    });
  });
});
