export const MOCK_CHAT = [
  {
    id: 1,
    type: "received",
    text: "Olá! Bem-vindo ao atendimento do Clube. Sou o assistente virtual. Para liberar a entrada do seu convidado, digite o *CPF* dele:",
    time: "10:00",
  },
  {
    id: 2,
    type: "sent",
    text: "11122233344",
    time: "10:01",
  },
  {
    id: 3,
    type: "received",
    text: "Obrigado. Agora, por favor, digite o *Nome Completo* do convidado:",
    time: "10:01",
  },
  {
    id: 4,
    type: "sent",
    text: "João da Silva",
    time: "10:02",
  },
  {
    id: 5,
    type: "received",
    text: "Perfeito. Qual o *motivo* do acesso?\n1 - Familiar\n2 - Day Use\n3 - Prestador de Serviço",
    time: "10:02",
  },
  {
    id: 6,
    type: "sent",
    text: "2",
    time: "10:02",
  },
  {
    id: 7,
    type: "received",
    text: "Qual a data da visita? (Ex: DD/MM/AAAA)",
    time: "10:03",
  },
  {
    id: 8,
    type: "sent",
    text: "15/06/2026",
    time: "10:03",
  },
  {
    id: 9,
    type: "received",
    text: "Tudo certo! 🎉\n\n*Resumo da Autorização:*\nNome: João da Silva\nCPF: 111.222.333-44\nMotivo: Day Use\nData: 15/06/2026\n\nA autorização já foi enviada para o titular aprovar no App Entrada Segura.",
    time: "10:04",
  },
  {
    id: 10,
    type: "received",
    text: "O Titular *aprovou* o seu acesso! ✅\n\nAqui está o seu Passe de Acesso com QR Code. Apresente-o na portaria junto com seu documento oficial com foto.",
    time: "10:15",
  },
  {
    id: 11,
    type: "received",
    text: "PASSE",
    isPass: true,
    time: "10:15",
  }
];
