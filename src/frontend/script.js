const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const inputRepeatPassword = document.getElementById('repeatPassword');
const inputFirstName = document.getElementById('firstName');
const inputLastName = document.getElementById('lastName');
const inputTel = document.getElementById('tel');
const inputCompany = document.getElementById('company');
const formJs = document.getElementById('form');

formJs.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        email: inputEmail.value,
        password: inputPassword.value,
        repeatPassword: inputRepeatPassword.value,
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        tel: inputTel.value,
        company: inputCompany.value,
    };

    console.log('Dati inviati:', formData);

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log('Risposta dal server:', data);

    if (response.ok) {
        alert('Registrazione avvenuta con successo');
    } else {
        console.log('Errore durante la registrazione:', data.message);
        alert(`Errore nella registrazione: ${data.message}`);
    }
});
