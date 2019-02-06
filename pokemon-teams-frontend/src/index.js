const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainEl = document.querySelector('main')
const state = {
    teams:[]
}
// server stuff
let getTeams = (id) => {
    return fetch(TRAINERS_URL)
    .then(trainers => trainers.json())
}

let addPokemon = (id) => {
    return fetch(POKEMONS_URL,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            trainer_id: id
        })
    }).then(resp => resp.json())
}

let removePokemon = (id) => {
    return fetch(`${POKEMONS_URL}/${id}`, {method: 'DELETE'})
}

// show teams
let showTeam = (team) => {
    let first = team
    let cardEl = document.createElement('div')
    let pokemon = first.pokemons.map(pokemonEl => `<li>${pokemonEl.nickname} (${pokemonEl.species}) <button class="release" data-pokemon-id="${pokemonEl.id}" id="${first.id}">Release</button></li>`).join('')
    cardEl.className = 'card'
    cardEl.id = first.id
    cardEl.innerHTML = 
    `
    <p>${first.name}</p>
    <button class="add-pokemon" id="${first.id}">Add Pokemon</button>
    <ul>
    ${pokemon}
    </ul>
    `
    mainEl.appendChild(cardEl);
}

let showTeams = () => {
    mainEl.innerHTML = ''
    state.teams.forEach(team => showTeam(team));
}

// Add Pokemon

let addToPokemonState = (id) => {
    let trainer = state.teams.find(trainer => trainer.id === id)
    if (trainer.pokemons.length < 6) {
        addPokemon(id)
        .then(toAdd => trainer.pokemons.push(toAdd))
        .then(showTeams)
    }
}

// remove pokemon

let removeFromPokemonState = (id, pId) => {
    let trainer = state.teams.find(trainer => trainer.id === id)
    removePokemon(pId)
    .then(() => trainer.pokemons = trainer.pokemons.filter(poke => poke.id !== pId))
    .then(showTeams)
}

let initialise = () => {
    getTeams()
    .then(trainers => state.teams = trainers)
    .then(showTeams)
    .then(listenForClicks)
}

// click based stuff
let listenForClicks = () => {
    document.body.addEventListener('click', (eve) => {
        if (eve.target.className === 'add-pokemon') {
            // console.log(eve.target)
            addToPokemonState(parseInt(eve.target.id))
        }
        if (eve.target.className === 'release') {
            // console.log(eve.target)
            removeFromPokemonState(parseInt(eve.target.id), parseInt(eve.target.dataset.pokemonId))
        }
    })
}
initialise()