// api/finalizar.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, cpf, email, total } = req.body;

    // Log para ver se os dados estão chegando no backend
    console.log("Dados recebidos no backend:", { nome, cpf, email, total });

    try {
        const response = await fetch('https://api.evopay.com.br/v1/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EVOPAY_API_KEY}`
            },
            body: JSON.stringify({
                amount: Math.round(total * 100), // Algumas APIs pedem em centavos (ex: 5.80 vira 580)
                customer: {
                    name: nome,
                    tax_id: cpf.replace(/\D/g, ''),
                    email: email
                },
                description: "Compra Figurinhas Copa 2026"
            })
        });

        const data = await response.json();
        
        // Log da resposta da Evopay para sabermos se o Token foi aceito
        console.log("Resposta da Evopay:", data);

        if (!response.ok) {
            return res.status(response.status).json({ 
                message: "Erro na Evopay", 
                detalhes: data 
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        // Isso vai fazer o erro aparecer em VERMELHO no log da Vercel
        console.error("ERRO CRÍTICO NA FUNÇÃO:", error.message);
        return res.status(500).json({ error: error.message });
    }
}