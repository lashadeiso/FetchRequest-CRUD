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

class HttpWorker {
  //--Get All Admins
  static getAllAdmins(func) {
    var fullApi =
      "https://testingservice.azurewebsites.net/api/user/getAllAdmins";
    fetch(fullApi, {
      method: "GET",
      headers: new Headers({
        authorization: `bearer ${localStorage["token"]}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => func(response));
  }

  //--Get All Users
  static getAllUsers(func) {
    var fullApi = "https://testingservice.azurewebsites.net/api/user/getAll";
    fetch(fullApi, {
      method: "GET",
      headers: new Headers({
        authorization: `bearer ${localStorage["token"]}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => func(response));
  }

  //--Admin Registration
  static registerAdmin(userItem, func) {
    const fullUrl =
      "https://testingservice.azurewebsites.net/api/user/registerAdmin";
    fetch(fullUrl, {
      method: "POST",
      headers: new Headers({
        authorization: `bearer ${localStorage["token"]}`,
        "content-type": "application/json",
      }),
      body: JSON.stringify(userItem),
    })
      .then((response) => response.json())
      .then((responce) => {
        func(responce);
        swal("Registration was completed successfully ", "", "success");
      })
      .catch((error) => {
        swal("Registration was not completed successfully ", "", "error");
        console.log(error);
      });
  }
}

//--html render
function htmlRender(data) {
  const section2body = document.querySelector(".section-2-body");
  section2body.innerHTML = "";
  data.forEach((item) => {
    section2body.innerHTML += `
    <tr>
      <td>${item.id}</td>
      <td>${item.email}</td>
    </tr>
    `;
  });
}

//--Get all Users
const allUser = document.querySelector("#allUser");
allUser.addEventListener("click", () => {
  HttpWorker.getAllUsers((res) => {
    htmlRender(res);
  });
});

//--Get All Admin
const allAdmin = document.querySelector("#allAdmin");
allAdmin.addEventListener("click", () => {
  HttpWorker.getAllAdmins((res) => {
    htmlRender(res);
  });
});

//------
const fuulName = document.querySelector("#fullName");
const eMail = document.querySelector("#eMail");
const password = document.querySelector("#password");
const confPass = document.querySelector("#confPass");
const registerAdmin = document.querySelector(".register");

registerAdmin.addEventListener("submit", () => {
  constadminItem = {
    userName: fuulName.value,
    email: eMail.value,
    password: password.value,
  };
  HttpWorker.registerAdmin(constadminItem, (res) => {
    console.log(res);
    HttpWorker.getAllAdmins((res) => {
      htmlRender(res);
    });
  });
  (fuulName.value = ""),
    (eMail.value = ""),
    (password.value = ""),
    (confPass.value = "");
});
