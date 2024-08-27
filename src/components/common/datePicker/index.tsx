import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format, subDays } from "date-fns"

interface dateProps {
    dateTimestamp?: number
    formateString?: string
    selectDateHandler?: (date: number) => void
}

export default function DatePicker({
    dateTimestamp = new Date().getTime(),
    formateString = 'yyyy-MM-dd',
    selectDateHandler = () => {}
}: dateProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        setSelectedDate(new Date(dateTimestamp));
    }, []);

    useEffect(() => {
        selectDateHandler(
            new Date(selectedDate
                ? selectedDate
                : new Date()
            )
            .getTime());
    }, [selectedDate]);
 
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={`w-full pl-3 text-left font-normal`}
                >
                    {   selectedDate
                        ? ( format(selectedDate, formateString))
                        : (<span>選擇日期</span>)
                    }
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    className="z-50"
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                        date < subDays(new Date(), 1)
                    }
                />
            </PopoverContent>
        </Popover>
    )
}