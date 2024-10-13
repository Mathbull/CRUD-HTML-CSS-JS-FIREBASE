// Como todo o nosso crud, que chama o fireEstore, esta mesclado com funções de logica da tela dentro do home.js
// Isso dificulda o crescimento, manutenção do codigo e quebra a responsabiidade
// Essa service é justamente para separar essas lógicas, acesso ao backend e logica da tela
// Serve para acessar o backEnd, fireEstore

const transactionService = {

    // Para listara as transações, eu pego o q esta relacionado ao usuario logado
    findByUser: user =>{
        return firebase.firestore()
            .collection('transactions')
            .where('user.uid', '==', user.uid)
            .get()
            .then(snapshot =>{
                hideLoading()
                const transactions = snapshot.docs.map(doc =>({
                    ...doc.data(),
                    uid: doc.id
                }))
    
                transactions.sort((a,b)=> // Solução implementada devido não conseguir essa opção .oderBy('date', 'desc') q exigia uma index
                    new Date(b.date) - new Date(a.date) )
                
                return transactions
            })

    },

    // Recupera no firestore pelo uid a transação que recebeu um clik para ser escrita na transaction para updade
    findByUid: uid=>{
        return firebase.firestore()
            .collection('transactions')
            .doc(uid)
            .get()
            .then(doc =>{
                return doc.data()
            }) 
    },

    // Remove a transação que recebeu o click e o confirmar
    remove: transaction =>{
        return  firebase.firestore()
        .collection('transactions')
        .doc(transaction.uid)
        .delete()
    },

    // Acessao o firestore e salva a transação
    save: transaction =>{
        return firebase.firestore()
            .collection('transactions')
            .add(transaction);
    },
    update: transaction =>{
        return firebase.firestore()
            .collection('transactions')
            .doc(getTransactionUid())
            .update(transaction)
    }
}