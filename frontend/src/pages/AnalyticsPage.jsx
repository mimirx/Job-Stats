import { useEffect, useState } from "react"
import api from "../api/api"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js"
import { Doughnut, Bar } from "react-chartjs-2"

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
)

function AnalyticsPage() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications")
                setApplications(response.data)
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load analytics")
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const applied = applications.filter(app => app.status === "Applied").length
    const interviews = applications.filter(app => app.status === "Interview").length
    const offers = applications.filter(app => app.status === "Offer").length
    const rejected = applications.filter(app => app.status === "Rejected").length

    const doughnutData = {
        labels: ["Applied", "Interview", "Offer", "Rejected"],
        datasets: [
            {
                data: [applied, interviews, offers, rejected],
                backgroundColor: [
                    "#3b82f6",
                    "#f59e0b",
                    "#22c55e",
                    "#ef4444"
                ],
                borderColor: "#1f2937",
                borderWidth: 2
            }
        ]
    }

    const barData = {
        labels: ["Applied", "Interview", "Offer", "Rejected"],
        datasets: [
            {
                label: "Applications by Status",
                data: [applied, interviews, offers, rejected],
                backgroundColor: [
                    "#3b82f6",
                    "#f59e0b",
                    "#22c55e",
                    "#ef4444"
                ],
                borderRadius: 8
            }
        ]
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#f9fafb",
                    font: {
                        size: 13
                    }
                }
            }
        }
    }

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#f9fafb"
                },
                grid: {
                    color: "rgba(255,255,255,0.08)"
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#f9fafb",
                    stepSize: 1
                },
                grid: {
                    color: "rgba(255,255,255,0.08)"
                }
            }
        }
    }

    if (loading) {
        return (
            <div className="pageContainer">
                <h1>Analytics</h1>
                <p>Loading analytics...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pageContainer">
                <h1>Analytics</h1>
                <p className="errorText">{error}</p>
            </div>
        )
    }

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1>Analytics</h1>
                <p>Visual breakdown of your application progress.</p>
            </div>

            <div className="chartsGrid">
                <div className="chartCard">
                    <h2>Status Breakdown</h2>
                    <div className="chartWrapper">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>

                <div className="chartCard">
                    <h2>Status Comparison</h2>
                    <div className="chartWrapper">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsPage