const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const app = express();

// Configuração do multer para o upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Função para calcular a quantidade de tinta utilizada na imagem
async function calculateInkUsage(imagePath) {
  const image = sharp(imagePath);
  
  // Obtém as metadatas da imagem (por exemplo, largura e altura)
  const metadata = await image.metadata();
  
  const width = metadata.width;
  const height = metadata.height;
  
  // Processa a imagem e converte para o formato de pixels brutos
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  let cmykUsage = { C: 0, M: 0, Y: 0, K: 0 };

  // Itera sobre os dados para contar a quantidade de tinta utilizada
  for (let i = 0; i < data.length; i += 4) {
    let C = data[i];   // Canal Ciano
    let M = data[i + 1]; // Canal Magenta
    let Y = data[i + 2]; // Canal Amarelo
    let K = data[i + 3]; // Canal Preto

    cmykUsage.C += C;
    cmykUsage.M += M;
    cmykUsage.Y += Y;
    cmykUsage.K += K;
  }

  // O valor de tinta é uma relação com a quantidade de pixels e o valor de tinta consumida por pixel
  const inkPerUnit = 0.1; // Defina o valor de tinta por unidade de CMYK (exemplo: 0.1 ml por unidade)

  // Converte a quantidade total de tinta em mililitros
  cmykUsage.C *= inkPerUnit;
  cmykUsage.M *= inkPerUnit;
  cmykUsage.Y *= inkPerUnit;
  cmykUsage.K *= inkPerUnit;

  // Retorna a quantidade de tinta usada em cada cor
  return cmykUsage;
}

// Função de processamento da imagem (continua sendo usada como antes)
async function processImageForInk(imagePath) {
  const inkUsage = await calculateInkUsage(imagePath);
  return inkUsage;
}

// Rota para o upload e análise da imagem
app.post('/analyze', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  try {
    const inkUsage = await processImageForInk(req.file.path);
    console.log('Uso de tinta calculado:', inkUsage);
    res.json(inkUsage);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar a imagem' });
  }
});

// Inicializa o servidor
app.listen(5500, () => {
  console.log('Servidor rodando na porta 5500');
});