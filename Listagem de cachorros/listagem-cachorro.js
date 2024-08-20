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

    carregarCachorros();
    setupEventListeners();
});

function carregarCachorros() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');

    const cachorros = JSON.parse(localStorage.getItem('pets')) || [];
    const container = document.getElementById('cachorro-list');
    container.innerHTML = '';

    cachorros.forEach((cachorro, index) => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${cachorro.breedImageUrl || '/imagens/default-dog.jpg'}" class="card-img-top" alt="${cachorro.dogBreed}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${cachorro.dogName}</h5>
                    <p class="card-text">
                        <strong>Tutor:</strong> ${cachorro.tutorName}<br>
                        <strong>Raça:</strong> ${cachorro.dogBreed}<br>
                        <strong>Nascimento:</strong> ${cachorro.dogBirthDate}<br>
                        <strong>Porte:</strong> ${cachorro.dogSize}
                    </p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${index}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${index}">Excluir</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    if (editId !== null) {
        abrirModalEdicao(editId);
    }
}

function setupEventListeners() {
    document.getElementById('cachorro-list').addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.getAttribute('data-id');
            abrirModalEdicao(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            excluirCachorro(id);
        }
    });

    document.getElementById('edit-form').addEventListener('submit', function (e) {
        e.preventDefault();
        salvarEdicao();
    });
}

function abrirModalEdicao(id) {
    const cachorros = JSON.parse(localStorage.getItem('pets')) || [];
    const cachorro = cachorros[id];

    document.getElementById('edit-id').value = id;
    document.getElementById('edit-dog-name').value = cachorro.dogName;
    document.getElementById('edit-tutor-name').value = cachorro.tutorName;
    document.getElementById('edit-contact-phone').value = cachorro.contactPhone;
    document.getElementById('edit-breed').value = cachorro.dogBreed;
    document.getElementById('edit-birth-date').value = formatDateForInput(cachorro.dogBirthDate);
    document.getElementById('edit-size').value = cachorro.dogSize;
    document.getElementById('edit-fur').value = cachorro.dogFur;
    document.getElementById('edit-allergies').value = cachorro.dogAllergies;
    document.getElementById('edit-observations').value = cachorro.dogObservations;

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

function formatDateForInput(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function salvarEdicao() {
    const id = document.getElementById('edit-id').value;
    const cachorros = JSON.parse(localStorage.getItem('pets')) || [];

    cachorros[id] = {
        ...cachorros[id],
        dogName: document.getElementById('edit-dog-name').value,
        tutorName: document.getElementById('edit-tutor-name').value,
        contactPhone: document.getElementById('edit-contact-phone').value,
        dogBreed: document.getElementById('edit-breed').value,
        dogBirthDate: formatDateForDisplay(document.getElementById('edit-birth-date').value),
        dogSize: document.getElementById('edit-size').value,
        dogFur: document.getElementById('edit-fur').value,
        dogAllergies: document.getElementById('edit-allergies').value,
        dogObservations: document.getElementById('edit-observations').value
    };

    localStorage.setItem('pets', JSON.stringify(cachorros));
    carregarCachorros();

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
}

function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function excluirCachorro(id) {
    if (confirm('Tem certeza que deseja excluir este cachorro?')) {
        const cachorros = JSON.parse(localStorage.getItem('pets')) || [];
        cachorros.splice(id, 1);
        localStorage.setItem('pets', JSON.stringify(cachorros));
        carregarCachorros();
    }
}
