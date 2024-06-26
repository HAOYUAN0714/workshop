export default interface Article {
    author: string,
    create_at: EpochTimeStamp | DOMHighResTimeStamp, 
    description: string,
    content?: string,
    id: string,
    image: string,
    isPublic: Boolean,
    tag: string[], // 文章標籤
    title: string,
    num: number
}