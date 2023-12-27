const STABILITY_THRESHOLD = .03;

const OutlookCard = ({ data }) => {
    let scoreValue = Math.round(parseFloat(data.score));
    let score = `Selectivity Score: ${scoreValue}%`;

    let totalChange = data.students_change;
    let stabilityStatus = `Stable over time (growth/decline within ±${100*STABILITY_THRESHOLD}% threshold)`;

    if (totalChange > STABILITY_THRESHOLD) {
        stabilityStatus = 'Strong prospects: this school will easily grow';
    } else if (totalChange < -STABILITY_THRESHOLD) {
        stabilityStatus = (
            <div>
            Higher risk of financial difficulty, with a greater potential for:
            <ul style={{ marginLeft: '20px'  }}>
                <li>Removal of certain programs/majors</li>
                <li>Becoming less selective</li>
                <li>Charging higher tuition</li>
                <li>Merging with other instutions or even closing</li>
            </ul>
            </div>
        );
    }
  
    return (
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#333' }}>University Outlook</h2>
        <p style={{ color: '#555' }}>{stabilityStatus}</p>
        <p style={{ color: '#555' }}>{score}</p>
        </div>
    );
  };
  
  export default OutlookCard;
  