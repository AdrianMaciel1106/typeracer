<script setup>
import { ref } from 'vue';
import GameEngine from './components/GameEngine.vue';

// Importem el gestor i la llista reactiva
import communicationManager, { jugadorsConnectats } from './services/communicationManager.js';

// Estat per controlar la vista
const vistaActual = ref('salaEspera'); // 'salaEspera', 'lobby', 'joc'
const nomJugador = ref('');

// Funció per connectar-se
function connectarAlServidor() {
  if (nomJugador.value.trim()) {
    communicationManager.connect(nomJugador.value);
    vistaActual.value = 'lobby';
  } else {
    alert('Introdueix un nom');
  }
}

// Funcions per canviar de vista
function comencarJoc() {
  vistaActual.value = 'joc';
  // En un futur, aquí avisaríem al servidor
}

function tornarAlLobby() {
  vistaActual.value = 'lobby';
}
</script>

<template>
  <main>
    <div v-if="vistaActual === 'salaEspera'" class="vista-container">
      <h1>Type Racer Royale</h1>
      <input 
        type="text" 
        v-model="nomJugador" 
        placeholder="Introdueix el teu nom"
        @keyup.enter="connectarAlServidor" 
      />
      <button @click="connectarAlServidor">Entra al Lobby</button>
    </div>

    <div v-else-if="vistaActual === 'lobby'" class="vista-container">
      <h2>Jugadors Connectats ({{ jugadorsConnectats.length }})</h2>
      <ul>
        <li v-for="jugador in jugadorsConnectats" :key="jugador.id">
          {{ jugador.name }}
        </li>
      </ul>
      <button @click="comencarJoc">Comença a Jugar!</button>
    </div>

    <div v-else-if="vistaActual === 'joc'" class="vista-container">
      <GameEngine />
      <button @click="tornarAlLobby">Torna al Lobby</button>
    </div>
  </main>
</template>

<style>
/* Estils globals per a l'aplicació */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #f0f2f5; /* Un fons gris molt suau */
  color: #333;
}

/* Contenidor principal que centra la nostra app */
main {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* El contenidor de cada vista */
.vista-container {
  width: 100%;
  max-width: 600px; /* Augmentat per al joc */
  padding: 2.5rem 2rem; /* Més espai intern */
  border-radius: 12px; /* Cantonades més arrodonides */
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); /* Ombra suau */
  text-align: center;
  box-sizing: border-box; /* Important per al padding */
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-top: 0;
}

h2 {
  font-size: 1.8rem;
  color: #34495e;
  border-bottom: 2px solid #f0f2f5;
  padding-bottom: 10px;
}

/* Inputs de text més moderns */
input[type="text"] {
  display: block;
  width: 90%;
  margin: 25px auto;
  padding: 14px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

input[type="text"]:focus {
  outline: none;
  border-color: #007aff; /* Color d'accent (blau) */
  box-shadow: 0 0 0 3px rgba(0,122,255,0.1);
}

/* Botons principals */
button {
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #007aff; /* Blau principal */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3; /* Un blau una mica més fosc */
}

button:active {
  transform: scale(0.98); /* Efecte de pulsació */
}

/* Llista de jugadors */
ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
}

li {
  font-size: 1.1rem;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
}

/* Afegeix un punt verd per a cada jugador (detall) */
li::before {
  content: '●';
  color: #28a745; /* Verd "online" */
  font-size: 0.8rem;
  margin-right: 10px;
}
</style>