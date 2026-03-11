import { Link } from "react-router-dom"

function LandingPage() {
    return (
        <div className="landingPage">
            <div className="landingHero">
                <h1>Job Stats</h1>
                <p className="landingSubtitle">
                    A full-stack job application tracker that helps you organize your search,
                    track statuses, and manage your progress.
                </p>

                <div className="landingButtons">
                    <Link to="/register" className="primaryLandingButton">
                        Create Account
                    </Link>

                    <Link to="/login" className="secondaryLandingButton">
                        Login
                    </Link>
                </div>
            </div>

            <div className="landingFeatures">
                <div className="landingFeatureCard">
                    <h3>Track Applications</h3>
                    <p>Save companies, positions, salaries, dates, and notes in one place.</p>
                </div>

                <div className="landingFeatureCard">
                    <h3>Manage Statuses</h3>
                    <p>Update applications as they move from Applied to Interview, Offer, or Rejected.</p>
                </div>

                <div className="landingFeatureCard">
                    <h3>View Statistics</h3>
                    <p>See your application totals, interview count, offers, and rejections at a glance.</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage