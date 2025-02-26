import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Share2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const memeTemplates = [
  {
    id: 1,
    name: "HODL Life",
    template: "https://i.imgur.com/example1.jpg",
    fact: "HODL is a misspelling of 'hold' that became crypto slang. It means holding onto your cryptocurrency regardless of market conditions, believing in long-term growth.",
  },
  {
    id: 2,
    name: "To The Moon",
    template: "https://i.imgur.com/example2.jpg",
    fact: "The phrase 'To The Moon' represents the optimistic belief that a cryptocurrency's price will rise dramatically, originating from Bitcoin's historic price increases.",
  },
  {
    id: 3,
    name: "Buy The Dip",
    template: "https://i.imgur.com/example3.jpg",
    fact: "'Buying the dip' refers to purchasing an asset after its price has declined, aiming to profit from a potential recovery. However, timing the market can be risky.",
  },
];

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(memeTemplates[0]);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const { toast } = useToast();

  const handleGenerate = () => {
    // For now, just show a coming soon toast
    toast({
      title: "Coming Soon!",
      description: "Meme generation will be available in the next update.",
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold">Meme Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create and learn with crypto memes
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Template Selection */}
        <div className="grid grid-cols-3 gap-2">
          {memeTemplates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTemplate(template)}
              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                selectedTemplate.id === template.id
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs text-center p-2">{template.name}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Educational Insight */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Did you know?</h3>
            <p className="text-sm text-muted-foreground">{selectedTemplate.fact}</p>
          </CardContent>
        </Card>

        {/* Meme Customization */}
        <div className="space-y-4">
          <Input
            placeholder="Top text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
          <Input
            placeholder="Bottom text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
        </div>

        {/* Preview Area */}
        <Card className="aspect-square overflow-hidden bg-black/50">
          <CardContent className="p-4 h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Preview Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setTopText("");
              setBottomText("");
            }}
          >
            Clear
          </Button>
          <Button className="flex-1 gap-2" onClick={handleGenerate}>
            <Download className="h-4 w-4" />
            Generate
          </Button>
          <Button variant="outline" className="px-3">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;
