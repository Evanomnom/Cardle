export const StatisticBox = ({ stat, value }) => {

    return (
        <div className="flex flex-col items-center justify-center align-center text-center">
            <div className="text-5xl">{value}</div>
            <div className="text-sm">{stat}</div>
        </div>
    )
}