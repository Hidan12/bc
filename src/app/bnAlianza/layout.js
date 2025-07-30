'use client'
import './alianza.css'

import ReduxProvider from '@/redux/ReduxProvider'

const Header = ()=>{
  return(
    <header className='w-full flex items-center border-b-1 border-b-gray-300'>
      <div className='flex items-center ml-3'>
        <img className='w-[30%] h-[10vh] object-contain' src='./assets/alianza/alianza1.png' />
        <img className='w-[40%] h-[49.5px] object-contain' src='./assets/alianza/alianza2.png'/>
      </div>
    </header>
  )
}


export default function RootLayout({ children }) {
   return (
    <html>
      <body>
        <ReduxProvider>
          <Header/>
          <main>{children}</main>
          <footer/>
        </ReduxProvider>
      </body>
    </html>
  )
}