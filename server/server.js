import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Teste da configuração do Gmail
transporter.verify((error) => {
  if (error) {
    console.error("❌ Erro na configuração do e-mail:");
    console.error(error);
  } else {
    console.log("✅ Servidor de e-mail conectado ao Gmail.");
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "EVORIAN Site Creator API",
  });
});

app.post("/api/site-request", async (req, res) => {
  try {
    const {
      name,
      project,
      type,
      description,
      email,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Nome e e-mail são obrigatórios.",
      });
    }

    const mailContent = `
NOVA SOLICITAÇÃO DE SITE
========================

Nome:
${name}

E-mail:
${email}

Projeto:
${project || "Não informado"}

Tipo:
${type || "Não informado"}

Descrição:
${description || "Não informado"}

========================
Enviado pelo EVORIAN Site Creator
`;

    const mailOptions = {
      from: `"EVORIAN Site Creator" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Novo projeto — ${project || name}`,
      text: mailContent,
      html: `
        <div style="font-family:Arial,sans-serif;background:#03060d;color:#fff;padding:40px;">
          
          <h1 style="margin-bottom:8px;">
            Nova solicitação de site
          </h1>

          <p style="color:#61a8ff;">
            EVORIAN Site Creator
          </p>

          <hr style="border:0;border-top:1px solid #222;margin:30px 0;">

          <h3>Cliente</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>

          <h3>Projeto</h3>
          <p><strong>Nome:</strong> ${project || "Não informado"}</p>
          <p><strong>Tipo:</strong> ${type || "Não informado"}</p>

          <h3>Descrição</h3>

          <div style="
            background:#0b111c;
            border:1px solid #1b2738;
            border-radius:12px;
            padding:20px;
            white-space:pre-wrap;
          ">
            ${description || "Não informado"}
          </div>

          <br>

          <p style="color:#777;font-size:12px;">
            Enviado automaticamente pela RECTOR | Security infrastructure by EVORIAN.
          </p>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("📨 Solicitação enviada:", {
      name,
      email,
      project,
      type,
    });

    res.json({
      success: true,
      message: "Solicitação enviada com sucesso.",
    });

  } catch (error) {

    console.error("❌ ERRO AO ENVIAR E-MAIL:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Não foi possível enviar sua solicitação.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 EVORIAN Site Creator API rodando em http://localhost:${PORT}`
  );
});