
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/homePage/HomePage'
import ListProdutosPage from './pages/ListProdutosPage'
import ProdutoPage from './pages/ProdutoPage'
import ListIngredientesPage from './pages/ListIngredientesPage'


function App() {


  return (
    
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/produto/:id" element={<ProdutoPage />}/>
        <Route path='produtos' element={<ListProdutosPage />}/>
        <Route path="/ingredientes" element={<ListIngredientesPage />}/>
        <Route path="/home" element={<HomePage />}/>

      </Routes>
   
    
  )
}

export default App
