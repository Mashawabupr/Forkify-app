export const recipeContainer = document.querySelector(".recipe");
import { renderError, renderSpinner } from "./script.js";
let bookList = [];
import { bookmarksList } from "./script.js";
export let showRecipe = function () {
  //1 loading recipes
  let id = window.location.hash.slice(1);
  if (!id) return;
  renderSpinner(recipeContainer);
  fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
    .then((response) => response.json())

    .then((data) => {
      let { recipe } = data.data;

      let markup = ` <figure class="recipe__fig">
          <img src="${recipe.image_url}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="src/img/icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cooking_time
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="src/img/icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="src/img/icons.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--decrease-servings">
                <svg>
                  <use href="src/img/icons.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

         
          <button class="btn--round">
            <svg class="">
              <use class ="bookmark" href="src/img/icons.svg#icon-bookmark"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${recipe.ingredients
              .map((el) => {
                return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                el.quantity ? el.quantity : ""
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${el.unit}</span>
                ${el.description}
              </div>
            </li>`;
              })
              .join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
      recipeContainer.innerHTML = "";
      recipeContainer.insertAdjacentHTML("beforeend", markup);
      let servings = document.querySelector(".recipe__info-data--people");
      let quantity = document.querySelectorAll(".recipe__quantity");
      let use = document.querySelector(".bookmark");

      let h = document.getElementById(window.location.hash);
      let resultS = document.querySelector(".search-results");

      let messageB = document.getElementById("bMessage");

      let btn = document
        .querySelector(".btn--round")
        .addEventListener("click", () => {
          //document.getElementById("bMessage").outerHTML = "";

          if (
            use.getAttribute("href") == "src/img/icons.svg#icon-bookmark-fill"
          ) {
            use.setAttribute("href", "src/img/icons.svg#icon-bookmark");
            let m = bookList.indexOf(window.location.hash);
            bookList.splice(m, 1);
            bookmarksList.removeChild(h);
            resultS.prepend(h);
            persistBookmarks();

            if (bookList.length == 0) {
              messageB.style.display = "flex";
              //bookmarksList.appendChild(messageB);
            }
          } else {
            use.setAttribute("href", "src/img/icons.svg#icon-bookmark-fill");
            bookList.push(window.location.hash);
            messageB.style.display = "none";
            bookmarksList.appendChild(h);
            persistBookmarks();
          }
        });
      if (bookList.includes(window.location.hash)) {
        use.setAttribute("href", "src/img/icons.svg#icon-bookmark-fill");
      }
      let persistBookmarks = function () {
        localStorage.setItem("list", bookmarksList.innerHTML);
      };

      document
        .querySelector(".btn--decrease-servings")
        .addEventListener("click", handlerServingsU);
      document
        .querySelector(".btn--increase-servings")
        .addEventListener("click", handlerServingsD);
      function quantityAll(newservings, old) {
        quantity.forEach((el) => {
          if (el.innerHTML != "") {
            el.innerHTML = (el.innerHTML * newservings) / old;
          }
        });
      }
      function handlerServingsD() {
        if (Number(servings.innerHTML) > 1) {
          let old = servings.innerHTML;
          servings.innerHTML -= 1;
          quantityAll(Number(servings.innerHTML), Number(old));
        }
      }
      function handlerServingsU() {
        let old = servings.innerHTML;
        servings.innerHTML = Number(servings.innerHTML) + 1;
        quantityAll(Number(servings.innerHTML), Number(old));
      }
    })
    .catch((e) => {
      recipeContainer.innerHTML = "";
      renderError();
    });
};
