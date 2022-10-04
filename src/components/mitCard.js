const MITCard = ({cardTitle, cardBody}) => {
    return (
        <div className="centered">
            <div className="form-card">
                <div className="form-card-header">
                    <h2>{cardTitle}</h2>
                </div>
                <div className="form-card-body">
                    {cardBody}
                </div>
            </div>
        </div>
    )
};

export default MITCard;