import axios from 'axios';
import { NextResponse } from 'next/server';

const URL_EXTERNA = process.env.URL_EXTERNA

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { uniqId } = params;
    console.log(uniqId, "back");
    
    const { data } = await axios.get(
      `${URL_EXTERNA}/api/pago/status`,{
        status: "consulta",
        uniqid: uniqId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.log("error al hacer la consulta");
    
    console.error("Error", error.message);

    return NextResponse.json(
      { error: "Ocurrió un error" },
      { status: 500 }
    );
  }
}
