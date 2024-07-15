import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"

export default function AdminProducts() {
    const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
    ]

    return (
        <div id="admin-products" className="flex flex-col px-4 h-full">
            <h2 className="flex flex-none items-center border-b-2 border-b-border  h-16 text-2xl">
                產品列表
            </h2>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-none h-16 items-center">
                    <button className="ml-auto py-2 px-4 rounded bg-confirm hover:brightness-110 text-confirm-foreground font-bold">
                        建立新商品
                    </button>
                </div>
                <div className="flex flex-1">
                    <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">分類</TableHead>
                        <TableHead>名稱</TableHead>
                        <TableHead>售價</TableHead>
                        <TableHead>啟用狀態</TableHead>
                        <TableHead className="text-right">編輯</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                        <TableRow key={invoice.invoice}>
                            <TableCell className="font-medium">{invoice.invoice}</TableCell>
                            <TableCell>{invoice.paymentStatus}</TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
}
