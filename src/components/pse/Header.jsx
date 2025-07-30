export default function Header (){
  return(
    <header className='w-full flex items-center border-b-1 border-b-gray-300'>
      <div className='flex items-center mt-1 w-full'>
        <div className='w-[62%] h-[12.5vh] flex items-center ml-1.5 bg-white'>
            <img className=' w-[20%] object-contain' src='/assets/pse/pse-logo.png' />
            <span className='text-[16px] ml-6 font-sans text-[#065EA6]'>¡Fácil, rápido y seguro!</span>
        </div>
        <img className='w-[38%] h-[12.5vh] object-cover' src='./assets/pse/pseder.svg'/>
      </div>
    </header>
  )
}