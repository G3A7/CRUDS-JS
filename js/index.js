/*
to change byte to kB ==> (byte)/1024
*/

// Global Var Ex.
const name = document.getElementById("name");
const price = document.getElementById("price");
const selected = document.getElementById("selected");
const file = document.getElementById("file");
const description = document.getElementById("description");
const imageFig = document.getElementById("imageFig");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const ulInfo = document.querySelector(".ul-info");
const arrayInputs = Array.from(document.querySelectorAll(".inpEvent"));
arrayInputs.push(selected, imageFig);
let flag = false;
let GlobalId = 0;
let regex = {
  name: /^[A-Z][a-z]{2,20}$/,
  price: /^([6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
  selected: /^(TV|Electronic|Smart ?Watch)$/i,
  description: /^.{3,250}$/,
  imageFig: /.+\.(png|jpg)/,
};

let info = {
  name: "Name must be at least 3 characters long",
  price: "Price must be between 6000 and 60000",
  selected: " category Must be (TV | Electronics)",
  description: "Description must be at least 3 characters ",
  imageFig: "image must be extention (jpg | png )",
};
// for (item in info){
//   console.log(item)
// }
document.querySelectorAll(".inpEvent").forEach((e) => {
  e.addEventListener("input", (el) => {
    validationInputs(el.target);
  });
});
function resetFlagAndId() {
  flag = false;
  GlobalId = 0;
}
selected.addEventListener("change", (e) => {
  validationInputs(e.target);
});

let Products = localStorage.getItem("arrProducts")
  ? JSON.parse(localStorage.getItem("arrProducts"))
  : [];
// console.log(localStorage.getItem("arrProducts"));
display();

file.addEventListener("change", () => {
  // bug
  // if (validationInputs(imageFig)) {
  // }
  // console.log(validationInputs(imageFig));
  imageFig.setAttribute("src", `./imgs/${file.files[0]?.name}`);
  if (validationInputs(imageFig)) {
    imageFig.classList.add("green");
  }
});
document.getElementById("btnAdd").addEventListener("click", function () {
  addOrUpdate(GlobalId, flag);
});
function confirmValidationForms() {
  let valid = true;
  if (!validationInputs(name)) {
    valid = false;
  }
  if (!validationInputs(price)) {
    valid = false;
  }
  if (!validationInputs(description)) {
    valid = false;
  }
  if (!validationInputs(selected)) {
    valid = false;
  }
  if (!validationInputs(imageFig)) {
    valid = false;
  }
  return valid;
}
function addOrUpdate(GlobalId = 0, flag = false) {
  // console.log(flag, GlobalId);
  let objData = {
    id: Date.now(),
    name: name.value,
    price: price.value,
    description: description.value,
    selected: selected.value,
    // name Only Without Path
    file: file.files[0]?.name ? file.files[0]?.name : imageFig.getAttribute("src").split("/")[2],
  };
  if (confirmValidationForms()) {
    console.log(flag, GlobalId);
    if (flag && GlobalId) {
      Products = Products.map((e) => {
        if (e.id == GlobalId) {
          return { ...e, ...objData };
        } else {
          return e;
        }
      });
      console.log("I' here");
    } else {
      Products.push(objData);
    }
    localStorage.setItem("arrProducts", JSON.stringify(Products));
    document.getElementById("btnAdd").innerText = "Add Product";
    document.getElementById("btnAdd").classList.replace("btn-warning", "btn-dark");
    display();
    clear();
  } else {
    ulInfo.innerHTML = "";
    let inputError = arrayInputs.filter((e) => {
      return !validationInputs(e);
    });
    // console.log(inputError);
    inputError.forEach((e) => {
      for (key in info) {
        if (key == e.id) {
          ulInfo.innerHTML += `<li>
            <i class="fa-solid fa-pen-to-square"></i>
           ${info[key]}
          </li>`;
        }
      }
    });
    document.querySelector(".box-black").classList.replace("d-none", "position-fixed");
  }
  resetFlagAndId();
}

function display(list = Products) {
  document.getElementById("rowData").innerHTML = "";
  let box = list.map((e) => {
    return `<div class="col-md-4">
            <div class="inner text-center p-2 rounded-2 shadow-sm">
              <div class="img mb-2">
              <img src="./imgs/${e.file}" class="w-100 img-custom d-block" alt="" />
              </div>
              <p>name:${e.nickName ? e.nickName : e.name}</p>
              <div class="price-cat mb-2 mt-2 d-flex align-items-center justify-content-between">
                <span class="badge text-bg-primary text-nowrap">Cat:${e.selected}</span>
                <span>price:${e.price}$</span>
              </div>
              <p class='my-3'>
                ${e.descriptionTemp ? e.descriptionTemp : e.description.slice(0, 20)}...
              </p>
              <div class="btns mt-5">
                <button onclick='setDataToUpdate(${e.id})'  class="btn btn-warning">Update</button>
                <button  onclick='deleteProducts(${e.id})' class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>`;
  });
  // many ways to display
  document.getElementById("rowData").innerHTML = box.join("").split(",").join("");
  if (list.length) {
    document.getElementById("notFound").classList.replace("d-block", "d-none");
  } else {
    document.getElementById("notFound").classList.replace("d-none", "d-block");
  }
}
function setDataToUpdate(id) {
  document.getElementById("btnAdd").innerText = "Update";
  document.getElementById("btnAdd").classList.replace("btn-dark", "btn-warning");
  const objData = Products.find((e) => {
    return e.id === id;
  });
  //    tricks
  window.scrollTo({
    top: 0,
    scroll: "smooth",
  });
  flag = true;
  GlobalId = objData.id;

  clear(objData);
}
function clear(data) {
  name.value = data ? data.name : "";
  price.value = data ? data.price : "";
  description.value = data ? data.description : "";
  selected.value = data ? data.selected : "";
  if (!data) {
    file.value = "";
  }
  imageFig.setAttribute("src", `${data ? "./imgs/" + data.file : "https://placehold.co/400x400"}`);
  name.classList.remove("is-valid");
  price.classList.remove("is-valid");
  description.classList.remove("is-valid");
  file.classList.remove("is-valid");
  selected.classList.remove("is-valid");
  imageFig.classList.remove("green");
}

function deleteProducts(id) {
  Products = Products.filter((e) => {
    return e.id != id;
  });
  localStorage.setItem("arrProducts", JSON.stringify(Products));
  display();
}

function validationInputs(el) {
  if (el.id == "imageFig") {
    // console.log(el.id);
    if (
      regex[el.id].test(el.getAttribute("src")) &&
      el.getAttribute("src") != "https://placehold.co/400x400"
    ) {
      imageFig.classList.add("green");
      imageFig.classList.remove("red");
      return true;
    } else {
      imageFig.classList.add("red");
      imageFig.classList.remove("green");
      return false;
    }
  }
  if (regex[el.id].test(el.value)) {
    el.classList.add("is-valid");
    el.classList.remove("is-invalid");

    return true;
  } else {
    el.classList.add("is-invalid");
    el.classList.remove("is-valid");
    return false;
  }
  // }
}

// Search
search.addEventListener("input", (el) => {
  const regexSearch = new RegExp(el.target.value, "i");
  const searchArr = Products.filter((e) => {
    e.nickName = e.name.replace(regexSearch, `<span class='text-info'>${el.target.value}</span>`);
    e.descriptionTemp = e.description.replace(
      regexSearch,
      `<span class='text-info'>${el.target.value}</span>`
    );
    return regexSearch.test(e.name) || regexSearch.test(e.description);
  });
  display(searchArr);
});

// Sort By Price And CreatedAt
filter.addEventListener("change", (e) => {
  // bug if price == price another
  if (e.target.value == "price") {
    console.log("Price");
    const minPrice = Products.map((e) => {
      return +e.price;
    });
    minPrice.sort((a, b) => {
      return a - b;
    });
    console.log(minPrice);
    let sortPrice = [];
    console.log(sortPrice);
    minPrice.forEach((p) => {
      Products.forEach((e) => {
        if (p == +e.price) {
          sortPrice.push(e);
        }
      });
    });
    console.log(sortPrice);
    Products = [...sortPrice];
    console.log(Products);
  } else if (e.target.value == "created") {
    // console.log("created");
    const idDate = Products.map((e) => {
      return +e.id;
    });
    idDate.sort((a, b) => {
      return a - b;
    });
    let sortCreated = [];
    idDate.forEach((p) => {
      Products.forEach((e) => {
        if (p == +e.id) {
          sortCreated.push(e);
        }
      });
    });
    Products = [...sortCreated];
  } else if (e.target.value == "Default") {
    Products = JSON.parse(localStorage.getItem("arrProducts"));
  }
  console.log(Products);
  display(Products);
});

document.querySelector(".close").addEventListener("click", function () {
  document.querySelector(".box-black").classList.replace("position-fixed", "d-none");
});
