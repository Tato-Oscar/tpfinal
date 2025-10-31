document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.form');
    
    // Ya no necesitamos 'paso1Div' ni 'paso2Div'
    
    const emailInput = document.getElementById('contacto');
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('repeat-password');
    
    // Se elimina 'buscarBtn'
    const cambiarBtn = document.getElementById('btn-cambiar'); // Este botón es 'submit'
    const resultSpan = document.getElementById('resultado');

    // SE ELIMINA TODO EL 'buscarBtn.addEventListener('click', ...)'

    // Toda la lógica se maneja en el 'submit' del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene que la página se recargue

        // Obtenemos todos los valores
        const email = emailInput.value;
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;
        resultSpan.textContent = ''; 

        // Validaciones primero
        if (!email || !password || !repeatPassword) {
            resultSpan.textContent = 'Error: Todos los campos son obligatorios.';
            resultSpan.style.color = 'red';
            return;
        }

        if (password !== repeatPassword) {
            resultSpan.textContent = 'Error: Las contraseñas no coinciden.';
            resultSpan.style.color = 'red';
            return;
        }

        try {
            // --- PASO 1: Buscar al usuario (lógica del antiguo 'btn-buscar') ---
            const responseFind = await fetch('http://localhost:8080/api/loginCliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contacto: email, password: 'Contrasenia' }) // Usamos la misma lógica de búsqueda
            });
            
            const dataFind = await responseFind.json();

            // --- PASO 2: Procesar la respuesta de la búsqueda ---
            
            if (dataFind.id) {
                // Usuario encontrado, ahora procedemos a cambiar la contraseña
                const userId = dataFind.id; 
                
                // --- PASO 3: Cambiar la contraseña (lógica del antiguo 'submit') ---
                const responseReset = await fetch('http://localhost:8080/api/resetCliente', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, password: password }),
                });
                const dataReset = await responseReset.json();

                if (responseReset.ok && dataReset.response === "OK") {
                    resultSpan.textContent = '¡Contraseña actualizada! Serás redirigido al login.';
                    resultSpan.style.color = '#00bfff'; // Un color de éxito
                    setTimeout(() => { window.location.href = 'loginClient.html'; }, 3000);
                } else {
                    resultSpan.textContent = `Error: ${dataReset.message || 'No se pudo actualizar.'}`;
                    resultSpan.style.color = 'red';
                }

            } else if (dataFind.message === "Cliente no encontrado, por favor registrese") {
                // Mensaje si el email no existe
                resultSpan.style.color = 'red';
                resultSpan.textContent = 'No se encontró una cuenta con ese correo electrónico.';
                
            } else {
                // Otro error de la API de búsqueda
                resultSpan.style.color = 'red';
                resultSpan.textContent = dataFind.message || 'Ocurrió un error inesperado al buscar la cuenta.';
            }

        } catch (error) {
            console.error('Error en fetch:', error);
            resultSpan.style.color = 'red';
            resultSpan.textContent = 'Error de red. No se pudo conectar al servidor.';
        }
    });
});