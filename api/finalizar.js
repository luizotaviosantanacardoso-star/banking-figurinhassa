export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { nome, cpf, email, total } = req.body;

        // Converte R$ 5,80 para 580 centavos (obrigatório em muitas APIs)
        const valorEmCentavos = Math.round(parseFloat(total) * 100);

        const response = await fetch('https://api.evopay.com.br/v1/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EVOPAY_API_KEY}`
            },
            body: JSON.stringify({
                amount: valorEmCentavos,
                customer: {
                    name: nome,
                    tax_id: cpf.replace(/\D/g, ''), // Envia apenas números do CPF
                    email: email
                },
                description: "Figurinhas Copa 2026"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro da Evopay:", data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro interno:", error.message);
        return res.status(500).json({ error: "Erro ao processar requisição" });
    }
}