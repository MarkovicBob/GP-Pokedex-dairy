import heatz from '../images/heart.svg';
import redheart from '../images/redheart.svg';

async function fetchPokemon(id){
    try{
        let generalPokemonArray=JSON.parse(localStorage.getItem("pokemonList")) || [];
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
        return pokemonObject;
    } catch (error){        
        return "failed";
    }
}


function generateCard(pokemon){
    let favouritesArrayGenerate = JSON.parse(localStorage.getItem("favouritesList")) || [];
    const isFavourite = favouritesArrayGenerate.find((p)=>p.id==pokemon.id)? true : false;
    const pokemonContainer = document.getElementById("pokemon-container");
    let card = document.createElement("div");
    card.classList.add("border-yellow-500", "rounded-lg","border-4", "flex", "flex-col");

    switch(`${pokemon.type[0]}`.toLowerCase()){
        case "grass": card.classList.add("bg-green-300"); break;
        case "psychic": card.classList.add("bg-purple-300"); break;
        case "fire": card.classList.add("bg-red-300", ); break;
        case "normal": card.classList.add("bg-orange-300", ); break;
        case "water": card.classList.add("bg-blue-300", ); break;
        case "bug": card.classList.add("bg-slate-300", ); break;
        default: card.classList.add("bg-gray-300");
    }

    let nameIdElement = document.createElement("h2");
    nameIdElement.className="m-4 font-bold text-lg";
    nameIdElement.textContent=`#${pokemon.id} ${pokemon.name}`;
    let imgElement = document.createElement("img");
    imgElement.src=`${pokemon.image}`;
    imgElement.classList.add("bg-white", "m-4", "rounded-lg");
    let weightHeightContainer = document.createElement("div");
    weightHeightContainer.classList.add("flex", "flex-row", "justify-between", "mx-4");
    let weightSpan = document.createElement("span");
    weightSpan.textContent="Weight: "+pokemon.weight;
    let heightSpan = document.createElement("span");
    heightSpan.textContent="Height: "+pokemon.height;
    weightHeightContainer.appendChild(weightSpan);
    weightHeightContainer.appendChild(heightSpan);

    let typeElement = document.createElement("p");
    typeElement.textContent=pokemon.type.join(', ');
    typeElement.classList.add("m-4");
    let heartContainer = document.createElement("div");
    heartContainer.className ="flex flex-row justify-end mx-4";
    let heartElement = document.createElement("img");
    
    if(isFavourite){
        heartElement.src = redheart;
    } else {
        heartElement.src = heatz;
    }
    
    heartElement.id="heart"+pokemon.id;
    heartElement.classList.add("w-8", "h-8",);
    heartElement.addEventListener('click',()=>changeFavouriteStatus(pokemon.id));    
    heartContainer.appendChild(heartElement);
    card.appendChild(nameIdElement);
    card.appendChild(imgElement);
    card.appendChild(weightHeightContainer);
    card.appendChild(typeElement);
    
    card.appendChild(heartContainer);
    pokemonContainer.appendChild(card);
}

function renderMain(pokemons){
    const pokemonContainer = document.getElementById("pokemon-container");
    pokemonContainer.textContent='';
    if(pokemons.length>0){
        pokemons.forEach(pokemon => {
        generateCard(pokemon);
        });
    } else {
        pokemonContainer.textContent("Es gibt keine Pokemon passend zu Ihrer Anfrage.");
    }
}

async function searchPokemon(){
    try{
        let searchPhrase = `${document.getElementById("searchInput").value}`.trim();
        
    let searchResults = [];
    let pokemonListe = JSON.parse(localStorage.getItem("pokemonList"))||[];
    searchResults = pokemonListe.filter((p)=>p.name == searchPhrase);
    if(searchResults.length==0){
        let totalPokemonArrayAPI = [];
        const pokemonFromAPI = await fetchPokemon(searchPhrase);
        if(pokemonFromAPI === "failed"){
            const pokemonContainer = document.getElementById("pokemon-container");   
            pokemonContainer.textContent='Ihre Anfrage ergab keine Treffer!';
        } else {
            searchResults.push(pokemonFromAPI);
        }        
    }
    console.log(searchResults);
    if(searchResults.length>0){
        renderMain(searchResults);
    } else {
        const pokemonContainer = document.getElementById("pokemon-container");        
        pokemonContainer.textContent='Ihre Anfrage ergab keine Treffer!';    
    }
    } catch (error){
        const pokemonContainer = document.getElementById("pokemon-container");        
        pokemonContainer.textContent='Ihre Anfrage ergab keine Treffer oder es ist ein Fehler aufgetreten!'+error;
    }    
}

export function filterByType(type){
    const pokemonListe = JSON.parse(localStorage.getItem("pokemonList"));
    let arrayPokemonsToShow = [];
    switch(type){
        case "fire": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type.some(el=>el=="fire")); break;
        case "grass": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type[0]=="grass"); break;
        case "psychic": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type[0]=="psychic"); break;
        case "bug": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type[0]=="bug"); break;
        case "normal": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type[0]=="normal"); break;
        case "electric": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type[0]=="electric"); break;
        case "water": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type[0]=="water"); break;
        case "poison": arrayPokemonsToShow= pokemonListe.filter((p)=>p.type.some(el=>el=="poison")); break;
        default: arrayPokemonsToShow = pokemonListe;
    }
    renderMain(arrayPokemonsToShow);
}

function resetFilter(){
    const pokemonListe = JSON.parse(localStorage.getItem("pokemonList"));
    renderMain(pokemonListe);
}

async function changeFavouriteStatus(id){
    let pokemonArray = JSON.parse(localStorage.getItem("pokemonList"));
    let pokemonToAdd = pokemonArray.find((p)=>p.id==id);
    let heartIcon = document.getElementById("heart"+id);
    if(pokemonToAdd){
        let favouritesArray = JSON.parse(localStorage.getItem("favouritesList"))||[];
        if(favouritesArray.find((p)=>p.id==pokemonToAdd.id)){ // delete from favourites
            if(confirm("Wollen Sie das Pokemon wirklich aus den Favoriten löschen?")){
                let index = favouritesArray.map(f=>f.name).indexOf(pokemonToAdd.name);
                console.log(index);
                await favouritesArray.splice(index,1);
                localStorage.setItem("favouritesList", JSON.stringify([...favouritesArray]));
                heartIcon.src=heatz;
                heartIcon.classList.add("w-8","h-8");
            }            
        } else { // add to favourites
            
            localStorage.setItem("favouritesList", JSON.stringify([...favouritesArray,pokemonToAdd]));
            
            heartIcon.src=redheart;
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

function setupFilterButtons(){
    const resetButton = document.getElementById("resetFilter");
    resetButton.addEventListener('click', ()=>resetFilter());
    const fireButton = document.getElementById("fireFilter");
    fireButton.addEventListener('click', ()=>filterByType("fire"));
    const grassButton = document.getElementById("grassFilter");
    grassButton.addEventListener('click', ()=>filterByType("grass"));
    const bugButton = document.getElementById("bugFilter");
    bugButton.addEventListener('click', ()=>filterByType("bug"));
    const psychicButton = document.getElementById("psychicFilter");
    psychicButton.addEventListener('click', ()=>filterByType("psychic"));
    const normalButton = document.getElementById("normalFilter");
    normalButton.addEventListener('click', ()=>filterByType("normal"));
    const electricButton = document.getElementById("electricFilter");
    electricButton.addEventListener('click', ()=>filterByType("electric"));
    const waterButton = document.getElementById("waterFilter");
    waterButton.addEventListener('click', ()=>filterByType("water"));
    const poisonButton = document.getElementById("poisonFilter");
    poisonButton.addEventListener('click', ()=>filterByType("poison"));
}

initialRenderOfMain();
document.getElementById("searchButton").addEventListener('click', ()=>searchPokemon());
setupFilterButtons();