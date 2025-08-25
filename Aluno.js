//const apiUrl = "https://localhost:7020/Api/Aluno"; // ajuste a porta conforme sua API

const apiUrl = "https://localhost:7196/Api/Aluno";


//"https://localhost:7196;http://localhost:5104"


// ---------- LISTAR ----------
async function carregarAlunos() {
  const response = await fetch(apiUrl);
  const alunos = await response.json();

  const tbody = document.querySelector("#alunoTable tbody");
  tbody.innerHTML = "";

  alunos.forEach(aluno => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${aluno.telefone}</td>
      <td>
        <button class="edit-btn" onclick="abrirModal('${aluno.id}', '${aluno.nome}', '${aluno.email}', '${aluno.telefone}')">Editar</button>
        <button class="delete-btn" onclick="deletarAluno('${aluno.id}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- CADASTRAR ----------
document.getElementById("alunoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, telefone })
  });

  e.target.reset();
  carregarAlunos();
});

// ---------- DELETAR ----------
async function deletarAluno(id) {
  if (!confirm("Deseja realmente excluir este aluno?")) return;

  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  carregarAlunos();
}

// ---------- EDITAR ----------
const modal = document.getElementById("editModal");
const span = document.querySelector(".close");

function abrirModal(id, nome, email, telefone) {
  modal.style.display = "block";
  document.getElementById("editId").value = id;
  document.getElementById("editNome").value = nome;
  document.getElementById("editEmail").value = email;
  document.getElementById("editTelefone").value = telefone;
}

span.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const nome = document.getElementById("editNome").value;
  const email = document.getElementById("editEmail").value;
  const telefone = document.getElementById("editTelefone").value;

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nome, email, telefone })
  });

  modal.style.display = "none";
  carregarAlunos();
});

// ---------- Inicializar ----------
carregarAlunos();

