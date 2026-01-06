
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage/HomePage'
import ListIngredientesPage from './pages/listPages/ListIngredientesPage'
import ListProdutosPage from './pages/listPages/ListProdutosPage'
import ListPedidosPage from './pages/listPages/ListPedidosPage'


function App() {


  return (
    
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path='/pedidos' element={<ListPedidosPage />}/>
        <Route path='produtos' element={<ListProdutosPage />}/>
        <Route path="/ingredientes" element={<ListIngredientesPage />}/>
        <Route path="/home" element={<HomePage />}/>

      </Routes>
   
    
  )
}

export default App
