import { useState, useEffect } from 'react'
function App() {
  const [cep, setCep] = useState("")
  const [ numero, setNumero] = useState("")
  const[erro, setErro] = useState("")
  const [endereco, setEndereco ] = useState({
    logradouro: "",
    bairro: "",
    uf: "",
    localidade: ""
  })

  async function buscarDados(cepDigitado) {
    try{
      const padrao = /^\d{5}-?\d{3}$/;

      if(!padrao.test(cepDigitado)) {
        console.log("ENTROU NO CEP INVALIDO")
        throw new Error('CEP inválido.')
      }
      const cepUrl = cepDigitado.replace("-", "")
      const resposta = await fetch (`https://viacep.com.br/ws/${cepUrl}/json/`)

      if(!resposta.ok) {
        throw new Error('Erro ao buscar os dados');
      }

      const dados = await resposta.json()

      if (dados.erro) {
        throw new Error("CEP não encontrado")
      }

      console.log("ENTROU NO SUCESSO")
      setEndereco({
        logradouro: dados.logradouro,
        bairro: dados.bairro,
        uf: dados.uf,
        localidade: dados.localidade
      })

      setErro("")
      }

    catch (error) {
      console.log("error:", error)
      console.log("message:", error.message)
      setErro(error.message)
    }
  }

  useEffect(() => {
    if (cep.length === 8 || cep.length === 9){
      buscarDados(cep)
    } else{
      setErro("")
    }

    if (cep.length === 0) {
      setEndereco({
        logradouro: "",
        bairro: "",
        uf: "",
        localidade: ""
      })
    }
  }, [cep])
  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-4 w-full'>
      <h1 className='text-3xl font-bold'> Cadastro de Endereço </h1>
      <form className='w-full max-w-sm bg-white p-8'>
        <div className='mb-4'>
          <input id='cep' type='text' placeholder='CEP' value={cep} onChange={(e) => setCep(e.target.value)} className={erro ? "border rounded p-2 w-full border-red-500 bg-red-50":"border rounded p-2 w-full"} maxLength={9}/>
          {erro ? <p className='text-red-500 mt-2'>  {erro}  </p> : null}
        </div>

        <div className='mb-4'>
          <input id='rua' type="text" placeholder='Rua' value={endereco.logradouro} readOnly className='border rounded p-2 w-full'/>
        </div>

        <div className='mb-4'>
          <input id='numero' type="text" placeholder='Número' value={numero} onChange={(e) => setNumero(e.target.value)} className='border rounded p-2 w-full'/>
        </div>

        <div className='mb-4'>
          <input id='bairro' type="text" placeholder='Bairro' value={endereco.bairro} readOnly className='border rounded p-2 w-full'/>
        </div>

        <div className='mb-4'>
          <input id='estado' type="text" placeholder='Estado' value={endereco.uf} readOnly className='border rounded p-2 w-full'/>
        </div>

        <div className='mb-4'>
          <input id='cidade' type="text" placeholder='Cidade' value={endereco.localidade} readOnly className='border rounded p-2 w-full'/>
        </div>
      </form>
    </main>
  )
}

export default App