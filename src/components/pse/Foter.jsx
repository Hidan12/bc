export default function Footer (){
  return(
    <footer className='w-full flex flex-col justify-center items-center border-t-1 border-t-gray-300'>
      <div className='w-[90%] flex rounded-lg mt-3'>
        <div className='p-3 rounded-l-lg  bg-amber-400'></div>
        <div className='w-[95%] bg-[#D9D9D966] pb-4 flex rounded-r-lg shadow-lg'>
          <div className='w-[25%] mt-3 flex flex-col items-center justify-center'>
            <img className='w-8 h-8 object-contain' src='/assets/pse/psefooterD.svg'/>
            <div className='w-full flex items-center mt-4'>
              <img className='w-2 h-2 object-contain ml-1' src='/assets/pse/pseMobile.svg' />
              <span className='text-[10px] ml-1.5'>En Bogotá:</span>
            </div>
            <div className='w-full flex items-center mt-0.5'>
              <img className='w-2 h-2 object-contain ml-1' src='/assets/pse/pseconta.svg' />
              <span className='text-[10px] ml-1.5'>Contáctanos:</span>
            </div>
          </div>
          <div className='w-[75%] mt-3 flex flex-col'>
            <span className='text-[13px] font-bold'>Para mayor información</span>
            <span className='text-[13px] font-bold'>comunícate con nosotros:</span>
            <span className='text-[10px] mt-2 ml-1'>+57 (601) 3808890 opción 5</span>
            <span className='text-[10px] mt-1 ml-1'>https://www.pse.com.co/persona-centro-de-ayuda</span>
          </div>
        </div>
      </div>

      <div className='mt-4  w-[90%]'>
        <img className='w-[30%] object-cover' src='/assets/pse/pseFooter.svg'/>
      </div>

    </footer>
  )
}