"use client"

const ClientComponent = ()=>{
    console.log(`Client: ${process.env.CUP}`)
    console.log(`Client: ${process.env.FOO}`)
    console.log(`Client: ${process.env.NEXT_PUBLIC_USER_AUTHOR}`)
    return <></>
}

export default ClientComponent