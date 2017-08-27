'use strict';

var MyForm = {};

var myForm = document.getElementById("myForm");
var submitButton = document.getElementById("submitButton");
var resultContainer = document.getElementById("resultContainer");
MyForm.validate = function() {
    var isFormValid = {
        isValid:Boolean,
        errorFields: []
    };
    return isFormValid;
};
MyForm.getData = function() {
    var formData = {};
    var myFormLength = myForm.length;
    for (var i = 0; i < myFormLength-1; i++) {
        formData[myForm[i].name] = myForm[i].value;
    }
    return formData;

};
MyForm.setData = function(dataObj) {
    for (var inputName in dataObj) {
        if (!dataObj.hasOwnProperty(inputName)) continue;
        if (!myForm[inputName]) continue;
        myForm.elements[inputName].value = dataObj[inputName];
    }
};
MyForm.submit = function() {
    var isFio = /^[А-Я][-а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+$/.test(myForm.fio.value);
    if (!isFio && !myForm.fio.classList.contains("error")) {
        myForm.fio.classList.add("error");
    } else if (isFio && myForm.fio.classList.contains("error")) {
        myForm.fio.classList.remove('error');
    }
    var isEmail = /.@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com.)$/.test(myForm.email.value);
    if (!isEmail && !myForm.email.classList.contains("error")) {
        myForm.email.classList.add("error");
    } else if (isEmail && myForm.email.classList.contains("error")) {
        myForm.email.classList.remove('error');
    }
    var isPhone = false;
    var isPhoneMask = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(myForm.phone.value);
    if (isPhoneMask) {
        var phoneString = myForm.phone.value.replace(/[-+()]/g, "");
        var phoneSum = 0;
        for (var i = 0; i < phoneString.length; i++){
            phoneSum += +phoneString[i];
        }
        isPhone = (phoneSum <= 30);

    }
    if (!isPhone && !myForm.phone.classList.contains("error")) {
        myForm.phone.classList.add("error");
    } else if (isPhone && myForm.phone.classList.contains("error")) {
        myForm.phone.classList.remove('error');
    }



    function ajaxRequest() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var responseObj = JSON.parse(xhttp.responseText);
                resultContainer.className = responseObj["status"];
                if (responseObj["status"] === "success") {
                    resultContainer.innerHTML = "Success";
                } else if (responseObj["status"] === "error" ) {
                    resultContainer.innerHTML = responseObj.reason;
                } else if (responseObj["status"] === "progress") {
                    setTimeout(ajaxRequest, responseObj.timeout);
                }
            }
        };
        xhttp.open("POST", myForm.action, true);
        xhttp.send();
    }

    if (isFio && isEmail && isPhone) {
        ajaxRequest();
    }

};

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    MyForm.submit();
});

var dataObj = {
  fio: "Big Ben",
  age: 0,
  email: "none@none.en",
  phone: +9
};
