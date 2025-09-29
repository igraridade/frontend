// Ajuste a URL da sua API aqui:
const apiUrl = "https://localhost:7196/Api/Aluno";

// Elementos
const modal = document.getElementById("editModal");
const spanClose = document.querySelector(".close");
const loading = document.getElementById("loading");
const toast = document.getElementById("toast");

// Função para mostrar toast com mensagem customizada
function showToast(message, bgColor = '#00bfa6') {
  toast.textContent = message;
  toast.style.backgroundColor = bgColor;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Listar alunos com loading e tratamento de erro
async function carregarAlunos() {
  const tbody = document.querySelector("#alunoTable tbody");
  loading.style.display = "block";
  tbody.innerHTML = "";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Erro na requisição");
    const alunos = await response.json();

    if (alunos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum aluno encontrado</td></tr>`;
    } else {
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
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: red;">Erro ao carregar alunos</td></tr>`;
    console.error(error);
  }

  loading.style.display = "none";
}

// Cadastrar aluno
document.getElementById("alunoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !email || !telefone) {
    showToast("Por favor, preencha todos os campos!", "#f44336");
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone })
    });
    if (!res.ok) throw new Error("Erro ao cadastrar aluno");

    e.target.reset();
    showToast("Aluno cadastrado com sucesso!");
    carregarAlunos();
  } catch {
    showToast("Erro ao cadastrar aluno", "#f44336");
  }
});

// Excluir aluno com confirmação
async function deletarAluno(id) {
  if (!confirm("Deseja realmente excluir este aluno?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir aluno");

    showToast("Aluno excluído com sucesso!", "#e53935");
    carregarAlunos();
  } catch {
    showToast("Erro ao excluir aluno", "#f44336");
  }
}

// Abrir modal edição e focar no campo nome
function abrirModal(id, nome, email, telefone) {
  modal.style.display = "flex";
  document.getElementById("editId").value = id;
  document.getElementById("editNome").value = nome;
  document.getElementById("editEmail").value = email;
  document.getElementById("editTelefone").value = telefone;

  setTimeout(() => document.getElementById("editNome").focus(), 100);
}

// Fechar modal ao clicar no X ou fora do conteúdo
spanClose.onclick = () => {
  modal.style.display = "none";
  document.getElementById("editForm").reset();
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    document.getElementById("editForm").reset();
  }
};

// Editar aluno
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const nome = document.getElementById("editNome").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const telefone = document.getElementById("editTelefone").value.trim();

  if (!nome || !email || !telefone) {
    showToast("Por favor, preencha todos os campos!", "#f44336");
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nome, email, telefone })
    });

    if (!res.ok) throw new Error("Erro ao atualizar aluno");

    modal.style.display = "none";
    document.getElementById("editForm").reset();
    showToast("Aluno atualizado com sucesso!");
    carregarAlunos();
  } catch {
    showToast("Erro ao atualizar aluno", "#f44336");
  }
});

// Inicializar lista
carregarAlunos();
