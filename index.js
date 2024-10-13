firebase.auth().onAuthStateChanged(user=>{
    if(user){
        window.location.href='pages/home/home.html'
    }
})



function isEmailValid(){
    const email = form.email().value;
    const recoverPasswordButton = form.recoverPasswordButton()
    if (!email || !validarEmail(email)){
        return recoverPasswordButton.classList.add('disabled_button')
    }
    return recoverPasswordButton.classList.remove('disabled_button')
    // pegar o valor do campo de email
    // verificar se o email não é vazio e se o email é valido
    // Se verdadeiro, então abilitar o botao de recuparar senha
    // se falso, entao desabilitar o botao de recuperar senha
    
}

function isPasswordValid(){
    const password = form.password().value
    const loginButton = form.loginButton()
    const email = form.email().value;

    if(!password || !email || !validarEmail(email)){
        return loginButton.classList.add('disabled_button')
        
    }
    return loginButton.classList.remove('disabled_button')
    
}

function toggleEmailError(){
    const email = form.email().value

    form.emailRequiredError().style.display = email ? "none": "block";
    form.emailInvalidError().style.display = validarEmail(email) ? "none": "block"
}

function togglePasswordErros(){
    const password = document.getElementById("password").value
    form.passwordRequiredError().style.display = password ? "none" : "block"
}

function toggleButtonsDisable(){
    isEmailValid()

    isPasswordValid()
    
}

function OnChangeEmail(){
    toggleButtonsDisable()
    toggleEmailError()
    
}
function onChangePassword(){
    toggleButtonsDisable();
    togglePasswordErros();
}

function login(){
    // degral@gmail.com.br
    // "123456789"
    showloading()
    firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value).then(Response =>{
        hideLoading()
        console.log("sucesso", Response)
        window.location.href= "pages/home/home.html"    
    }).catch(error =>{
        hideLoading()
        alert(getErrorMessage(error))
        console.log(getErrorMessage(error))
    })

    
}

function recoverPassword(){
    showloading();
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() =>{
        hideLoading();
        alert("Email enviado com sucesso");
    }).catch(error =>{
        hideLoading();
        alert(getErrorMessage(error))
    })

    
}

function getErrorMessage(error){
    if(error.code == "auth/invalid-credential"){
        console.log(error.code)
        return "Usuário não encontrado!"
    }
    if(error.code == "auth/wrong-password"){
        return "Senha inválida!"
    }
    return error.message;
}

function register(){
    // showloading()
    window.location.href = "pages/register/register.html"
}



const form = {
    email: () => document.getElementById('email'),
    password: () => document.getElementById('password'),
    loginButton: () =>  document.getElementById("loginButton"),
    recoverPasswordButton: () => document.getElementById('recover-password-button'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    passwordRequiredError:() => document.getElementById("password-required-error")

}