const ConfirmBox = 
    ({
    header, message, handleYes, buttonYes, setConfirm, buttonNo
    }) => {
    return (
        <div className="blur-out">
            <div className="confirm-box">
                <h4>{header}</h4>
                <p>{message}</p>
                <button 
                    className="button-full"
                    onClick={handleYes}
                    >{buttonYes}</button>
                <br/>
                <br/>
                <button 
                    className="button-full"
                    onClick={() => {setConfirm(false)}}
                    >{buttonNo}</button>
            </div>
        </div>
    )

}

export default ConfirmBox