// Caso seja uma atualização trazer os dados da nova transação senão não fzer nada
if(!isNewTransacation()){
    const uid = getTransactionUid();
    findTransactionsByUid(uid)
}


function onChangeDate(){
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none"
    toggleSaveButtonDisable()
}

function onChangeValue(){
    const value = form.value().value
    form.valueRequiredError().style.display = !value ? "block":"none"
    form.valueLessOrEqualToZeroError().style.display  = value <= 0 ? "block": 'none'
    toggleSaveButtonDisable()
}

function onChangeTransactionType(){
    const transactionType = form.transactionType().value

    form.transactionTypeRequiredError().style.display = !transactionType ? "block":'none'
    toggleSaveButtonDisable()
}

function  isFormValid(){
    const date = form.date().value;
    if(!date){ return false}
    
    const value = form.value().value;
    if(!value || value <=0){return false}

    const transactionType = form.transactionType().value;
    if(!transactionType){return}

    return true

}

//Cria transação
function createTransaction(){
    return {
        type: form.typeExpense().checked ? "expense" : "income",
        date: form.date().value,
        money:{
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactionType().value,
        description: form.desccription().value,
        user:{
            uid: firebase.auth().currentUser.uid
        }
    }
}

//Salvar transação se for new ou se é edição
function saveTransaction(){

    const transaction = createTransaction()
    
    if(isNewTransacation()){
        save(transaction)
    }else{
        update(transaction)
    }

}

//salva transação
function save(transaction){
    showloading()

    // Aqui havia um cod que iria salva uma nova transactions do user

    // Madar a nova transação para o firestore
    transactionService.save(transaction)
        .then(()=>{
            hideLoading();
            window.location.href = '../home/home.html'
        })
        .catch(()=>{
            hideLoading()
            alert('Erro ao salvar transação')
        })
}

// Salvar uma edição
function update(transaction){
    // mostrar componenete de carregando
    showloading()
    
     // Aqui havia um cod que iria autalizar a transactions do user

     transactionService.update(transaction)
        .then(()=>{
            hideLoading()
            window.location.href = '../home/home.html'
        })
        .catch(()=>{
            hideLoading()
            alert('Erro ao atualizar transação')
        })
}


// pegar o parametros passado na URL
function getTransactionUid(){
    const  urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid')
}

//Função para verificar se existe uma nova transação
function isNewTransacation(){
    return getTransactionUid() ? false : true;
}

// Função para pegar uma transação pelo uid e carregar na pagina de transaction
function findTransactionsByUid(uid){
    showloading()

    // Aqui havia um cod que iria buscar as transactions pelo uid

    transactionService.findByUid(uid)
    .then(transaction =>{
        hideLoading()
        if(transaction){
            fillTransactionScreen(transaction)
            toggleSaveButtonDisable()
        }else{
            alert('Documento não encontrado');
            window.location.href = '../home/home.html';
        }
    })
    .catch(()=>{
        hideLoading()
        alert('Erro ao recuperar documento')
        window.location.href = '../home/home.html';
    })
}

//Irá colocar os dados na tela transaction do UID para edição
function fillTransactionScreen(transaction){
    if(transaction.type == 'expense'){
        form.typeExpense().checked = true;
    }else{
        form.typeIncome().checked = true
    }

    form.date().value = transaction.date
    form.currency().value = transaction.money.currency
    form.value().value = transaction.money.value
    form.transactionType().value = transaction.transactionType
    form.desccription().value = transaction.description ?  transaction.description : ""

}



function toggleSaveButtonDisable(){
    const buttonSave = form.saveButton()
    if(isFormValid()){
        return form.saveButton().classList.remove('disabled_button')
    }
    return form.saveButton().classList.add('disabled_button')
}

const form = {
    typeExpense: ()=> document.getElementById('expense'),
    typeIncome:() => document.getElementById('income'),

    date: ()=> document.getElementById('date'),
    dateRequiredError: ()=> document.getElementById('date-required-error'),

    currency: ()=> document.getElementById("currency"),
    value: ()=> document.getElementById('value'),
    valueRequiredError: ()=> document.getElementById('value-required-error'),
    valueLessOrEqualToZeroError: ()=> document.getElementById('value-less-or-equal-to-zero-error'),

    transactionType: ()=> document.getElementById('transaction-type'),
    transactionTypeRequiredError: ()=> document.getElementById('transaction-type-required-error'),

    desccription: ()=> document.getElementById('description'),

    saveButton:()=> document.getElementById('save-button')
}