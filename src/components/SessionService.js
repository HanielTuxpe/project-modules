// En tu servicio de gestión de sesión (SessionService.js)
import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = 'session';

export const iniciarSesion = (tipoUsuario) => {
    // Lógica de autenticación
    Cookies.set(SESSION_COOKIE_NAME, tipoUsuario, { 
        expires: 5 / (24 * 60),
        sameSite: 'None', 
        secure: true, 
    });
};

export const cerrarSesion = () => {
    Cookies.remove(SESSION_COOKIE_NAME);
};

export const obtenerTipoUsuario = () => {
    return Cookies.get(SESSION_COOKIE_NAME);
};
