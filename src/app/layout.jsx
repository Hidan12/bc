import ReduxProvider from "@/redux/ReduxProvider";

export default function RotLayout({ children }) {
   return (
    <html>
      <body>
        <header/>
        <ReduxProvider>
            <main>{children}</main>
        </ReduxProvider>
        <footer/>
      </body>
    </html>
  )
}