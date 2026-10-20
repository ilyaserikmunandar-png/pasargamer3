// CATATAN: Ganti URL localhost dengan URL Render Anda nanti
const API = 'http://localhost:3000'; 
const app = document.getElementById('app');
let token = localStorage.getItem('token');

async function render() {
  app.innerHTML = `<h1 class="text-2xl font-bold text-center p-5">Pasar Gamer</h1>`;
}
render();
