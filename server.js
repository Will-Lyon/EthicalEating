var path = require('path')
var express = require('express')
var exphbs = require('express-handlebars')
var fs = require('fs')
//var fs = require('f')  not quite sure what this is for and its causing an error

var ingredients = require("./ingredients.json")
var brands = require("./brands.json")

const { resolveSoa } = require('dns')
const e = require('express')
const { runInNewContext } = require('vm')

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
//returns searched ingredient
app.get('/ingredient/:id', function (req, res, next) {
    var ingredientId = req.params.id;
    
    if(ingredientId.includes("search")){
        console.log("===1")
        search = req.query.q;
        console.log(search);
        res.status(200).render('ingredientPage', searching(search))
        console.log("===1")
    }
    else if (ingredients[ingredientId]) {
        console.log("===2")
        res.status(200).render('ingredientPage', ingredients[ingredientId])
        console.log("===2")
    }
    else {
        next()
    }
    
})

//accepts new ingredient and adds to database
app.post('*/ingredient/addNew', function(req,res) {
    if(req.body && req.body.Name && req.body.Producers && !ingredients[req.body.Name]) {
        console.log("==Client sent: ", req.body)
        
        var newIngredient = {
            Name : req.body.Name,
            Producers : req.body.Producers   
        }
        ingredients.push(newIngredient)
        

        fs.writeFile('./ingredients2.json', JSON.stringify(ingredients, null, 2), function(err) {
            if(err) {
                res.status(500).send("error writing ingredient to database")
            } else {
                res.status(200).send("ingredient added")
            }
        })
    } else {
        res.status(400).send("requests must contain a json body with matching fields")
    }
})

//accepts new producers and adds them to database VVV need to prevent it from allowing multiple entries of same brand VVV
app.post('*/ingredient/:id/addNewProd', function(req,res) {
    var ingredientId = req.params.id
    var indexOf = ingredients.findIndex(i=>i.Name === ingredientId)
    
    if(req.body && req.body.producerName && req.body.numReviews && req.body.ethicScore && req.body.ethicScoreRaw ) {
        console.log("==Client sent: ", req.body)
        var newProd = {
            producerName : req.body.producerName,
            numReviews : req.body.numReviews,
            ethicScore : req.body.ethicScore,
            ethicScoreRaw : req.body.ethicScoreRaw
        }
        
        ingredients[indexOf].Producers.push(newProd)

        fs.writeFile('./ingredients.json', JSON.stringify(ingredients, null, 2), function(err) {
            if(err) {
                res.status(500).send("error writing ingredient to database")
            } else {
                res.status(200).send("ingredient added")
            }
        })
    } else {
        res.status(400).send("requests must contain a json body with matching fields")
    }
})



//accepts new ingredient rating and adds it to database
//app.post()

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
    return {"searchq": s }; 
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