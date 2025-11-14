<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// --- ESTAT DEL JOC (Amb errors: 0) ---
const estatDelJoc = ref({
  paraules: [
    { id: 1, text: 'component', estat: 'pendent', errors: 0 },
    { id: 2, text: 'reactivitat', estat: 'pendent', errors: 0 },
    { id: 3, text: 'javascript', estat: 'pendent', errors: 0 },
    { id: 4, text: 'framework', estat: 'pendent', errors: 0 },
    { id: 5, text: 'template', estat: 'pendent', errors: 0 }
  ],
  indexParaulaActiva: 0,
  textEntrat: '',
  estadistiques: [],
});

const paraulaActiva = computed(() => {
  if (estatDelJoc.value.indexParaulaActiva >= estatDelJoc.value.paraules.length) {
    return null;
  }
  return estatDelJoc.value.paraules[estatDelJoc.value.indexParaulaActiva];
});

let tempsIniciParaula = 0;

function iniciarCronometreParaula() {
  tempsIniciParaula = Date.now();
}

// --- LÒGICA DE VALIDACIÓ (CORREGIDA PER MOSTRAR ERRORS) ---
function validarProgres() {
  if (!paraulaActiva.value) return;

  const textCorrecte = paraulaActiva.value.text;
  const textEntrat = estatDelJoc.value.textEntrat;

  // Iniciem cronòmetre
  if (textEntrat.length === 1 && tempsIniciParaula === 0) {
    iniciarCronometreParaula();
  }

  // --- REPTE 5 (Versió Millorada per mostrar error en vermell) ---
  if (textEntrat.length > 0 && !textCorrecte.startsWith(textEntrat)) {
    // Comprovem si l'error s'acaba de produir
    const textAnterior = textEntrat.substring(0, textEntrat.length - 1);
    if (textCorrecte.startsWith(textAnterior)) {
      paraulaActiva.value.errors++; // Comptem l'error
    }
    // NO esborrem la lletra, per permetre que es vegi en vermell.
    // L'usuari haurà d'esborrar-la manualment.
  }
  // --- FI REPTE 5 ---

  // Comprovem si la paraula està completada
  if (textEntrat === textCorrecte) {
    const tempsTrigat = Date.now() - tempsIniciParaula;
    
    estatDelJoc.value.estadistiques.push({
      paraula: paraulaActiva.value.text,
      temps: tempsTrigat,
      errors: paraulaActiva.value.errors,
    });

    // Actualitzem estat
    paraulaActiva.value.estat = 'completada';
    estatDelJoc.value.indexParaulaActiva++;
    estatDelJoc.value.textEntrat = '';
    tempsIniciParaula = 0;

    if (estatDelJoc.value.indexParaulaActiva >= estatDelJoc.value.paraules.length) {
      console.log('Joc acabat!', estatDelJoc.value.estadistiques);
    }
  }
}

// --- REPTE 4: Funció Ajudant ---
function getClasseLletra(indexLletra) {
  const textEntrat = estatDelJoc.value.textEntrat;
  
  // Aquest 'if' és crucial. Si textEntrat és més llarg
  // que la paraula (impossible) o la lletra és incorrecta
  if (indexLletra >= textEntrat.length) {
    return 'lletra-pendent';
  }

  // Si la lletra de la paraula correcta NO coincideix
  if (paraulaActiva.value.text[indexLletra] !== textEntrat[indexLletra]) {
    return 'lletra-incorrecta';
  }
  
  // Si la lletra és correcta
  if (textEntrat[indexLletra] === paraulaActiva.value.text[indexLletra]) {
    return 'lletra-correcta';
  }
}

// --- REPTE 6: Teclat Visual ---
const filesDelTeclat = ref([
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]);
const teclaPremuda = ref('');

function handleKeyDown(event) {
  if (event.key.length > 1) return; // Ignorem Shift, Ctrl, etc.
  const tecla = event.key.toUpperCase();
  if (filesDelTeclat.value.flat().includes(tecla)) {
    teclaPremuda.value = tecla;
    setTimeout(() => {
      teclaPremuda.value = '';
    }, 150);
  }
}

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
        v-for="(paraula, index) in estatDelJoc.paraules" 
        :key="paraula.id"
        class="paraula"
        :class="{ 
          'paraula-activa': index === estatDelJoc.indexParaulaActiva,
          'paraula-completada': paraula.estat === 'completada'
        }"
      >
        <span 
          v-for="(lletra, i) in paraula.text.split('')" 
          :key="i"
          class="lletra"
          :class="index === estatDelJoc.indexParaulaActiva ? getClasseLletra(i) : ''"
        >
          {{ lletra }}
        </span>
      </div>
    </div>

    <input 
      type="text" 
      class="text-input"
      v-model="estatDelJoc.textEntrat"
      @input="validarProgres"
      placeholder="Comença a escriure..."
      :disabled="!paraulaActiva"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="none"
      spellcheck="false"
    />

    <div class="teclat-container">
      <div 
        v-for="(fila, i) in filesDelTeclat" 
        :key="i" 
        class="fila-teclat"
      >
        <div 
          v-for="tecla in fila" 
          :key="tecla" 
          class="tecla"
          :class="{ 'tecla-premuda': tecla === teclaPremuda }"
        >
          {{ tecla }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estils específics del GameEngine */
.game-engine {
  font-family: Arial, sans-serif;
  width: 100%;
}

.paraules-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  line-height: 2rem;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
}

.paraula {
  color: #aaa;
}

.paraula-completada {
  color: #d0d0d0;
}

.paraula-activa {
  color: #333; /* Color per defecte de la paraula activa */
}

/* --- Estils REPTE 4 --- */
.lletra {
  transition: all 0.1s;
}

.lletra-correcta {
  color: #4caf50; /* Verd */
}

/* Aquesta és la classe que faltava! */
.lletra-incorrecta {
  color: #fff;
  background-color: #f44336; /* Fons vermell */
  text-decoration: underline;
  border-radius: 2px;
  padding: 0 1px;
}

.text-input {
  width: 100%; /* El padding ja el gestiona el pare (.vista-container) */
}

/* --- Estils REPTE 6 --- */
.teclat-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  user-select: none; /* Evita que es pugui seleccionar el text */
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
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-weight: bold;
  color: #333;
  transition: background-color 0.1s;
}
.tecla-premuda {
  background-color: #00bcd4; /* Color d'il·luminació */
  color: #fff;
}
</style>