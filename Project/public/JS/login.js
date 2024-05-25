
document.addEventListener('DOMContentLoaded', () => {

    let timer = 30;

    const decrementTimer = () => {
        if (timer > 0) {
            timer -= 1;
        } else {
            timer = 0;
        }
        document.getElementById('timer').innerText = timer;
    };

    setInterval(decrementTimer, 1000);


    document.getElementById('form-page').style.display = 'block';
});
