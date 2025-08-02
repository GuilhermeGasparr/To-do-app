const form = document.getElementById("form-tarefas")
const input = document.getElementById("tarefa-user")
const lista = document.getElementById("lista-tarefas")
const filtro = document.getElementById("filtro-tarefas")
const aviso = document.getElementById("aviso")
form.addEventListener("submit", handleSubmit)
function handleSubmit(e) {
  e.preventDefault()
  const tarefa = input.value.trim()
  if (tarefa == "") return
  const tarefaSalva = criarTarefa(tarefa)
  input.value = ""
  filtrarTarefas(filtro.value)
}
filtro.addEventListener("change", () => {
  filtrarTarefas(filtro.value)
})
class Tarefa {
  constructor(texto) {
    this.id = Date.now().toString()
    this.texto = texto
    this.concluida = false
  }
}
let tarefas = []
function salvarNoLocalStorage() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas))
}
function carregarDoLocalStorage() {
  const dados = JSON.parse(localStorage.getItem("tarefas")) || []
  tarefas = dados.map((t) => Object.assign(new Tarefa(), t))
  renderizarTarefas()
}
document.addEventListener("DOMContentLoaded", () => {
  carregarDoLocalStorage()
})
function renderizarTarefas() {
  lista.innerHTML = ""
  tarefas.forEach((tarefa) => {
    const li = document.createElement("li")
    li.textContent = tarefa.texto
    li.classList.add("item-novo")

    const botao = criarBotaoRemover(li, tarefa.id)
    const checkbox = criarCheckBox(li, tarefa)

    li.appendChild(botao)
    li.appendChild(checkbox)
    lista.appendChild(li)

    requestAnimationFrame(() => {
      li.classList.remove("item-novo")
    })
  })
  filtrarTarefas(filtro.value)
}
function criarTarefa(tarefa) {
  if (verificarTarefaIgual(tarefa)) {
    mostrarAviso()
    return
  }
  aviso.textContent = ""
  aviso.classList.remove("encolhendo")
  const novaTarefa = new Tarefa(tarefa)
  tarefas.push(novaTarefa)
  salvarNoLocalStorage()
  renderizarTarefas()
}
function mostrarAviso() {
  aviso.textContent = "Não é possível adicionar tarefas iguais"
  aviso.classList.add("mostrar")

  setTimeout(() => {
    aviso.classList.remove("mostrar")
  }, 2500)
}
function verificarTarefaIgual(tarefa) {
  return tarefas.some((t) => t.texto == tarefa)
}
function criarBotao(tipoBotao) {
  const botao = document.createElement("button")
  botao.textContent = tipoBotao
  return botao
}
function criarBotaoRemover(li, id) {
  const botaoRemover = criarBotao("Remover")
  botaoRemover.onclick = () => {
    li.classList.add("item-removido")
    setTimeout(() => {
      tarefas = tarefas.filter((t) => t.id !== id)
      salvarNoLocalStorage()
      renderizarTarefas()
    }, 300)
  }
  return botaoRemover
}
function criarCheckBox(li, tarefa) {
  const checkBox = document.createElement("input")
  checkBox.type = "checkbox"
  checkBox.checked = tarefa.concluida
  checkBox.addEventListener("change", () => {
    tarefa.concluida = checkBox.checked
    salvarNoLocalStorage()
    filtrarTarefas(filtro.value)
  })
  return checkBox
}
function filtrarTarefas(filtroSelecionado) {
  const itens = lista.querySelectorAll("li")
  itens.forEach((li) => {
    const checkBox = li.querySelector("input[type=checkbox]")
    switch (filtroSelecionado) {
      case "pendentes":
        li.style.display = checkBox.checked ? "none" : ""
        break
      case "concluidas":
        li.style.display = checkBox.checked ? "" : "none"
        break
      default:
        li.style.display = ""
    }
  })
}
