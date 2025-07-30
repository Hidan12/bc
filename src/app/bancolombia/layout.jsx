export default function Layout({ children }) {
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