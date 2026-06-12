function Skeleton({ style = {}, className = "" }) {
    return <div className={`skeleton ${className}`} style={style} />
}

export function StatCardSkeleton() {
    return (
        <div className="statCard">
            <Skeleton style={{ width: "55%", height: "0.9rem", marginBottom: "0.85rem" }} />
            <Skeleton style={{ width: "38%", height: "2.2rem", borderRadius: "6px" }} />
        </div>
    )
}

export function ApplicationCardSkeleton() {
    return (
        <div className="applicationCard">
            <div className="applicationCardHeader">
                <Skeleton style={{ width: "42%", height: "1.55rem" }} />
                <div className="cardActions">
                    <Skeleton style={{ width: "58px", height: "36px", borderRadius: "10px" }} />
                    <Skeleton style={{ width: "58px", height: "36px", borderRadius: "10px" }} />
                </div>
            </div>
            {[80, 65, 50, 70].map((w, i) => (
                <Skeleton key={i} style={{ width: `${w}%`, height: "0.95rem", marginBottom: "0.42rem", borderRadius: "4px" }} />
            ))}
        </div>
    )
}

export function TimelineCardSkeleton() {
    return (
        <div className="timelineCard">
            <div className="timelineMarker">
                <Skeleton style={{ width: "82px", height: "26px", borderRadius: "999px" }} />
            </div>
            <div className="timelineContent" style={{ flex: 1 }}>
                <Skeleton style={{ width: "38%", height: "1.45rem", marginBottom: "0.4rem" }} />
                <Skeleton style={{ width: "28%", height: "0.95rem", marginBottom: "0.5rem" }} />
                <Skeleton style={{ width: "52%", height: "0.9rem" }} />
            </div>
        </div>
    )
}

export function ChartCardSkeleton({ wide = false }) {
    return (
        <div className={`chartCard ${wide ? "chartCardWide" : ""}`}>
            <Skeleton style={{ width: "45%", height: "1.9rem", marginBottom: "1rem" }} />
            <Skeleton style={{ height: "280px", borderRadius: "12px" }} />
        </div>
    )
}

export default Skeleton
