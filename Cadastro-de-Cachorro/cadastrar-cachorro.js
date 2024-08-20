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

    const apiUrl = 'https://dog.ceo/api/breeds/list/all';
    const breedSelect = document.getElementById('dogBreed');
    let selectedBreedImageUrl = '';

    function fetchBreeds() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                populateBreedOptions(data.message);
            })
            .catch(error => console.log('Erro ao buscar raças:', error));
    }

    function populateBreedOptions(breeds) {
        breedSelect.innerHTML = '<option selected disabled>Raça:</option>';

        for (const breed in breeds) {
            const option = document.createElement('option');
            option.value = breed;
            option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
            breedSelect.appendChild(option);
        }

        breedSelect.addEventListener('change', (event) => {
            const selectedBreed = event.target.value;
            fetchBreedImage(selectedBreed);
        });
    }

    function fetchBreedImage(breed) {
        const imageUrl = `https://dog.ceo/api/breed/${breed}/images/random`;

        fetch(imageUrl)
            .then(response => response.json())
            .then(data => {
                displayBreedImage(data.message);
                selectedBreedImageUrl = data.message;
            })
            .catch(error => console.error('Erro ao buscar a imagem da raça', error));
    }

    function displayBreedImage(imageUrl) {
        const breedImage = document.getElementById('breedImage');
        breedImage.src = imageUrl;
    }

    function formatarDataNascimento(dataISO) {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', (event) => {
            event.preventDefault();

            const tutorName = document.getElementById('tutorName').value.trim();
            const contactPhone = document.getElementById('contactPhone').value.trim();
            const dogName = document.getElementById('dogName').value.trim();
            const dogBreed = breedSelect.value;
            const dogBirthDate = formatarDataNascimento(document.getElementById('dogBirthDate').value);
            const dogSize = document.getElementById('dogSize').value;
            const dogFur = document.getElementById('dogFur').value;

            if (!tutorName || !contactPhone || !dogName || !dogBreed || !dogBirthDate || !dogSize || !dogFur) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const dogData = {
                tutorName: tutorName,
                contactPhone: contactPhone,
                dogName: dogName,
                dogNickname: document.getElementById('dogNickname').value.trim(),
                dogAllergies: document.getElementById('dogAllergies').value.trim(),
                dogBreed: dogBreed,
                dogBirthDate: dogBirthDate,
                dogSize: dogSize,
                dogFur: dogFur,
                dogObservations: document.getElementById('dogObservations').value.trim(),
                breedImageUrl: selectedBreedImageUrl
            };

            salvarPet(dogData);

            console.log("Cachorro registrado:", dogData);
            alert(`Cachorro ${dogData.dogName} registrado com sucesso!`);

            document.querySelector('form').reset();
            document.getElementById('breedImage').src = '';
        });

        fetchBreeds();
    }
});

function salvarPet(dogData) {
    let pets = JSON.parse(localStorage.getItem('pets')) || [];
    dogData.id = Date.now().toString();
    pets.push(dogData);
    localStorage.setItem('pets', JSON.stringify(pets));
}