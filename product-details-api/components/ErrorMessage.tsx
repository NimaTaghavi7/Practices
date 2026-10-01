interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="ml-5 p-5 mb-5 text-2xl font-bold text-red-500">{message}</p>;
}