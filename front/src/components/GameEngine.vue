<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// ---- Estado del Juego ----
const partida = ref({
  palabras: [
    { id: 1, text: 'componente', estado: 'pendiente', errors: 0 },
    { id: 2, text: 'reactividad', estado: 'pendiente', errors: 0 },
    { id: 3, text: 'javascript', estado: 'pendiente', errors: 0 },
    { id: 4, text: 'framework', estado: 'pendiente', errors: 0 },
    { id: 5, text: 'plantilla', estado: 'pendiente', errors: 0 }
  ],
  palabraActualIdx: 0, // El índice de la palabra actual
  inputUsuario: '',  // Lo que el usuario está escribiendo
  estadisticas: [],  // Guardamos los resultados
});

// Una 'computed' para acceder fácil a la palabra en la que estamos
const palabraActual = computed(() => {
  const idx = partida.value.palabraActualIdx;
  if (idx >= partida.value.palabras.length) {
    return null; // El juego ha terminado
  }
  return partida.value.palabras[idx];
});

let tiempoInicio = 0; // Para el cronómetro

function iniciarCronometro() {
  tiempoInicio = Date.now();
}

// ---- Lógica Principal ----
// Se ejecuta CADA VEZ que el usuario teclea algo
function revisarInput() {
  if (!palabraActual.value) return; // No hacer nada si se acabó el juego

  const palabraCorrecta = palabraActual.value.text;
  const inputActual = partida.value.inputUsuario;

  // Empezar el crono al teclear la primera letra
  if (inputActual.length === 1 && tiempoInicio === 0) {
    iniciarCronometro();
  }

  // --- Lógica de Errores ---
  // Si el texto NO empieza con lo que el usuario ha escrito...
  if (inputActual.length > 0 && !palabraCorrecta.startsWith(inputActual)) {
    // Para contar el error UNA SOLA VEZ, comprobamos si
    // el texto *anterior* sí era correcto.
    const inputAnterior = inputActual.substring(0, inputActual.length - 1);
    if (palabraCorrecta.startsWith(inputAnterior)) {
      palabraActual.value.errors++; // Sumamos un error
    }
    // No borramos la letra, dejamos que el CSS la pinte de rojo
    // El usuario tendrá que usar 'Backspace'
  }

  // --- Lógica de Palabra Completada ---
  if (inputActual === palabraCorrecta) {
    const tiempoTardado = Date.now() - tiempoInicio;
    
    // Guardar estadísticas
    partida.value.estadisticas.push({
      palabra: palabraActual.value.text,
      tiempo: tiempoTardado,
      errors: palabraActual.value.errors,
    });

    // Resetear para la siguiente palabra
    palabraActual.value.estado = 'completada';
    partida.value.palabraActualIdx++;
    partida.value.inputUsuario = '';
    tiempoInicio = 0;

    // Comprobar si se acabó el juego
    if (partida.value.palabraActualIdx >= partida.value.palabras.length) {
      console.log('¡Juego terminado!', partida.value.estadisticas);
      // Aquí se podría mostrar un resumen
    }
  }
}

// --- Función de Estilo (CSS) ---
// Decide qué clase (color) debe tener cada letra
function obtenerClaseLetra(idxLetra) {
  const input = partida.value.inputUsuario;
  
  // Si aún no hemos llegado a esta letra
  if (idxLetra >= input.length) {
    return 'letra-pendiente';
  }
  // Si la letra tecleada NO coincide con la letra correcta
  if (palabraActual.value.text[idxLetra] !== input[idxLetra]) {
    return 'letra-incorrecta';
  }
  // Si coincide
  return 'letra-correcta';
}

// ---- Teclado Visual ----
const filasTeclado = ref([
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]);
const teclaPulsada = ref(''); // Para el "flash" de la tecla

function handleKeyDown(event) {
  if (event.key.length > 1) return; // Ignorar 'Shift', 'Ctrl', 'Backspace'

  const teclaMayus = event.key.toUpperCase();
  if (filasTeclado.value.flat().includes(teclaMayus)) {
    teclaPulsada.value = teclaMayus;
    // Quitar el "flash" después de 150ms
    setTimeout(() => {
      teclaPulsada.value = '';
    }, 150);
  }
}

// Escuchar las teclas en toda la ventana
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

</script>

<template>
  <div class="game-engine">
    <div class="paraules-container">
      <div 
        v-for="(palabra, index) in partida.palabras" 
        :key="palabra.id"
        class="paraula"
        :class="{ 
          'paraula-activa': index === partida.palabraActualIdx,
          'paraula-completada': palabra.estado === 'completada'
        }"
      >
        <span 
          v-for="(letra, i) in palabra.text.split('')" 
          :key="i"
          class="lletra"
          :class="index === partida.palabraActualIdx ? obtenerClaseLetra(i) : ''"
        >
          {{ letra }}
        </span>
      </div>
    </div>

    <input 
      type="text" 
      class="text-input"
      v-model="partida.inputUsuario"
      @input="revisarInput"
      placeholder="Empieza a escribir..."
      :disabled="!palabraActual"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="none"
      spellcheck="false"
    />

    <div class="teclat-container">
      <div 
        v-for="(fila, i) in filasTeclado" 
        :key="i" 
        class="fila-teclat"
      >
        <div 
          v-for="tecla in fila" 
          :key="tecla" 
          class="tecla"
          :class="{ 'tecla-premuda': tecla === teclaPulsada }"
        >
          {{ tecla }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo "humanizado" - Modo oscuro / Terminal */
.game-engine {
  width: 100%;
  background: #282c34; /* Fondo oscuro */
  color: #abb2bf; /* Texto gris claro */
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
}

.paraules-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  font-family: 'Courier New', Courier, monospace; /* Fuente de programador */
  font-size: 1.6rem;
  line-height: 2.2rem;
  padding: 15px;
  background: #21252b; /* Fondo un poco más oscuro */
  border-radius: 4px;
}

.paraula {
  color: #5c6370; /* Palabras grises (aún no escritas) */
}

.paraula-completada {
  color: #444; /* Aún más oscuras */
}

.paraula-activa {
  color: #abb2bf; /* Palabra activa en gris claro */
}

/* --- Colores de las letras --- */
.lletra {
  transition: all 0.1s;
}

.lletra-correcta {
  color: #98c379; /* Verde (como en el código) */
  font-weight: bold;
}

.lletra-incorrecta {
  color: #21252b; /* Texto oscuro */
  background-color: #e06c75; /* Rojo (como en el código) */
  border-radius: 2px;
  padding: 0 1px;
}

/* Input de texto */
.text-input {
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  background: #21252b;
  color: #abb2bf;
  border: 1px solid #5c6370;
  border-radius: 4px;
  box-sizing: border-box;
}
.text-input:focus {
  outline: none;
  border-color: #61afef; /* Azul al hacer foco */
}

/* --- Teclado --- */
.teclat-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  user-select: none;
}
.fila-teclat {
  display: flex;
  gap: 6px;
}
.tecla {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #5c6370;
  border-radius: 4px;
  background: #3a3f4b;
  font-weight: bold;
  color: #abb2bf;
  transition: background-color 0.1s;
}
.tecla-premuda {
  background-color: #61afef; /* Azul (como en el código) */
  color: #21252b;
  border-color: #61afef;
}
</style>