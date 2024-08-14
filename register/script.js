document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://dog.ceo/api/breeds/list/all';

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
        const breedSelect = document.getElementById('dogBreed');
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

    
    document.getElementById('registerButton').addEventListener('click', () => {
        const dogData = {
            tutorName: document.getElementById('tutorName').value,
            contactPhone: document.getElementById('contactPhone').value,
            dogName: document.getElementById('dogName').value,
            dogNickname: document.getElementById('dogNickname').value,
            dogAllergies: document.getElementById('dogAllergies').value,
            dogBreed: document.getElementById('dogBreed').value,
            dogBirthDate: document.getElementById('dogBirthDate').value,
            dogSize: document.getElementById('dogSize').value,
            dogFur: document.getElementById('dogFur').value,
            dogObservations: document.getElementById('dogObservations').value,
            breedImageUrl: selectedBreedImageUrl
        };

        
        let storedDogs = JSON.parse(localStorage.getItem('dogs')) || [];
        storedDogs.push(dogData);
        localStorage.setItem('dogs', JSON.stringify(storedDogs));

        console.log("Cachorro registrado:", dogData);
        alert(`Cachorro ${dogData.dogName} registrado com sucesso!`);
    });

    fetchBreeds();
});
