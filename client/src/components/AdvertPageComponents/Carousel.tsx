import { useState, useEffect, Children } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"
import { useNavigate } from "react-router-dom"

interface Props{
  children: JSX.Element[],
  autoSlide?: boolean,
  autoSlideInterval?: number,
  advertId: string
}

export default function Carousel({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
  advertId
}:Props) 

{
  const [curr, setCurr] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if(!slides) return
  },[])

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [])
  return (
    <div className="relative w-full h-full">

    <div className="overflow-hidden relative rounded-xl bg-gray-200 border">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * (100+ curr)}%)` }}
      >
        {slides}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prev}
            className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
          >
            <ChevronLeft size={30} />
          </button>
          <button
            onClick={next}
            className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
          >
          <ChevronRight size={30} />
          </button>
      </div>
      )}
      

    </div>
    <div className="absolute bottom-4 right-0 left-0 bg-transparent">
    <div className="flex items-center justify-center gap-2">
      {slides.map((_, i) => (
        <img key={i}
          onClick={() => setCurr(i)}
          className={`
          transition-all w-12 h-12 rounded-sm
          ${curr !== i &&"opacity-70"}
        `}
          src={slides[i].props.src}
        />
      ))}
    </div>
    </div>
  </div>
  )
}      
