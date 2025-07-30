'use client'
import './cajaSocial.css'

export default function RootLayout({ children }) {
   return (
    <html>
      <body>
        <header/>
        <main>{children}</main>
        <footer/>
      </body>
    </html>
  )
}