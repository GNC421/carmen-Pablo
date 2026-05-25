// ========================================
// PANTALLA DE PRESENTACIÓN - FOTO NOVIOS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const presentationStage = document.getElementById('presentationStage');
    const mainContent = document.getElementById('mainContent');

    // Ocultar pantalla de carga después de 1.5 segundos
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('hide');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 600);
        }
    }, 1500);

    // Función para avanzar al contenido principal
    function goToMainContent() {
        if (presentationStage) {
            presentationStage.classList.add('hide');
            if (mainContent) mainContent.classList.add('visible');
            setTimeout(function() {
                if (presentationStage) presentationStage.style.display = 'none';
            }, 800);
        }
    }

    // Al hacer clic en cualquier lugar de la pantalla de presentación
    if (presentationStage) {
        presentationStage.addEventListener('click', function(e) {
            goToMainContent();
        });
    }
});

// ========================================
// VALIDACIÓN Y ENVÍO DEL FORMULARIO
// ========================================

// Validación personalizada
const form = document.getElementById('weddingForm');
if (form) {
    form.addEventListener('submit', function(event) {
        const nombre = document.getElementById('nombre')?.value;
        const email = document.getElementById('email')?.value;
        const asistencia = document.querySelector('input[name="asistencia"]:checked');
        
        if (!nombre || !email || !asistencia) {
            event.preventDefault();
            alert('Por favor, complete los campos obligatorios: nombre, email y asistencia.');
        }
    });
}

// Script para Google Sheets
const scriptURL = 'https://script.google.com/macros/s/AKfycbwNWzEyX_QbhAnSZr1SGlASsAQmuhL13fFVFY32fEIMI2QeG2-EsAfAupEPWALHOGyh/exec';

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const data = {
            nombre: document.getElementById('nombre')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefono: document.getElementById('telefono')?.value || '',
            asistencia: document.querySelector('input[name="asistencia"]:checked')?.value || '',
            num_asistentes: document.getElementById('num_asistentes')?.value || '1',
            acompanantes: document.getElementById('acompanantes')?.value || '',
            otras_alergias: document.getElementById('otras_alergias')?.value || '',
            bus: document.querySelector('input[name="bus"]:checked')?.value || ''
        };
        
        const alergias = [];
        document.querySelectorAll('input[name="alergias"]:checked').forEach(cb => {
            alergias.push(cb.value);
        });
        data.alergias = alergias.join(', ');
        
        console.log("data:", JSON.stringify(data));
        
        const submitBtn = document.querySelector('.mkdf-submit-btn');
        if (submitBtn) {
            const originalText = submitBtn.querySelector('span:first-child')?.textContent || 'Enviar';
            if (submitBtn.querySelector('span:first-child')) {
                submitBtn.querySelector('span:first-child').textContent = 'Enviando...';
            }
            submitBtn.disabled = true;
            
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(() => {
                const successMsg = document.getElementById('successMessage');
                if (successMsg) successMsg.style.display = 'block';
                if (submitBtn.querySelector('span:first-child')) {
                    submitBtn.querySelector('span:first-child').textContent = originalText;
                }
                submitBtn.disabled = false;
                if (form) form.reset();
                setTimeout(() => {
                    if (successMsg) successMsg.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                alert('Error al enviar. Por favor, inténtelo de nuevo.');
                console.error('Error:', error);
                if (submitBtn.querySelector('span:first-child')) {
                    submitBtn.querySelector('span:first-child').textContent = originalText;
                }
                submitBtn.disabled = false;
            });
        }
    });
}