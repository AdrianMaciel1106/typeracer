import { io } from 'socket.io-client';
import { ref } from 'vue'; // Importem ref per fer la llista reactiva

// Creem una variable reactiva que App.vue podrà importar
export const jugadorsConnectats = ref([]);

// Creem una única instància del socket
// autoConnect: false -> No es connecta fins que nosaltres li diguem
const socket = io('http://localhost:8080', { autoConnect: false });

// Aquest objecte serà la nostra API per comunicar-nos
const communicationManager = {
  
  // Funció per connectar-se i registrar listeners
  connect(playerName) {
    socket.autoConnect = true; // Habilitem la connexió automàtica
    socket.connect(); // Connectem manualment la primera vegada
    
    // Quan ens connectem, enviem el nom
    socket.on('connect', () => {
      console.log('Connectat al servidor amb ID:', socket.id);
      socket.emit('setPlayerName', playerName);
    });

    // Quan rebem la llista de jugadors, l'actualitzem
    socket.on('updatePlayerList', (llistaDeJugadors) => {
      jugadorsConnectats.value = llistaDeJugadors;
    });

    // Gestionem la desconnexió (opcional però recomanat)
    socket.on('disconnect', () => {
      console.log('Desconnectat del servidor');
      jugadorsConnectats.value = []; // Buidem la llista
    });
  },

  disconnect() {
    socket.disconnect();
  },

  // --- Aquí aniran la resta de funcions per a 'emit' i 'on' ---
  // ...
};

export default communicationManager;