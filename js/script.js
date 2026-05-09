// ========================================
// ANIMACIÓN DEL SOBRE - SIN POP UP
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const invitationStage = document.getElementById('invitationStage');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.querySelector('.envelope');
    const openBtn = document.getElementById('openBtn');
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

    // Función para abrir el sobre y mostrar el cuestionario directamente
    function openEnvelope() {
        // Abrir la solapa del sobre
        envelope.classList.add('open');
        
        // Después de la animación de apertura, mostrar el cuestionario
        setTimeout(function() {
            // Ocultar el sobre con fade-out
            envelopeWrapper.classList.add('fade-out');
            
            // Mostrar el contenido principal
            mainContent.classList.add('visible');
            
            // Ocultar el stage del sobre
            invitationStage.classList.add('hide');
            
            // Eliminar el stage después de la transición
            setTimeout(function() {
                invitationStage.style.display = 'none';
            }, 800);
        }, 500); // Esperar a que la solapa se abra
    }

    // Evento del botón "Abrir invitación"
    if (openBtn) {
        openBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEnvelope();
        });
    }

    // También se puede abrir haciendo clic en el sobre
    if (envelope) {
        envelope.addEventListener('click', function(e) {
            if (e.target !== openBtn && !envelope.classList.contains('open')) {
                openEnvelope();
            }
        });
    }
});

// ========================================
// RESTO DEL CÓDIGO DEL FORMULARIO
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