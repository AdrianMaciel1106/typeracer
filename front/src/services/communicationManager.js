import { io } from 'socket.io-client';
import { ref } from 'vue';

// Hacemos que la lista de jugadores sea 'reactiva'.
// App.vue la importará directamente.
export const jugadoresEnLobby = ref([]);

// Se conectará al mismo servidor que sirve la página web
const socket = io({ autoConnect: false });

// Creamos un objeto 'gestor' para no llamar a 'socket'
// directamente desde la App.vue. Es más limpio.
const gestorConexion = {
  
  // Esta es la función que llamará App.vue
  conectar(nombreJugador) {
    // Ahora sí, le damos permiso para conectar
    socket.autoConnect = true; 
    socket.connect();
    
    // ---- Listeners (Escuchar al servidor) ----

    // 1. Cuando la conexión se establece
    socket.on('connect', () => {
      console.log('Conectado al servidor. Enviando nombre...');
      // Le mandamos nuestro nombre al servidor
      socket.emit('setPlayerName', nombreJugador);
    });

    // 2. Cuando el servidor nos manda una lista actualizada
    socket.on('updatePlayerList', (nuevaLista) => {
      // Vue se encargará de actualizar la vista
      jugadoresEnLobby.value = nuevaLista;
    });

    // 3. Cuando nos desconectamos
    socket.on('disconnect', () => {
      console.log('Te has desconectado.');
      jugadoresEnLobby.value = []; // Vaciamos la lista
    });
  },

  // Función para desconectar manualmente (si hace falta)
  desconectar() {
    socket.disconnect();
  },
};

// Exportamos el gestor para que App.vue lo use
export default gestorConexion;