'use client'

import { useState, useRef } from 'react'
import { supabase } from './supabase'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function Home() {
  const [curp, setCurp] = useState('')
  const [resultado, setResultado] = useState<any>(null)

  const pdfRef = useRef<HTMLDivElement>(null)

  const buscar = async () => {
    if (!curp.trim()) {
      alert('Ingresa tu CURP')
      return
    }

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('curp', curp.trim())

    if (error) {
      alert('Error al consultar')
      return
    }

    if (data && data.length > 0) {
      setResultado(data[0])
    } else {
      alert('Cliente no encontrado')
      setResultado(null)
    }
  }

  const generarPDF = async () => {
    if (!pdfRef.current) return

    const canvas = await html2canvas(pdfRef.current)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    const width = 190
    const height = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, 'PNG', 10, 10, width, height)
    pdf.save('constancia.pdf')
  }

  const generarFolio = () => {
    const fecha = new Date()
    return `MX-${fecha.getFullYear()}-${Math.floor(Math.random() * 100000)}`
  }

  const folio = generarFolio()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >

      {/* HEADER */}
      <header
        style={{
          backgroundColor: '#611232',
          padding: '14px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <img src="/logo.png" style={{ height: '40px' }} />

        <nav style={{ display: 'flex', gap: '30px', fontSize: '14px' }}>
          <span>Trámites</span>
          <span>Gobierno</span>
          <span>Datos</span>
          <span>Iniciar sesión</span>
        </nav>
      </header>

      {/* LINEA DORADA */}
      <div style={{ height: '3px', backgroundColor: '#b38e5d' }} />

      {/* HERO */}
      <section
        style={{
          background: '#7a1736',
          color: 'white',
          padding: '120px 20px',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 700,
            marginBottom: '15px'
          }}
        >
          Consulta de registros
        </h1>

        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Consulta tu información registrada en el sistema
        </p>

        {/* BUSCADOR */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <div
            style={{
              display: 'flex',
              width: '650px',
              backgroundColor: 'white',
              borderRadius: '50px',
              overflow: 'hidden'
            }}
          >
            <input
              type="text"
              placeholder="Ejemplo: ABCD123456HDFXXX00"
              value={curp}
              onChange={(e) => setCurp(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                padding: '18px 25px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: '#000'
              }}
            />

            <button
              onClick={buscar}
              style={{
                padding: '18px 30px',
                backgroundColor: '#b38e5d',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* RESULTADO */}
      <section
        style={{
          backgroundColor: '#f2f2f2',
          padding: '50px',
          display: 'flex',
          justifyContent: 'center',
          flex: 1
        }}
      >
        {resultado && (
          <div style={{ textAlign: 'center' }}>

            <div
              ref={pdfRef}
              style={{
                backgroundColor: 'white',
                padding: '40px',
                width: '500px',
                borderRadius: '8px',
                textAlign: 'left',
                color: '#000',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <img src="/logo.png" style={{ height: '55px' }} />
              </div>

              <h2 style={{ textAlign: 'center', color: '#611232' }}>
                CONSTANCIA DE REGISTRO
              </h2>

              <hr />

              <p><strong>Folio:</strong> {folio}</p>
              <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>

              <br />

              <p><strong>Nombre:</strong> {resultado.nombre}</p>
              <p><strong>CURP:</strong> {resultado.curp}</p>
              <p><strong>Concepto:</strong> {resultado.concepto}</p>
              <p><strong>Status:</strong> {resultado.status}</p>
              <p><strong>Aportación:</strong> ${Number(resultado.aportacion || 0).toLocaleString()}</p>
              <p><strong>Cantidad a recibir:</strong>
                ${Number(resultado.cantidad_recibir || 0).toLocaleString()}
              </p>

              <br />

              <p style={{ fontSize: '12px', color: '#555' }}>
                Documento oficial generado automáticamente por el sistema.
              </p>
            </div>

            <button
              onClick={generarPDF}
              style={{
                marginTop: '25px',
                padding: '14px 24px',
                backgroundColor: '#611232',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Descargar PDF
            </button>

          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: '#611232',
          color: 'white',
          textAlign: 'center',
          padding: '18px',
          fontSize: '13px'
        }}
      >
        Gobierno de México · 2026
      </footer>

    </div>
  )
}