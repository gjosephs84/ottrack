const MITCard = ({cardTitle, cardBody, minWidth, maxWidth}) => {
    let minCardWidth = "250px";
    let maxCardWidth = "300px";
    if (minWidth != null) {
        minCardWidth = minWidth;
    }
    if (maxWidth != null) {
        maxCardWidth = maxWidth;
    }
    return (
        <div className="centered">
            <div className="form-card"
                style={{minWidth: minCardWidth, maxWidth: maxCardWidth}}>
                <div className="form-card-header">
                    <h2 style={{textAlign: "center"}}>{cardTitle}</h2>
                </div>
                <div className="form-card-body">
                    {cardBody}
                </div>
            </div>
        </div>
    )
};

export default MITCard;