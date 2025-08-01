import axios from 'axios';
import { NextResponse } from 'next/server';

const URL_EXTERNA = process.env.URL_EXTERNA

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(`${URL_EXTERNA}/api/pago/status`);
    console.log(body);
    
    
    const { data } = await axios.post(
      `${URL_EXTERNA}/api/pago/status`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error", error.message);

    return NextResponse.json(
      { error: "Ocurrió un error" },
      { status: 500 }
    );
  }
}
