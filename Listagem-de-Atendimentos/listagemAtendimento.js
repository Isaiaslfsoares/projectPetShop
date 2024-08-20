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

    const atendimentos = buscarAtendimentos();
    const pets = buscarPets();
    showInHtml(atendimentos, pets);

    document.getElementById('mostrarAtendimentos').addEventListener('click', () => {
        showInHtml(atendimentos, pets);
    });
});

function showInHtml(atendimentos, pets) {
    const container = document.getElementById('atendimentosContainer');
    container.innerHTML = '';

    if (atendimentos.length === 0) {
        container.innerHTML = '<p class="col-12 text-center">Nenhum atendimento encontrado.</p>';
        return;
    }

    atendimentos.forEach((atendimento, index) => {
        const { cachorroId, tipoServico, funcionario, horario, concluido } = atendimento;
        const pet = pets.find(p => p.id === cachorroId) || {};
        const { dogName, dogBreed, breedImageUrl } = pet;

        let serviceType = Array.isArray(tipoServico) ? tipoServico.join(' | ') : tipoServico;

        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${breedImageUrl || '/imagens/default.jpg'}" class="card-img-top" alt="${dogBreed || 'N/A'}" style="height: 200px; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title">${dogName || 'N/A'}</h5>
                    <p class="card-text">
                        <strong>ID:</strong> ${cachorroId}<br>
                        <strong>Raça:</strong> ${dogBreed || 'N/A'}<br>
                        <strong>Data e Hora:</strong> ${horario}<br>
                        <strong>Serviços:</strong> ${serviceType}<br>
                        <strong>Funcionário:</strong> ${funcionario || 'N/A'}<br>
                        <strong>Progresso:</strong> ${concluido ? 'Concluído' : 'Em andamento'}
                    </p>
                </div>
                <div class="card-footer">
                    <a href="/Cadastro de Atendimento/cadastro-atendimento.html?atendimentoId=${index}" class="btn btn-primary">Editar</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function buscarAtendimentos() {
    return JSON.parse(localStorage.getItem('atendimentos')) || [];
}

function buscarPets() {
    return JSON.parse(localStorage.getItem('pets')) || [];
}