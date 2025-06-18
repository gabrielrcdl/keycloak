import express from "express";

const app = express();

app.get("/login", (req, res) => {
  const loginUrlParams = new URLSearchParams({
    response_type: "code",
    client_id: "fullcycle-client",
    redirect_uri: "http://localhost:3000/callback",
    scope: "openid",
  });

  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginUrlParams.toString()}`;

  res.redirect(url);
});

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

  res.json(result);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
