// Crea un error amb un codi HTTP. El gestor d'errors d'app.js el converteix en resposta.
export function error(status, missatge) {
  const err = new Error(missatge);
  err.status = status;
  return err;
}
