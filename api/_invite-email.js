// Invite email content, localized by the lead's `lang` field.
// HUB_SIGNUP_URL and DRIVE_TRAINING_URL are placeholders — confirm/replace
// before sending real invites (see the chat for what's still pending).

const HUB_SIGNUP_URL = process.env.HUB_SIGNUP_URL || 'https://meridian-fitness.vercel.app/primeiro-acesso';
const DRIVE_TRAINING_URL = process.env.DRIVE_TRAINING_URL || 'https://drive.google.com/TODO-cole-o-link-dos-videos-aqui';

const WHATSAPP_NUMBER = '4915204066998';
const WHATSAPP_TEXT = {
  pt: 'Olá! Acabei de receber meu acesso ao Fitness Hub por email.',
  en: 'Hi! I just received my Fitness Hub access by email.',
  de: 'Hallo! Ich habe gerade meinen Fitness-Hub-Zugang per E-Mail erhalten.',
};
function getWhatsappUrl(lang) {
  const text = WHATSAPP_TEXT[lang] || WHATSAPP_TEXT.pt;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const COPY = {
  pt: {
    subject: 'Seu acesso ao Fitness Hub está liberado',
    preheader: 'Seu acesso já está liberado. Veja como começar.',
    hello: (name) => `Oi${name ? ', ' + name : ''}!`,
    intro: 'Seu acesso ao Meridian Fitness Performance Hub já está liberado.',
    ctaLabel: 'Acessar o Hub',
    stepsTitle: 'Para começar:',
    steps: [
      'Acesse o link acima.',
      'Crie sua senha.',
      'Na primeira vez que entrar, vá primeiro em Configurações antes de qualquer outra aba.',
    ],
    migrationTitle: 'Já tem uma base de alunos em outro lugar?',
    migrationBody: 'Se você já tem alunos cadastrados em planilha, outro sistema ou caderno, dá pra migrar tudo direto pra dentro do Hub. É só responder o WhatsApp de follow-up confirmando que tem interesse.',
    videosTitle: 'Vídeos de treinamento (opcional)',
    videosBody: 'Preparei um material em vídeo explicando cada parte do Hub. Assista se quiser se aprofundar, mas não é obrigatório pra começar.',
    videosLabel: 'Ver vídeos de treinamento',
    whatsappLabel: 'Falar agora no WhatsApp',
    closing: 'Um follow-up por WhatsApp vem em seguida, mas pode chamar a qualquer momento.',
    signature: 'Vinicius, Meridian Fitness Performance Hub',
  },
  en: {
    subject: 'Your Fitness Hub access is ready',
    preheader: 'Your access is ready. Here is how to get started.',
    hello: (name) => `Hi${name ? ', ' + name : ''}!`,
    intro: 'Your access to the Meridian Fitness Performance Hub is ready.',
    ctaLabel: 'Open the Hub',
    stepsTitle: 'To get started:',
    steps: [
      'Open the link above.',
      'Create your password.',
      'The first time you log in, go to Settings before anything else.',
    ],
    migrationTitle: 'Already have a student base somewhere else?',
    migrationBody: 'If you already track students in a spreadsheet, another tool, or a notebook, it can be migrated straight into the Hub. Just reply to the WhatsApp follow-up confirming you are interested.',
    videosTitle: 'Training videos (optional)',
    videosBody: "I put together a video walkthrough of the Hub. Watch it if you want to go deeper, but it is not required to get started.",
    videosLabel: 'Watch the training videos',
    whatsappLabel: 'Message us on WhatsApp now',
    closing: 'A WhatsApp follow-up is coming next, but feel free to reach out anytime.',
    signature: 'Vinicius, Meridian Fitness Performance Hub',
  },
  de: {
    subject: 'Dein Zugang zum Fitness Hub ist freigeschaltet',
    preheader: 'Dein Zugang ist freigeschaltet. So geht es los.',
    hello: (name) => `Hallo${name ? ', ' + name : ''}!`,
    intro: 'Dein Zugang zum Meridian Fitness Performance Hub ist freigeschaltet.',
    ctaLabel: 'Hub Öffnen',
    stepsTitle: 'So geht es los:',
    steps: [
      'Öffne den Link oben.',
      'Erstelle dein Passwort.',
      'Geh beim ersten Login zuerst zu Einstellungen, bevor du etwas anderes machst.',
    ],
    migrationTitle: 'Hast du schon eine Kundenliste woanders?',
    migrationBody: 'Wenn du deine Kunden schon in Excel, einem anderen Tool oder einem Notizbuch verwaltest, kann das direkt in den Hub migriert werden. Antworte einfach auf die WhatsApp-Nachricht und bestätige dein Interesse.',
    videosTitle: 'Schulungsvideos (optional)',
    videosBody: 'Ich habe Videos vorbereitet, die jeden Teil des Hubs erklären. Schau sie dir an, wenn du tiefer einsteigen willst, aber sie sind kein Muss für den Start.',
    videosLabel: 'Schulungsvideos ansehen',
    whatsappLabel: 'Jetzt auf WhatsApp schreiben',
    closing: 'Ein WhatsApp-Follow-up kommt als Nächstes, du kannst aber jederzeit schreiben.',
    signature: 'Vinicius, Meridian Fitness Performance Hub',
  },
};

function getCopy(lang) {
  return COPY[lang] || COPY.pt;
}

function buildInviteEmailHtml(lang, name) {
  const c = getCopy(lang);
  const steps = c.steps.map((s) => `<li style="margin-bottom:8px;">${s}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#F2F7F6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${c.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F7F6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#FFFFFF;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background-color:#013A40;padding:28px 32px;">
              <span style="color:#02C39A;font-weight:800;font-size:0.8rem;letter-spacing:2px;text-transform:uppercase;">Meridian Fitness Performance Hub</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#013A40;">
              <p style="font-size:1.1rem;margin:0 0 16px 0;">${c.hello(name)}</p>
              <p style="font-size:1rem;line-height:1.6;margin:0 0 24px 0;">${c.intro}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                <tr>
                  <td style="background-color:#02C39A;border-radius:3px;">
                    <a href="${HUB_SIGNUP_URL}" style="display:inline-block;padding:14px 28px;color:#013A40;text-decoration:none;font-weight:700;font-size:0.9rem;">${c.ctaLabel}</a>
                  </td>
                </tr>
              </table>
              <p style="font-weight:700;font-size:0.95rem;margin:0 0 10px 0;">${c.stepsTitle}</p>
              <ol style="padding-left:20px;margin:0 0 28px 0;font-size:0.95rem;line-height:1.5;color:#4B6367;">${steps}</ol>
              <div style="border-top:1px solid #E2E8F0;padding-top:20px;margin-bottom:24px;">
                <p style="font-weight:700;font-size:0.95rem;margin:0 0 8px 0;">${c.migrationTitle}</p>
                <p style="font-size:0.9rem;line-height:1.5;color:#4B6367;margin:0;">${c.migrationBody}</p>
              </div>
              <div style="border-top:1px solid #E2E8F0;padding-top:20px;margin-bottom:24px;">
                <p style="font-weight:700;font-size:0.95rem;margin:0 0 8px 0;">${c.videosTitle}</p>
                <p style="font-size:0.9rem;line-height:1.5;color:#4B6367;margin:0 0 10px 0;">${c.videosBody}</p>
                <a href="${DRIVE_TRAINING_URL}" style="color:#028090;font-size:0.9rem;font-weight:600;">${c.videosLabel}</a>
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                <tr>
                  <td style="background-color:#25D366;border-radius:3px;">
                    <a href="${getWhatsappUrl(lang)}" style="display:inline-block;padding:12px 24px;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:0.9rem;">${c.whatsappLabel}</a>
                  </td>
                </tr>
              </table>
              <p style="font-size:0.9rem;color:#4B6367;margin:0 0 4px 0;">${c.closing}</p>
              <p style="font-size:0.9rem;color:#013A40;font-weight:600;margin:20px 0 0 0;">${c.signature}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getSubject(lang) {
  return getCopy(lang).subject;
}

module.exports = { buildInviteEmailHtml, getSubject };
