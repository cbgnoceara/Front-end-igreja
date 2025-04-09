let sala = "";

function selecionarSala(nome) {
  sala = nome;
  document.getElementById("salaSelecionada").textContent = nome;
  document.getElementById("formReserva").style.display = "block";
}

async function fazerReserva() {
  const dataSelecionada = document.getElementById("data").value;
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!dataSelecionada) {
    return alert("Selecione uma data!");
  }

  try {
    const response = await fetch("https://reserva-salas-backend.onrender.com/reservar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sala,
        data: dataSelecionada,
        usuarioId: usuario._id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Reserva realizada com sucesso!");
      document.getElementById("formReserva").style.display = "none";
      fetchReservas(); // Atualiza a lista
    } else {
      alert("Erro ao reservar: " + data.message);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao conectar com o servidor.");
  }
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "../login/login.html";
}

async function fetchReservas() {
  try {
    const response = await fetch("https://reserva-salas-backend.onrender.com/reservas");
    const reservas = await response.json();

    const lista = document.getElementById("listaReservas");
    lista.innerHTML = ""; // limpa a lista

    reservas.forEach((reserva) => {
      const item = document.createElement("li");
      item.textContent = `Sala: ${reserva.sala} | Data: ${reserva.data} | Por: ${reserva.usuarioId.apelido}`;
      lista.appendChild(item);
    });
  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
  }
}

// Chama quando a página carregar
window.onload = () => {
  fetchReservas();
};
