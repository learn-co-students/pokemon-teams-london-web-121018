const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const cardHolder = document.querySelector('main');

function cardHolderListener(){
    cardHolder.addEventListener('click', e =>{
        if(!e.target.matches('.release') && e.target.matches('button')){ 
            addPokemon(e.target.dataset.trainerId);

        }else if(e.target.matches('.release')){
            console.log(e.target.dataset.pokemonId);
            releasePokemon(e.target.dataset.pokemonId);
        }
    })
}


let trainers;

function addTrainers(list){
    cardHolder.innerHTML = ''
    for(const trainer of list){
        addIndividualTrainer(trainer);
    }
}

function addIndividualTrainer(trainer){
    cardHolder.innerHTML += `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul>
        ${trainer.pokemons.map(pokemon => `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`).join('')}
        </ul>
    </div>`
}



function initialize(){
    getTrainers()
    .then(info => 
        {trainers = info
        addTrainers(trainers)});

    cardHolderListener();
}








function getTrainers(){
    return fetch('http://localhost:3000/trainers').then(resp => resp.json());
}

function addPokemon(trainerId){
    let addtrainer = trainers[trainerId-1]
    if(addtrainer.pokemons.length !== 6){
        return fetch('http://localhost:3000/pokemons',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'trainer_id': trainerId
            })
            }).then(() => getTrainers().then(addTrainers))
    }else{
        window.alert("trainer has maximum pokemon");
    }
    
}

function releasePokemon(pokemonId){
    return fetch(`${POKEMONS_URL}/${pokemonId}`, {
      method: "DELETE",
    })
    .then(() => getTrainers().then(addTrainers))
  }

initialize()