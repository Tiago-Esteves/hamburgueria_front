import React from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import "./HeaderComponent.css";


const HeaderComponent: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

    return (
        <header className="home-header">
            <div className="brand">
                <div className="logo"><button onClick={() => navigate("/")}>🍔</button></div>
                <div><h1>Burguinho</h1></div>
                <div className="logo"><SideBar isOpen={isOpen} setIsOpen={setIsOpen} /></div>
                

                     
            </div>
        </header>

    );
};

export default HeaderComponent;
/*☰*/