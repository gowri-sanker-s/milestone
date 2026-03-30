"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { funnel } from "@/lib/fonts";
type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};
const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: string) => {
    const pageValue = btnType === "prev" ? Number(page) - 1 : Number(page) + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl);
  };
  return (
    <div
      className={`flex gap-3 items-center justify-end my-3 ${funnel.className}`}
    >
      <button
        className="px-4 py-2 bg-primary-border rounded-full min-w-[90px] text-[15px] font-semibold flex gap-3 items-center justify-between disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed hover:bg-primary-text hover:text-primary-bg transition-all duration-300 shadow-xs border border-primary-text/10"
        onClick={() => handleClick("prev")}
        disabled={Number(page) <= 1}
      >
        <span>
          <ArrowLeft size={15} strokeWidth={1.5} />
        </span>
        Previous
      </button>
      <button
        className="px-4 py-2 bg-primary-border rounded-full min-w-[90px] text-[15px] font-semibold flex gap-3 items-center justify-between disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed hover:bg-primary-text hover:text-primary-bg transition-all duration-300 shadow-xs border border-primary-text/10"
        onClick={() => handleClick("next")}
        disabled={Number(page) === totalPages}
      >
        Next
        <span>
          <ArrowRight size={15} strokeWidth={1.5} />
        </span>
      </button>
    </div>
  );
};

export default Pagination;
