const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const mainTag = document.querySelector('main')

document.addEventListener('DOMContentLoaded', onLoad)

function onLoad() {
  mainTag.addEventListener('click', clickHandler)
  fetch(TRAINERS_URL)
    .then(r => r.json())
    .then((trainerArr) => {
      trainerArr.forEach(trainerObj => {
        mainTag.innerHTML += trainerCard(trainerObj)
        let ulTag = mainTag.querySelector(`.poke-${trainerObj.id}`)
        trainerObj.pokemons.forEach(pokemon => {
          ulTag.innerHTML += pokemonTemplate(pokemon)
        })
      }
    )
  })
}

function clickHandler(evt) {
  if(evt.target.innerText === 'Add Pokemon') {
    addPokemon(evt.target.dataset.trainerId)
  } else if (evt.target.innerText === 'Release') {
    removePokemon(evt);
  }
}

function removePokemon(evt) {
  const pokemonId = evt.target.dataset.pokemonId
  fetch(`${POKEMONS_URL}/${pokemonId}`, {
    method: 'DELETE'
  }).then(r => r.json())
    .then(pokemon => {
      if(pokemon.id) {
        evt.target.parentElement.remove()
      } else {
        throw new Error('Pokemon was not sucessfully deleted')
      }
    })
    .catch(console.error)
}


function addPokemon(trainerId) {
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "trainer_id": trainerId
    })

  }).then(r => r.json())
    .then((pokemon) => {
      if(pokemon.trainer_id) {
        let ulTag = mainTag.querySelector(`.poke-${pokemon.trainer_id}`)
        ulTag.innerHTML += pokemonTemplate(pokemon)
      } else {
        alert(pokemon.error)
      }
    })
}

const trainerCard = (trainerObj) => {
  return `
    <div class="card" data-id="${trainerObj.id}"><p>${trainerObj.name}</p>
      <button data-trainer-id="${trainerObj.id}">Add Pokemon</button>
      <ul class="poke-${trainerObj.id}">

      </ul>
    </div>
  `
}

const pokemonTemplate = (pokemon) => {
  return `
    <li>${pokemon.nickname } (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
`
}
