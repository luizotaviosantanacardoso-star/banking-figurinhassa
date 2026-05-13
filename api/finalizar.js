// api/finalizar.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, cpf, email, total } = req.body;

    try {
        const response = await fetch('https://api.evopay.com.br/v1/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EVOPAY_API_KEY}`
            },
            body: JSON.stringify({
                amount: total,
                customer: {
                    name: nome,
                    tax_id: cpf.replace(/\D/g, ''),
                    email: email
                },
                description: "Figurinhas Copa 2026"
            })
        });

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
}