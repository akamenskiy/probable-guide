'use strict';

var MyForm = {};

MyForm.form = document.getElementById("myForm");
MyForm.fields = [
    {
        name: 'fio',
        validation: /^[А-Я][-а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+$/
    },
    {
        name: 'email',
        validation: /.@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com.)$/
    },
    {
        name: 'phone',
        validation: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/
    }
];
MyForm.submitButton = document.getElementById("submitButton");
MyForm.resultContainer = document.getElementById("resultContainer");
MyForm.submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    MyForm.submit();
});

MyForm.validate = function() {
    var phoneString;
    var phoneSum;

    var isFormValid = {
        isValid: true,
        errorFields: []
    };

    MyForm.fields.forEach(function(field) {
        var reg = field.validation;
        var isValid = reg.test(MyForm.form[field.name].value);
        if (!isValid) {
            isFormValid.errorFields.push(field.name);
        }
    });

    if (!isFormValid.errorFields['phone']) {
        phoneString = MyForm.form.phone.value.replace(/[-+()]/g, "");
        phoneSum = 0;
        for (var i = 0; i < phoneString.length; i++) {
            phoneSum += +phoneString[i];
        }
        if (phoneSum >= 30) {
            isFormValid.errorFields.push("phone");
        }
    }

    isFormValid.isValid = !isFormValid.errorFields.length;
    return isFormValid;
};

MyForm.getData = function() {
    var formData = {};
    MyForm.fields.forEach(function(field) {
        formData[field.name] = MyForm.form[field.name].value;
    });
    return formData;
};


MyForm.setData = function(dataObj) {
    MyForm.fields.forEach(function(field) {
        MyForm.form[field.name].value = dataObj[field.name];
    });
};

MyForm.submit = function() {
    var isFormValid = MyForm.validate();
    var fieldsNames = MyForm.fields.map(function(item) { return item.name });
    MyForm.clearErrors(fieldsNames);

    isFormValid.isValid ?
        MyForm.send() :
        MyForm.setErrors(isFormValid.errorFields);

};

MyForm.setErrors = function(errorFields) {
    errorFields.forEach(function(fieldName) {
        if (!MyForm.form[fieldName].classList.contains("error")) {
            MyForm.form[fieldName].classList.add("error");
        }
    });
};

MyForm.clearErrors = function(fields) {
    fields.forEach(function(fieldName) {
        if (MyForm.form[fieldName].classList.contains("error")) {
            MyForm.form[fieldName].classList.remove("error");
        }
    });
};

MyForm.response = function(response) {
    var responseObj = JSON.parse(response);
    MyForm.resultContainer.className = responseObj["status"];
    if (responseObj["status"] === "success") {
        MyForm.resultContainer.innerHTML = "Success";
    } else if (responseObj["status"] === "error") {
        MyForm.resultContainer.innerHTML = responseObj.reason;
    } else if (responseObj["status"] === "progress") {
        setTimeout(MyForm.send, responseObj.timeout);
    }
};

MyForm.send = function () {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            MyForm.response(xhttp.responseText);
        }
    };
    xhttp.open("POST", MyForm.form.action, true);
    xhttp.send();
};

var dataObj = {   // Объект для проверки MyForm.setData;
  fio: "Жэ Бэ Ка",
  age: 24,
  email: "none@ya.ru",
  phone: "+7(121)111-11-11"
};
