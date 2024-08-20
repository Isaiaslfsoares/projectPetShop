document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.getElementById('wrapper');
    var toggleButton = document.getElementById('menu-toggle');
    var overlay = document.querySelector('.overlay');
    var pageContent = document.getElementById('page-content-wrapper');

    toggleButton.onclick = function () {
        wrapper.classList.toggle('toggled');
        overlay.classList.toggle('active');
        if (wrapper.classList.contains('toggled')) {
            pageContent.style.marginLeft = '0';
        } else {
            pageContent.style.marginLeft = '250px';
        }
    };

    overlay.onclick = function () {
        wrapper.classList.remove('toggled');
        overlay.classList.remove('active');
        pageContent.style.marginLeft = '250px';
    };

    if (window.innerWidth > 768) {
        pageContent.style.marginLeft = '250px';
    }

    const selectCachorro = document.getElementById('selectCachorro');
    const atendimentoForm = document.getElementById('atendimentoForm');
    let atendimentoId = null;

    carregarCachorros();

    const urlParams = new URLSearchParams(window.location.search);
    atendimentoId = urlParams.get('atendimentoId');

    if (atendimentoId !== null) {
        carregarAtendimento(atendimentoId);
    }

    if (atendimentoForm) {
        atendimentoForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const atendimento = {
                cachorroId: document.getElementById('selectCachorro').value,
                horario: formatarDataHora(document.getElementById('horarioAtendimento').value),
                tipoServico: obterServicosSelecionados(),
                funcionario: document.getElementById('funcionarioResponsavel').value,
                concluido: document.getElementById('atendimentoConcluido').checked,
                valor: parseFloat(document.getElementById('valorServico').value)
            };

            try {
                validarAtendimento(atendimento);
                if (atendimentoId !== null) {
                    atualizarAtendimento(atendimentoId, atendimento);
                    alert('Atendimento atualizado com sucesso!');
                } else {
                    salvarAtendimento(atendimento);
                    alert('Atendimento cadastrado com sucesso!');
                }
                window.location.href = '/Listagem de Atendimentos/listagemAtendimento.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }
});

function carregarCachorros() {
    const cachorros = buscarPets();
    const selectCachorro = document.getElementById('selectCachorro');
    cachorros.forEach(cachorro => {
        const option = document.createElement('option');
        option.value = cachorro.id;
        option.textContent = `${cachorro.dogName} (${cachorro.dogBreed})`;
        selectCachorro.appendChild(option);
    });
}

function carregarAtendimento(id) {
    const atendimentos = buscarAtendimentos();
    const atendimento = atendimentos[id];
    if (atendimento) {
        document.getElementById('selectCachorro').value = atendimento.cachorroId;
        document.getElementById('horarioAtendimento').value = formatarDataHoraParaInput(atendimento.horario);
        atendimento.tipoServico.forEach(servico => {
            document.getElementById(`servico${servico}`).checked = true;
        });
        document.getElementById('funcionarioResponsavel').value = atendimento.funcionario;
        document.getElementById('atendimentoConcluido').checked = atendimento.concluido;
        document.getElementById('valorServico').value = atendimento.valor;
    }
}

function formatarDataHoraParaInput(dataHoraFormatada) {
    const [data, hora] = dataHoraFormatada.split(' ');
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}T${hora}`;
}

function obterServicosSelecionados() {
    const servicos = [];
    document.querySelectorAll('input[type="checkbox"][id^="servico"]:checked').forEach(checkbox => {
        servicos.push(checkbox.value);
    });
    return servicos;
}

function formatarDataHora(dataHoraISO) {
    const dataHora = new Date(dataHoraISO);
    if (isNaN(dataHora.getTime())) {
        return 'Data inválida';
    }
    return dataHora.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function validarAtendimento(atendimento) {
    if (!atendimento.cachorroId || !atendimento.horario || atendimento.tipoServico.length === 0) {
        throw new Error("Campos obrigatórios não preenchidos");
    }
    if (isNaN(atendimento.valor) || atendimento.valor < 0) {
        throw new Error("Valor do serviço inválido");
    }
}

function salvarAtendimento(atendimento) {
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    atendimentos.push(atendimento);
    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
}

function atualizarAtendimento(id, atendimentoAtualizado) {
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    atendimentos[id] = atendimentoAtualizado;
    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
}

function buscarAtendimentos() {
    return JSON.parse(localStorage.getItem('atendimentos')) || [];
}

function buscarPets() {
    return JSON.parse(localStorage.getItem('pets')) || [];
}