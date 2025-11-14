<script setup>
import { ref } from 'vue';
// Importamos nuestro GameEngine
import GameEngine from './components/GameEngine.vue';

// Importamos el gestor de conexión y la lista de jugadores que creamos
import gestorConexion, { jugadoresEnLobby } from './services/communicationManager.js';

// ---- Estado de la App ----

// 'pantallaActual' controla qué vista mostramos
const pantallaActual = ref('espera'); // Vistas: 'espera', 'lobby', 'partida'
const nombreUsuario = ref('');

// ---- Funciones ----

// Se llama al pulsar el botón de entrar
function entrarAlLobby() {
  const nombre = nombreUsuario.value.trim();
  
  if (nombre) {
    gestorConexion.conectar(nombre); // Le pasamos el nombre al gestor
    pantallaActual.value = 'lobby'; // Cambiamos de pantalla
  } else {
    alert('¡Escribe un nombre!');
  }
}

// Se llama desde el lobby para empezar
function iniciarPartida() {
  pantallaActual.value = 'partida';
  // TODO: Avisar al servidor que este jugador ha empezado
}

// Se llama desde el juego para volver
function volverAlLobby() {
  pantallaActual.value = 'lobby';
}
</script>

<template>
  <main>
    <div v-if="pantallaActual === 'espera'" class="vista-container">
      <h1>Type Racer Royale</h1>
      <input 
        type="text" 
        v-model="nombreUsuario" 
        placeholder="Escribe tu nombre..."
        @keyup.enter="entrarAlLobby" 
      />
      <button @click="entrarAlLobby">Entrar al Lobby</button>
    </div>

    <div v-else-if="pantallaActual === 'lobby'" class="vista-container">
      <h2>Jugadores Conectados ({{ jugadoresEnLobby.length }})</h2>
      <ul>
        <li v-for="jugador in jugadoresEnLobby" :key="jugador.id">
          {{ jugador.name }}
        </li>
      </ul>
      <button @click="iniciarPartida">¡Empezar a Jugar!</button>
    </div>

    <div v-else-if="pantallaActual === 'partida'" class="vista-container">
      <GameEngine />
      <button @click="volverAlLobby">Volver al Lobby</button>
    </div>
  </main>
</template>

<style>
/* Estilo "humanizado" - Menos moderno, más funcional */
body {
  font-family: Verdana, sans-serif; /* Fuente diferente */
  margin: 0;
  background-color: #fafafa; /* Fondo casi blanco */
  color: #222;
}

main {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* Contenedor principal con bordes duros */
.vista-container {
  width: 100%;
  max-width: 550px; /* Un poco más estrecho */
  padding: 2rem;
  border-radius: 4px; /* Esquinas más cuadradas */
  background: #ffffff;
  border: 1px solid #ccc; /* Sin sombras, con borde */
  text-align: center;
  box-sizing: border-box;
}

h1 {
  font-size: 2.2rem;
  color: #333;
  margin-top: 0;
}

h2 {
  font-size: 1.5rem;
  color: #444;
  border-bottom: 1px dashed #ddd; /* Borde discontinuo */
  padding-bottom: 10px;
}

/* Inputs */
input[type="text"] {
  display: block;
  width: 90%;
  margin: 25px auto;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #337ab7; /* Azul "clásico" */
}

/* Botones */
button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #337ab7; /* Azul "clásico" */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

button:hover {
  background-color: #286090; /* Azul más oscuro */
}

/* Lista de jugadores */
ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
}

li {
  font-size: 1.1rem;
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

/* Punto de "online" del color de los botones */
li::before {
  content: '●';
  color: #337ab7; /* Azul "clásico" */
  font-size: 0.8rem;
  margin-right: 10px;
}
</style>