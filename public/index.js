//Event Listenters For login/register Popups
var bgModal = document.getElementById('bg-modal')
var regModal = document.getElementById('reg-modal')

document.getElementById('login-button').addEventListener('click',
    function () {
        bgModal.style.display = 'flex';
    });

document.querySelectorAll('.close-modal').forEach(item => {
    item.addEventListener('click', event => {
        bgModal.style.display = 'none'
        regModal.style.display = 'none'
        //Resets all entered data for logging in or registering 
        var loginData = document.querySelectorAll('.login-input')
        for (let i = 0; i < loginData.length; i++) {
            loginData[i].value = ''
        }
    })
})
/* breaking 
document.getElementById('register-button').addEventListener('click',
    function () {
        bgModal.style.display = 'none';
        regModal.style.display = 'flex';
    });

document.getElementById('login-link').addEventListener('click',
    function () {
        bgModal.style.display = 'flex';
        regModal.style.display = 'none';
    });
*/

/*
 * Add ingredient functionality
 */

document.getElementById('add-ing-button').addEventListener('click',
function () {
    ingModal.style.display = 'flex';  
});

var ingModal = document.getElementById('ingModal')

//on submission of new ingredient sends it to server
document.getElementById("ingredient-submit-button").addEventListener('click', function() {
    var ingInput = document.getElementById('ingredient-name-input').value.trim()
    if(!ingInput) { alert("Please add an ingredient") }
    else {
        fetch('ingredient/addNew', {
            method: 'POST',
            body: JSON.stringify({         
                Name : ingInput,
                Producers : []
                
            }),
            headers: {'Content-Type': 'application/json'}
        }).then(function(res) {
            if(res.status === 200) {
                //update UI to display new input
            } else {
                alert("Unable to save ingredient")
            }
        })
    }
    ingModal.style.display = 'none'
    clearIngModals()
})

/*
 * Add producer functionality
 */
var prodModal = document.getElementById("prodModal")

//open prod modal on click
document.getElementById("add-producer-button").addEventListener('click', function() {
    prodModal.style.display = 'flex'
})


document.getElementById('producer-submit-button').addEventListener('click', function() {
    var prodName = document.getElementById('producer-name-input').value.trim()
    var prodScore = document.getElementById('producer-score-input').value.trim()
    var ingredientId = document.getElementById('ingredientId').innerText
    if(!prodName || !prodScore) {alert("please fill all fields")}
    else if (prodScore < 1 || prodScore > 10) {alert("please enter a value between 1 and 10")}
    else {

        var prodUrl = 'ingredient/' + ingredientId + '/addNewProd'
        fetch(prodUrl, {
            method: 'POST',
            body : JSON.stringify({
                producerName: prodName,
                numReviews : 1,
                ethicScore : prodScore,
                ethicScoreRaw : prodScore
            }),
            headers: {'Content-Type' : 'application/json'}
        }).then(function(res) {
            if(res.status === 200) {

            } else {
                alert("Unable to save producer")
            }
        })
    }
    prodModal.style.display = 'none'
    clearIngModals()
})

/*
 * Rate producer functionality
 */
var rateModal = document.getElementById('rateModal')
var prodId
document.querySelectorAll('.rate-them-button').forEach(item=>{
    item.addEventListener('click', function(event) {
        rateModal.style.display = 'flex'
        prodId = event.currentTarget.getAttribute('data-id')
    })
})

    


document.getElementById('rating-submit-button').addEventListener('click',function() {
    var ratingNum = document.getElementById('rating-input').value.trim()
    var ingredientId = document.getElementById('ingredientId').innerText
    console.log(ratingNum)
    if(!ratingNum || ratingNum < 1 || ratingNum > 10) {alert("please enter a number between 1 and 10")}
    else {
        var url = 'ingredient/' + ingredientId + '/rateProd'
        fetch(url, {
            method: 'POST',
            body : JSON.stringify({
                producerName: prodId,
                ethicScoreRaw : ratingNum
            }),
            headers: {'Content-Type' : 'application/json'}
        }).then(function(res) {
            if(res.status === 200) {

            } else {
                alert("Unable to save rating")
            }
        })
    }
    rateModal.style.display = 'none'
    clearIngModals()
})

//close modals
document.querySelectorAll('.close-add-modal').forEach(item => {
    item.addEventListener('click', event => {
        ingModal.style.display = 'none'
        prodModal.style.display = 'none'
        rateModal.style.display = 'none'
        clearIngModals()
    })
})

function clearIngModals () {
    var userInput = document.querySelectorAll('.modal-input')
    for (let i = 0; i < userInput.length; i++) {
        userInput[i].value = ''
    }
}
