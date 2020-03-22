const {Router} = require('express')
const Course = require('../models/course')
const router = new Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить новый курс',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })
    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router