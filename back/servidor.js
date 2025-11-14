import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // De momento, cualquiera se puede conectar
  }
});

// Guardamos los jugadores conectados
// La 'key' será el ID del socket, y el 'value' será {id, name}
const jugadores = {};

console.log('Servidor escuchando en el puerto 8080. ¡Go!');

// Función para mandar la lista nueva a TODOS
function actualizarListaJugadores() {
  // 'updatePlayerList' es el "canal" que escucha el frontend
  io.emit('updatePlayerList', Object.values(jugadores));
}

// Lógica principal de conexión
io.on('connection', (socket) => {
  console.log(`Nuevo jugador conectado: ${socket.id}`);
  
  // Cuando un jugador cierra la pestaña
  socket.on('disconnect', () => {
    console.log(`Jugador ${socket.id} se ha ido.`);
    
    // Lo borramos de la lista
    delete jugadores[socket.id];
    
    // Avisamos al resto
    actualizarListaJugadores();
  });

  // Cuando el jugador se registra con un nombre
  socket.on('setPlayerName', (nombre) => {
    
    // Comprobación simple (opcional, pero humano)
    if (!nombre || nombre.trim().length === 0) {
      nombre = "Anónimo";
    }

    jugadores[socket.id] = { id: socket.id, name: nombre.trim() };
    console.log(`El jugador ${socket.id} ahora se llama: ${nombre}`);
    
    // Mandamos la lista actualizada
    actualizarListaJugadores();
  });

  // TODO: Aquí irá la lógica de la partida
});

server.listen(8080);