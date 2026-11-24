import GlassCard from "./components/glass"
import Nav from "./components/nav"


function App() {
  return (
    <main className="min-h-dvh w-full">
      <div className="flex min-h-dvh w-full flex-col bg-[url('/img/download.jpg')] bg-cover bg-center">
        <Nav />
        <div className="grid flex-1 grid-cols-3   place-content-center gap-4  mx-auto ">

          <GlassCard className="col-span-2 ">
          </GlassCard>
          <GlassCard className=""></GlassCard>
          <GlassCard className=""></GlassCard>
          <GlassCard className="col-span-2 "></GlassCard>
        </div>
      </div>

    </main>
  )
}

export default App
