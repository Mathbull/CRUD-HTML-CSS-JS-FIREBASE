function logout(){
    firebase.auth().signOut().then(()=>{
        window.location.href = '../../index_.html'
    }).catch(()=>{
        alert('Erro ao fazer logOut')
    })
}

firebase.auth().onAuthStateChanged(user =>{
    if(user){
        findTransactions(user)
    }
})


function newTransaction(){
    window.location.href = '../transaction/transaction.html'
}

findTransactions()

function findTransactions(user){
    showloading()

    // Aqui havia um cod que iria buscar as transactions do user
    
    // agora no transaction.serve, pois acessao o backend
    transactionService.findByUser(user)
    .then(transactions =>{
            hideLoading()
    
            addTransactionsToScreen(transactions)
    })
    .catch(error =>{
        hideLoading();
        console.log('err',error)
        alert('Error ao recuperar transações')
    })


}

function addTransactionsToScreen(transactions){
    const orderLista = document.getElementById('transactions')

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction)

        // Adicionando botão de delete de evento
        li.appendChild(createDeleteButton(transaction))

        li.appendChild(createParagraph(formatarDate(transaction.date)))

        li.appendChild(createParagraph(formatMoney(transaction.money)))

        li.appendChild(createParagraph(transaction.type))

        if(transaction.description){
            li.appendChild(createParagraph(transaction.description))
        }

        orderLista.appendChild(li);

        
    }); 
    //forEach (elemento => {}) Equivale a:
    // for(i=0; i<transactions.length; i++){
    //     let transactions[i]
    // }
}

// Criando uma novas funçãos para diminuir a função addTransactionsToScreen q esta muito grande
function createTransactionListItem(transaction){
    const li = document.createElement('li');
    li.classList.add(transaction.type)
    // gerando um id com o UID para cada lista
    li.id = transaction.uid

    // Caso queira editar, basta clicar no evento
    li.addEventListener('click', ()=>{
    //é redirecionado para a pagina de transaction, passando parametros: uid da transaction
    window.location.href = '../transaction/transaction.html?uid=' + transaction.uid;
    })
    return li;
}

function createDeleteButton(transaction){
    // Adicionando botão de delete de evento
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Remover'
    deleteButton.classList.add('outline','danger')
    // Adicionando a funcionalidade quando clicado no button de perguntar e remover
    deleteButton.addEventListener('click', event =>{
        // No caso de um click em um filho, esse click se propaga ao pai e por assim em diante
        event.stopPropagation();
        askRemoverTransaction(transaction);
    })
    return deleteButton
}

function createParagraph(value){
    const element = document.createElement('p')
    element.innerHTML = value 
    return element
}
// fim da redução da função


function formatarDate(date){
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money){
    return `${money.currency} ${money.value.toFixed(2)}`
}

//Função para perguntar e remover transação
function askRemoverTransaction(transaction){
    const shouldRemove = confirm('Deseja remover a transação?')

    // Se o shouldRemove for true então clicou em confimar o delete, senão não
    if(shouldRemove){
        // chamando função para remover a transaction
        RemoveTransaction(transaction);
    }
}

// remove a transaction
function RemoveTransaction(transaction){
    showloading()

    // Aqui havia um cod que iria remove a transactions q recebeu click    

    transactionService.remove(transaction)
        .then(()=>{
                hideLoading();
                // Pega o id da lista removovida e remove ela da tela
                document.getElementById(transaction.uid).remove();
            })
            .catch( error =>{
                hideLoading();
                console.log(error)
                alert('Erro ao remover transação')
            })
}


// const fakeTransactions = [{
//     type: 'expense',
//     date: '2024-01-01',
//     money: {
//         currency: 'R$',
//         value: 10
//     },
//     transactionType: 'Supermercado'
// },
// {
//     type: 'income',
//     date: '2024-09-05',
//     money: {
//         currency: 'R$',
//         value: 37000
//     },
//     transactionType: 'Salário',
//     description: 'Empresa A'
// },
// {
//     type: 'expense',
//     date: '2024-01-10',
//     money: {
//         currency: 'EUR',
//         value: 10
//     },
//     transactionType: 'Transporte',
//     description: 'Metrô ida e volta'
// },
// {
//     type: 'expense',
//     date: '2024-05-01',
//     money: {
//         currency: 'USD',
//         value: 1000
//     },
//     transactionType: 'Aluguel',
//     description: 'Mensalidade'
// }]