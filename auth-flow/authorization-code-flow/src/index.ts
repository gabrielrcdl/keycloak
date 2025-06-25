import express from "express";
import crypto from "crypto";
import session from "express-session";
import jwt from "jsonwebtoken";
const app = express();

app.use(
  session({
    secret: "your-secret-key", // Chave apenas para modo de desenvolvimento/testes
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/login", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("base64");

  //@ts-ignore
  req.session.nonce = nonce;
  req.session.save(() => {
    const loginUrlParams = new URLSearchParams({
      response_type: "code",
      client_id: "fullcycle-client",
      redirect_uri: "http://localhost:3000/callback",
      scope: "openid",
      nonce,
    });

    const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginUrlParams.toString()}`;

    res.redirect(url);
  });
});

//@ts-expect-error - type mismatch
app.get("/callback", async (req, res) => {
  const bodyParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: "fullcycle-client",
    code: req.query.code as string,
    redirect_uri: "http://localhost:3000/callback",
  });

  const url = `http://keycloak:8080/realms/fullcycle-realm/protocol/openid-connect/token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  const result = await response.json();

  const payloadAccessToken = jwt.decode(result.access_token) as any;
  const payloadRefreshToken = jwt.decode(result.refresh_token) as any;
  const payloadIdToken = jwt.decode(result.id_token) as any;

  if (
    //@ts-expect-error - type mismatch
    payloadAccessToken.nonce !== req.session.nonce ||
    //@ts-expect-error - type mismatch
    payloadIdToken.nonce !== req.session.nonce ||
    //@ts-expect-error - type mismatch
    payloadRefreshToken.nonce !== req.session.nonce
  ) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  //@ts-expect-error - type mismatch
  req.session.user = payloadAccessToken;
  //@ts-expect-error - type mismatch
  req.session.access_token = result.access_token;
  //@ts-expect-error - type mismatch
  req.session.id_token = result.id_token;
  req.session.save();
  res.json(result);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
