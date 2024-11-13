// Objetivo: Archivo de configuración de variables de entorno para desarrollo
import {name, version} from '../../package.json';
export const environment = {
    production: false,
    NAME: name,
    VERSION: version,
    API: 'http://localhost:3000',
    };