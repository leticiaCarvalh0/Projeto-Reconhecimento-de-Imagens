const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultDiv = document.getElementById('result');
const resultContent = document.getElementById('resultContent');

// Caminho do modelo
const URL = "./my_model/";
let model, maxPredictions;

// Inicialização do modelo
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Cérebro da IA carregado com sucesso!");
    } catch (e) {
        console.error("Erro ao carregar modelo. Verifique a pasta my_model", e);
    }
}

// Preview da imagem
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            analyzeBtn.style.display = 'block';
            resultDiv.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Função de análise (precisa ser global por causa do onclick)
window.analyzeImage = async function () {
    if (!model) {
        alert("Aguarde o carregamento do modelo...");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = "⌛ Analisando padrões...";

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        const prediction = await model.predict(imagePreview);

        console.log("===== RESULTADO DA IA =====");

let bestPrediction = null;

prediction.forEach(p => {
    const percentage = (p.probability * 100).toFixed(2);

    console.log(`Classe: ${p.className}`);
    console.log(`Confiança: ${percentage}%`);
    console.log("----------------------");

    // pegar a melhor classe
    if (!bestPrediction || p.probability > bestPrediction.probability) {
        bestPrediction = p;
    }
});

console.log("🏆 Classe mais provável:");
console.log(`${bestPrediction.className} (${(bestPrediction.probability * 100).toFixed(2)}%)`);

        resultDiv.style.display = 'block';
        resultContent.innerHTML = "";

        prediction.forEach(p => {
            const percentage = (p.probability * 100).toFixed(2);
            resultContent.innerHTML += `
                <div style="margin-bottom: 15px;">
                    <div style="display:flex; justify-content: space-between;">
                        <span>${p.className}</span>
                        <strong>${percentage}%</strong>
                    </div>
                    <div style="background: #eee; height: 10px; border-radius: 5px;">
                        <div style="background: #6366f1; width: ${percentage}%; height: 100%; border-radius: 5px; transition: width 0.8s;"></div>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Erro na predição:", err);
        alert("Erro ao analisar a imagem.");
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "Analisar Imagem";
    }
};

window.addEventListener("load", init);
