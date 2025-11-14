# 👾 Type Racer (Proyecto Full-Stack)

---

## 🚀 Tecnologías Utilizadas

Este proyecto está dividido en dos partes:

* **Frontend (Carpeta `/frontend`):**
    * **[Vue.js 3](https://vuejs.org/)** (con la Composition API y `<script setup>`)
    * **[Vite](https://vitejs.dev/)** (como entorno de desarrollo)
    * **[Socket.io-client](https://socket.io/)** (para la conexión en tiempo real)

* **Backend (Carpeta `/backend`):**
    * **[Node.js](https://nodejs.org/)**
    * **[Express](https://expressjs.com/)** (como servidor web)
    * **[Socket.io](https://socket.io/)** (para gestionar las conexiones WebSocket)

---

## 🎮 ¿Qué hace este proyecto?

* **Lobby Multijugador:** Los jugadores pueden unirse a una sala de espera e introducir su nombre.
* **Actualización en Tiempo Real:** La lista de jugadores en el lobby se actualiza al instante para todos los clientes conectados usando WebSockets.
* **Juego de Mecanografía:** Implementa una lógica de juego donde el usuario debe teclear palabras.
* **Feedback Instantáneo:** El motor del juego (`GameEngine.vue`) da feedback letra por letra (verde si es correcta, rojo si es incorrecta).
* **Contador de Errores:** Registra los errores cometidos en cada palabra.
* **Teclado Visual:** Un teclado QWERTY en pantalla que reacciona a las pulsaciones del usuario.

---

## 🛠️ Cómo Ejecutarlo en Local

Para probar este proyecto en tu propio ordenador, necesitarás tener [Node.js](https://nodejs.org/es) instalado.

### 1. Backend (El Servidor)

Primero, arranca el servidor.

```bash
# 1. Clona el repositorio
git clone [https://github.com/AdrianMaciel1106/typeracer](https://github.com/AdrianMaciel1106/typeracer)

# 2. Entra en la carpeta del backend
cd typeracer/back

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor
node servidor.js
