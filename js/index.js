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
let flag = false;
let GlobalId = 0;
let regex = {
  name: /^[A-Z][a-z]{2,20}$/,
  price: /^([6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
  selected: /^(TV|Electronic|Smart ?Watch)$/i,
  description: /^.{3,250}$/,
  file: /.+\.(png|jpg)/,
};
document.querySelectorAll(".inpEvent").forEach((e) => {
  e.addEventListener("input", (el) => {
    validationInputs(el.target);
  });
});

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
  if (validationInputs(file)) {
    imageFig.setAttribute("src", `./imgs/${file.files[0]?.name}`);
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
  // if (!file.files[0] && flag == false) {
  //   if (!validationInputs(file)) {
  //     valid = false;
  //   }
  // } else if (file.files[0] && flag == true) {
  //   if (!validationInputs(file)) {
  //     valid = false;
  //   }
  // }
  return valid;
}
function addOrUpdate(GlobalId = 0, flag = false) {
  console.log(flag,GlobalId);
  let objData = {
    id: Date.now(),
    name: name.value,
    price: price.value,
    description: description.value,
    selected: selected.value,
    // name Only Without Path
    file: file.files[0]?.name ? file.files[0]?.name : imageFig.getAttribute("src").split("/")[2],
  };
  console.log(objData.file);
  if (confirmValidationForms()) {
    if (flag && GlobalId) {
      Products = Products.map((e) => {
        if (e.id == GlobalId) {
          return { ...e, ...objData };
        } else {
          return e;
        }
      });
    } else {
      Products.push(objData);
    }
    localStorage.setItem("arrProducts", JSON.stringify(Products));
    document.getElementById("btnAdd").innerText = "Add Product";
    document.getElementById("btnAdd").classList.replace("btn-warning", "btn-dark");
    display();
    clear();
  }
  GlobalId = 0;
  flag = false;
}

function display() {
  let box = Products.map((e) => {
    return `<div class="col-md-4">
            <div class="inner text-center p-2 rounded-2 shadow-sm">
              <div class="img mb-2">
              <img src="./imgs/${e.file}" class="w-100 img-custom d-block" alt="" />
              </div>
              <span>name:${e.name}</span>
              <div class="price-cat mb-2 mt-2 d-flex align-items-center justify-content-between">
                <span class="badge text-bg-primary text-nowrap">Cat:${e.selected}</span>
                <span>price:${e.price}$</span>
              </div>
              <p class='my-3'>
                ${e.description.slice(0, 20)}...
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
  if (Products.length) {
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

function validationInputs(el, size = -1) {
  // if (size != -1) {
  //   if (regex[el.id].test(el.getAttribute("src")) && +(size / 1024).toFixed(2) < 12000) {
  //     imageFig.classList.add("green");
  //     imageFig.classList.remove("red");
  //     return true;
  //   } else {
  //     imageFig.classList.add("red");
  //     imageFig.classList.remove("green");
  //     return false;
  //   }
  // } else {

  if (regex[el.id].test(el.value)) {
    el.classList.add("is-valid");
    el.classList.remove("is-invalid");
    if (el.id == "file") {
      imageFig.classList.add("green");
      imageFig.classList.remove("red");
    }
    return true;
  } else {
    el.classList.add("is-invalid");
    el.classList.remove("is-valid");
    if (el.id == "file") {
      imageFig.classList.add("red");
      imageFig.classList.remove("green");
    }
    return false;
  }
  // }
}