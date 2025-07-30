import { useEffect, useState } from "react";
import "./inputMinimalista.css"

const InputMinimalista = ({
    label,
    placeHolder, 
    borderCol, 
    borderColSelec, 
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
    btn=false,
    labelColor = "text-black"
})=>{
    const [isFocused, setIsFocused] = useState(false);
    const [banSelect, setBanSelect] = useState(false)
    const [borderError, setBorderError] = useState(error)
    const [mostrarPasword, setMostrarPasword] = useState(false)
    
    useEffect(()=>{
        if (!isFocused && banSelect &&value.trim() == "") {
            setBorderError(true)     
        }
    },[isFocused])
    return(
        <div className="w-full flex flex-col">
            <span className={`text-[12px] ${labelColor}`}>{label}</span>
            <div tabIndex={0} onFocus={()=> {setIsFocused(true), setBanSelect(true)}} onBlur={()=>setIsFocused(false)} className={`w-full relative flex border-b-2 ${borderError || error ? borderColError: isFocused ? borderColSelec : borderCol}`}>
                <input
                value={value}
                placeholder={placeHolder}
                inputMode={modoNumerico ? "numeric": "text"}
                type={ type == "password" ? mostrarPasword ? "text": "password" : type} 
                name={name}
                onChange={(e)=>handler(e)}
                className={`${backGraundInput} ${btn ? "w-[65%]" :"w-full"} px-1 py-2.5 focus:outline-none focus:ring-0`}
                />
                {contenBtn && 
                <button onClick={()=> setMostrarPasword(p => !p)} className={btn ? "w-[35%]":"absolute left-0"}>
                    {contenBtn}
                </button>
                }
            </div>
            {error && <span className="text-[14px] text-red-600 font-medium">{errorLabel}</span>}
        </div>
    )
}

export default InputMinimalista