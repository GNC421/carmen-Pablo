// ========================================
// ANIMACIÓN DEL SOBRE Y PAPEL VOLADOR
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const invitationStage = document.getElementById('invitationStage');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.querySelector('.envelope');
    const openBtn = document.getElementById('openBtn');
    const flyingPaper = document.getElementById('flyingPaper');
    const mainContent = document.getElementById('mainContent');

    // Ocultar pantalla de carga
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('hide');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 600);
        }
    }, 1500);

    // Función para abrir el sobre y lanzar el papel
    function openEnvelope() {
        // Abrir la solapa del sobre
        envelope.classList.add('open');
        
        // Después de la apertura, mostrar el papel volador
        setTimeout(function() {
            // Mostrar el papel en posición inicial (dentro del sobre)
            flyingPaper.style.display = 'block';
            
            // Forzar reflow para que la transición funcione
            flyingPaper.offsetHeight;
            
            // Animar el papel hacia el centro
            flyingPaper.classList.add('flying');
            
            // Después de que el papel llegue al centro, ocultar el sobre
            setTimeout(function() {
                envelopeWrapper.classList.add('fade-out');
                
                // Hacer que el papel se "abra" (se agrande y desaparezca)
                setTimeout(function() {
                    flyingPaper.classList.add('open');
                    
                    // Mostrar el cuestionario
                    setTimeout(function() {
                        mainContent.classList.add('visible');
                        invitationStage.classList.add('hide');
                        
                        // Limpiar después de la animación
                        setTimeout(function() {
                            invitationStage.style.display = 'none';
                        }, 800);
                    }, 400);
                }, 300);
            }, 500);
        }, 500);
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
// FUNCIONALIDAD DE CARDS DESPLEGABLES
// ========================================

document.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', () => {
        const card = header.parentElement;
        card.classList.toggle('active');
    });
});

// Abrir primera card por defecto
const firstCard = document.querySelector('.card');
if (firstCard) {
    firstCard.classList.add('active');
}

// ========================================
// FORMULARIO Y ENVÍO A GOOGLE SHEETS
// ========================================

// Validación personalizada
const form = document.getElementById('weddingForm');
if (form) {
    form.addEventListener('submit', function(event) {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
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
        
        // Recoger todos los datos del formulario
        const formData = new FormData(this);
        const data = {};

        data.nombre = document.getElementById('nombre').value;
        data.email = document.getElementById('email').value;
        data.telefono = document.getElementById('telefono').value;
        
        const asistenciaRadio = document.querySelector('input[name="asistencia"]:checked');
        data.asistencia = asistenciaRadio ? asistenciaRadio.value : '';
        
        data.num_asistentes = document.getElementById('num_asistentes').value;
        data.acompanantes = document.getElementById('acompanantes').value;
        
        // Procesar checkboxes (alergias)
        const alergias = [];
        document.querySelectorAll('input[name="alergias"]:checked').forEach(checkbox => {
            alergias.push(checkbox.value);
        });
        
        // Construir objeto con todos los datos
        for (let [key, value] of formData.entries()) {
            if (key !== 'alergias') {
                data[key] = value;
            }
        }
        
        // Añadir alergias como string
        data.alergias = alergias.join(', ');

        data.otras_alergias = document.getElementById('otras_alergias').value;
        
        const busRadio = document.querySelector('input[name="bus"]:checked');
        data.bus = busRadio ? busRadio.value : '';

        console.log("data: " + JSON.stringify(data));
        
        // Mostrar mensaje de carga
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Enviar a Google Sheets
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            document.getElementById('successMessage').style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            alert('Error al enviar. Por favor, inténtelo de nuevo.');
            console.error('Error:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}