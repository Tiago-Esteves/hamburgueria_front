import React, { useState } from "react";
import * as ingredienteService from "../services/ingredientService";
import type { Ingrediente } from "../services/ingredienteService";


const TelaIngrediente: React.FC = () => {
  const [ingrediente, setIngrediente] = useState<Ingrediente | null>(null);

  return (
    <div>
      <form action="">
        <input type="text" />
        <input type="text" value={"valor"}/>
      </form>
    </div>
  );
};

export default TelaIngrediente;