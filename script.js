const diseases = [
    {
        name: "Soybean Aphid",
        description: "Small, pear-shaped insects that feed on soybean plants. They can cause stunted growth, reduced yield, and transmit viral diseases.",
        treatment: "Use of insecticides, biological control with natural predators, and planting resistant soybean varieties."
    },
    {
        name: "Japanese Beetle",
        description: "Metallic green beetles that feed on soybean leaves, causing skeletonized foliage. Severe infestations can lead to significant defoliation.",
        treatment: "Application of insecticides, use of pheromone traps, and cultural practices like crop rotation."
    }
];

let uploadHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resultImage = document.getElementById('resultImage');
    const detections = document.getElementById('detections');
    const diseaseInfo = document.getElementById('diseaseInfo');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleFileDrop);
    clearHistoryBtn.addEventListener('click', clearHistory);

    loadHistory();
    updateHistoryList();

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) processImage(file);
    }

    function handleFileDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    }

    function processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target.result;
            displayImageAndDetection(imageSrc);
        };
        reader.readAsDataURL(file);
    }

    function displayImageAndDetection(src, savedDetection = null) {
        resultImage.innerHTML = `<img src="${src}" alt="Uploaded image" class="fade-in">`;
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

        if (savedDetection) {
            displaySavedDetection(savedDetection);
        } else {
            simulateDetection(src);
        }
    }

    function simulateDetection(imageSrc) {
        setTimeout(() => {
            const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
            const detection = {
                name: detectedDisease.name,
                description: detectedDisease.description,
                treatment: detectedDisease.treatment
            };
            displayDetection(detection);
            addToHistory(imageSrc, detection);
        }, 1000);
    }

    function displayDetection(detection) {
        detections.innerHTML = `<h3 class="slide-in">Detected: ${detection.name}</h3>`;
        diseaseInfo.innerHTML = `
            <div class="slide-in">
                <h4>Description:</h4>
                <p>${detection.description}</p>
                <h4>Treatment:</h4>
                <p>${detection.treatment}</p>
            </div>
        `;
    }

    function displaySavedDetection(detection) {
        displayDetection(detection);
    }

    function addToHistory(imageSrc, detection) {
        const timestamp = new Date().toLocaleString();
        uploadHistory.unshift({ src: imageSrc, date: timestamp, detection: detection });
        if (uploadHistory.length > 10) uploadHistory.pop();
        saveHistory();
        updateHistoryList();
    }
    

    function updateHistoryList() {
        historyList.innerHTML = '';
        uploadHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.detection.name} - ${item.date}</span>
                <div>
                    <button class="btn-secondary view-btn">View</button>
                    <button class="btn-secondary delete-btn">Delete</button>
                </div>
            `;
            li.querySelector('.view-btn').addEventListener('click', () => displayImageAndDetection(item.src, item.detection));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteHistoryItem(index));
            historyList.appendChild(li);
        });
    }
    

    function deleteHistoryItem(index) {
        uploadHistory.splice(index, 1);
        saveHistory();
        updateHistoryList();
    }

    function clearHistory() {
        uploadHistory = [];
        saveHistory();
        updateHistoryList();
    }

    function saveHistory() {
        localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));
    }

    function loadHistory() {
        const storedHistory = localStorage.getItem('uploadHistory');
        if (storedHistory) {
            uploadHistory = JSON.parse(storedHistory);
        }
    }
});

document.getElementById('menuToggle').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.remove('active');
    });
});


window.addEventListener('scroll', function() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (window.scrollY > 300) { // Show button when scrolled 300px down
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});


document.getElementById('scrollToTop').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});




