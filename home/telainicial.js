let sala = "";

function selecionarSala(nome) {
  sala = nome;
  document.getElementById("salaSelecionada").textContent = nome;
  document.getElementById("formReserva").style.display = "block";
}

async function fazerReserva() {
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;
  const horarioInicio = document.getElementById("horarioInicio").value;
  const horarioFim = document.getElementById("horarioFim").value;
  const finalidade = document.getElementById("finalidade").value;
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!dataInicio || !dataFim || !horarioInicio || !horarioFim || !finalidade) {
    return alert("Preencha todos os campos!");
  }

  try {
    const response = await fetch("https://reserva-salas-backend.onrender.com/reservar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sala,
        dataInicio,
        dataFim,
        horarioInicio,
        horarioFim,
        finalidade,
        usuarioId: usuario._id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Reserva realizada com sucesso!");
      document.getElementById("formReserva").style.display = "none";
      fetchReservas();
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
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";

    reservas.forEach((reserva) => {
      const item = document.createElement("li");
      item.classList.add("reserva-item");

      // Corrigindo fuso horário com toLocaleString
      const dataHoraInicioFormatada = new Date(`${reserva.dataInicio}T${reserva.horarioInicio}`).toLocaleString("pt-BR", {
        timeZone: "America/Fortaleza",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const dataHoraFimFormatada = new Date(`${reserva.dataFim}T${reserva.horarioFim}`).toLocaleString("pt-BR", {
        timeZone: "America/Fortaleza",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const apelido = reserva.usuarioId?.apelido || "Desconhecido";

      item.innerHTML = `
        <strong>${reserva.sala}</strong><br>
        <span>🗓️ ${dataHoraInicioFormatada} até ${dataHoraFimFormatada}</span><br>
        <span>🎯 ${reserva.finalidade}</span><br>
        <span>👤 ${apelido}</span>
      `;

      if (reserva.usuarioId?._id === usuario._id) {
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("btn-excluir");
        botaoExcluir.onclick = () => excluirReserva(reserva._id);
        item.appendChild(botaoExcluir);
      }

      lista.appendChild(item);
    });
  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
  }
}

async function excluirReserva(idReserva) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!confirm("Tem certeza que deseja excluir esta reserva?")) return;

  try {
    const response = await fetch(`https://reserva-salas-backend.onrender.com/reservas/${idReserva}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: usuario._id }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Reserva excluída com sucesso!");
      fetchReservas();
    } else {
      alert("Erro ao excluir: " + data.message);
    }
  } catch (err) {
    console.error("Erro ao excluir reserva:", err);
    alert("Erro ao conectar com o servidor.");
  }
}

window.onload = () => {
  fetchReservas();
};
