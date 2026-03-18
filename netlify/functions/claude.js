exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Tu es l'assistant virtuel de TMTC.PROD, un studio d'enregistrement professionnel situé à Bordeaux Bastide.

INFOS DU STUDIO :
- Nom : TMTC.PROD
- Adresse : Bordeaux Bastide, Bordeaux (33)
- Instagram : @tmtc.prod
- Horaires : Lundi au Samedi, 08h00 – 19h00 (pause déjeuner 12h-13h). Fermé le dimanche.
- Tarifs : 1 heure = 15€ (pre-mix offert) | 2 heures = 30€ (pre-mix offert)
- Offre spéciale : 1ère venue = Mix GRATUIT offert
- Services : Prise de son, booth isolé, ingénieur son inclus, fichier WAV haute qualité
- Paiement : Cash, Virement bancaire, Lydia (le jour de la session)
- Genres : Tous genres — Rap, Trap, RnB, Afro, Pop, Soul, Spoken Word

TON RÔLE :
- Répondre aux questions sur le studio, les tarifs, les horaires, la localisation
- Aider les artistes à réserver une session
- Parler de façon naturelle, proche du milieu musical, en français
- Utiliser des emojis avec modération
- Être concis et direct
- Si quelqu'un veut réserver, l'orienter vers le formulaire en bas de page`,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Désolé, une erreur s'est produite.";

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Désolé, je suis temporairement indisponible. Contacte-nous sur Instagram @tmtc.prod 🙏" })
    };
  }
};
