import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrors(error: any) {
  if (error.name === "ZodError") {
    // handle zod error
    const errors = error.issues || error.errors || [];
    const fieldErrors = Object.keys(errors).map(
      (field) => errors[field].message,
    );
    return fieldErrors.length > 0 ? fieldErrors.join(". ") : error.message;
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // handle prisma error
    const target = error.meta?.target;
    let field = "Field";

    if (Array.isArray(target) && target.length > 0) {
      field = target[0];
    } else if (typeof target === "string") {
      field = target.split("_")[1] || target;
    } else if (typeof error.message === "string") {
      const match = error.message.match(/fields?: \(`(.*?)`\)/);
      if (match && match[1]) {
        field = match[1];
      }
    }

    const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
    return `${formattedField} already exists`;
  } else {
    // handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

// convert prisma obj to typescript object

// currency formatter
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

// format currency using above formatter
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return currencyFormatter.format(amount);
  } else if (typeof amount === "string") {
    return currencyFormatter.format(Number(amount));
  } else {
    return NaN;
  }
}

// shorten uuid
export function formatId(id: string) {
  return `...${id.substring(id.length - 6)}`;
}

// format date and time
export function formatDate(dateString: Date) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-IN",
    dateTimeOptions,
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-IN",
    dateOptions,
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-IN",
    timeOptions,
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
}

// form the pagination links
export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const query = qs.parse(params);
  query[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    },
  );
};
