export function exportApplicationsToCsv(applications) {
    const headers = ["Company", "Position", "Location", "Salary", "Status", "Date Applied", "Notes"]

    const rows = applications.map(app => [
        app.company,
        app.position,
        app.location || "",
        app.salary || "",
        app.status,
        app.date_applied ? app.date_applied.slice(0, 10) : "",
        app.notes ? app.notes.replace(/"/g, '""') : ""
    ])

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
}
