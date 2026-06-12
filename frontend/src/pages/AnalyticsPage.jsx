import { useEffect, useState } from "react"
import api from "../api/api"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
} from "chart.js"
import { Doughnut, Bar, Line } from "react-chartjs-2"

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
)

const chartColors = {
    applied: "#b79a72",
    interview: "#c89a4b",
    offer: "#7b8b6a",
    rejected: "#b56b5c"
}

function AnalyticsPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        api.get("/stats")
            .then(res => setStats(res.data))
            .catch(err => setError(err.response?.data?.error || "Failed to load analytics"))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="pageContainer">
                <div className="pageHeader"><h1>Analytics</h1><p>Loading analytics...</p></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pageContainer">
                <div className="pageHeader"><h1>Analytics</h1><p className="errorText">{error}</p></div>
            </div>
        )
    }

    if (!stats || stats.total === 0) {
        return (
            <div className="pageContainer">
                <div className="pageHeader">
                    <h1>Analytics</h1>
                    <p>Visual breakdown of your application progress.</p>
                </div>
                <div className="emptyAnalyticsCard">
                    <h2>No analytics yet</h2>
                    <p>Add some applications first and your charts will appear here.</p>
                </div>
            </div>
        )
    }

    const { total, breakdown, responseRate, weeklyTrend, avgSalary } = stats

    const doughnutData = {
        labels: ["Applied", "Interviews", "Offers", "Rejected"],
        datasets: [{
            data: [breakdown.Applied, breakdown.Interview, breakdown.Offer, breakdown.Rejected],
            backgroundColor: [chartColors.applied, chartColors.interview, chartColors.offer, chartColors.rejected],
            borderColor: "#faf6ef",
            borderWidth: 3,
            cutout: "55%"
        }]
    }

    const barData = {
        labels: ["Applied", "Interviews", "Offers", "Rejected"],
        datasets: [{
            data: [breakdown.Applied, breakdown.Interview, breakdown.Offer, breakdown.Rejected],
            backgroundColor: [chartColors.applied, chartColors.interview, chartColors.offer, chartColors.rejected],
            borderRadius: 8
        }]
    }

    const lineData = {
        labels: weeklyTrend.map(w => {
            const d = new Date(w.week)
            return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`
        }),
        datasets: [{
            label: "Applications",
            data: weeklyTrend.map(w => w.count),
            borderColor: "#a88c68",
            backgroundColor: "rgba(168, 140, 104, 0.12)",
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#a88c68",
            pointRadius: 4
        }]
    }

    const sharedAxisStyles = {
        ticks: { color: "#3b2f2a", font: { weight: 600 } },
        grid: { color: "rgba(90, 70, 45, 0.08)" }
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top", labels: { color: "#3b2f2a", font: { size: 13, weight: 600 }, boxWidth: 18 } },
            tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}` } }
        }
    }

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `Count: ${ctx.raw}` } } },
        scales: { x: sharedAxisStyles, y: { ...sharedAxisStyles, beginAtZero: true, ticks: { ...sharedAxisStyles.ticks, stepSize: 1 } } }
    }

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.raw} application${ctx.raw !== 1 ? "s" : ""}` } } },
        scales: { x: sharedAxisStyles, y: { ...sharedAxisStyles, beginAtZero: true, ticks: { ...sharedAxisStyles.ticks, stepSize: 1 } } }
    }

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1>Analytics</h1>
                <p>Visual breakdown of your application progress.</p>
            </div>

            <div className="statsGrid">
                <div className="statCard"><h3>Total Applications</h3><p>{total}</p></div>
                <div className="statCard"><h3>Interviews</h3><p>{breakdown.Interview}</p></div>
                <div className="statCard"><h3>Offers</h3><p>{breakdown.Offer}</p></div>
                <div className="statCard"><h3>Response Rate</h3><p>{responseRate}%</p></div>
                {avgSalary && <div className="statCard"><h3>Avg Salary</h3><p>${Number(avgSalary).toLocaleString()}</p></div>}
            </div>

            <div className="chartsGrid">
                <div className="chartCard">
                    <h2>Status Breakdown</h2>
                    <div className="chartWrapper"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
                </div>

                <div className="chartCard">
                    <h2>Status Comparison</h2>
                    <div className="chartWrapper"><Bar data={barData} options={barOptions} /></div>
                </div>

                {weeklyTrend.length > 1 && (
                    <div className="chartCard chartCardWide">
                        <h2>Applications Over Time</h2>
                        <div className="chartWrapper"><Line data={lineData} options={lineOptions} /></div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnalyticsPage
