document.getElementById('login-button').addEventListener('click',
    function () {
        document.getElementById('bg-modal').style.display = 'flex';
    });


document.querySelector('.close-modal').addEventListener('click',
    function () {
        document.getElementById('bg-modal').style.display = 'none';
    });
