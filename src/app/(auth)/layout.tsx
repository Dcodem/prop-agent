export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8f9ff] text-[#0d1c2e] min-h-screen flex items-center justify-center p-6 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      {children}
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-[#c5e9ee]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-[#00838f]/5 rounded-full blur-[100px]"></div>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#006872 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      </div>
    </div>
  );
}
