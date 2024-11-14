import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Nav() {
  return (
    <main className="w-screen flex justify-between items-center p-4 bg-base-200">
      <div className="font-semibold">gorillatype</div>

      <div></div>
      <ThemeSwitcher />
    </main>
  );
}
