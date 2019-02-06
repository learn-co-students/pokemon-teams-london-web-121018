const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainEl = document.querySelector('main');


//SERVER FETCH////////////////////////////////////////////////////////////////////////////////////

const getTrainers = () => {
    return fetch(TRAINERS_URL)
        .then(resp => resp.json());
};

const grabPokemon = () => {
    return fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({trainer_id: state.selectedTrainer.id})
    }).then(resp => resp.json());
};

const deletePokemon = (id) => {
    return fetch(`${POKEMONS_URL}/${id}`, {
            method: 'DELETE'
    });
};

//STATE///////////////////////////////////////////////////////////////////////////////////////////

const state = {
    trainers: [],
    selectedTrainer: null,
};

//MAIN SECTION DISPLAY////////////////////////////////////////////////////////////////////////////

const showTrainerCard = (trainer) => {
    const trainerDiv = document.createElement('div');
    const pokemonLis = trainer.pokemons.map(poke => `<li data-poke_id=${poke.id}>${poke.nickname}(${poke.species})<button data-id=${trainer.id} class='release'>Release</button></li>`).join('');

    trainerDiv.className = 'card';
    trainerDiv.innerHTML = `<p>${trainer.name}</p>
                            <button data-id=${trainer.id}>Add Pokemon</button>
                            <ul>
                                ${pokemonLis}
                            </ul>`;
    mainEl.appendChild(trainerDiv);
    }; 

const renderTrainers = () => {
    mainEl.innerHTML ='';

    state.trainers.forEach(showTrainerCard);
};
//MOVE POKEMONS FROM TRAINERS/////////////////////////////////////////////////////////////////////

const removePokemon = (pokemonId) => {
    const updatedTrainerPokes = state.selectedTrainer.pokemons.filter(poke => poke.id !== pokemonId);
    state.selectedTrainer.pokemons = updatedTrainerPokes;
    deletePokemon(pokemonId);

};

const addPokemon = () => {
    grabPokemon().then(pokemon => {
        console.log(pokemon)
         if (pokemon.error) { 
             alert(pokemon.error)
            } else {
            state.selectedTrainer.pokemons.push(pokemon)
            renderTrainers()}
    }); 
};


//EVENT LISTENERS/////////////////////////////////////////////////////////////////////////////////
const findTrainer = id => {
    return state.trainers.find(trainer => trainer.id === id) 
};

const cardListener = () => {
    document.addEventListener('click', event => {
            if (event.target.tagName === 'BUTTON') {
                let id = parseInt(event.target.dataset.id);
                state.selectedTrainer = findTrainer(id);

                if (event.target.className) {
                    let id = parseInt(event.target.parentElement.dataset.poke_id)
                    removePokemon(id)
                    renderTrainers()
                } else {
                    addPokemon()
                }
            }
    });
}; 
 
//INITIALIZE//////////////////////////////////////////////////////////////////////////////////////

const init = () => {
    getTrainers()
        .then(jso => {
            state.trainers = jso;
            renderTrainers();
        });
    cardListener()
};

init()