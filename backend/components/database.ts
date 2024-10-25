import environment from './environment';
import User from '../models/user.model';

import { Sequelize, Model } from 'sequelize';


class Database {
    // declare sequelize: Sequelize;
    // declare User: typeof User;

    static sequelize: Sequelize | null = null;
    static User: typeof User | null = null;
    // sequelize = null;

    // La librería Sequelize para base de datos requiere un acomodo especial para
    // esperar y asegurarse que la base de datos se autentique correctamente
    // Basado en: https://stackoverflow.com/questions/60942051/sequelize-with-asynchronous-configuration-in-nodejs
    /**
     * Configura la base de datos, sus modelos, y verifica que la conexión a la base de datos sea correcta.
     * 
     * @throws Arroja un error cuando la conexión a la base de datos no puede ser establecida
     */
    static async setup(){
        this.sequelize = new Sequelize(
            environment.database.name,
            environment.database.username, 
            environment.database.password, 
            {
                host: environment.database.host,
                dialect: 'mysql',
            },
        );

        // Inicializar modelos
        User.init(this.sequelize);

        // Asignar modelos a clase Database
        this.User = User;

        // Configurar asociaciones (hasMany, etc.):
        // this.User.associate(this);

        await this.sequelize.authenticate();


        // Descomentar la siguiente línea para sincronizar cambios a modelos
        // NOTA: hace drop table a todos los modelos!
        await this.sequelize.sync({ force: true });
        // TODO: usar migrations para cambios en la base de datos
        
        console.log('Conectado a base de datos.');
    }
}

export default Database;