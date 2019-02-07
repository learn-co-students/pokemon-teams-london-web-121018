const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main');

const state = {
  // pokemons: [],
  trainers: []
}

function renderSingleTrainer(trainer) {
  const div = document.createElement('div')
  div.className = 'card'
  div.dataset.id = trainer.id
  div.innerHTML = `
    <p>${trainer.name}</p>
    <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
    </ul>
    `;
    const addBtn = div.querySelector('button');
  addBtn.addEventListener('click', getPokemons)

    trainer.pokemons.forEach(pokemon => {
      const li = document.createElement('li')
      li.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release">Release</button>`;
      li.addEventListener('click', deletePokemon)
      const ul = document.querySelector('ul')
      ul.appendChild(li)
    })
  main.appendChild(div);
}

function renderMultipleTrainers() {
  main.innerHTML = '';
  state.trainers.forEach(trainer => renderSingleTrainer(trainer))
}


// initializer

function initialize() {
    getTrainers()
    .then(trainers => {
    state.trainers = trainers
  }).then(renderMultipleTrainers)
}



// server stuff
function getPokemons(trainerId) {
  return fetch(POKEMONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'
    },
    body: JSON.stringify({trainer_id: trainerId})
  })
    .then(initialize)
}

function getTrainers() {
  return fetch(TRAINERS_URL)
            .then(resp => resp.json())
}

function deletePokemon() {
  fetch(POKEMONS_URL + `${event.target.dataset.pokemonId}, {
    method: 'DELETE'
  }`).then(initialize)
}

initialize()
