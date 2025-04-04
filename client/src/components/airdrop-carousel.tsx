import { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
  onViewMore?: () => void;
}

const AirdropCarousel = ({ children, onViewMore }: CarouselProps) => {
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
        <div className="flex gap-4">
          {children}
          {onViewMore && (
            <div className="flex-[0_0_300px] px-2">
              <div className="h-[280px] w-[300px] overflow-hidden border-primary/20 card-gradient hover:bg-black/70 transition-colors rounded-lg flex items-center justify-center border border-primary/20">
                <Button 
                  variant="outline" 
                  className="text-lg"
                  onClick={onViewMore}
                >
                  View More
                </Button>
              </div>
            </div>
          )}
        </div>
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