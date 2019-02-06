const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const pokemonWrapper = document.querySelector('main')

const state = {
  trainers: [],
  currentPokemon: null,
  currentTrainer: null,
}

document.addEventListener('click', (event) => {
  if (event.target.innerText === "Add Pokemon") {
    //console.log('button')
    button = event.target
    state.currentTrainer = state.trainers.find((trainer) => { return trainer.id === parseInt(button.dataset.trainerId) })
    //console.log(state.currentTrainer)
    getPokemon(state.currentTrainer.id).then(addTrainers)
  } else if (event.target.innerText === "Release") {
    pokemonId = event.target.dataset.pokemonId
    deletePokemon(pokemonId).then(getTrainers)
  }
})

function getTrainers() {
  return fetch(TRAINERS_URL).then(response => { return response.json() }).then(resp => state.trainers = resp).then(addTrainers)
}

function getPokemon(trainerid) {
  return fetch(POKEMONS_URL, {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trainer_id: trainerid })
  }).then(resp => {
    if (resp.status === 403) {
      alert('Team is Full!')
    } else {
      return resp.text()
    }
  })
    .then(pokemon => { if (pokemon) { state.currentTrainer.pokemons.push(JSON.parse(pokemon)) } })
}

function deletePokemon(pokemonid) {
  return fetch(`http://localhost:3000/pokemons/${pokemonid}`, {
    method: "delete",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemon_id: pokemonid })
  })
}

function addTrainers() {
  pokemonWrapper.innerHTML = ''
  // state.trainers = trainers
  // debugger
  state.trainers.forEach(trainer => {
    let trainerCard = document.createElement("div")
    let pokemons = trainer.pokemons
    let pokemonList = []
    pokemons.forEach(pokemon => {
      singlePokemon = document.createElement("li")
      singlePokemon.innerHTML = `
      ${pokemon.nickname}(${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}"> Release</button >`
      pokemonList.push(singlePokemon)
    })
    trainerCard.className = "card"
    trainerCard.dataID = trainer.id
    trainerCard.innerHTML = `<p>${trainer.name}</p> <button data-trainer-id="${trainer.id}">Add Pokemon</button><ul>`
    pokemonList.forEach(pokemon => {
      trainerCard.append(pokemon)
    })
    pokemonWrapper.append(trainerCard)
  })
}




getTrainers()