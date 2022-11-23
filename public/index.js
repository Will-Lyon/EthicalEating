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

