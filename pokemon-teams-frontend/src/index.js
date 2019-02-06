const trainerContainer = document.querySelector('main')

// state
const state = {
  trainers: [],
  selectedTrainer: null
}

// add trainer to page
function addTrainer(trainer) {
	const trainerEl = document.createElement('div');
	trainerEl.className = 'card';
	trainerEl.dataset.id = trainer.id;
	trainerEl.innerHTML = `
		<p>${trainer.name}</p>
		<button data-trainer-id=${trainer.id}>Add Pokemon</button>
		<ul class="trainer-${trainer.id}">
		</ul>
	`
	trainerContainer.append(trainerEl);
  const addBtn = trainerEl.querySelector('button');
  addBtn.addEventListener('click', () => {
    state.selectedTrainer = trainer
    if(isTrainerFull()){
      postPokemon(trainer)
      .then(addPokemon)
    } else {
      alert(`${state.selectedTrainer.name} has a full team!`)
    }
  })
}

// add trainers to page
function addTrainers(trainers) {
	trainers.forEach(addTrainer)
}

// add pokemon to trainer
const addPokemonToTrainer = trainer => {
	trainer.pokemons.forEach( pokemon => {
		addPokemon(pokemon)
    })
}

// add single pokemon to trainer
function addPokemon(pokemon) {
  // state.selectedTrainer.pokemons.push(pokemon);
  const pokemonUl = document.querySelector(`ul.trainer-${pokemon.trainer_id}`)
  const pokemonEl = document.createElement('li');
  pokemonEl.innerHTML = `
    ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
  `
  pokemonUl.append(pokemonEl);
  const deleteBtn = pokemonEl.querySelector('button');
  deleteBtn.addEventListener('click', () => {
    deletePokemon(pokemon)
      .then(pokemonEl.remove())
  })
}

// add pokemons to all trainers
const addPokemonToTrainers = trainers => {
  trainers.forEach(addPokemonToTrainer);
}

// is trainer full
const isTrainerFull = () => {
  const pokemonListEl = document.querySelector(`.trainer-${state.selectedTrainer.id}`);
  return pokemonListEl.childElementCount < 6 ? true : false;
}


// Server Stuff

// get trainers
function getTrainers () {
  return fetch('http://localhost:3000/trainers')
    .then(resp => resp.json())
}

// post pokemon
function postPokemon (trainer) {
  return fetch('http://localhost:3000/pokemons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trainer_id: trainer.id })
  })
  .then(resp => resp.json())
}

// delete pokemon
function deletePokemon (pokemon) {
  return fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
    method: 'DELETE'
  })
}

// on page load
function initialization() {
  getTrainers()
    .then( trainers => {
      state.trainers = trainers;
      addTrainers(trainers)
      addPokemonToTrainers(trainers)
    })
}

initialization()
