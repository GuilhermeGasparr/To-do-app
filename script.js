const form = document.getElementById("form-tarefas")
const inputTarefa = document.getElementById("tarefa-user")
const inputPrazo = document.getElementById("prazo-user")
const lista = document.getElementById("lista-tarefas")
const filtro = document.getElementById("filtro-tarefas")
const aviso = document.getElementById("aviso")
const pesquisa = document.getElementById("input-pesquisa")
form.addEventListener("submit", handleSubmit)
function handleSubmit(e) {
  e.preventDefault()
  const tarefa = inputTarefa.value.trim()
  const prazo = inputPrazo.value
  if (tarefa == "") return
  criarTarefa(tarefa, prazo)
  inputTarefa.value = ""
  filtrarTarefas(filtro.value)
}
filtro.addEventListener("change", () => {
  filtrarTarefas(filtro.value)
})
class Tarefa {
  constructor(texto, prazoUser) {
    this.id = Date.now().toString()
    this.texto = texto
    this.concluida = false
    this.prazo = prazoUser
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
    li.setAttribute("data-id", tarefa.id)
    const spanTexto = document.createElement("span")
    spanTexto.textContent = tarefa.texto
    const spanData = document.createElement("span")
    spanData.textContent = tarefa.prazo
    li.appendChild(spanTexto)
    li.appendChild(spanData)
    li.classList.add("item-novo")
    const botaoRemover = criarBotaoRemover(li, tarefa.id)
    const botaoEditar = criarBotaoEditar(tarefa.id)
    const checkbox = criarCheckBox(li, tarefa)
    const acoes = document.createElement("div")
    acoes.classList.add("acoes")
    acoes.appendChild(botaoEditar)
    acoes.appendChild(botaoRemover)
    acoes.appendChild(checkbox)
    li.appendChild(acoes)
    lista.appendChild(li)
    requestAnimationFrame(() => {
      li.classList.remove("item-novo")
    })
  })
  filtrarTarefas(filtro.value)
  atualizarContador()
}
function criarTarefa(tarefa, prazo) {
  if (verificarTarefaIgual(tarefa)) {
    mostrarAviso()
    return
  }
  aviso.textContent = ""
  aviso.classList.remove("encolhendo")
  const novaTarefa = new Tarefa(tarefa, prazo)
  tarefas.push(novaTarefa)
  salvarNoLocalStorage()
  renderizarTarefas()
}
function atualizarContador() {
  const totalTarefas = document.querySelectorAll("#lista-tarefas li").length
  const labelContador = document.getElementById("contador")
  labelContador.textContent = `Tarefas: ${totalTarefas}`
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
function criarBotaoEditar(id) {
  const botaoEditar = criarBotao("Editar")
  botaoEditar.onclick = () => {
    const tarefa = tarefas.find((t) => t.id == id)
    if (!tarefa) return
    const li = document.querySelector(`[data-id = '${id}']`)
    if (!li) return
    li.innerHTML = ""
    const inputEdicaoTexto = document.createElement("input")
    const inputEdicaoData = document.createElement("input")
    inputEdicaoTexto.type = "text"
    inputEdicaoData.type = "date"
    inputEdicaoTexto.value = tarefa.texto
    inputEdicaoData.value = tarefa.prazo
    inputEdicaoTexto.classList.add("input-edicao-texto")
    inputEdicaoData.classList.add("input-edicao-data")
    const botaoSalvar = criarBotao("Salvar")
    const botaoCancelar = criarBotao("Cancelar")
    botaoSalvar.onclick = () => {
      const novoTexto = inputEdicaoTexto.value.trim()
      const novaData = inputEdicaoData.value
      if (novoTexto == "") {
        alert("Você não pode adicionar uma tarefa vazia")
      }
      if (tarefas.some((t) => t.texto === novoTexto && t.id !== id)) {
        alert("Já existe uma tarefa com esse nome.")
        return
      }
      tarefa.texto = novoTexto
      tarefa.prazo = novaData
      salvarNoLocalStorage()
      renderizarTarefas()
    }
    botaoCancelar.onclick = () => {
      renderizarTarefas()
    }

    li.appendChild(inputEdicaoTexto)
    li.appendChild(inputEdicaoData)
    li.appendChild(botaoSalvar)
    li.appendChild(botaoCancelar)
  }

  return botaoEditar
}
const modal = document.getElementById("modal-confirmacao")
const botaoConfirmar = document.getElementById("confirmar-button")
const botaoCancelar = document.getElementById("cancelar-button")
let acaoConfirmada = null
function mostrarModal(acao) {
  acaoConfirmada = acao
  modal.style.display = "flex"
  botaoConfirmar.onclick = () => {
    modal.style.display = "none"
    if (acaoConfirmada) acaoConfirmada()
  }
  botaoCancelar.onclick = () => {
    modal.style.display = "none"
    acaoConfirmada = null
  }
}
function criarBotaoRemover(li, id) {
  const botaoRemover = criarBotao("Remover")
  botaoRemover.onclick = () => {
    mostrarModal(() => {
      li.classList.add("item-removido")
      setTimeout(() => {
        tarefas = tarefas.filter((t) => t.id !== id)
        salvarNoLocalStorage()
        renderizarTarefas()
      }, 300)
    })
  }
  return botaoRemover
}
function criarCheckBox(li, tarefa) {
  const label = document.createElement("label")
  label.classList.add("checkbox-wrapper")
  const checkBox = document.createElement("input")
  checkBox.type = "checkbox"
  checkBox.checked = tarefa.concluida
  checkBox.classList.add("custom-checkbox")
  checkBox.addEventListener("change", () => {
    tarefa.concluida = checkBox.checked
    salvarNoLocalStorage()
    filtrarTarefas(filtro.value)
  })
  const visualFake = document.createElement("span")
  visualFake.classList.add("checkbox-fake")
  label.appendChild(checkBox)
  label.appendChild(visualFake)
  return label
}
function filtrarTarefas(filtroSelecionado) {
  const itens = lista.querySelectorAll("li")
  itens.forEach((li) => {
    const checkBox = li.querySelector("input[type=checkbox]")
    switch (filtroSelecionado) {
      case "pendentes":
        if (checkBox.checked) {
          li.classList.add("item-removido-filtro")
        } else {
          li.classList.remove("item-removido-filtro")
        }
        break
      case "concluidas":
        if (checkBox.checked) {
          li.classList.remove("item-removido-filtro")
        } else {
          li.classList.add("item-removido-filtro")
        }
        break
      default:
        li.classList.remove("item-removido-filtro")
    }
  })
}

//Chamamento de pesquisa aqui! Apresentar se necessario
pesquisa.addEventListener("input", () => {
  const termo = pesquisa.value.trim().toLowerCase()
  pesquisarTarefas(termo)
})
function pesquisarTarefas(termo) {
  const itens = Array.from(lista.querySelectorAll("li"))
  if (termo === "") {
    itens.forEach((li) => li.classList.remove("item-removido-pesquisa"))
    renderizarTarefas()
    return
  }
  const combinam = []
  const naoCombinam = []
  itens.forEach((li) => {
    const texto = li.querySelector("span").textContent.toLowerCase()
    if (texto.includes(termo.toLowerCase())) {
      li.classList.remove("item-removido-pesquisa")
      combinam.push(li)
    } else {
      li.classList.add("item-removido-pesquisa")
      naoCombinam.push(li)
    }
  })
  combinam.forEach((li) => lista.appendChild(li))
  naoCombinam.forEach((li) => lista.appendChild(li))
  filtrarTarefas(filtro.value)
}
