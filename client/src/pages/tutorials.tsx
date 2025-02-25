import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

const tutorials = [
  {
    id: 1,
    title: "How to Claim Airdrops",
    duration: "5:30",
    thumbnail: "https://images.unsplash.com/photo-1639815189096-f75717eaecfe",
  },
  {
    id: 2,
    title: "Understanding Crypto Wallets",
    duration: "8:45",
    thumbnail: "https://images.unsplash.com/photo-1642403711737-8e89f8d92b24",
  },
  {
    id: 3,
    title: "Best Practices for Security",
    duration: "7:15",
    thumbnail: "https://images.unsplash.com/photo-1644329968124-4c68f17c21e3",
  },
];

const Tutorials = () => {
  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold">Tutorials</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="space-y-4">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="overflow-hidden bg-black/50">
                <div className="relative">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground">{tutorial.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Tutorials;
