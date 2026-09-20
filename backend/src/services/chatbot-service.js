const REPLIES = Object.freeze({
  greeting:
    '¡Hola! Soy el asistente de Belleza Tetris. Pregúntame por servicios, precios, horarios, citas o el juego.',
  prices:
    'Nuestros servicios: Corte ($800), Tinte ($1,500), Manicure ($600) y Facial ($1,200), con ITBIS incluido. ¿Quieres agendar una cita?',
  hours: 'Estamos abiertos de lunes a sábado, de 9:00 a. m. a 7:00 p. m. Te esperamos.',
  place:
    'Nos encontramos en la Av. Principal #123, Santo Domingo. Puedes agendar tu cita desde la sección Citas.',
  booking:
    'Para agendar una cita ve a la sección Citas del menú y completa el formulario. ¡Te esperamos!',
  game: 'En la sección Juego puedes jugar Tetris. Usa las flechas para mover, ↑ para rotar y espacio para soltar. Guarda tu puntuación al terminar.',
  contact: 'Escríbenos al (809) 555-1234 o al correo hola@bellezatetris.com.',
  thanks: '¡Con mucho gusto! ¿Necesitas algo más?',
  fallback:
    'No tengo información sobre eso. Pregunta por servicios, precios, horarios, citas o el juego.',
});

const RULES = [
  {
    keywords: ['hola', 'buenos dias', 'buenas tardes', 'saludos'],
    reply: REPLIES.greeting,
  },
  { keywords: ['precio', 'cuanto', 'costo', 'costar', 'tarifa'], reply: REPLIES.prices },
  {
    keywords: ['horario', 'hora', 'abierto', 'abren', 'cierran', 'abre'],
    reply: REPLIES.hours,
  },
  {
    keywords: ['donde', 'ubicacion', 'direccion', 'lugar', 'ubicados'],
    reply: REPLIES.place,
  },
  { keywords: ['cita', 'agendar', 'reservar', 'reserva'], reply: REPLIES.booking },
  {
    keywords: ['tetris', 'juego', 'puntaje', 'puntuacion', 'puntos'],
    reply: REPLIES.game,
  },
  {
    keywords: ['contacto', 'telefono', 'whatsapp', 'correo', 'email'],
    reply: REPLIES.contact,
  },
  { keywords: ['gracias', 'perfecto', 'genial', 'excelente'], reply: REPLIES.thanks },
];

const chatbotService = {
  /**
   * Genera una respuesta según palabras clave del mensaje.
   * @param {string} message
   * @returns {string}
   */
  reply(message) {
    const normalized = message.toLowerCase();
    for (const rule of RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.reply;
      }
    }
    return REPLIES.fallback;
  },
};

module.exports = chatbotService;
