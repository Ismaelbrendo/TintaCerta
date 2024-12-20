document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById('uploadForm');
  
    uploadForm.addEventListener('submit', sendFile);
  });
  
  function sendFile(event) {
    event.preventDefault();
    const fileUpload = document.getElementById("fileUpload");
    const resultArea = document.getElementById("resultArea");
  
    if (fileUpload.files.length === 0) {
      alert("Por favor, selecione um arquivo antes de enviar.");
      return;
    }
  
    const selectedFile = fileUpload.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    fetch('http://localhost:5500/analyze', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        resultArea.innerHTML = `
          <strong>Quantidade de tinta usada:</strong><br>
          Ciano: ${data.C} ml<br>
          Magenta: ${data.M} ml<br>
          Amarelo: ${data.Y} ml<br>
          Preto: ${data.K} ml
        `;
      })
      .catch(error => {
        console.error("Erro ao enviar o arquivo:", error);
        resultArea.textContent = "Erro ao enviar o arquivo.";
      });
  }
  