import React from "react";
import "../../assets/MenuIconCircle";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";

const navItems: Array<{ label: string; icon: string; route: string }> = [
    
     { label: "Home", icon: "🏠", route: "/" },
     { label: "Produtos", icon: "🍔", route: "/produtos" },
     { label: "Ingredientes", icon: "🥬", route: "/ingredientes" },
];

const SideBar: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="inner">
                <header>
                    <button onClick={() => setIsOpen(!isOpen)}><span>{isOpen ? "X" : "☰"}</span></button>           
                </header>
                <nav>{navItems.map(item => (
                    <button key={item.icon} type="button" onClick={() => { navigate(item.route); setIsOpen(false); }}>
                        <span className="material...">{item.icon}</span>
                        <p>{item.label}</p>
                        
                    </button>
                ))}</nav>
            </div>
        </aside>    
    );
};

export default SideBar;
{/*☰*/}