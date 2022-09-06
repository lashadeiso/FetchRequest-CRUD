// ---For SignIn/SignUp form
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.addEventListener("click", () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});

function returnToSignIn() {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
}

loginBtn.addEventListener("click", () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
});
signupLink.addEventListener("click", () => {
  signupBtn.click();
  return false;
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

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

//--Check Token Function-ტოკენით ვამოწმებ ვის ფეიჯზე უნდა გადავიდეს
function checkToken() {
  if (localStorage["token"] && localStorage["token"].length > 0) {
    const claims = jwtDecoder(localStorage["token"]);
    const role = claims.role;
    const uniqName = claims.unique_name;
    if (uniqName === "superAdmin") {
      location.href = "./superAdmin.html";
    } else if (role === "Admin") {
      location.href = "./admin.html";
    } else if (role === "Customer") {
      location.href = "./customer.html";
    }
  }
}
checkToken();

//---Selectors For SignIn
const signInEMailInp = document.querySelector("#signInEMail");
const signInPasswordInp = document.querySelector("#signInPassword");
const signInBtn = document.querySelector("#signInBtn");

class HttpWorker {
  static baseApiUrl = "https://testingservice.azurewebsites.net/api";
  //--SignIn
  static logIn(logInData, func) {
    var fullUrl = `${HttpWorker.baseApiUrl}/User/LogIn`;
    fetch(fullUrl, {
      method: "POST",
      body: JSON.stringify(logInData),
      headers: new Headers({
        "content-type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((response) => func(response))
      //აი უკვე აქ respose ში არის ტოკენის ობიექტი,და თუ გვინდა ტოკენი ამოვიღოთ
      //დაგვჭირდება responce.jwt,რასაც გავაკეთებ func ში გადაცემის დროს
      .catch((error) => {
        swal("LogIn was not Successfully", "", "error");
        console.log(error);
      });
  }

  //--SignUp
  static customerSignUp(userItem, func) {
    const fullUrl = `${HttpWorker.baseApiUrl}/user/registerUser?api-version=1`;
    fetch(fullUrl, {
      method: "POST",
      headers: new Headers({
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

signInBtn.addEventListener("click", () => {
  const logInUser = {
    email: signInEMailInp.value,
    password: signInPasswordInp.value,
  };

  HttpWorker.logIn(logInUser, (res) => {
    localStorage["token"] = res.jwt;
    localStorage["claims"] = JSON.stringify(jwtDecoder(res.jwt));
    checkToken();
  });
});

//--Select Fro Sign Up
const signUpFullName = document.querySelector("#signUpFullName");
const signUpEMail = document.querySelector("#signUpEMail");
const signUpPassword = document.querySelector("#signUpPassword");
const signUpBtn = document.querySelector("#signUpBtn");
const headerLogInBTN = document.querySelector(".headerLogInBTN");

signUpBtn.addEventListener("click", () => {
  const signUpUser = {
    userName: signUpFullName.value,
    email: signUpEMail.value,
    password: signUpPassword.value,
  };

  HttpWorker.customerSignUp(signUpUser, (res) => {
    console.log(res);
    document.querySelector("#signUpFullName").value = "";
    document.querySelector("#signUpEMail").value = "";
    document.querySelector("#signUpPassword").value = "";
    document.querySelector("#signUpConfirmPassword").value = "";
    headerLogInBTN.click();
  });
});
