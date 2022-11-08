/*

    ----- CONFIRMBOX COMPONENT -----

    The purpose of this component is to standardize a confirmation alert
    for certain actions that occur before PUT/POST requests to the API.

    The output is a div against a full-screen blurred background with two
    button uptions—YES to confirm the action, or NO to clear the alert and
    allow the user to alter their choices before continuing.

    ConfirmBox takes the following props:

        header: A string to use as the alert header/title
        message: A string to show what the alert should say
        handleYes: The callback function to do whatever needs to be confirmed
        buttonYes: A string representing the text of the yes button
        setConfirm: The setState of the variable that toggles whether ConfirmBox shows or not
        buttonNo: A string representing the text of the no button

*/

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