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
    const total = applications.length

    const chartColors = {
        applied: "#3b82f6",
        interview: "#f59e0b",
        offer: "#22c55e",
        rejected: "#ef4444"
    }

    const doughnutData = {
        labels: ["Applied", "Interview", "Offer", "Rejected"],
        datasets: [
            {
                data: [applied, interviews, offers, rejected],
                backgroundColor: [
                    chartColors.applied,
                    chartColors.interview,
                    chartColors.offer,
                    chartColors.rejected
                ],
                borderColor: "#1f2937",
                borderWidth: 3,
                cutout: "52%"
            }
        ]
    }

    const barData = {
        labels: ["Applied", "Interview", "Offer", "Rejected"],
        datasets: [
            {
                data: [applied, interviews, offers, rejected],
                backgroundColor: [
                    chartColors.applied,
                    chartColors.interview,
                    chartColors.offer,
                    chartColors.rejected
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
                position: "top",
                labels: {
                    color: "#f9fafb",
                    font: {
                        size: 13
                    },
                    boxWidth: 18
                }
            },
            tooltip: {
                callbacks: {
                    label: context => `${context.label}: ${context.raw}`
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
            },
            tooltip: {
                callbacks: {
                    label: context => `Count: ${context.raw}`
                }
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
                <div className="pageHeader">
                    <h1>Analytics</h1>
                    <p>Loading analytics...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pageContainer">
                <div className="pageHeader">
                    <h1>Analytics</h1>
                    <p className="errorText">{error}</p>
                </div>
            </div>
        )
    }

    if (total === 0) {
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

    return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1>Analytics</h1>
                <p>Visual breakdown of your application progress.</p>
            </div>

            <div className="analyticsSummaryGrid">
                <div className="analyticsMiniCard">
                    <span>Total</span>
                    <strong>{total}</strong>
                </div>
                <div className="analyticsMiniCard">
                    <span>Applied</span>
                    <strong>{applied}</strong>
                </div>
                <div className="analyticsMiniCard">
                    <span>Interview</span>
                    <strong>{interviews}</strong>
                </div>
                <div className="analyticsMiniCard">
                    <span>Offer</span>
                    <strong>{offers}</strong>
                </div>
                <div className="analyticsMiniCard">
                    <span>Rejected</span>
                    <strong>{rejected}</strong>
                </div>
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