//--Hi User--მისალმება ნავბარში
const welcome = document.querySelector(".welcome");
welcome.innerHTML = `Hi ${JSON.parse(localStorage["claims"]).unique_name}`;

//------------LogOut Btn-----------------
const logOutBtn = document.querySelector("#logOut");
logOutBtn.addEventListener("click", function () {
  localStorage.clear();
  location.href = "./index.html";
});

//--Http Worker
class HttpWorker {
  //--Get All Admins
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
}

//--html render
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
    </tr>
    `;
  });
}

//--ჩატვირთვისთანავე რო წამოიღოს კონტაქტების ლისთი
HttpWorker.getAllContacts((res) => {
  htmlRender(res);
});
