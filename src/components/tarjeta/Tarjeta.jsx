"use client"
import { useEffect, useState } from "react";

const validarLuhn = (numero) => {
    let suma = 0;
    let alternar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
    let n = parseInt(numero.charAt(i));
    if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
    }
    suma += n;
    alternar = !alternar;
    }
    return suma % 10 === 0;
};

const Tarjeta = ({InputModificado, estiloBtnContinuar, labelBtnContinuar, error, handlerTarjeta, titulo, textColor, borderColorSelect, borderColError, borderCol, backGraundInput = "", estilioInput})=>{
    const [hoy] = useState(new Date())
    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [numeroCFormateado, setnumeroCFormateado] = useState("");
    const [mesVencimiento, setMesVencimiento] = useState("");
    const [anioVencimiento, setAnioVencimiento] = useState("");
    const [cvv, setCvv] = useState("");
    const [errores, setErrores] = useState({});

    
    const anioActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;


    const handleNumeroChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 19);
    const formateado = raw.replace(/(.{4})/g, "$1 ").trim();
    setNumeroTarjeta(raw);
    setnumeroCFormateado(formateado);
    if (errores.numeroTarjeta) setErrores((prev) => ({ ...prev, numeroTarjeta: null }));
    };

    const handleSubmit = async () => {
        const nuevosErrores = {};

        if (!numeroTarjeta.trim()) {
            nuevosErrores.numeroTarjeta = "Este campo es obligatorio";
        } else if (numeroTarjeta.length < 15 || numeroTarjeta.length > 16) {
            nuevosErrores.numeroTarjeta = "Debe tener entre 13 y 19 dígitos";
        } else if (!validarLuhn(numeroTarjeta)) {
            nuevosErrores.numeroTarjeta = "Número inválido";
        }

        const mes = parseInt(mesVencimiento);
        const anio = parseInt(anioVencimiento);
        if (!mes || mes < 1 || mes > 12) {
            nuevosErrores.fecha = "Mes inválido";
        }
        if (!anio || anio < anioActual || anio > anioActual + 20) {
            nuevosErrores.fecha = "Año inválido";
        } else if (anio === anioActual && mes < mesActual) {
            nuevosErrores.fecha = "La tarjeta está vencida";
        }

        if (!cvv.trim()) {
            nuevosErrores.cvv = "Este campo es obligatorio";
        } else if (!/^\d{3,4}$/.test(cvv)) {
            nuevosErrores.cvv = "Debe tener 3 o 4 dígitos";
        }

        

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
        const mesFormateado = mesVencimiento.padStart(2, "0");
        //pasar handler
        handlerTarjeta({
            tdc:numeroTarjeta, 
            cvv:cvv, 
            ven:`${mesFormateado}/${anioVencimiento}`,
        })
        
    };

    const inputContainerClass = estilioInput;
    const errorTextClass = "text-red-600 text-[11px] mt-1 px-1";

    return (
    <div className="w-full flex flex-col items-center mt-2 pb-3.5">
        <h5 className={`text-[18px] font-semibold ${textColor}`}>{titulo}</h5>
        {error != "" && <span className="text-red-600 text-[11px] mt-1 px-1 mb-3" >{error}</span>}
        <div className="w-full flex flex-col gap-y-3.5">
        
        <div className="w-full flex flex-col justify-center items-center my-2.5">
          <InputModificado error={!!errores?.numeroTarjeta} borderCol={borderCol} errorLabel={errores?.numeroTarjeta || ""} borderColError={borderColError} modoNumerico={true} label={"Número de tarjeta"} labelColor={textColor} handler={handleNumeroChange} borderColorSelect={borderColorSelect} placeHolder={"1234 5678 9012 3456"} value={numeroCFormateado} name={"membresia"} backGraundInput={backGraundInput}/>
        </div>

        {/* Fecha de expiración */}
        <div className={`${inputContainerClass} ${errores?.fecha ? borderColError : borderCol}`}>
            <div className={`flex flex-col items-start w-full ${backGraundInput != "" ? backGraundInput : ""}`}>
                <span className={`text-[12px] ${textColor} ml-2`}>Fecha de expiración de Tarjeta</span>
                <div className="flex items-center mt-1 pl-1.5 gap gap-x-0.5">
                    <input
                        autoComplete="off"
                        type="number"
                        placeholder="MM"
                        min="1"
                        max="12"
                        maxLength={2}
                        value={mesVencimiento}
                        onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 2) {
                            setMesVencimiento(value);
                            if (value.length === 2) {
                            document.getElementById("anioInput")?.focus();
                            }
                        }
                        }}
                        className="w-[16%] text-[15px] focus:outline-none font-semibold px-2 py-1"
                    />
                    <span className="text-[17px] font-semibold">/</span>
                    <input
                        id="anioInput"
                        autoComplete="off"
                        type="number"
                        placeholder="YYYY"
                        maxLength={4}
                        value={anioVencimiento}
                        onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 4) {
                            setAnioVencimiento(value);
                        }
                        }}
                        className="w-[35%] text-[15px] focus:outline-none font-semibold  px-2 py-1"
                    />
                </div>
                {errores.fecha && <span className={errorTextClass}>{errores.fecha}</span>}
            </div>
        </div>


        {/* CVV */}
        <div className="w-full flex flex-col justify-center items-center my-2.5">
            <InputModificado error={!!errores?.cvv} errorLabel={errores?.cvv || ""} borderCol={borderCol} borderColError={borderColError} modoNumerico={true} label={"Código de seguridad (CVV)"} labelColor={textColor} handler={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} borderColorSelect={borderColorSelect} placeHolder={"123"} value={cvv} name={"membresiaCodigo"} backGraundInput={backGraundInput}/>
        </div>

        <button
            className={`${estiloBtnContinuar}`}
            onClick={handleSubmit}
        >
            {labelBtnContinuar}
        </button>
        </div>
    </div>
    );
}

export {Tarjeta}