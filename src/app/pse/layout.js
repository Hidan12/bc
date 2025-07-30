import Header from '@/components/pse/Header'
import './pse.css'
import Footer from '@/components/pse/Foter'



export const metadata = {
  title: "PSE",
  description: "Plataforma de pagos PSE",
};


export default function Layout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}