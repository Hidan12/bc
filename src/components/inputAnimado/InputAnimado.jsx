import { useState } from "react";

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
        className={`w-full p-3 relative flex items-center rounded transition-all duration-300 ${
            isFocused ? borderColSelec != "" ? `border-1 ${borderColSelec}` : borderCol : borderCol
        } ${backGraundInput} ${borderCol} ${borderColError && error ? borderColError: ""}`}
        >
        <input
            inputMode={modoNumerico ? "numeric" : "text"}
            name={name}
            type={ type == "password" ? mostrarPasword ? "text": "password" : type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handler(e)}
            className={`ml-0.5 p-1 font-semibold text-[14px] outline-none transition-all ${backGraundInput} ${
                btn || svg ? "w-[90%]" : "w-full"
            }`}
            placeholder={isFocused ? placeHolder : ""}
            value={value}
            />
            { svg && isFocused && svg}
        {contenBtn && 
            <button onClick={()=> setMostrarPasword(p => !p)} className={btn ? "w-[20%]":"absolute left-0"}>
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
};
export{InputAnimado}