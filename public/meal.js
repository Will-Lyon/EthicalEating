const data = undefined;
const recipeIngredients = data || [];
var index = 0;
var addButton = document.getElementById('add-ingredient-button')

addButton.addEventListener('click', function(){
    var ingredientName = document.getElementById('ingredient-add-text').value
    recipeIngredients[index] = ingredientName;
    index++;
    console.log("-- recipeIngredients[index]: ", recipeIngredients[index]);
    var li = document.createElement('li')
    li.textContent = ingredientName
    document.getElementById('meal-list').appendChild(li)
})

var submitRecipe = document.getElementById('submit-recipe');

submitRecipe.addEventListener('click', function(){
    var nameInput = document.getElementById('meal-name').value.trim()
    if(!nameInput) { alert("Please add a name") }
    else {
        fetch('build/addNew', {
            method: 'POST',
            body: JSON.stringify({         
                Name : nameInput,
                Ingredients : []
                
            }),
            headers: {'Content-Type': 'application/json'}
        }).then(function(res) {
            if(res.status === 200) {
                //update UI to display new input
                alert("Recipe Saved")
                document.getElementById('meal-name').value = ""
                document.getElementById('ingredient-add-text').value = ""
            } else {
                alert("Unable to save recipe")
            }
        })
    }
})