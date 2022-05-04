import Sequelize from 'sequelize'
import 'dotenv/config'

// Till here all ok

const dataBase = new Sequelize(process.env.DATA_BASE, process.env.USER, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
  });


async function a() {
    const registry = dataBase.define('registries', {
        UserID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserName: { type: Sequelize.STRING },
        UserEmail: { type: Sequelize.STRING},
        UserPassword: { type: Sequelize.STRING}
    }, {
        freezeTableName: true,
        timestamps: false
    });

    let ids = await registry.findAll({
        attributes: ['UserId']
    })

    ids = JSON.stringify(ids)
    const arrayIds = ids
}

a()

function generateId() {
    let authentic = false
    while (!(authentic)) {
        const userId = Math.floor(Math.random() * 90000) + 10000
        authentic = true
        for (let i; i < ids.length; i++) {
            if (ids[i]['UserId'] == userId) {
                authentic = false
                break
            }
        }
        if (authentic) {
            return userId
        }
    }
}

function createLine(name, email, password) {
    registry.create({
        UserID: generateId(),
        UserName: name,
        UserEmail: email,
        UserPassword: password
    })
}

// const db = factory()