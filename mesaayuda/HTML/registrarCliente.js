const formE1 = document.querySelector('.form');
formE1.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formE1);
    const data = Object.fromEntries(formData);
    const displayMessage = document.getElementById('resultado1');
    if (!data.contacto || !data.password) {
        displayMessage.style.color = 'RED';
        displayMessage.textContent = 'El Email y la Contraseña son obligatorios.';
        return;
    }
    if (data.termscondition !== 'on') {
        displayMessage.style.color = 'RED';
        displayMessage.textContent = 'Debe aceptar los términos y condiciones.';
        return;
    }
    // --- Preparación del Fetch (esto estaba correcto) ---
    const newUser = {
        contacto: data.contacto,
        password: data.password
    };
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    };
    
    const API_URL = 'http://localhost:8080/api/addCliente';
    fetch(API_URL, options)
        .then(res => {
            if (!res.ok) {
                return res.json().then(errorInfo => {
                    throw new Error(errorInfo.message || 'Error en la respuesta del servidor');
                });
            }
            return res.json();
        })
        .then(response => {
            console.log(response);
            if (response.response === 'OK') {
                displayMessage.style.color = 'green'; 
                displayMessage.textContent = '¡Registro exitoso! Serás redirigido al login.';
                setTimeout(() =>{window.location.href = 'loginClient.html';}, 3000);
            } else if (response.response === 'ERROR') {
                throw new Error(response.message || 'Error desconocido del servidor.');
            }
        })
        .catch(err => {
            console.error('Error en el registro:', err.message);
            displayMessage.style.color = 'RED';
            displayMessage.textContent = err.message || 'No se pudo conectar con el servidor.';
        });
});