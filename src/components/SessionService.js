import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = 'session';

export const iniciarSesion = (tipoUsuario) => {
    // Crear un objeto Date para 10 minutos a partir de ahora
    const now = new Date();
    const expireTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutos en milisegundos
    
    // Establecer la cookie con la fecha de expiración
    Cookies.set(SESSION_COOKIE_NAME, tipoUsuario, { expires: expireTime });
};

export const cerrarSesion = () => {
    Cookies.remove(SESSION_COOKIE_NAME);
};

export const obtenerTipoUsuario = () => {
    return Cookies.get(SESSION_COOKIE_NAME);
};
