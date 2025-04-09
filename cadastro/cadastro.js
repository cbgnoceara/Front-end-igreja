document.getElementById("formCadastro").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const apelido = document.getElementById("apelido").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
  
    try {
      const response = await fetch("https://reserva-salas-backend.onrender.com/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ apelido, email, senha })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "/login/login.html";
      } else {
        alert(data.message || "Erro ao cadastrar.");
      }
  
    } catch (error) {
      alert("Erro de rede. Tente novamente.");
      console.error(error);
    }
  });
  