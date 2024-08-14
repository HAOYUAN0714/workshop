import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from "lucide-react"
import { useEffect } from "react"

interface pageSetProps {
    currentPage: number,
    totalPages: number,
    showPageNum?: number,
    handlePageChange: (page: number) => void,
}

export default function PageSet({
    currentPage = 1, // 當前頁碼
    totalPages = 1, // 總頁數
    showPageNum = 5, // 顯示頁碼數量
    handlePageChange,
}: pageSetProps) {
    const [totalPageArray, setTotalPageArray] = useState([1]); // 總頁碼陣列
    const [showPageArray, setShowPageArray] = useState([1]); // 頁碼陣列
    const [nextActive, setNextActive] = useState(false); // 點擊下一頁是否有效
    const [previousActive, setPreviousActive] = useState(false); // 點擊上一頁是否有效
    const [showPageArrow, setShowPageArrow] = useState(false); // 顯示前後頁按鈕 [上一頁 , 下一頁
    const [hasEllipsis, setHasEllipsis] = useState(false); // 顯示後續是否有更多分頁 ...

    // 更新顯示頁碼陣列
    const upadteShowPageArray = () => {
        let showPageList = [];

        switch (true) {
            case totalPages - showPageNum <= 0: // 如果總頁數小於等於顯示頁數 , 直接顯示全部頁數
                showPageList = totalPageArray.filter(page => page);
                break;
            case currentPage > totalPages - showPageNum: // 如果目前頁數在倒數剩餘的顯示頁數內 , page 就等於剩餘的頁數內的頁數
                showPageList = totalPageArray.filter(page => page > totalPages - showPageNum);
                break;
            default: // 當前頁面的顯示區段數 , 例如當顯示頁數為 5 時 ,  1-5 (1) , 6-10 (2) , 11 - 15 (3)
                const curRangeIndex = Math.ceil(currentPage / showPageNum); 
                showPageList = totalPageArray.filter(page => page <= curRangeIndex * showPageNum && page > (curRangeIndex - 1) * showPageNum)
                break;
        }

        setShowPageArray(showPageList);
    }

    useEffect(() => {
        setTotalPageArray(Array.from({ length: totalPages }, (_, i) => i + 1));
        setShowPageArrow(totalPages > showPageNum);
    }, [totalPages])

    useEffect(() => {
        upadteShowPageArray();
        setPreviousActive(currentPage !== 1 && totalPages > 1 && totalPages > showPageNum)
        setNextActive(currentPage !== totalPages && totalPages > 1 && totalPages > showPageNum)
        setHasEllipsis(totalPages - showPageArray.length > 0 && totalPages !== currentPage)
    }, [currentPage, totalPageArray])

    useEffect(() => {
        setHasEllipsis(totalPages - showPageArray.length > 0 && totalPages !== currentPage)
    }, [showPageArray])

    return (
        <Pagination>
            { showPageArrow && <PaginationContent>
                {<>
                    {/* 跳到首頁  */}
                    <PaginationItem onClick={() => handlePageChange(1)}>
                        <PaginationLink isDisabled={!previousActive}>
                            <ChevronFirst />
                        </PaginationLink>
                    </PaginationItem>
                    {/* 跳到前頁 */}
                    <PaginationItem onClick={() => handlePageChange(currentPage - 1)}>
                        <PaginationLink isDisabled={!previousActive}>
                            <ChevronLeft />
                        </PaginationLink>
                    </PaginationItem>
                </>}
            </PaginationContent>}
            <PaginationContent>
                {/* 分頁 */}
                {showPageArray.map(page => {
                    return (
                        <PaginationItem key={page} onClick={() => handlePageChange(page)}>
                            <PaginationLink isActive={currentPage === page}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}
            </PaginationContent>
            {showPageArrow && <PaginationContent>
                { hasEllipsis &&  <PaginationItem> <PaginationEllipsis /> </PaginationItem> }
                {<>
                    {/* 跳到下頁  */}
                    <PaginationItem onClick={() => handlePageChange(currentPage + 1)}>
                        <PaginationLink isDisabled={!nextActive}>
                            <ChevronRight />
                        </PaginationLink>
                    </PaginationItem>
                    {/* 跳到尾頁  */}
                    <PaginationItem onClick={() => handlePageChange(totalPages)}>
                        <PaginationLink isDisabled={!nextActive}>
                            <ChevronLast />
                        </PaginationLink>
                    </PaginationItem>
                </>}
            </PaginationContent>}
        </Pagination>
    )

}