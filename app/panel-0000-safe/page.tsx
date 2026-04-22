'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Admin() {

const [autenticado,setAutenticado]=useState(false)
const [usuario,setUsuario]=useState('')
const [password,setPassword]=useState('')

const [clientes,setClientes]=useState<any[]>([])
const [editandoId,setEditandoId]=useState<number | null>(null)

const [form,setForm]=useState({
nombre:'',
curp:'',
concepto:'',
status:'',
aportacion:'',
cantidad_recibir:''
})

const login=()=>{
if(
usuario===process.env.NEXT_PUBLIC_ADMIN_USER &&
password===process.env.NEXT_PUBLIC_ADMIN_PASS
){
setAutenticado(true)
}else{
alert('Credenciales incorrectas')
}
}

const cargarClientes=async()=>{
const {data}=await supabase
.from('clientes')
.select('*')
.order('id',{ascending:false})

setClientes(data || [])
}

useEffect(()=>{
if(autenticado){
cargarClientes()
}
},[autenticado])

const formatearDinero=(valor:string)=>{
const limpio=valor.replace(/\D/g,'')
return limpio.replace(/\B(?=(\d{3})+(?!\d))/g,',')
}

const guardar=async()=>{

if(!form.nombre || !form.curp){
alert('Nombre y CURP obligatorios')
return
}

const dataFinal={
nombre:form.nombre.trim(),
curp:form.curp.toUpperCase(),
concepto:form.concepto,
status:form.status,
aportacion:Number(form.aportacion.replace(/,/g,'')) || 0,
cantidad_recibir:Number(
form.cantidad_recibir.replace(/,/g,'')
) || 0
}

if(editandoId){

await supabase
.from('clientes')
.update(dataFinal)
.eq('id',editandoId)

alert('Cliente actualizado')
setEditandoId(null)

}else{

await supabase
.from('clientes')
.insert([dataFinal])

alert('Cliente guardado')
}

setForm({
nombre:'',
curp:'',
concepto:'',
status:'',
aportacion:'',
cantidad_recibir:''
})

cargarClientes()
}

const editar=(c:any)=>{
setForm({
nombre:c.nombre,
curp:c.curp,
concepto:c.concepto,
status:c.status,
aportacion:
c.aportacion
? c.aportacion.toString().replace(
/\B(?=(\d{3})+(?!\d))/g,
','
)
:'',
cantidad_recibir:
c.cantidad_recibir
? c.cantidad_recibir.toString().replace(
/\B(?=(\d{3})+(?!\d))/g,
','
)
:''
})

setEditandoId(c.id)
}

const cancelar=()=>{
setEditandoId(null)

setForm({
nombre:'',
curp:'',
concepto:'',
status:'',
aportacion:'',
cantidad_recibir:''
})
}

const eliminar=async(id:number)=>{
if(!confirm('¿Eliminar cliente?')) return

await supabase
.from('clientes')
.delete()
.eq('id',id)

cargarClientes()
}

if(!autenticado){
return(
<div style={bg}>
<div style={card}>
<h2 style={{color:'#222'}}>
Acceso Admin
</h2>

<input
placeholder='Usuario'
onChange={(e)=>setUsuario(e.target.value)}
style={input}
/>

<input
type='password'
placeholder='Contraseña'
onChange={(e)=>setPassword(e.target.value)}
style={input}
/>

<button
onClick={login}
style={btn}
>
Entrar
</button>

</div>
</div>
)
}

return(
<div style={container}>

<h1 style={{color:'#222'}}>
Panel Administrativo
</h1>

<div style={grid}>

<div style={card}>

<h3>
{editandoId
? 'Editar cliente'
: 'Nuevo cliente'}
</h3>

<input
placeholder='Nombre'
value={form.nombre}
onChange={(e)=>
setForm({
...form,
nombre:e.target.value
})
}
style={input}
/>

<input
placeholder='CURP'
value={form.curp}
onChange={(e)=>
setForm({
...form,
curp:e.target.value.toUpperCase()
})
}
style={input}
/>

<input
placeholder='Concepto'
value={form.concepto}
onChange={(e)=>
setForm({
...form,
concepto:e.target.value
})
}
style={input}
/>

<select
value={form.status}
onChange={(e)=>
setForm({
...form,
status:e.target.value
})
}
style={input}
>
<option value=''>
Seleccionar status
</option>

<option value='Pagado'>
Pagado
</option>

<option value='Pendiente'>
Pendiente
</option>

</select>

<label style={label}>
Aportación
</label>

<input
placeholder='Aportación'
value={form.aportacion}
onChange={(e)=>{
const valor=formatearDinero(
e.target.value
)

setForm({
...form,
aportacion:valor
})
}}
style={input}
/>

<label style={label}>
Cantidad a recibir
</label>

<input
placeholder='Cantidad a recibir'
value={form.cantidad_recibir}
onChange={(e)=>{
const valor=formatearDinero(
e.target.value
)

setForm({
...form,
cantidad_recibir:valor
})
}}
style={input}
/>

<button
onClick={guardar}
style={btn}
>
{editandoId
?'Actualizar cliente'
:'Guardar cliente'}
</button>

{editandoId && (
<button
onClick={cancelar}
style={{
...btn,
background:'#777'
}}
>
Cancelar edición
</button>
)}

</div>


<div style={card}>

<h3>
Clientes registrados
</h3>

<table
style={{
width:'100%',
borderCollapse:'collapse'
}}
>

<thead>
<tr>

<th style={th}>
Nombre
</th>

<th style={th}>
CURP
</th>

<th style={th}>
Status
</th>

<th style={th}>
Aportación
</th>

<th style={th}>
Cantidad a recibir
</th>

<th style={th}>
Acciones
</th>

</tr>
</thead>

<tbody>

{clientes.map((c)=>(
<tr key={c.id}>

<td style={td}>
{c.nombre}
</td>

<td style={td}>
{c.curp}
</td>

<td style={td}>
{c.status}
</td>

<td style={td}>
$
{Number(
c.aportacion||0
).toLocaleString()}
</td>

<td style={td}>
$
{Number(
c.cantidad_recibir||0
).toLocaleString()}
</td>

<td style={td}>

<button
onClick={()=>editar(c)}
style={{
...btn,
marginRight:'6px'
}}
>
Editar
</button>

<button
onClick={()=>
eliminar(c.id)
}
style={deleteBtn}
>
Eliminar
</button>

</td>

</tr>
))}

</tbody>
</table>

</div>

</div>
</div>
)
}


const container={
background:'#f4f6f8',
minHeight:'100vh',
padding:'30px'
}

const bg={
height:'100vh',
display:'flex',
justifyContent:'center' as const,
alignItems:'center' as const,
background:'#f4f6f8'
}

const grid={
display:'grid',
gridTemplateColumns:'1fr 2fr',
gap:'20px',
marginTop:'20px'
}

const card={
background:'white',
padding:'20px',
borderRadius:'10px',
boxShadow:'0 5px 15px rgba(0,0,0,.10)',
display:'flex',
flexDirection:'column' as const,
gap:'10px'
}

const label={
fontWeight:'600',
color:'#333'
}

const input={
padding:'10px',
border:'1px solid #ccc',
borderRadius:'6px',
background:'#fff',
color:'#222'
}

const btn={
background:'#611232',
color:'#fff',
border:'none',
padding:'10px',
borderRadius:'6px',
cursor:'pointer'
}

const deleteBtn={
background:'#c62828',
color:'#fff',
border:'none',
padding:'8px',
borderRadius:'4px',
cursor:'pointer'
}

const th={
textAlign:'left' as const,
padding:'10px',
color:'#333'
}

const td={
padding:'10px',
borderTop:'1px solid #eee',
color:'#222'
}