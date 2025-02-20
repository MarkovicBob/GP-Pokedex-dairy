import heatz from '../images/heart.svg';
import redheart from '../images/redheart.svg';

function generateFavouriteCard(pokemon){
    let favouritesArrayGenerate = JSON.parse(localStorage.getItem("favouritesList")) || [];
    const isFavourite = favouritesArrayGenerate.find((p)=>p.id==pokemon.id)? true : false;
    const pokemonContainer = document.getElementById("favourites-container");
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
    heartElement.addEventListener('click',()=>changeFavouriteStatusFavourites(pokemon.id));    
    heartContainer.appendChild(heartElement);

    commentElement = document.createElement("input");
    commentElement.type="text";
    commentElement.value= pokemon.comment;
    commentElement.classList.add("m-4");
    commentElement.id="comment"+pokemon.id;
    commentSubmitElement=document.createElement("button");
    commentSubmitElement.textContent="Save";
    commentSubmitElement.classList.add("rounded-lg","border", "border-black","border-solid","bg-gray-300", "mb-4", "mx-10", "px-2", "py-1");
    commentSubmitElement.addEventListener('click',()=>saveComment(pokemon.id));
    card.appendChild(nameIdElement);
    card.appendChild(imgElement);
    card.appendChild(weightHeightContainer);
    card.appendChild(typeElement);
    
    card.appendChild(heartContainer);
    card.appendChild(commentElement);
    card.appendChild(commentSubmitElement);
    pokemonContainer.appendChild(card);
}

function renderMain(){
    const pokemonContainer = document.getElementById("favourites-container");
    pokemonContainer.textContent='';
    let pokemons = JSON.parse(localStorage.getItem("favouritesList")) || [];
    if(pokemons.length>0){
        pokemons.forEach(pokemon => {
            generateFavouriteCard(pokemon);
        });
    } else {
        pokemonContainer.textContent="Sie haben keine Pokemon als Favoriten markiert.";
    }
}

function changeFavouriteStatusFavourites(id){
    if(confirm("Wollen Sie das Pokemon wirklich aus den Favoriten löschen?")){
        let pokemonArray = JSON.parse(localStorage.getItem("pokemonList"));
        let pokemonToRemove = pokemonArray.find((p)=>p.id==id);
        if(pokemonToRemove){
            let favouritesArray = JSON.parse(localStorage.getItem("favouritesList"))||[];
            if(favouritesArray.find((p)=>p.id==pokemonToRemove.id)){ // delete from favourites
                //splicen...
                let index = favouritesArray.map(f=>f.name).indexOf(pokemonToRemove.name);
                console.log(index);
                favouritesArray.splice(index,1);
                localStorage.setItem("favouritesList", JSON.stringify([...favouritesArray]));
                renderMain()
                // Herz leeren
            }else {
                
            }        
        } else {
            console.error("Pokemon existiert nicht");
        }
    }  
}


function saveComment(id){
    
    const favList = JSON.parse(localStorage.getItem("favouritesList"));
    const commentInput = document.getElementById("comment"+id);
    console.log(commentInput.value);
    let pokemonToUpdate = favList.find((p)=>p.id == id);
    if(pokemonToUpdate){
        pokemonToUpdate.comment = commentInput.value;
    }
    localStorage.setItem("favouritesList", JSON.stringify([...favList]));
    alert("Comment successfully saved!");
}

renderMain();