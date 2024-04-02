export default interface Coupon {
    id?: string,
    title: string,
    is_enabled: number,
    percent: number,
    due_date: EpochTimeStamp | DOMHighResTimeStamp, // 有效期限
    code: string
}