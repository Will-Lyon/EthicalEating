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

//eventually this will be used to do search stuffs from the main page. 
// app.get('/search', function(req,res,next){
//     search = req.query.q;
//     res.status(200).render("mainsearch", searchgen(search))
// })


//this one doesnt display anything by default anymore but it shouldnt really matter in this case
app.get('/ingredient', function (req, res, next) {
    res.status(200).render('ingredientPage', {
        //ingredientList: ingredients
        name : ingredients.Name,
        ingredientList : ingredients.Producers
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
    
    if(ingredientId.includes("search")){
        search = req.query.q;
        console.log(search);
        res.status(200).render('ingredientPage', searching(search))
    }
    else if (ingredients[ingredientId]) {
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

app.listen(port, function() {
    console.log("==server listening on port: ", port)
})



function searching(s){
    for(i in ingredients){
        console.log(ingredients[i].Name)
        if(ingredients[i].Name == s){
            return ingredients[i];
        }
    }
    return {"Name": s }; 
}  

function searchbrand(s){
    out = []
    for(b in brands){
        if(brands[b].Name == s){
            out.push(brands[b])
        }else{
            for(i in brands[b].Ingredients){
                if(brands[b].Ingredients[i] == s){
                    out.push(brands[b])
                }
            }
        }
    }
    return out;
}

function searchgen(s){

    return {
        Search: s,
        Ingredients: searching(s),
        Brands: searchbrand(s)
    }
}