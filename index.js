const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const cardRouter = require('./routes/card')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const app = express()
// Настраиваем шаблонизатор
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine) // Регистрируем что такой движок есть
app.set('view engine', 'hbs') // Начинаем его использовать
app.set('views', 'views') // Указываем где будут хранится все наши шаблоны (По умолчанию стоит views)

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5e7125da1afdaf0e749678b4')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public'))) // Указываем экспресу папку статических файлов
app.use(express.urlencoded({extended: true})) // Для получения данных с форм
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
}))
app.use(varMiddleware)

// Регистрируем роуты, для наглядности тут указываем эндпоинты, а в самих роутах везде '/'
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/orders', ordersRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRouter)
app.use('/auth', authRoutes)

const port = process.env.port || 3000

async function start() {
    try {
        const url = 'mongodb+srv://artem:z1l6oOkTLjopkSSH@cluster0-sahlq.mongodb.net/shop'
        await mongoose.connect(url, {
            useNewUrlParser: true, 
            useUnifiedTopology:true
        })
        const candidate = await  User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'artem@mail.ru',
                name: 'Artem',
                cart: {items: []}
            })
            await user.save()
        } 
        app.listen(port, () => {
            console.log(`Server has been started on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
    
}

start()

