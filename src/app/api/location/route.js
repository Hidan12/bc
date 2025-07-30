export async function GET() {
  const usuarios = [{ id: 1, nombre: 'Martín' }];
  return Response.json(usuarios);
}

export async function POST(request) {
  const data = await request.json();
  return Response.json({ mensaje: 'Usuario creado', data });
}