var path = require('path')
var express = require('express')
var exphbs = require('express-handlebars')
//var fs = require('f')  not quite sure what this is for and its causing an error

var ingredients = require("./ingredients.json")
var brands = require("./brands.json")

const { resolveSoa } = require('dns')
const e = require('express')

var port = process.env.PORT || 8000
var app = express()

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.json())

app.use(express.static('public'))

app.get('/', function (req, res, next) {
    res.status(200).render('landingPage')
})

app.get('/ingredient', function (req, res, next) {
    res.status(200).render('ingredients', {
        ingredientList: ingredients
    })
})

app.get('/brand', function (req, res, next) {
    res.status(200).render('brands', {
        brandList: brands
    })
})

app.get('/brand/:id', function (req, res, next) {
    var brandId = req.params.id;
    if (brands[brandId]) {
        res.status(200).render('brandPage', brands[brandId])
    }

    else {
        next()
    }
}
)

var punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

app.get('/ingredient/:id', function (req, res, next) {
    var ingredientId = req.params.id;
    if (ingredients[ingredientId]) {
        res.status(200).render('ingredientPage', ingredients[ingredientId])
    }
    else {
        next()
    }
})

app.get("*", function (req, res, next) {
    res.status(404).render('404', {
        path: req.url
    })
})

app.listen(port, function () {
    console.log("== Server is listening on port " + port)
})