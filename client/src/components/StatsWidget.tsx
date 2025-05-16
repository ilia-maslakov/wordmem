import React from "react"

type StatsWidgetProps = {
    correct: number
    total: number
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ correct, total }) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">📊 Статистика</h2>
            <div className="text-lg text-gray-600">Всего попыток: <span className="font-semibold">{total}</span></div>
            <div className="text-lg text-gray-600">Правильных: <span className="font-semibold text-green-600">{correct}</span></div>
            <div className="text-lg text-gray-600">Процент: <span className="font-semibold text-blue-600">{percent}%</span></div>
        </div>
    )
}
