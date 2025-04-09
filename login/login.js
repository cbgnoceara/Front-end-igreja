document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;  

  try {
    const response = await fetch("https://reserva-salas-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      // Salvar info de login (pode ser ID, nome, token, etc.)
      localStorage.setItem("usuarioLogado", JSON.stringify(data));
      window.location.href = "../home/telainicial.html"; // redireciona para a tela inicial
    } else {
      alert("Login falhou: " + data.message);
    }
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    alert("Erro ao conectar com o servidor.");
  }
});
