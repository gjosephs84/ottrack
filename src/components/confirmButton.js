const ConfirmButton = ({onClick}) => {
    return (
        <div className="confirm-button" onClick={onClick}>
            <p className="confirm-check">✓</p>
        </div>
    )
}

export default ConfirmButton;