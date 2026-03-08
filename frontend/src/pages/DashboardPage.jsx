function DashboardPage() {
    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1>Dashboard</h1>
                <p>Welcome to Job Stats.</p>
            </div>

            <div className="statsGrid">
                <div className="statCard">
                    <h3>Total Applications</h3>
                    <p>0</p>
                </div>

                <div className="statCard">
                    <h3>Interviews</h3>
                    <p>0</p>
                </div>

                <div className="statCard">
                    <h3>Offers</h3>
                    <p>0</p>
                </div>

                <div className="statCard">
                    <h3>Rejected</h3>
                    <p>0</p>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage