import { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
}

const AirdropCarousel = ({ children }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">{children}</div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm z-10"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm z-10"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AirdropCarousel;
