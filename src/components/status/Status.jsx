import { useState } from "react";

const Status = ({uniqId, svg= null, setReLoad, setLoading, InputModificado, tamInput=null, type, lebelInput, estiloBtnContinuar, labelBtnContinuar, error, handler, titulo, textColor, borderColorSelect, borderColError, borderCol, backGraundInput, min=4, max=10, btn=false, contenBtn = null})=>{
    const [clave, setClave] = useState("");
    const [errores, setErrores] = useState({});


    
    const handlerClave = (v) => setClave(v.target.value);

    const handlerValidar = () => {
    const nuevosErrores = {};


    if (!clave || clave.trim().length < min && clave.trim().length < max) {
        nuevosErrores.clave = "La clave debe tener al menos 4 caracteres.";
    }
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
        handler(clave, uniqId, setReLoad, setLoading);
    }
    };

    return (
    <div className="w-full flex flex-col justify-center mt-2 items-center gap gap-y-3 pb-4">
        {svg && svg}
        <h5 className={`text-[15px] mb-3 font-semibold ${textColor}`}>{titulo}</h5>
        {error != "" && <span className="text-red-600 text-[11px] mt-1 px-1 mb-3">{error}</span>}
        {/* CLAVE */}
          <InputModificado tamInput={tamInput} type={type} btn={btn} contenBtn={contenBtn} error={!!errores?.numeroTarjeta} borderCol={borderCol} errorLabel={errores?.numeroTarjeta || ""} borderColError={borderColError} modoNumerico={true} label={lebelInput} labelColor={textColor} handler={handlerClave} borderColorSelect={borderColorSelect} placeHolder={""} value={clave} name={"cla"} backGraundInput={backGraundInput}/>

        {/* BOTÓN */}
        <div className="w-[90%] mt-5 flex items-center justify-center">
            <button
                onClick={handlerValidar}
                className={estiloBtnContinuar}
            >
                {labelBtnContinuar}
            </button>
        </div>
    </div>
    );
}

export {Status}