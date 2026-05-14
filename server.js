const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Permite que seu site acesse a API
app.use(express.json());

// ROTA QUE O SEU SITE VAI CHAMAR
app.post('/api/finalizar', async (req, res) => {
    const { total } = req.body;

    try {
        const response = await axios.post('https://pix.evopay.cash/v1/account/transactions', {
            amount: total,
            callbackUrl: "https://seu-site.com/webhook" // URL para receber confirmação de pago
        }, {
            headers: {
                'API-Key': '89b08ebe-e1fe-484b-863e-564082b82d32',
                'Content-Type': 'application/json'
            }
        });

        // Retorna os dados do Pix (qrCodeText) para o seu HTML
        res.json(response.data);
    } catch (error) {
        console.error('Erro na Evopay:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao gerar transação Pix.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));