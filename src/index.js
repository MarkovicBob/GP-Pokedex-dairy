

async function fetchPokemon(id){
    try{
        let generalPokemonArray=JSON.parse(localStorage.getItem("pokemonList")) || [];
        console.log("FP:"+generalPokemonArray);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if(!response.ok){throw new Error("Pokemon ist entwischt oder war niemals da!");}
        
        const pokemon = await response.json();
        let pokemonObject = {
            id : pokemon.id,
            name : pokemon.name,
            type : pokemon.types.map((t)=>t.type.name),
            weight : pokemon.weight,
            height : pokemon.height,
            image : pokemon.sprites.other.showdown.front_default,
            comment : ""
        }        
                
        localStorage.setItem("pokemonList",JSON.stringify([...generalPokemonArray, pokemonObject]));
    } catch (error){
        console.error(error);
    }
}


function generateCard(pokemon){
    const pokemonContainer = document.getElementById("pokemon-container");
    let card = document.createElement("div");
    card.classList.add("border-yellow-500", "rounded-lg","border-4", "flex", "flex-col");

    switch(`${pokemon.type[0]}`.toLowerCase()){
        case "grass": card.classList.add("bg-green-500"); break;
        case "psychic": card.classList.add("bg-purple-900"); break;
        case "fire": card.classList.add("bg-red-800", "text-white"); break;
        default: card.classList.add("bg-gray-900", "text-white");
    }

    let nameIdElement = document.createElement("h2");
    nameIdElement.className="m-4 font-bold text-lg";
    nameIdElement.textContent=`#${pokemon.id} ${pokemon.name}`;
    let imgElement = document.createElement("img");
    imgElement.src=`${pokemon.image}`;
    imgElement.classList.add("bg-white", "m-4");
    let weightHeightContainer = document.createElement("div");
    weightHeightContainer.classList.add("flex", "flex-row", "justify-between", "mx-4");
    let weightSpan = document.createElement("span");
    weightSpan.textContent="Weight: "+pokemon.weight;
    let heightSpan = document.createElement("span");
    heightSpan.textContent="Height: "+pokemon.height;
    weightHeightContainer.appendChild(weightSpan);
    weightHeightContainer.appendChild(heightSpan);

    let typeElement = document.createElement("p");
    let heartContainer = document.createElement("div");
    heartContainer.className ="flex flex-row justify-end mx-4";
    let heartElement = document.createElement("img");
    heartElement.src = "./images/heatz.png";
    console.log(heartElement)
    heartContainer.appendChild(heartElement);
    card.appendChild(nameIdElement);
    card.appendChild(imgElement);
    card.appendChild(weightHeightContainer);
    card.appendChild(typeElement);
    typeElement.textContent=pokemon.type.join(', ');
    card.appendChild(heartContainer);
    pokemonContainer.appendChild(card);
}

function renderMain(pokemons){
    const pokemonContainer = document.getElementById("pokemon-container");
    pokemonContainer.textContent='';
    pokemons.forEach(pokemon => {
        generateCard(pokemon);
    });
}

async function searchPokemon(searchPhrase){
    let searchResults = [];

    if(searchResults.length>0){
        renderMain(searchResults);
    } else {
        const pokemonContainer = document.getElementById("pokemon-container");
        pokemonContainer.className='text-red-800 text-center font-bold text-lg';
        pokemonContainer.innerHTML='<h2>Ihre Suche ergab keine Treffer!</h2>';    
    }
    
}

function filterByType(type){

}

function changeFavouriteStatus(id){
    let pokemonArray = JSON.parse(localStorage.getItem("pokemonList"));
    let pokemonToAdd = pokemonArray.find((p)=>p.id==id);
    if(pokemonToAdd){
        let favouritesArray = JSON.parse(localStorage.getItem("favouritesList"));
        if(favouritesArray.find((p)=>p.id==pokemonToAdd.id)){ // delete from favourites
            //splicen...
            // Herz leeren
        } else { // add to favourites
            favouritesArray.push(pokemonToAdd);
            localStorage.setItem("favouritesList", JSON.stringify(favouritesArray));
            // Herz ausfüllen
        }        
    } else {
        console.error("Pokemon existiert nicht");
    }
   
}

async function initialRenderOfMain(){
    
    let pokemonList = JSON.parse(localStorage.getItem("pokemonList")) || [];

    if(pokemonList.length!=0){
        renderMain(pokemonList);
    } else {
        localStorage.setItem("pokemonList",JSON.stringify([]));
        for(let i = 1;i<=150;i++){
            await fetchPokemon(i);
        }
        pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
        renderMain(pokemonList);
    }
}

initialRenderOfMain();