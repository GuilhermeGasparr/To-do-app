const form = document.getElementById("form-tarefas")
const input = document.getElementById("tarefa-user")
const lista = document.getElementById("lista-tarefas")
const filtro = document.getElementById("filtro-tarefas")
form.addEventListener("submit", handleSubmit)
function handleSubmit(e) {
  e.preventDefault()
  const tarefa = input.value.trim()
  if (tarefa == "") return
  criarTarefa(tarefa)
  input.value = ""
  filtrarTarefas(filtro.value)
}
filtro.addEventListener("change", () => {
  filtrarTarefas(filtro.value)
})
function criarTarefa(tarefa) {
  const li = document.createElement("li")
  li.textContent = tarefa
  const botao = criarBotaoRemover(li)
  const checkbox = criarCheckBox(li)
  li.appendChild(botao)
  li.appendChild(checkbox)
  lista.appendChild(li)
}
function criarBotao(tipoBotao) {
  const botao = document.createElement("button")
  botao.textContent = tipoBotao
  return botao
}
function criarBotaoRemover(li) {
  const botaoRemover = criarBotao("Remover")
  botaoRemover.onclick = () => {
    li.remove()
    filtrarTarefas(filtro.value)
  }
  return botaoRemover
}
function criarCheckBox(li) {
  const checkBox = document.createElement("input")
  checkBox.type = "checkbox"
  checkBox.addEventListener("change", () => {
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
