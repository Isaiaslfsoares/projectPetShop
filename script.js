document.addEventListener('DOMContentLoaded', function () {
    const cachorroSelect = document.getElementById('cachorro');
    const cachorroImage = document.getElementById('cachorroImage');
    const serviceForm = document.getElementById('serviceForm');

    axios.get('https://dog.ceo/api/breeds/list/all')
        .then(response => {
            const breeds = Object.keys(response.data.message);
            cachorroSelect.innerHTML = '<option value="" disabled selected>Selecione um cachorro</option>';
            breeds.forEach(breed => {
                cachorroSelect.innerHTML += `<option value="${breed}">${breed}</option>`;
            });

            const savedBreed = localStorage.getItem('selectedBreed');
            if (savedBreed) {
                cachorroSelect.value = savedBreed;
                showCachorroImage(savedBreed);
            }
        });

    function showCachorroImage(breed) {
        axios.get(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => cachorroImage.src = response.data.message);
    }

    cachorroSelect.addEventListener('change', function () {
        const selectedBreed = this.value;
        if (selectedBreed) {
            showCachorroImage(selectedBreed);
            localStorage.setItem('selectedBreed', selectedBreed);
        }
    });

    serviceForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || []
        const tipoServico = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.id);
        const atendimentoData = {
            cachorro: cachorroSelect.value,
            servicos: tipoServico,
            funcionario: document.getElementById('funcionario').value,
            concluido: document.getElementById('concluido').checked,
            valor: document.getElementById('valor').value
        };
        atendimentos.push(atendimentoData)
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        alert('Dados salvos no localStorage');
    });
});
