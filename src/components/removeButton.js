const RemoveButton = ({onClick}) => {
    return (
        <div className="remove-button" onClick={onClick}>
            <p className="remove-x">X</p>
        </div>
    )
}

export default RemoveButton;