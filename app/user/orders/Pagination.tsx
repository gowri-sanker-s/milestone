"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
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
    <div>
      <button
        className="px-4 py-2 bg-primary-border rounded-md disabled:opacity-70"
        onClick={() => handleClick("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </button>
      <button
        className="px-4 py-2 bg-primary-border rounded-md disabled:opacity-70"
        onClick={() => handleClick("next")}
        disabled={Number(page) === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
