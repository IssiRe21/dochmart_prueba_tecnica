import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import bcrypt from 'bcrypt';
// import { InferCreationAttributes, InferAttributes, Model, CreationOptional } from '@sequelize/core';

const bscryptSaltRounds = 10;

class User extends Model {
    // La palabra 'declare' se asegura que este campo no sea emitido por Typescript
    // Mas información: https://sequelize.org/docs/v6/core-concepts/model-basics/
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static get modelFields(){
        return {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }
    }

    static get modelOptions(){
        return {
           version: true,
        }
    }

    static init(sequelize){
        const options = { ...this.modelOptions, sequelize };
        return super.init(this.modelFields, options);
    }

    /**
     * Crea un hash usando el password actual de la instancia, y lo actualiza en la instancia actual
     */
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, bscryptSaltRounds);
    }

    /**
     * Devuelve `true` cuando el hash de password de la instancia actual coincide con el hash generado por el 
     * password a verificar
     * 
     * @param passwordToVerify Password (sin hashear) a verificar
     */
    async verifyPassword(passwordToVerify: string) {
        // Usando versión async
        // https://www.npmjs.com/package/bcrypt#a-note-on-timing-attacks
        return await bcrypt.compare(passwordToVerify, this.password);
    }

}

export default User;