import express from 'express'
import path from 'path'
import createEventEmitter  from './server Modules/event-emitter.js'
import dataBase from './server Modules/db.js'
import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'



const port = 8000
const url = `http://localhost:${port}/`

const app = express()
const database = dataBase(Sequelize)

const dirname = 'C:/Users/Henrique/Desktop/Site de venda/'
const files = ['Landing Page', 'sign up'] // Files the will be used in the routes


for (const file of files) { // Using the files
    app.use(express.static(path.join(dirname, file)))
}

//app.use(express.json())

// Preparing the routes

app.get('/', function(request, response) {
    response.sendFile(dirname + 'Landing Page/index.html')
})

app.get('/sign-up', function (request, response) {
    response.sendFile(dirname + 'sign up/signup.html')
})

app.post('/sign-up', function (request, response) {
    console.log(`> Receiving a request type: ${request.headers.type}`)
    const active = new createEventEmitter()

    active.on('formRegister', async function() {
        console.log('> Receiving a formulary')
        const name = request.headers.name
        const email = request.headers.email
        const password = request.headers.password

        console.log('Name: ' + name + ' Email: ' + email + ' Password:' + password)

        if ([name, email, password].includes(undefined)) {
            console.log("> It is not all fill")
            return response.status(422).json({msg: 'Fill in all inputs'})
        }

        const userExists = await database.registry.findOne({ where: { UserEmail: email } })
        
        if (userExists) {
            console.log("The user already exist")
            return response.status(422).json({msg: 'Please put another email'})
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        database.addUser(name, email, passwordHash)
        console.log('> Added user')
        return response.status(200).json({msg: 'SUCCESS'})
    })

    active.notifyAll(request.headers.type)
})

app.get('/sign-in', function (request, response) {
    response.sendFile(dirname + 'sign in/signin.html')
})

app.post('/sign-in', function (request, response) {
    console.log(`> Receiving a request type ${request.headers.type}`)
    const active = new createEventEmitter()

    active.on('formLogin', async function () {
        console.log('> Receiving a formulary')
        const account = request.headers.account
        const password = request.headers.account

        let temp = await database.registry.findOne({ where: { UserEmail: account } })
        if (temp === null) {
            temp = await database.registry.findOne({ where: { UserName: account } })
        }

        const user = temp

        if (!user) {
            return response.status(422).json({msg: 'This account does not exist'})
        }

        const checkPassword = bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return response.status(422).json({msg: 'This account does not exist'})
        }

        try {
            const  secret = process.env.SECRET
            const token = jwt.sign(
                {
                  id: user._id
                },
                secret
            )

            res.status(200).json({msg: "Authentication successful", token})

        } catch (err) {
            console.log(err)
            return response.status(500).json({msg: 'Error in the server'})
        }




        
    })

})
// End
app.listen(port, function() {
    console.log(`listening on ${url}`)
})
