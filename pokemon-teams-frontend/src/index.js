const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const main = document.querySelector("main")

const state = {
  trainers: [],
  selectedTrainer: null
}

// Add a single trainer
const addATrainer = (trainer ) => {
  const trainerDiv = document.createElement('div')
  const pokemonList = trainer.pokemons.map(pokemon => `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-id=${pokemon.id}>Release</button></li>`).join('')
  trainerDiv.className = "card"
  trainerDiv.dataset.id = trainer.id
  trainerDiv.innerHTML =
  `
  <p>${trainer.name}</p>
  <button class = "add" data-id=${trainer.id}>Add Pokemon</button>
  <ul>
    ${pokemonList}
  </ul>`
  main.appendChild(trainerDiv)
}

// Add multiple trainers
const addTrainers = () => {
  main.innerHTML = ""
  state.trainers.forEach(trainer => addATrainer(trainer))
}

//Add a pokemon listener
const addPokemonListener = () => {
  document.addEventListener('click', event => {
    if (event.target.className === "add") {
      const id = parseInt(event.target.dataset.id)
      const foundTrainer = state.trainers.find(trainer => trainer.id === id)
      addAPokemonButton(id, foundTrainer)
    }
  })
}

//Add a Pokemon
const addAPokemonButton =(id, trainer) => {
  if (trainer.pokemons.length === 6){
    window.alert("Trainer can't have more than 6 pokemon")
  } else {
  state.selectedTrainer = trainer
  addAPokemon(state.selectedTrainer)
  .then(resp => state.selectedTrainer.pokemons.push(resp))
  .then(resp => addTrainers(state.trainers))}
}

// Release a Pokemon Listenr
const releaseAPokemonListener = () => {
  document.addEventListener('click', event => {
    if (event.target.className === "release") {
      const pokemonId = parseInt(event.target.dataset.id)
      releaseAPokemon(pokemonId)
    }
  })
}

// release Pokemon from State
const deletePokemonFromState = (pokemon) => {
  const trainerId = pokemon.trainer_id
  const pokemonId = pokemon.id
  const trainerIndex = trainerId-1
  trainer = state.trainers[trainerIndex]
  const newPokemons = trainer.pokemons.filter(poke => poke.id !== pokemonId )
  trainer.pokemons = newPokemons
  addTrainers()
}

// server
const getTrainers = () => {
  return fetch('http://localhost:3000/trainers')
    .then(resp => resp.json())
}

const addAPokemon = (trainer) => {
  return fetch(`http://localhost:3000/pokemons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({trainer_id: trainer.id})
  }).then(resp => resp.json())
}

const releaseAPokemon = (pokemonId) => {
  return fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
    method: 'DELETE',
  }).then(resp => resp.json())
  .then(resp => deletePokemonFromState(resp))
}

initialize = () => {
  getTrainers()
  .then(trainers => {
  state.trainers = trainers
  addTrainers(state.trainers)
})
releaseAPokemonListener()
addPokemonListener()
}

initialize()
