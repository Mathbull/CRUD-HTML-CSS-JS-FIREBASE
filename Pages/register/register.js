firebase.auth().onAuthStateChanged(user=>{
    if(user){
        window.location.href='../home/home.html'
    }
})



function OnChangeEmail(){
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validarEmail(email) ? "none" : "block";

    toggleRegisterButtonDisable()
}

function onChangePassword(){
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none": "block"
    form.passwordMinLengthError().style.display = password.length >=6 ? "none": "block"

    validatePasswordsMatch()
    toggleRegisterButtonDisable()
}

function onChangeConfirmPassoword(){
    validatePasswordsMatch()
    toggleRegisterButtonDisable()
}

function validatePasswordsMatch(){
    const confirmPassword = form.confirmPassword().value;
    const password = form.password().value
    form.passwordDoesntMatchError().style.display = (confirmPassword == password)? "none": "block"

    
}

function toggleRegisterButtonDisable(){
    if(isFormValid()){
        form.registerButton().classList.remove('disabled_button')
    }else{
        form.registerButton().classList.add('disabled_button')
    }
}

function isFormValid(){
    const email = form.email().value;
    if(!email || !validarEmail(email)){
        return false
    }

    const password = form.password().value;
    if(!password ||password.length < 6){
        return false;
    }

    const confirmPassword = form.confirmPassword().value
    if(password !=confirmPassword){
        return false;
    }

    return true;
}

function register(){
    showloading();

    const email = form.email().value
    const password = form.password().value
    firebase.auth().createUserWithEmailAndPassword(
        email, password
    ).then(()=>{
        hideLoading();
        window.location.href = '../../pages/home/home.html'
    }).catch(error =>{
        hideLoading();
        alert(getErrorMessage(error))
    })
}


function getErrorMessage(error){
    if(error.code == "auth/email-already-in-use"){
        console.log(error.code)
        return "Email já está em uso"
    }
    if(error.code == "auth/wrong-password"){
        return "Senha inválida!"
    }
    return error.message;
}

const form = {
    email: ()=>document.getElementById("email"),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),

    password: () => document.getElementById('password'),
    passwordRequiredError: ()=> document.getElementById('password-required-error'),
    passwordMinLengthError: () => document.getElementById('password-min-length-error'),

    confirmPassword: () => document.getElementById('confirmPassword'),
    passwordDoesntMatchError: () => document.getElementById('password-doesnt-match-error'),

    registerButton: () => document.getElementById('register-button')

}