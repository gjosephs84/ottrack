import React from "react";

const MenuButton = ({ text, show, setShow}) => {
    const [selected, setSelected] = React.useState("menu-button-unselected");
    const handleSelect = () => {
        if (selected == "menu-button-unselected") {
            setSelected("menu-button-selected")
        } else {
            setSelected("menu-button-unselected")
        };
        setShow(!show);
    }
    return (
        <div
            className={selected}
            onClick={handleSelect}
        >{text}</div>
    )
}

const ButtonMenu = ({menuOptions}) => {
    const options = [];
    for (let i=0; i<menuOptions.length; i++) {
        const { text, show, setShow } = menuOptions[i];
        const optionWithClass = {
            text: text,
            show: show,
            setShow: setShow
        };
        options.push(optionWithClass);
    };
    
    


    return (
        <div className="admin-menu">
            {options.map((menuOption) => {
                return (
                    <MenuButton 
                        key={menuOption.text}
                        text={menuOption.text}
                        show={menuOption.show} 
                        setShow={menuOption.setShow}
                    />
                )
            })}
        </div>
    )

}

export default ButtonMenu;