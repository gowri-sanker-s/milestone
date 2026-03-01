export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-primary-bg overflow-scroll">
      {children}
    </div>
  );
}
