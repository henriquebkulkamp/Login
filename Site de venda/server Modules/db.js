export default function factory(Sequelize) {
    const dataBase = new Sequelize('site', 'root', 'jwef293jIO2323hres', {
        host: 'localhost',
        dialect: 'mysql'
    })

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
    })


    async function getId() {

        let bruteId = await registry.findAll({
            attributes: ['UserId']
        })

        bruteId = JSON.stringify(bruteId)
        const id = []

        for(let i=0; i < bruteId.length; i++) {
            id.push(bruteId[i]['UserId']) 
        }
        return id
    }


    function generateId() {
        const ids = getId()
        let authentic = false

        while (!(authentic)) {
            const userId = Math.floor(Math.random() * 90000) + 10000
            authentic = true
            for (let i; i < ids.length; i++) {
                if (ids[i] == userId) {
                    authentic = false
                    break
                }
            }
            if (authentic) {
                return userId
            }
        }
    }

    function addUser(name, email, password) {
        const newUser = registry.create({
            UserID: generateId(),
            UserName: name,
            UserEmail: email,
            UserPassword: password
        })
        return newUser
    }

    return {
        getId,
        addUser,
        registry
    }
}