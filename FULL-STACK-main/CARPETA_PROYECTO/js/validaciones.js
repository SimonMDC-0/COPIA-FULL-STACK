/**
 * validaciones.js — The World Is Yours (TWY)
 * Validaciones simples: RUT chileno, correo electronico y telefono.
 */

'use strict';

/* -- 1. RUT CHILENO --------------------------------------- */

/* Limpia un RUT: quita puntos, guiones y espacios */
function limpiarRut(rut) {
    return String(rut).replace(/[\.\-\s]/g, '').toUpperCase().trim();
}

/* Formatea un RUT al formato estandar "12.345.678-9" */
function formatearRut(rut) {
    const limpio = limpiarRut(rut);
    if (limpio.length < 2) return rut;
    const cuerpo = limpio.slice(0, -1);
    const dv     = limpio.slice(-1);
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
}

/* Valida el RUT chileno verificando el digito verificador */
function validarRut(rut) {
    const limpio = limpiarRut(rut);
    if (limpio.length < 2) return false;
    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);
    if (!/^\d+$/.test(cuerpo)) return false;
    let suma = 0, factor = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma   += parseInt(cuerpo[i]) * factor;
        factor  = factor === 7 ? 2 : factor + 1;
    }
    const dvCalc = 11 - (suma % 11);
    let dvEsp = dvCalc === 11 ? '0' : dvCalc === 10 ? 'K' : String(dvCalc);
    return dvIngresado === dvEsp;
}

/* -- 2. CORREO ELECTRONICO -------------------------------- */

/* Valida el formato de un correo electronico */
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(String(email).toLowerCase().trim());
}

/* -- 3. TELEFONO CHILENO ---------------------------------- */

/* Valida un numero de telefono chileno (celular +56 9 XXXXXXXX) */
function validarTelefono(telefono) {
    const limpio = String(telefono).replace(/[\s\(\)\-]/g, '');
    const regex = /^(\+?56)?9\d{8}$/;
    return regex.test(limpio);
}

/* -- 4. FUNCIONES DE UI ----------------------------------- */

/* Muestra un mensaje de error debajo del campo indicado */
function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.style.borderColor = '#c0392b';
    let errorDiv = input.parentElement.querySelector('.twy-error-msg');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'twy-error-msg';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = '? ' + mensaje;
}

/* Limpia el mensaje de error y estilos de un campo */
function limpiarError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.style.borderColor = '';
    const errorDiv = input.parentElement.querySelector('.twy-error-msg');
    if (errorDiv) errorDiv.remove();
}

/* Marca un campo como valido con borde verde */
function marcarValido(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    limpiarError(inputId);
    input.style.borderColor = '#2d6a4f';
}

/* -- 5. ACTIVADORES DE CAMPO ------------------------------ */

/* Activa formato y validacion de RUT en tiempo real */
function activarCampoRut(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', () => {
        const limpio = limpiarRut(input.value);
        if (limpio.length >= 2) input.value = formatearRut(limpio);
    });
    input.addEventListener('blur', () => {
        const val = input.value.trim();
        if (!val) { limpiarError(inputId); return; }
        validarRut(val) ? marcarValido(inputId) : mostrarError(inputId, 'RUT invalido. Verifica el digito verificador.');
    });
}

/* Activa validacion de correo al perder foco */
function activarCampoEmail(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('blur', () => {
        const val = input.value.trim();
        if (!val) { limpiarError(inputId); return; }
        validarEmail(val) ? marcarValido(inputId) : mostrarError(inputId, 'Correo invalido. Usa el formato usuario@dominio.com');
    });
}

/* Activa validacion de telefono al perder foco */
function activarCampoTelefono(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('blur', () => {
        const val = input.value.trim();
        if (!val) { limpiarError(inputId); return; }
        validarTelefono(val) ? marcarValido(inputId) : mostrarError(inputId, 'Telefono invalido. Formato: +56 9 XXXX XXXX');
    });
}

/* -- 6. NAMESPACE GLOBAL ---------------------------------- */

/* Expone las funciones en window.TWY para uso desde HTML */
window.TWY = window.TWY || {};
Object.assign(window.TWY, {
    limpiarRut, formatearRut, validarRut,
    validarEmail,
    validarTelefono,
    mostrarError, limpiarError, marcarValido,
    activarCampoRut, activarCampoEmail, activarCampoTelefono
});

/* -- 7. ATAJO DE TECLADO ADMIN ---------------------------- */

/* Ctrl+Shift+A o Alt+A redirige al panel de administrador */
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        const enPages = window.location.pathname.includes('/pages/') ||
                        window.location.pathname.includes('\\pages\\');
        window.location.href = enPages ? 'panelAdmin.html' : 'pages/panelAdmin.html';
    }
});
