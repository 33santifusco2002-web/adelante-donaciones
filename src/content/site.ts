/**
 * CONTENIDO CENTRALIZADO DE LA PÁGINA DE DONACIONES DE ADELANTE
 *
 * Todos los textos, montos, cifras y datos de la organización viven acá.
 * Cada dato marcado con `// PENDIENTE` todavía no fue confirmado por Adelante:
 * es un valor de ejemplo y hay que reemplazarlo antes de publicar.
 *
 * Los montos van en pesos argentinos, sin puntos ni símbolos (20000, no "$20.000").
 */

export type Frequency = "mensual" | "unica";

export type AmountOption = {
  value: number;
  /** Lo que se ve debajo del monto en el botón (corto). */
  impact: string;
  /** Frase de impacto dinámica que aparece al elegir el monto. */
  impactLong: string;
  /** Muestra la etiqueta "Más elegido" y lo preselecciona. */
  featured?: boolean;
};

export const org = {
  name: "Adelante",
  legalName: "Asociación Civil Adelante",
  tagline: "Trabajo, educación y urbanización en los barrios de Mar del Plata",
  // Datos confirmados
  address: "Vieytes 1570, Mar del Plata, General Pueyrredon, Buenos Aires (7600)",
  whatsapp: "+54 9 223 656 7231",
  whatsappLink: "https://wa.me/5492236567231",
  instagram: "@adelante.mdp",
  instagramLink: "https://www.instagram.com/adelante.mdp/",
  website: "https://adelante.org.ar",
  families: 300,
  neighborhoods: 4,
  // PENDIENTE: confirmar e-mail de contacto
  email: "contacto@adelante.org.ar",
  // PENDIENTE: CUIT de la Asociación Civil
  cuit: "a confirmar",
  // PENDIENTE: número de personería jurídica (DPPJ)
  personeria: "a confirmar",
  // PENDIENTE: ¿la donación es deducible de Ganancias? (art. 81 inc. c, exención AFIP/ARCA)
  deducible: null as boolean | null,
  // PENDIENTE: cantidad real de voluntarios (valor de ejemplo)
  volunteers: 60,
  // PENDIENTE: años de trabajo en los barrios (valor de ejemplo)
  years: 8,
};

export const seo = {
  title: "Doná a Adelante | 300 familias de Mar del Plata siguen adelante",
  description:
    "Con tu aporte mensual o único, Adelante acompaña a más de 300 familias en 4 barrios de Mar del Plata con trabajo, educación y urbanización. Doná en 1 minuto con Mercado Pago.",
  ogImage: "/og.jpg",
};

export const demoBanner = "Boceto de propuesta – datos de ejemplo";

export const header = {
  manageLink: "Gestionar o dar de baja mi aporte",
};

export const hero = {
  eyebrow: "Asociación Civil · Mar del Plata",
  title: "Con tu aporte, 300 familias de Mar del Plata siguen adelante",
  subtitle: "Acompañamos a chicos y familias de 4 barrios con educación, trabajo y urbanización.",
  // Reemplazar /public/hero.jpg por una foto real del trabajo en los barrios.
  imageAlt: "Chicos y voluntarios de Adelante en una actividad en el barrio",
};

export const donation = {
  sectionTitle: "Sumate con tu aporte",
  stepLabel: (step: 1 | 2) => `Paso ${step} de 2`,
  step1Title: "Tu aporte",
  step2Title: "Tus datos",
  frequencyLegend: "¿Cada cuánto querés aportar?",
  frequencyLabels: {
    mensual: "Mensual",
    unica: "Una sola vez",
  } as Record<Frequency, string>,
  frequencyHint: "Recomendado",
  amountLegend: "Elegí un monto",
  featuredBadge: "Más elegido",
  otherAmountLabel: "Otro monto",
  otherAmountPlaceholder: "Ingresá el monto",
  // PENDIENTE: monto mínimo para "Otro monto" (provisorio)
  minAmount: 3000,
  otherImpactLong:
    "Tu aporte se suma a los programas de Adelante en los 4 barrios: útiles, becas, talleres y acompañamiento a las familias.",

  // Montos mensuales: CONFIRMADOS
  amounts: {
    mensual: [
      {
        value: 5000,
        impact: "Útiles para un chico por mes",
        impactLong: "Con $5.000 por mes, un chico tiene todos los útiles que necesita para ir a la escuela.",
      },
      {
        value: 10000,
        impact: "Medio kit escolar",
        impactLong: "Con $10.000 por mes cubrís medio kit escolar: cuadernos, lápices y mochila para empezar el año.",
      },
      {
        value: 20000,
        impact: "Un kit escolar",
        impactLong: "Con $20.000 por mes, un chico arranca el año con su kit escolar completo.",
        featured: true,
      },
      {
        value: 40000,
        impact: "Beca de estimulación temprana",
        impactLong:
          "Con $40.000 por mes becás a un nene o una nena en el programa de estimulación temprana de primeras infancias.",
      },
    ],
    // PENDIENTE: montos de donación única e impactos (provisorios, de ejemplo)
    unica: [
      {
        value: 10000,
        impact: "Materiales para un taller",
        impactLong: "Con $10.000 cubrís los materiales de un taller de oficios para jóvenes del barrio.",
      },
      {
        value: 25000,
        impact: "Un kit escolar y más",
        impactLong: "Con $25.000, un chico empieza las clases con su kit escolar completo y libros de lectura.",
        featured: true,
      },
      {
        value: 50000,
        impact: "Un mes de apoyo escolar",
        impactLong: "Con $50.000 sostenés un mes de apoyo escolar para un grupo de chicos de primaria.",
      },
      {
        value: 100000,
        impact: "Equipar un espacio",
        impactLong: "Con $100.000 equipás un espacio de primeras infancias con juegos y materiales didácticos.",
      },
    ],
  } satisfies Record<Frequency, AmountOption[]>,

  continueButton: (amount: string, frequency: Frequency) =>
    frequency === "mensual" ? `Continuar con ${amount} por mes` : `Continuar con ${amount}`,
  donateButton: (amount: string, frequency: Frequency) =>
    frequency === "mensual" ? `Donar ${amount} por mes` : `Donar ${amount}`,
  backButton: "Volver",
  fields: {
    name: "Nombre",
    email: "E-mail",
    emailHint: "Te mandamos el comprobante acá.",
    phone: "Celular (opcional)",
    phoneHint: "Solo para avisarte si hay algún problema con tu aporte.",
    newsletter: "Quiero recibir novedades de Adelante",
  },
  security: "Pago 100% seguro con Mercado Pago",
  cancelAnytime: "Podés cancelar tu aporte mensual cuando quieras",
  processing: "Te estamos llevando a Mercado Pago…",
  processingDemo: "Procesando tu aporte…",
  transfer: {
    toggle: "Prefiero transferir",
    title: "Transferencia bancaria",
    // PENDIENTE: alias y CBU de la cuenta de la Asociación
    alias: "a confirmar",
    cbu: "a confirmar",
    holder: "Asociación Civil Adelante",
    note: "Cuando transfieras, mandanos el comprobante por WhatsApp así te agradecemos.",
    copy: "Copiar",
    copied: "¡Copiado!",
  },
  errors: {
    minAmount: (min: string) => `El monto mínimo es ${min}.`,
    amountRequired: "Elegí o ingresá un monto.",
    nameRequired: "Contanos tu nombre.",
    emailInvalid: "Revisá el e-mail: parece que falta algo (ej.: nombre@gmail.com).",
    phoneInvalid: "Revisá el celular: usá solo números (ej.: 223 555 1234).",
    generic:
      "No pudimos conectar con Mercado Pago. Tus datos siguen cargados: probá de nuevo en unos segundos o escribinos por WhatsApp.",
  },
};

export const impactBar = {
  title: "Nuestro trabajo en números",
  items: [
    { value: `${org.families}+`, label: "familias acompañadas" },
    { value: `${org.neighborhoods}`, label: "barrios de la periferia" },
    { value: `${org.volunteers}`, label: "voluntarios" }, // PENDIENTE (ejemplo)
    { value: `${org.years}`, label: "años en los barrios" }, // PENDIENTE (ejemplo)
  ],
};

// PENDIENTE: textos de los programas (ejemplos verosímiles) y fotos reales
export const programs = {
  eyebrow: "Programas",
  intro: "Trabajamos con cada familia de forma integral: desde los primeros años hasta el primer empleo.",
  title: "Tu aporte llega a tres programas",
  items: [
    {
      id: "etec",
      name: "ETEC",
      image: "/programas/etec.jpg",
      imageAlt: "Jóvenes en un taller de capacitación",
      description:
        "Capacitación en oficios y acompañamiento para que jóvenes y adultos del barrio consigan trabajo o arranquen su propio emprendimiento.",
      funds: "Herramientas, materiales y docentes de los talleres.",
    },
    {
      id: "mentes-curiosas",
      name: "Mentes Curiosas",
      image: "/programas/mentes-curiosas.jpg",
      imageAlt: "Chicos haciendo tareas con una voluntaria",
      description:
        "Apoyo escolar y alfabetización para chicos de primaria, con voluntarios que los acompañan semana a semana.",
      funds: "Kits escolares, libros y la merienda de cada encuentro.",
    },
    {
      id: "adelante-futuro",
      name: "Adelante Futuro",
      image: "/programas/adelante-futuro.jpg",
      imageAlt: "Nenes pequeños jugando con materiales didácticos",
      description:
        "Estimulación temprana para primeras infancias y acompañamiento a sus familias en los primeros años.",
      funds: "Becas, juegos didácticos y profesionales especializados.",
    },
  ],
};

// PENDIENTE: testimonios reales. Estos son EJEMPLOS con nombres de pila genéricos.
export const testimonials = {
  eyebrow: "Voces del barrio",
  title: "Lo que nos cuentan",
  note: "Testimonios de ejemplo",
  items: [
    {
      name: "Laura",
      role: "Mamá del barrio (ejemplo)",
      image: "/testimonios/1.jpg",
      quote: "Mi hijo empezó a ir a Mentes Curiosas y ahora le gusta leer. Antes no quería ni abrir un libro.",
    },
    {
      name: "Martín",
      role: "Egresado de ETEC (ejemplo)",
      image: "/testimonios/2.jpg",
      quote: "Hice el taller de electricidad y hoy trabajo por mi cuenta. Me dieron herramientas y confianza.",
    },
    {
      name: "Sofía",
      role: "Donante mensual (ejemplo)",
      image: "/testimonios/3.jpg",
      quote: "Dono todos los meses porque veo en qué se usa la plata. Es poco para mí y mucho para ellos.",
    },
  ],
};

// PENDIENTE: porcentajes reales de uso de fondos (ejemplo, deben sumar 100)
export const transparency = {
  eyebrow: "Transparencia",
  title: "En qué usamos cada peso",
  intro: "Publicamos en qué se usan los fondos. Así se distribuyó lo recaudado el último año (ejemplo):",
  items: [
    { label: "Programas educativos", percent: 50, color: "#0F2E1B" },
    { label: "Primeras infancias", percent: 25, color: "#0B7A1E" },
    { label: "Trabajo y oficios", percent: 15, color: "#8DB596" },
    { label: "Gastos operativos", percent: 10, color: "#FFCC00" },
  ],
  reportLabel: "Ver informe de impacto",
  // PENDIENTE: link al informe de impacto
  reportUrl: "#",
};

export const faq = {
  eyebrow: "Preguntas frecuentes",
  title: "Antes de donar",
  items: [
    {
      q: "¿Es seguro?",
      a: "Sí. El pago lo procesa Mercado Pago: nosotros nunca vemos ni guardamos los datos de tu tarjeta o cuenta.",
    },
    {
      q: "¿Cómo cancelo mi aporte?",
      a: "Cuando quieras, en un minuto: desde la app de Mercado Pago (Suscripciones) o completando el formulario de baja. Sin llamados ni trámites.",
    },
    {
      q: "¿Recibo comprobante?",
      a: "Sí. Mercado Pago te manda el comprobante por e-mail cada vez que se acredita tu aporte.",
    },
    {
      // PENDIENTE: confirmar situación impositiva
      q: "¿Es deducible de Ganancias?",
      a: "Estamos confirmando la exención ante ARCA. Si tu aporte es deducible, te enviamos el certificado para tu declaración jurada.",
    },
    {
      q: "¿Puedo donar desde el exterior?",
      a: "Sí, con tarjetas emitidas fuera de Argentina a través de Mercado Pago. Si tenés algún problema, escribinos por WhatsApp y te ayudamos.",
    },
  ],
};

export const footer = {
  links: [
    { label: "Términos y condiciones", href: "#" }, // PENDIENTE
    { label: "Política de privacidad", href: "#" }, // PENDIENTE
    { label: "Dar de baja mi aporte", href: "/baja" },
  ],
};

export const sticky = { label: "Donar ahora" };

export const thanks = {
  title: (name: string) => (name ? `¡Gracias, ${name}!` : "¡Gracias por tu aporte!"),
  body: (amount: string, frequency: Frequency) =>
    frequency === "mensual"
      ? `Tu aporte de ${amount} por mes ya es parte de Adelante.`
      : `Tu aporte de ${amount} ya es parte de Adelante.`,
  receipt: "En unos minutos te llega el comprobante de Mercado Pago a tu e-mail.",
  shareTitle: "¿Nos ayudás a llegar a más gente?",
  shareButton: "Compartir por WhatsApp",
  shareText: (url: string) =>
    `Acabo de sumarme a Adelante, que acompaña a más de 300 familias de Mar del Plata. Si podés, sumate vos también: ${url}`,
  monthlyInvite: {
    title: "¿Y si lo hacés todos los meses?",
    body: "Un aporte mensual, aunque sea chico, nos permite planificar el año y sostener los programas.",
    button: (amount: string) => `Aportar ${amount} por mes`,
  },
  backHome: "Volver al inicio",
};

export const pending = {
  title: "Tu pago está pendiente",
  body: "Mercado Pago todavía está procesando tu pago (pasa con algunos medios como efectivo o transferencia). Te avisamos por e-mail cuando se acredite.",
};

export const failed = {
  title: "El pago no se pudo completar",
  body: "No se te cobró nada. Puede pasar si la tarjeta fue rechazada o si se cerró la ventana. Tus datos siguen cargados: probá de nuevo o con otro medio de pago.",
  retry: "Volver a intentar",
};

export const unsubscribe = {
  title: "Gestionar o dar de baja tu aporte",
  intro: "Sin trabas: podés cancelar tu aporte mensual cuando quieras, de cualquiera de estas dos formas.",
  optionMp: {
    title: "Desde Mercado Pago (inmediato)",
    steps: [
      "Entrá a la app o web de Mercado Pago.",
      "Andá a Tu perfil → Suscripciones.",
      "Elegí “Adelante” y tocá Cancelar suscripción.",
    ],
    link: "https://www.mercadopago.com.ar/subscriptions",
    linkLabel: "Ir a mis suscripciones",
  },
  optionForm: {
    title: "Pedíselo a Adelante",
    body: "Dejanos el e-mail con el que donás y lo damos de baja nosotros en 48 horas hábiles.",
    email: "E-mail con el que donás",
    reason: "¿Nos contás por qué? (opcional)",
    submit: "Pedir la baja",
    success: "Listo, recibimos tu pedido. Te confirmamos la baja por e-mail en 48 horas hábiles. ¡Gracias por haber sido parte!",
    error: "No pudimos enviar el pedido. Probá de nuevo o escribinos por WhatsApp.",
  },
};
