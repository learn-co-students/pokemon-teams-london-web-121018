const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const addBtn =  document.querySelector('#addPokemon')
const cardEls = document.querySelector('main')

const state = {
  trainers: []
}

//Add a single Trainer Card to <main>
addTrainerCard = (trainer) => {
  trainerCard = document.createElement('div')
    trainerCard.className = "card"
    trainerCard.dataset.trainerId = trainer.id
    pokemonList = trainer.pokemons.map(pokemon => `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>`).join("")
    trainerCard.innerHTML =
      `<p>${trainer.name}</p>
      <button class='addBtn' data-button-id="${trainer.id}">Add Pokemon</button>
      <ul>${pokemonList}</ul>`
    cardEls.append(trainerCard)
}

// Add multiple Trainer Cards to <main>
addTrainerCards = () => {
  cardEls.innerHTML = ''
	state.trainers.forEach(trainer => addTrainerCard(trainer))
}

//function for listening add Pokemon to trainer
function listenForNewPokemon () {
  document.addEventListener('click', (event) => {
      if (event.target.className === 'addBtn') {
        selectedTrainer = state.trainers.find(trainer => trainer.id === parseInt(event.target.dataset.buttonId))
        addPokemon(selectedTrainer)
           .then( () => getTrainers()
             .then(trainers => state.trainers = trainers)
                .then(addTrainerCards))
      }
  })
}

//function for listening releasing of pokemon
function listenForRelease () {
  document.addEventListener('click', (event) => {
    if (event.target.className === 'release') {
      releasePokemon(event.target.dataset.pokemonId)
         .then( () => getTrainers()
           .then(trainers => state.trainers = trainers)
             .then(addTrainerCards))
    }
  })
}



//INITIALIZE ON OPENING OF PAGE
function initialize () {
  getTrainers()
    .then(trainers => {
      state.trainers = trainers
      addTrainerCards(state.trainers)
    })
  listenForNewPokemon()
  listenForRelease()
}


//Server Stuff
function getTrainers () {
  return fetch('http://localhost:3000/trainers')
    .then(resp => resp.json())
}

function addPokemon (trainer) {
  return fetch(`http://localhost:3000/pokemons`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({trainer_id: trainer.id})
  }).then(resp => resp.json())
}

function releasePokemon (pokemonId) {
  return fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
     method: 'DELETE',
  }).then(resp => resp.json())
}

initialize ()
