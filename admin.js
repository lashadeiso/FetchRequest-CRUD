//--Hi User--მისალმება ნავბარში
const welcome = document.querySelector(".welcome");
welcome.innerHTML = `Hi ${JSON.parse(localStorage["claims"]).unique_name}`;

//------------LogOut Btn-----------------
const logOutBtn = document.querySelector("#logOut");
logOutBtn.addEventListener("click", function () {
  localStorage.clear();
  location.href = "./index.html";
});
//----JWT Decoter Function
function jwtDecoder(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

//--Http Worker
class HttpWorker {
  //--Get All Contacts
  static getAllContacts(func) {
    var fullApi = "https://testingservice.azurewebsites.net/api/Contract";
    fetch(fullApi, {
      method: "GET",
      headers: new Headers({
        authorization: `bearer ${localStorage["token"]}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => func(response));
  }

  //--Add Contact
  static addContact(contactItem, func) {
    var fullApi = "https://testingservice.azurewebsites.net/api/Contract";
    fetch(fullApi, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        authorization: `bearer ${localStorage["token"]}`,
      }),
      body: JSON.stringify(contactItem),
    })
      .then((response) => response.json())
      .then((response) => func(response))
      .catch((error) => {
        swal("Somtehing went wrong ", "", "error");
        console.log(error);
      });
  }

  //--Delete Contact
  static deleteContact(itemId, func) {
    var fullApi = `https://testingservice.azurewebsites.net/api/Contract/${itemId}`;
    fetch(fullApi, {
      method: "DELETE",
      headers: new Headers({
        "content-type": "application/json",
        authorization: `bearer ${localStorage["token"]}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => func(response))
      .catch((error) => {
        swal("Somtehing went wrong ", "", "error");
        console.log(error);
      });
  }

  //--Update Contact
  static updateContact(updateItem, func) {
    var fullApi = `https://testingservice.azurewebsites.net/api/Contract`;
    fetch(fullApi, {
      method: "PUT",
      headers: new Headers({
        "content-type": "application/json",
        authorization: `bearer ${localStorage["token"]}`,
      }),
      body: JSON.stringify(updateItem),
    })
      .then((response) => response.json())
      .then((response) => func(response))
      .catch((error) => {
        swal("Somtehing went wrong ", "", "error");
        console.log(error);
      });
  }
}

//--Html Render
function htmlRender(data) {
  const dataArea = document.querySelector(".table-data-area");
  dataArea.innerHTML = "";
  data.forEach((item) => {
    dataArea.innerHTML += `
    <tr>
    <td>${item.id}</td>
    <td>${item.vinCode}</td>
    <td>${item.price}</td>
    <td>${item.amountPaid}</td>
    <td>${item.amountToBePaid}</td>
    <td>${item.purchase}</td>
    <td>${item.container}</td>
    <td>${item.carManufacture}</td>
    <td>${item.carModel}</td>
    <td>${item.year}</td>
    <td><button class="updateBtn" onclick="updateContactItem(${item.id})">Update</button></td>
    <td><button class="deleteBtn" onclick="deleteAndNewRender(${item.id})">Delete</button></td>
    </tr>
    `;
  });
}

//--ჩატვირთვისთანავე რო წამოიღოს კონტაქტების ლისთი
HttpWorker.getAllContacts((res) => {
  htmlRender(res);
});

//-- Contact Item Class
class ContactItem {
  constructor(
    userId,
    vinCode,
    price,
    amountPaid,
    amountToBePaid,
    purchase,
    container,
    carManufacture,
    carModel,
    year
  ) {
    this.userId = userId;
    this.vinCode = vinCode;
    this.price = price;
    this.amountPaid = amountPaid;
    this.amountToBePaid = amountToBePaid;
    this.purchase = purchase;
    this.container = container;
    this.carManufacture = carManufacture;
    this.carModel = carModel;
    this.year = year;
  }
}

//-- Add Contact Data
const saveBtn = document.querySelector(".save-btn");
const allContactInputs = document.querySelectorAll(".register-control");
saveBtn.addEventListener("click", () => {
  const vinCode = document.querySelector("#vinCode").value;
  const price = document.querySelector("#price").value;
  const amountPaid = document.querySelector("#amountPaid").value;
  const amountToBePaid = document.querySelector("#amountToBePaid").value;
  const purchase = document.querySelector("#purchase").value;
  const container = document.querySelector("#container").value;
  const carManufacture = document.querySelector("#carManufacture").value;
  const carModel = document.querySelector("#carModel").value;
  const year = document.querySelector("#year").value;
  const userId = jwtDecoder(localStorage.getItem("token")).nameid;

  const conItem = new ContactItem(
    userId,
    vinCode,
    +price,
    +amountPaid,
    +amountToBePaid,
    purchase,
    container,
    carManufacture,
    carModel,
    year
  );
  HttpWorker.addContact(conItem, (res) => {
    console.log(res);
    HttpWorker.getAllContacts((res) => {
      htmlRender(res);
      document.querySelector("#vinCode").value = "";
      document.querySelector("#price").value = "";
      document.querySelector("#amountPaid").value = "";
      document.querySelector("#amountToBePaid").value = "";
      document.querySelector("#purchase").value = "";
      document.querySelector("#container").value = "";
      document.querySelector("#carManufacture").value = "";
      document.querySelector("#carModel").value = "";
      document.querySelector("#year").value = "";
    });
  });
});

//--Function for Delete Button
function deleteAndNewRender(itemId) {
  HttpWorker.deleteContact(itemId, (res) => {
    console.log(res);
    HttpWorker.getAllContacts((res) => {
      htmlRender(res);
    });
  });
}

//----------Open Modal For Update-----
let saveContactId = "";
const modalOpenBtn = document.querySelector("#modalOpen");
function updateContactItem(itemId) {
  modalOpenBtn.click();
  saveContactId = itemId;
}

//---Sav To Update Info

function updateSave() {
  const updateVinCode = document.querySelector("#updateVinCode").value;
  const updatePrice = document.querySelector("#updatePrice").value;
  const updateAmountPaid = document.querySelector("#updateAmountPaid").value;
  const updateAmountToBePaid = document.querySelector(
    "#updateAmountToBePaid"
  ).value;
  const updatePurchase = document.querySelector("#updatePurchase").value;
  const updateContainer = document.querySelector("#updateContainer").value;
  const updateCarManufacture = document.querySelector(
    "#updateCarManufacture"
  ).value;
  const updateCarModel = document.querySelector("#updateCarModel").value;
  const updateYear = document.querySelector("#updateYear").value;
  const newItem = {
    id: saveContactId,
    userId: +JSON.parse(localStorage["claims"]).nameid,
    vinCode: updateVinCode,
    price: +updatePrice,
    amountPaid: +updateAmountPaid,
    amountToBePaid: +updateAmountToBePaid,
    purchase: updatePurchase,
    container: updateContainer,
    carManufacture: updateCarManufacture,
    carModel: updateCarModel,
    year: updateYear,
  };
  HttpWorker.updateContact(newItem, () => {
    HttpWorker.getAllContacts((res) => {
      console.log(newItem);
      htmlRender(res);
      modalOpenBtn.click();
      document.querySelector("#updateVinCode").value = "";
      document.querySelector("#updatePrice").value = "";
      document.querySelector("#updateAmountPaid").value = "";
      document.querySelector("#updateAmountToBePaid").value = "";
      document.querySelector("#updatePurchase").value = "";
      document.querySelector("#updateContainer").value = "";
      document.querySelector("#updateCarManufacture").value = "";
      document.querySelector("#updateCarModel").value = "";
      document.querySelector("#updateYear").value = "";
    });
  });
}
