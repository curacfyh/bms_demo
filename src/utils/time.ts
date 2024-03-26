// 判断时间是早上、上午、中午、下午、晚上
export const getDayPeriod = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 9) {
        return '早上'
    } else if (hour >= 9 && hour < 12) {
        return '上午'
    } else if (hour >= 12 && hour < 14) {
        return '中午'
    } else if (hour >= 14 && hour < 18) {
        return '下午'
    } else {
        return '晚上'
    }
}
